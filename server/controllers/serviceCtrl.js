const MonitoredService = require("../models/serviceModel");
const ServiceStatusRecord = require("../models/serviceRecordModel");
const Category = require("../models/categoryModel");
const axios = require("axios");
const mongoose = require('mongoose')

// Create a new monitored service
const createNewService = async (req, res) => {
  const categoryName = req.body.category.toLowerCase();

  try {
    // Find or create the category by name
    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      // Category doesn't exist, create it
      category = new Category({ name: categoryName });
      await category.save();
    }

    const service = await MonitoredService.findOne({ url: req.body.url });
    if (!service) {
      const newService = new MonitoredService({
        name: req.body.serviceName,
        url: req.body.url,
        owner: req.body.owner,
        category: category._id,
      });
      await newService.save();
      // Add the service's ObjectId to the category's services array
      category.services.push(newService._id);
      await category.save();

      // check current status of the website while creating

     
        await performStatusCheck(newService);
    
    

      const updatedCategory = await Category.find({}).populate("services");

      res.status(201).json({ category: updatedCategory });
    } else {
      console.log("Service Already Created");
      res.status(403).json({ message: "Service Already Created" });
    }
  } catch (error) {
    console.log("error comes during fetching");
    console.log(error);
    res.status(500).json({ message: `Server Side Error:${error}` });
  }
};

// Function to perform a status check for a service
async function performStatusCheck(service) {
  const startTime = new Date();

  try {
    const response = await axios.get(service.url);
    const endTime = new Date();
    const responseTime = endTime - startTime;
    const statusCode = response.status;
    const statusMessage = response.statusText;

    const serviceRecord = await ServiceStatusRecord.findOne({
      serviceId: service._id,
    });
    let statusRecord;

    if (!serviceRecord) {
      // Create a new status record
      statusRecord = new ServiceStatusRecord({
        serviceId: service._id,
        statusCode,
        statusMessage,
        responseTime,
        timestamp: Date.now(),
      });

      await statusRecord.save();
    } else {
      statusRecord = await ServiceStatusRecord.findOneAndUpdate(
        { serviceId: service._id },
        {
          serviceId: service._id,
          statusCode,
          statusMessage,
          responseTime,
          timestamp: Date.now(),
        },
        { new: true }
      );
    }

    // Update the service's errorRecords if the status code is 4xx or 5xx
    if (statusCode >= 400) {
      service.errorRecords.push(statusRecord);
      service.statusHistory.push(statusRecord);
      await service.save();
    }

    // Update the service's status history
    service.statusHistory.push(statusRecord);
    await service.save();
  } catch (error) {
    console.error(
      `Error checking service status for ${service.name}: ${error.message}`
    );

    // Create an error record for unwanted errors and add it to the service's errorRecords
    const serviceRecord = await ServiceStatusRecord.findOne({
      serviceId: service._id,
    });
    let unwantedErrorRecord;

    if (!serviceRecord) {
      // Create a new unwanted error record
      unwantedErrorRecord = new ServiceStatusRecord({
        serviceId: service._id,
        statusCode: 0, // Use a code or value to represent unwanted errors
        statusMessage: "Unwanted Error - Check your URL",
        responseTime: 0, // Set to 0 or an appropriate value
      });

      await unwantedErrorRecord.save();
    } else {
      // Update the existing service record with the unwanted error information
      serviceRecord.statusCode = 0;
      serviceRecord.statusMessage = "Unwanted Error - Check your URL";
      serviceRecord.responseTime = 0;

      await serviceRecord.save();
    }

    // Add the unwanted error record to the service's errorRecords

    errorRecord = {
      _id: serviceRecord._id,
      responseTime: 0,
      statusMessage: "Unwanted Error - Check your URL",
      statusCode: 0,
    };
    await service.errorRecords.push(errorRecord);
    await service.statusHistory.push(errorRecord);
    await service.save();
    console.log("add succesfully");
  }
}

// Function to periodically check and update service statuses
async function monitorServices() {
  try {
    const services = await MonitoredService.find();

    const statusCheckPromises = services.map(async (service) => {
      await performStatusCheck(service);
    });

    await Promise.all(statusCheckPromises);
  } catch (error) {
    console.error("Error monitoring services:", error);
  }
}

// Update Planned Activity
const updatePlannedActivity = async (req, res) => {
  const { id } = req.params;

  try {
    // You need to await the MonitoredService.findById(id) to ensure it's an async operation.
    const service = await MonitoredService.findById(id);

    if (!service) {
      // Respond with an error message
      return res.status(404).json({ error: "Invalid Service" });
    }

    // Push the planned activity data from the request body into the service's plannedActivity array.
    const startDate = req.body.startDate;
    const startTime = req.body.startTime;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;

// Combine date and time strings and create a Date object
const combinedStartDateTimeString = `${startDate}T${startTime}`;
const combinedStartDateTime = new Date(combinedStartDateTimeString);

const combinedEndDateTimeString = `${endDate}T${endTime}`;
const combinedEndDateTime = new Date(combinedEndDateTimeString);



    service.plannedActivity.push({
      title:req.body.title,
      startTime:combinedStartDateTime,
      endTime:combinedEndDateTime,
      description:req.body.description

    });

    // Save the updated service with the new planned activity.
    await service.save();

    // Respond with the updated service.
    res.json(service);
  } catch (error) {
    console.log(`Error while updating planned activity: ${error}`);
    // Respond with an error message and status code.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Fetching single service
const getService = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await MonitoredService.findById(id).populate('category');
    if (!service) {
      res.status(403).json("Service not exist!");
    }
    
    res.status(200).json(service);
  } catch (error) {
    // Respond with an error message and status code.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetching all services
const getAllServices = async (req, res) => {
  try {
 
    const allServices = await MonitoredService.find({});
    res.status(200).json(allServices);
  } catch (error) {
    console.log(`Error while fetching services: ${error}`);
    // Respond with an error message and status code.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetching all categories
const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}).populate("services");
    res.status(200).json(allCategories);
  } catch (error) {
    console.log(`Error while fetching categories: ${error}`);
    // Respond with an error message and status code.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit Existing Service
const editService = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the service by its ID and populate the 'category' field
    const service = await MonitoredService.findById(id).populate('category');


    // Find the category associated with the service
    const categoryId = service.category._id.toString();
    
    const category = await Category.findById(categoryId);

// Check if the requested category is different from the current one
if (category.name.toLowerCase() !== req.body.category.toLowerCase()) {

  // If the category is different, update category and service associations

  // Check if the new category already exists
  const isCategoryAlreadyExist = await Category.findOne({
    name: req.body.category.toLowerCase(),
  });

  if (isCategoryAlreadyExist) {
    // If the category already exists, update the service's category association
    const existingCategory = await Category.findById(isCategoryAlreadyExist._id);
    existingCategory.services.push(service._id);
    await existingCategory.save();

    service.category = existingCategory._id;
    service.name = req.body.serviceName
    service.url = req.body.url
    await service.save();
  } else {
    // If the category doesn't exist, create a new category and update associations
    const newCategory = new Category({
      name: req.body.category,
      services: [service.id],
    });
    await newCategory.save();

    service.category = newCategory.id;
    service.name = req.body.serviceName
    service.url = req.body.url
    await service.save();
  }

  // Remove the service from the old category's services array
  const index = category.services.indexOf(service.id);
  category.services.splice(index, 1);
  await category.save();

  res.status(200).json({ message: 'Service updated successfully',
  data: service});
} else {
  // If the category is the same, update the service details

  const updatedService = await MonitoredService.findByIdAndUpdate(
    id,
    {name:req.body.serviceName,
    url:req.body.url,
  category:service.category },
    { new: true }
  ).populate('category');

  res.status(200).json({
    message: 'Service details updated successfully',
    data: updatedService,
  });
}

  } catch (error) {
    console.log(`Error while updating service: ${error}`);
    // Respond with an error message and status code.
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  createNewService,
  monitorServices,
  updatePlannedActivity,
  getAllServices,
  getAllCategories,
  getService,
  editService
};

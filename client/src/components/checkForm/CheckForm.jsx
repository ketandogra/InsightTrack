import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import "./checkForm.scss";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMonitorService, editService, fetchService, plannedMaintenance } from "../../redux/slice/serviceSlice";
import { toast } from "react-toastify";
import { useLocation,useParams } from "react-router-dom";
import Loading from "../UI/loading/Loading";
import axios from "axios"

const CheckForm = ({ isOpened, setIsOpended, formType }) => {
  const [isServicePage, setIsServicePage] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    description: '',
  });

  const handleInputChange = (e) => {
    setMaintenanceFormData({
      ...maintenanceFormData,
      [e.target.name]: e.target.value,
    });
  };
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/history")) {
      setIsServicePage(true);
    }
  }, [location]);

  const dispatch = useDispatch();
  const service = useSelector((state)=>state.categories.service);
  const categoryData = useSelector((state) => state.categories.data);
  const loading = useSelector((state) => state.categories.loading);

  const existingCategory = categoryData.map((item) => item.name);

  const [categories, setCategories] = useState(existingCategory);
  const [selectedCategory, setSelectedCategory] = useState(() => (formType === "editService" ? service?.category?.name : ""));

  const [newCategory, setNewCategory] = useState("");

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  };

  const handleAddService = async (event) => {
    event.preventDefault();

    try {
      const enteredUrl = event.target.hostName.value.trim();

      if (
        enteredUrl.startsWith("http://") ||
        enteredUrl.startsWith("https://")
      ) {
        const serviceName = event.target.friendlyName.value;
        const url = event.target.hostName.value;
        const owner = "Ketan Dogra";

        const newServiceData = {
          serviceName,
          url,
          owner,
          category: selectedCategory,
        };

        // Dispatch the addMonitorService action with the service data
        setIsOpended(false);
        dispatch(addMonitorService(newServiceData));
        toast.success("New service addedd successfully!");
      } else {
        toast.error("Host name should start with http:// or https://");
      }
    } catch (error) {
      toast.error("Error adding monitor service:", error);
    }
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory); // Update selectedCategory with the newly added category
    }
  };

  const handleEditService = async (event)=>{
    event.preventDefault();

    try {
      const enteredUrl = event.target.hostName.value.trim();

      if (
        enteredUrl.startsWith("http://") ||
        enteredUrl.startsWith("https://")
      ) {
        const serviceName = event.target.friendlyName.value;
        const url = event.target.hostName.value;
        const owner = "Ketan Dogra";
      

        const updatedServiceData = {
          serviceName,
          url,
          owner,
          category: selectedCategory,
        };

        // Dispatch the addMonitorService action with the service data
        setIsOpended(false);
        const id = service?._id
        dispatch(editService({updatedServiceData,id}));
        toast.success("Service updated successfully!");
      } else {
        toast.error("Host name should start with http:// or https://");
      }
    } catch (error) {
      toast.error("Error during updating monitor service:", error);
    }
    
  }

  const validateForm = () => {
    // Example validation - you can add more checks as needed
    if (!maintenanceFormData.title || !maintenanceFormData.startDate || !maintenanceFormData.startTime || !maintenanceFormData.endDate || !maintenanceFormData.endTime) {
      console.log(maintenanceFormData);
      toast.error('All fields are required');
      return false;
    }
    return true;
  };

  const handleAddPlannedMaintenance = async (e) => {
    e.preventDefault();

    // setMaintenanceFormData({...maintenanceFormData})

    if (!validateForm()) {
      // Validation failed
      return;
    }

    try {
      const id = service?._id

      dispatch(plannedMaintenance({maintenanceFormData,id}))
      // Reset the form after successful submission
      setMaintenanceFormData({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: '',
      });

      setIsOpended(!isOpened)
      toast.success("Scheduled maintenance has been successfully added!");
    } catch (error) {
      toast.error('Error submitting form:', error);

      // Handle the error as needed
      toast.error('Failed to submit the form. Please try again later.');
    }
  };

  if (loadingData) {
    return <Loading setLoadingData={setLoadingData} service={service} delay="1" />;
  }
  return (
    <div className="form">
      <Container>
        <Row>
          <Col lg="12">
            <h6 className="forTitle">
              {formType == "addService"
                ? "Basic Information"
                : formType == "editService"
                ? "Edit Current Service"
                : "Schedule Planned Maintenance"}
            </h6>
            <span onClick={() => setIsOpended(!isOpened)}>
              <RxCross2 />
            </span>

            {formType == "addService" ? (
              <Form onSubmit={handleAddService}>
                <FormGroup className="formGroup">
                  <label htmlFor="hostName">Host name</label>
                  <input
                    type="text"
                    placeholder="http://www.xyz.com"
                    id="hostName"
                    name="hostName"
                    required
                  />
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="friendlyName">Friendly check name</label>
                  <input
                    type="text"
                    placeholder="Check name"
                    name="friendlyName"
                    id="friendlyName"
                    required
                  />
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="category">Category</label>
                  <div className="categorySelect">
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="new">Add New Category</option>
                    </select>
                    {selectedCategory === "new" && (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter a new category"
                          value={newCategory}
                          onChange={handleNewCategoryChange}
                        />
                        <button
                          onClick={handleAddNewCategory}
                          className="button"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </FormGroup>
                <FormGroup>
                  <button type="submit" className="button">
                    Submit
                  </button>
                </FormGroup>
              </Form>
            ) : formType == "editService" ? (
              <Form onSubmit={handleEditService}>
                <FormGroup className="formGroup">
                  <label htmlFor="hostName">Host name</label>
                  <input
                    type="text"
                    placeholder="http://www.xyz.com"
                    id="hostName"
                    name="hostName"
                    defaultValue={service?.url}
                    required
                  />
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="friendlyName">Friendly check name</label>
                  <input
                    type="text"
                    placeholder="Check name"
                    name="friendlyName"
                    id="friendlyName"
                    defaultValue={service?.name}
                    required
                  />
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="category">Category</label>
                  <div className="categorySelect">
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value={service?.category?.name}>{service?.category?.name}</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="new">Add New Category</option>
                    </select>
                    {selectedCategory === "new" && (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter a new category"
                          value={newCategory}
                          onChange={handleNewCategoryChange}
                        />
                        <button
                          onClick={handleAddNewCategory}
                          className="button"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </FormGroup>
                <FormGroup>
                  <button type="submit" className="button">
                    Edit
                  </button>
                </FormGroup>
              </Form>
            ) : (
              <Form onSubmit={handleAddPlannedMaintenance}>

                <FormGroup className="formGroup">
                  <label htmlFor="friendlyName">Service Name</label>
                  <input
                    type="text"
                    placeholder="Check name"
                    name="friendlyName"
                    id="friendlyName"
                    defaultValue={service?.name}
                    disabled
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="title">Activity Title </label>
                  <input type="text" 
                  placeholder="Enter the title"
                  id="title"
                  name="title"
                  
                  onChange={handleInputChange}
                  value={maintenanceFormData.title}
                  required/>
                </FormGroup>

                <FormGroup className="formGroup">
                  <label htmlFor="startDate">Start Date </label>
                  <input type="date" 
                  placeholder=""
                  id="startDate"
                  name="startDate"
                  onChange={handleInputChange}
                  value={maintenanceFormData.startDate}
                  required/>
                </FormGroup>

                
                <FormGroup className="formGroup">
                  <label htmlFor="startTime">Start Time </label>
                  <input type="time" 
                  placeholder=""
                  id="startTime"
                  name="startTime"
                  onChange={handleInputChange}
                  value={maintenanceFormData.startTime}
                  required/>
                </FormGroup>
                <FormGroup className="formGroup">
                  <label htmlFor="endDate">End Date </label>
                  <input type="date" 
                  placeholder=""
                  id="endDate"
                  name="endDate"
                  onChange={handleInputChange}
                  value={maintenanceFormData.endDate}
                  required/>
                </FormGroup>

                <FormGroup className="formGroup">
                  <label htmlFor="endTime">End Time </label>
                  <input type="time" 
                  placeholder=""
                  id="endTime"
                  name="endTime"
                  onChange={handleInputChange}
                  value={maintenanceFormData.endTime}
                  required/>
                </FormGroup>

                <FormGroup className="formGroup">
                  <label htmlFor="description">Description</label>
                  <textarea type="text" 
                  placeholder=""
                  id="description"
                  name="description"
                  rows="3"
                  cols="12"
                  onChange={handleInputChange}
                  value={maintenanceFormData.description}
                  required/>
                </FormGroup>
                <FormGroup>
                  <button type="submit" className="button">
                    Submit
                  </button>
                </FormGroup>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckForm;

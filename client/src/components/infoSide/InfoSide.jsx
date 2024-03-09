import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfoCard from "../infoCard/InfoCard";
import Loading from "../UI/loading/Loading";
import { fetchAllServices } from "../../redux/slice/serviceSlice";

const InfoSide = () => {
  const [plannedActivity, setPlannedActivity] = useState([])
  const [currentOutageService,setCurrentOutageService] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllServices());
  }, [dispatch]);

  const services = useSelector((state) => state.categories.services);
  const loading = useSelector((state) => state.categories.loading);

  const fetchAllPlannedMaintenanceNext5Days = (services) => {
    const currentDate = new Date();
    const startDay = currentDate.toISOString();
    const endOf5thDay = new Date(currentDate);
    endOf5thDay.setDate(currentDate.getDate() + 5)
    const endOfDay = endOf5thDay.toISOString()

   
    const plannedMaintenanceNext5Days = services.reduce((result, service) => {
      const plannedMaintenance = service.plannedActivity.filter((activity) => {
        const startTime = activity?.startTime
        const endTime = activity?.endTime
   

        // Check if the startDate is within the next 5 days
        return endTime >= startDay && endTime < endOfDay;
      });

      if (plannedMaintenance.length > 0) {
        result.push({
          serviceId: service._id,
          serviceName: service.name,
          plannedMaintenance,
        });
      }
      
      return result;
    }, []);

    console.log(plannedMaintenanceNext5Days);

    return plannedMaintenanceNext5Days;
  };

  const checkAllCurrentOutageServices = (services) => {
    const currentDateTime = new Date();
  
    // Filter services with ongoing or upcoming planned maintenance
    const servicesWithPlannedMaintenance = services.filter((service) => {
      if (service?.plannedActivity) {
        // Check if there is any planned maintenance for the service
        const hasPlannedMaintenance = service.plannedActivity.some((activity) => {
          const startDate = new Date(activity.startTime);
          const endDate = new Date(activity.endTime);
  
          // Check if the planned maintenance is currently ongoing or upcoming
          return startDate <= currentDateTime && currentDateTime <= endDate;
        });
  
        return hasPlannedMaintenance;
      }
  
      return false; // If no plannedActivity, exclude the service
    });
  
    // Filter services with the latest status code indicating an outage (you may adjust the condition)
    const servicesWithOutageStatus = services.filter((service) => {
      const latestStatusCode = service?.statusHistory[service.statusHistory.length - 1]?.statusCode;
      
      // Adjust the condition based on your definition of an outage status
      return latestStatusCode !== 200; // Assuming 205 indicates an outage status
    });
  
    // Combine the two sets of services to get the services currently in outage
    const currentOutageServices = servicesWithPlannedMaintenance.concat(servicesWithOutageStatus);

    setCurrentOutageService(currentOutageServices)
  
    console.log(currentOutageService);
  };
  

  useEffect(() => {
    const data = fetchAllPlannedMaintenanceNext5Days(services);
    setPlannedActivity(data)
    checkAllCurrentOutageServices(services)
    // You might want to dispatch or use the data in your application logic.
  }, [services]);

  if (loading === "pending") {
    return <Loading delay="2" />;
  }

  return (
    <div className="infoSide">
      {currentOutageService?.length > 0 ? (
        <>
          {currentOutageService.map((service, index) => (
            <InfoCard type="outage" key={index} data={service} />
          ))}
        </>
      ) : (
        <InfoCard type="no outage"/>
      )}

      {plannedActivity?.length > 0 ? (
        <>
          {plannedActivity.map((activity, index) => (
            <InfoCard type="maintenance" key={index} data={activity} />
          ))}
        </>
      ) : (
        <InfoCard type="no maintenance"/>
      )}
      <InfoCard type="history" />
    </div>
  );
  
};

export default InfoSide;

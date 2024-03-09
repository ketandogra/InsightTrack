import MonitoringCard from "../monitoringCard/MonitoringCard";
import "./monitoringSide.scss";
import { fetchAllServices, fetchCategories } from "../../redux/slice/serviceSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";


const MonitoringSide = () => {
  const [monitorDays, setMonitorDays] = useState([]);
  const [plannedServices, setPlannedServices] = useState([]);
  const dispatch = useDispatch();
  const categoryData = useSelector((state) => state.categories.data);
  const loading = useSelector((state) => state.categories.loading);
  const services = useSelector((state) => state.categories.services);

  useEffect(() => {
    // Fetch category data when the component mounts
    dispatch(fetchCategories());
    dispatch(fetchAllServices());
    getLast5Days();
  }, [dispatch]);

  useEffect(() => {
    // Call checkPlannedMaintenance when services or other relevant dependencies change
    checkPlannedMaintenance(services);
  }, [services]); // Add other dependencies as needed

  const checkPlannedMaintenance = (services) => {
    // Assuming currentDateTime is a valid Date object
    const currentDateTime = new Date();

    // Filter services with planned maintenance in the current time
    const servicesWithCurrentPlannedMaintenance = services.filter((service) => {
      if (service?.plannedActivity) {
        // Check if there is any planned maintenance for the service
        const hasPlannedMaintenance = service.plannedActivity.some((activity) => {
          const startDate = new Date(activity.startTime);
          const endDate = new Date(activity.endTime);

          // Check if the planned maintenance is currently ongoing
          return startDate <= currentDateTime && currentDateTime <= endDate;
        });

        return hasPlannedMaintenance;
      }

      return false; // If no plannedActivity, exclude the service
    });

    console.log(servicesWithCurrentPlannedMaintenance);
    setPlannedServices(servicesWithCurrentPlannedMaintenance);
  };

  const getLast5Days = () => {
    const today = new Date();
    const last5Days = [];

    // Loop through the last 5 days and push each date into the array
    for (let i = 5; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last5Days.push(date);
    }

    setMonitorDays(last5Days);
  };

  return (
    <div className="monitoringSide">
      {loading === "pending" ? (
        <span className="loader"></span>
      ) : loading === "rejected" ? (
        <p>Error loading Services</p>
      ) : (
        categoryData?.map((category) => (
          category.services.length > 0 && (
            <MonitoringCard
              key={category.id}
              data={category}
              monitorDays={monitorDays}
              plannedServices={plannedServices}
            />
          )
        ))
      )}
    </div>
  );
};

export default MonitoringSide;


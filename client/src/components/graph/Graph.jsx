import React, { useEffect, useState } from 'react'; // Importing necessary modules from React
import "./graph.scss"; // Importing stylesheet for the graph component
import { Line } from 'react-chartjs-2'; // Importing Line component from react-chartjs-2
import { Chart as ChartJs } from "chart.js/auto"; // Importing Chart component from chart.js

const Graph = ({ averageTimestamp, type, service, days }) => { // Functional component Graph receiving props

  // State hook to manage availability data
  const [availability, setAvailability] = useState({
    labels: [],
    datasets: [
      {
        label: 'Availability (%)',
        data: [],
        backgroundColor: '#FA7070',
        borderColor: '#FE0000',
      },
    ],
  });

  // Function to calculate daily uptime percentage based on status history
  const calculateDailyUptimePercentage = (statusHistory) => {
    const last30DaysHistory = statusHistory?.filter(
      (entry) => new Date(entry?.timestamp).getTime() >= Date.now() - 30 * 24 * 60 * 60 * 1000
    );
  
    const dailyUptimePercentages = [];
  
    for (let i = 29; i >= 0; i--) {
      const currentDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0,
        0
      ).getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
  
      const dailyStatusHistory = last30DaysHistory?.filter(
        (entry) =>
          new Date(entry?.timestamp).getTime() >= startOfDay &&
          new Date(entry?.timestamp).getTime() <= endOfDay
      );
      console.log(dailyStatusHistory);
  
      // Calculating total uptime for the day
      const firstCheck = dailyStatusHistory[0];
      const lastCheck = dailyStatusHistory[dailyStatusHistory.length - 1];
      console.log(new Date(lastCheck?.timestamp).getTime() - new Date(firstCheck?.timestamp).getTime());
  
      const totalUptime = dailyStatusHistory.reduce((uptime, entry) => {
        if (entry.statusCode === 200) {
          const nextEntryIndex = dailyStatusHistory.indexOf(entry) + 1;
          const endTime =
            nextEntryIndex < dailyStatusHistory.length
              ? new Date(dailyStatusHistory[nextEntryIndex]?.timestamp).getTime()
              : endOfDay;
          uptime += endTime - new Date(entry?.timestamp).getTime();
        }
        return uptime;
      }, 0);
      console.log(`Total Uptime: ${totalUptime}`);

      // Adjusted calculation of uptimePercentage considering total day time
      const totalDayTime = dailyStatusHistory.reduce((totaltime, entry) => {
        const nextEntryIndex = dailyStatusHistory.indexOf(entry) + 1;
        const endTime =
          nextEntryIndex < dailyStatusHistory.length
            ? new Date(dailyStatusHistory[nextEntryIndex]?.timestamp).getTime()
            : endOfDay;
        totaltime += endTime - new Date(entry?.timestamp).getTime();
        return totaltime;
      }, 0);

      const adjustedUptime = Math.min(totalUptime, totalDayTime); // Ensure uptime doesn't exceed totalDayTime
      const uptimePercentage = (adjustedUptime / totalDayTime) * 100 || 0;

      dailyUptimePercentages.push({
        date: currentDate.toLocaleDateString(),
        uptimePercentage: uptimePercentage.toFixed(2),
      });
    }
  
    console.log(dailyUptimePercentages);
  
    const availabilityData = {
      labels: days,
      datasets: [
        {
          label: 'Availability (%)',
          data: dailyUptimePercentages.map((item) => parseFloat(item.uptimePercentage)),
          backgroundColor: '#FA7070',
          borderColor: '#FE0000',
        },
      ],
    };
  
    setAvailability(availabilityData); // Setting availability data to state
  };
  
  // useEffect hook to trigger the calculation when service prop changes
  useEffect(() => {
    if (service.statusHistory) {
      calculateDailyUptimePercentage(service.statusHistory);
    }
  }, [service]);

  // State hook to manage service data
  const [serviceData, setServiceData] = useState({
    labels: days,
    datasets: [
      {
        label: 'Response time (ms)',
        data: averageTimestamp.map((item) => item.averageResponseTime),
        backgroundColor: '#09d5a9',
        borderColor: '#06ab87',
      },
    ],
  });

  console.log(serviceData); // Logging service data

  return (
    <div>
      {type === 'availability' ? <Line data={availability} /> : <Line data={serviceData} />} {/* Rendering Line component based on type */}
    </div>
  );
};

export default Graph; // Exporting Graph component

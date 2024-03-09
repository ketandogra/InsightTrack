import React, { useState } from 'react';
import axios from 'axios'; // for making HTTP requests
import "./report.scss"

const Report = () => {
  const [availabilityData, setAvailabilityData] = useState(null);

  const fetchAvailabilityData = async() => {
    // Make a request to fetch availability data from the server
    axios.get('/api/availability')
      .then(response => {
        // Assuming response.data is the availability data
        setAvailabilityData(response.data);
      })
      .catch(error => {
        console.error('Error fetching availability data:', error);
      });
  };

  const downloadAvailabilityReport = async () => {

    await fetchAvailabilityData()
    // Check if availabilityData is available
    if (availabilityData) {
      // Convert availabilityData to CSV format
      const csvData = convertToCSV(availabilityData);
      
      // Create a blob object containing the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      
      // Create a URL for the blob object
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and click it to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'availability_report.csv');
      document.body.appendChild(link);
      link.click();
      // Remove the link element
      document.body.removeChild(link);
    } else {
      console.error('No availability data available to download.');
    }
  };

  // Function to convert availability data to CSV format
  const convertToCSV = (data) => {
    // Convert data to CSV format, you can use any suitable library or custom function
    // Example:
    return data.map(row => Object.values(row).join(',')).join('\n');
  };

  return (
    <div>
      <button className='download button' onClick={downloadAvailabilityReport}>Download Report</button>
    </div>
  );
};

export default Report;

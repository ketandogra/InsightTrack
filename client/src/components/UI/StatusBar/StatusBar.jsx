import React, { useEffect, useState } from "react";
import "./statusBar.scss";

const StatusBar = ({ data, service, type }) => {

  const getTime = (time) => {
    const dateObject = new Date(time);
    const formattedDate = dateObject.toLocaleDateString();
    const formattedTime = dateObject.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  let timestamp
  let date
  if(type=="planned maintenance"){
    
    timestamp = data?.startTime;
    date = new Date(timestamp);

  }else{
    timestamp = data?.timestamp;
    date = new Date(timestamp);
  }

  let month, day, year;
  day = date.getDate() ;
  month = date.getMonth() + 1;
  year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;


  return (
    <div className="statusContainer">
   
        <div className="dateContainer">
          <span>{formattedDate}</span>
        </div>
    

      <div className="statusBanner">
        <span style={{ backgroundColor: type === "outage" ? "#BB0000" :type ==="operational"? "#5CB85C":"#5BC0DE" }}></span>
        <div>
          {type==="planned maintenance"?(<h6>{data.title}</h6>):(<h6>{service.name} is {type === "outage" ? "Down" : "Up"}</h6>)}
          {type==="planned maintenance" && <span className="maintenanceDescription">starting {getTime(data.startTime)} and ending {getTime(data.endTime)}</span>}
          
          {type==="operational" && <span style={{width:"100%"}}>Last check: {new Date(service.statusHistory[service.statusHistory.length - 1].timestamp).toLocaleString()}</span>}
          {type==="outage" && <span style={{width:"100%"}}>{new Date(data?.timestamp).toLocaleString()}</span>}

        
        </div>
        
      </div>
    </div>
  );
};

export default StatusBar;

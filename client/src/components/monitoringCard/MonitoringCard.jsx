import React, { useEffect, useState } from "react";
import "./monitoringCard.scss";
import { Row, Col } from "reactstrap";
import { PiCheckFatFill } from "react-icons/pi";
import { FaMinus } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { FaAsterisk } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Link } from "react-router-dom";

const MonitoringCard = ({ data, monitorDays, plannedServices }) => {
  const days = {
    0: "SUN",
    1: "MON",
    2: "TUE",
    3: "WED",
    4: "THU",
    5: "FRI",
    6: "SAT",
  };
  const lastDays = [1, 2, 3, 4, 5];

  const status = [
    {
      id: 1,
      message: "OPERATIONAL",
      icon: <PiCheckFatFill />,
      color: "#5CB85C",
    },
    { id: 2, message: "DEGRADATION", icon: <FaMinus />, color: "#F0AD4E" },
    { id: 3, message: "OUTAGE", icon: <FaExclamation />, color: "#BB0000" },
    {
      id: 4,
      message: "PLANNED MAINTENANCE",
      icon: <FaInfo />,
      color: "#5BC0DE",
    },
    {
      id: 5,
      message: "MULTIPLE ISSUES",
      icon: <FaAsterisk />,
      color: "#6E4CDD",
    },
    {
      id: 6,
      message: "DATA NOT AVAILABLE",
      icon: <ImCross />,
      color: "grey",
    },
  ];

  const checkPlannedOutage = (record,index,service)=>{

    if (!record || !record.length) {
      // Handle cases where record is undefined or an empty array
      return false;
    }

    let day, month, year;
    const currentDay = monitorDays[index];

    if (!currentDay) {
      // Handle cases where currentDay is undefined
      return false;
    }

    day = currentDay.getDate();
    month = currentDay.getMonth() + 1;
    year = currentDay.getFullYear();

    const existingDate = `${day}-${month}-${year}`;

    for (let i = 0; i < record.length; i++) {
      const timestamp = record[i].startTime;

      if (!timestamp) {
        // Handle cases where timestamp is undefined
        continue; // Skip this iteration and continue to the next one
      }

      const date = new Date(timestamp);
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();

      const checkDate = `${day}-${month}-${year}`;

      if (existingDate === checkDate) {
        return true;
      }
    }

    return false;

  }

  const checkErrorOutage = (record, index, service) => {
    if (!record || !record.length) {
      // Handle cases where record is undefined or an empty array
      return false;
    }

    let day, month, year;
    const currentDay = monitorDays[index];

    if (!currentDay) {
      // Handle cases where currentDay is undefined
      return false;
    }

    day = currentDay.getDate();
    month = currentDay.getMonth() + 1;
    year = currentDay.getFullYear();

    const existingDate = `${day}-${month}-${year}`;

    for (let i = 0; i < record.length; i++) {
      const timestamp = record[i].timestamp;

      if (!timestamp) {
        // Handle cases where timestamp is undefined
        continue; // Skip this iteration and continue to the next one
      }

      const date = new Date(timestamp);
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();

      const checkDate = `${day}-${month}-${year}`;

      if (existingDate === checkDate) {
        return true;
      }
    }

    return false;
  };

  const checkLast5DaysStatusExist = (statusHistory, index) => {
    if (!statusHistory) {
      // Handle cases where statusHistory is undefined or an empty array
      return false;
    }

    let day, month, year;
    const currentDay = monitorDays[index];

    if (!currentDay) {
      // Handle cases where currentDay is undefined
      return false;
    }

    day = currentDay.getDate();
    month = currentDay.getMonth() + 1;
    year = currentDay.getFullYear();

    const existingDate = `${day}-${month}-${year}`;

    for (let i = 0; i < statusHistory.length; i++) {
      const timestamp = statusHistory[i].timestamp;

      if (!timestamp) {
        // Handle cases where timestamp is undefined
        continue; // Skip this iteration and continue to the next one
      }

      const date = new Date(timestamp);
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();

      const checkDate = `${day}-${month}-${year}`;

      if (existingDate === checkDate) {
        return true;
      }
      // if(existingDate < checkDate){
      //   return false;
      // }
    }

    return false;
  };
  return (
    <div className="monitoringCard">
      <div className="panelHeading">
        <div className="panelRow">
          <div className="panelTitle">
            <h6>{data?.name?.toUpperCase()}</h6>
            <div className="dateHeadrer">
              <div className="dateWrapper">
                {monitorDays.map((date, index) => (
                  <div className="DateInfo" key={index}>
                    <div>
                      <span>{days[date.getDay()]}</span>
                      <p>
                        {date.getMonth() + 1}-{date.getDate()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="now">NOW</div>
            </div>
          </div>
        </div>
      </div>

      {data?.services?.map((service, index) => (
        <div className="panelBody" key={index}>
          <Row className="d-flex">
            <Col lg="6" md="4" sm="4" className="panelBodyLeft">
              <div className="leftSection">
                <Link to={`/history/${service._id}`}>
                  {service.name}{" "}
                  <span>{`(${
                    service?.statusHistory[service?.statusHistory?.length - 1]
                      .responseTime
                  } ms)`}</span>
                </Link>
              </div>
            </Col>
            <Col lg="6" md="8" sm="8" className="panelBodyRight">
              {lastDays.map((data1, index) => (
                <div
                  className="rightSection pastResult"
                  key={index}
                  style={{
                    backgroundColor:
                      service?.errorRecords?.length > 0 &&
                      checkErrorOutage(service?.errorRecords, index, service.name)
                        ? status[2].color
                        : service?.statusHistory?.length > 0 && checkPlannedOutage(service?.plannedActivity,index,service?.name)? status[3].color:
                          checkLast5DaysStatusExist(
                            service.statusHistory,
                            index
                          )
                        ? status[0].color
                        : status[5].color,
                  }}
                >
                  <span>
                    {service?.errorRecords?.length > 0 &&
                    checkErrorOutage(service?.errorRecords, index, service.name)
                      ? status[2].icon
                      : service?.plannedActivity?.length > 0 && checkPlannedOutage(service?.plannedActivity,index,service?.name)? status[3].icon:
                      service?.statusHistory?.length > 0 && checkLast5DaysStatusExist(service.statusHistory, index)
                      ? status[0].icon
                      : status[5].icon}
                  </span>
                </div>
              ))}
              <div
                className="rightSection result"
                style={{
                  backgroundColor:
                    service?.statusHistory[service.statusHistory.length - 1]
                      ?.statusCode === 200
                      ? status[0].color
                      : plannedServices?.some(
                          (item) => item._id === service._id
                        )
                      ? status[3].color
                      : status[2].color,
                }}
              >
                <span>
                  {service?.statusHistory[service.statusHistory.length - 1]
                    ?.statusCode == 200
                    ? status[0].icon
                    : plannedServices?.some((item) => item._id === service._id)
                    ? status[3].icon
                    : status[2].icon}
                </span>
                <span>
                  {service?.statusHistory[service.statusHistory.length - 1]
                    ?.statusCode == 200
                    ? "OPERATIONAL"
                    : plannedServices?.some((item) => item._id === service._id)
                    ? "MAINTENANCE"
                    : "OUTAGE"}
                </span>
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default MonitoringCard;

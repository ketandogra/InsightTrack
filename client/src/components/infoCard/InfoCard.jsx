import "./infoCard.scss";
import { PiCheckFatFill } from "react-icons/pi";
import { FaMinus } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { FaAsterisk } from "react-icons/fa";
import { BsCheckCircle } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { Col, Row } from "reactstrap";
import { useState } from "react";

const InfoCard = ({ type, data }) => {
  const getStartTime = (time) => {
    const dateObject = new Date(time);
    const formattedDate = dateObject.toLocaleDateString();
    const formattedTime = dateObject.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };
  const getEndTime = (time) => {
    const dateObject = new Date(time);
    const formattedDate = dateObject.toLocaleDateString();
    const formattedTime = dateObject.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };
  const info = [
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
      color: "#00A9FF",
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

  return (
    <div
      className="infoCard"
      style={
        type === "maintenance"
          ? { borderTop: `15px solid ${info[3].color}` }
          :type === "outage"? {borderTop: `15px solid ${info[2].color}`}:{}
      }
    >
      {" "}
      {type === "outage" ?( <>
          {/* Outage section */}
          
            <div>
              <div className="headerDiv">
                <div>
                  <span style={{ color: info[2].color }}>
                    OUTAGE : {data?.name}
                  </span>
                </div>
              </div>
              <Row className="infoBody">
                <Col className="bodyText w-100" xs="12" sm="8">
                  <p>
                    Last Check : {new Date(data?.statusHistory?.[data?.statusHistory?.length -1 ].timestamp).toString()}
                  </p>
                  
                </Col>
              </Row>
            </div>
          
        </>): type === "no outage" ? (
        <>
          {/* No Outage section */}
          <div className="headerDiv">
            <div>
              <span>CURRENT STATUS</span>
            </div>
          </div>
          <Row className="infoBody">
            <Col className="bodyText" xs="12" sm="8">
              <p>
                If there is ever an interruption in service a notification will
                be posted to this page. If you are experiencing problems not
                listed on this page you can contact the IT service desk for more
                information.
              </p>
            </Col>
            <Col className="bodyIcon" xs="12" sm="4">
              <BsCheckCircle />
              <span>No Outages</span>
            </Col>
          </Row>
        </>
      ) : type === "maintenance" ? (
        <>
          {/* Maintenance section */}
          {data?.plannedMaintenance?.map((activity, index) => (
            <div key={index}>
              <div className="headerDiv">
                <div>
                  <span style={{ color: info[3].color }}>
                    PLANNED OUTAGE : {data?.serviceName}
                  </span>
                </div>
              </div>
              <Row className="infoBody">
                <Col className="bodyText w-100" xs="12" sm="8">
                  <p>
                    {data?.serviceName} has planned maintenance, starting{" "}
                    {getStartTime(activity?.startTime)} and ending{" "}
                    {getEndTime(activity?.endTime)}
                  </p>
                  <p>{activity?.description}</p>
                </Col>
              </Row>
            </div>
          ))}
        </>
      ) : type === "no maintenance" ? (
        <>
          <div className="headerDiv">
            <div>
              <span>PLANNED MAINTENANCE</span>
            </div>
          </div>
          <Row className="infoBody">
            <Col className="bodyText" xs="12" sm="8">
              <p>
                The Ensemble publishes information on planned service
                availability in the table below. This includes events occuring
                over the next 5 days.
              </p>
            </Col>
            <Col className="bodyIcon maintenance" xs="12" sm="4">
              <BsCheckCircle />
              <span>No Upcoming Planned Maintenace </span>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Default info section */}
          <div className="headerDiv">
            <div>
              <span>HISTORY LEGEND</span>
            </div>
          </div>
          {info.map((item, id) => (
            <div
              className="infoWrapper"
              key={id}
              style={{ backgroundColor: item.color }}
            >
              <span className="infoMessage">
                {item.icon}
                <span>{item.message}</span>
              </span>
            </div>
          ))}

          <hr />

          <div className="extraInfo">
            The Ensemble dashboard publishes information on service availability
            of the last 5 days in the table to the right.
          </div>
        </>
      )}
    </div>
  );
};

export default InfoCard;

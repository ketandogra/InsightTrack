
import React, { useCallback, useEffect, useState } from "react"; // Importing necessary modules from React
import "./history.scss"; // Importing stylesheet for the history component
import Graph from "../../components/graph/Graph"; // Importing Graph component
import { useParams } from "react-router-dom"; // Importing useParams from react-router-dom
import { useSelector, useDispatch } from "react-redux"; // Importing useSelector and useDispatch from react-redux
import { fetchService } from "../../redux/slice/serviceSlice"; // Importing fetchService action creator from serviceSlice
import Loading from "../../components/UI/loading/Loading"; // Importing Loading component
import { Col, Container, Row } from "reactstrap"; // Importing necessary components from reactstrap
import StatusBar from "../../components/UI/StatusBar/StatusBar"; // Importing StatusBar component
import Report from "../../components/report/Report";
// History Component
const History = () => {
  const { id } = useParams(); // Getting 'id' parameter from the URL
  const dispatch = useDispatch(); // Initializing useDispatch hook
  const [pastOutage, setPastOutage] = useState([]); // State hook to manage past outages
  const [last30Days, setLast30Days] = useState([]); // State hook to manage last 30 days data
  const [loadingData, setLoadingData] = useState(true); // State hook to manage loading state
  const [overAllUpTime, setOverAllTime] = useState(""); // State hook to manage overall uptime
  const [upcomingPlannedMaintenance, setUpcomingPlannedMaintenace] = useState([]); // State hook to manage upcoming planned maintenance
  const [pastPlannedOutage, setPastPlannedOutage] = useState([]); // State hook to manage past planned outage

  // useEffect hook to fetch last 30 days data
  useEffect(() => {
    const fetchLast30Days = async () => {
      const today = new Date();
      const days = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const formattedDate = `${month}/${day}/${year}`;
        days.push(formattedDate);
      }

      setLast30Days(days);
    };

    fetchLast30Days();
  }, []);

  // useEffect hook to dispatch fetchService action
  useEffect(() => {
    dispatch(fetchService(id));
  }, [dispatch]);

  const service = useSelector((state) => state.categories.service); // Selecting service from the state
  const loading = useSelector((state) => state.categories.loading); // Selecting loading state from the state

  // Function to get last 2 outages
  const last2Outage = (data) => {
    let result = [];
    let count = 0;
    let currentLength = data?.errorRecords?.length;
    for (let i = currentLength - 1; i >= 0; i--) {
      count++;
      result.push(data?.errorRecords[i]);
      if (count === 2) {
        break;
      }
    }
    setPastOutage(result);
  };

  // Function to get last 2 planned outages
  const last2PlannedOutageOutage = (data) => {
    const plannedActivities = data?.plannedActivity || [];
    const currentDateTime = new Date();

    // Filter out activities that are ongoing or upcoming
    const filteredActivities = plannedActivities.filter((activity) => {
      const startDate = new Date(activity.startTime);
      const endDate = new Date(activity.endTime);

      // Include activities that are not currently ongoing or upcoming
      return endDate < currentDateTime;
    });

    // Get the first two filtered planned activities
    const result = filteredActivities.slice(0, 2);

    console.log(result);

    setPastPlannedOutage(result);
  };

  // Function to calculate upcoming planned maintenance
  const calculateUpcomingPlannedMaintenance = () => {
    const plannedActivity = service?.plannedActivity;
    const currentDate = new Date();
    let month, day, year;
    day = currentDate.getDate();
    month = currentDate.getMonth() + 1;
    year = currentDate.getFullYear();

    const formattedDate = `${year}/${month}/${day}`;

    // Ensure that upcomingPlannedMaintenance is an empty array
    let upcomingPlannedMaintenance = [];

    if (plannedActivity?.length > 0) {
      for (let activity of plannedActivity) {
        // Extract startDate from the activity

        let day = new Date(activity.endTime).getDate();
        let month = new Date(activity.endTime).getMonth() + 1;
        let year = new Date(activity.endTime).getFullYear();

        const formattedPlannedDate = `${year}/${month}/${day}`;

        const plannedEndDate = new Date(activity.endTime);

        // Compare startDate with the current date
        if (
          plannedEndDate > currentDate &&
          plannedEndDate - currentDate <= 5 * 24 * 60 * 60 * 1000
        ) {
          // If the condition is true, add the activity to upcomingPlannedMaintenance
          upcomingPlannedMaintenance.push(activity);
        }
      }
    }

    setUpcomingPlannedMaintenace(upcomingPlannedMaintenance);
  };

  // useEffect to handle service changes and get last 2 outages
  useEffect(() => {
    if (service?.errorRecords?.length > 0) {
      last2Outage(service);
    }
  }, [service]);

  // useEffect to calculate overall uptime
  useEffect(() => {
    // Example usage with service and timestamp from the last entry
    const lastEntryTimestamp =
      service?.statusHistory?.[service?.statusHistory?.length - 1]?.timestamp;
    const uptimePercentage = calculateLast24HoursUptimePercentage(
      service?.statusHistory,
      lastEntryTimestamp
    );

    setOverAllTime(uptimePercentage);
  }, [service]);

  const [averageTimestamp, setAverageTimestamp] = useState([]); // State hook to manage average timestamps

  // useCallback to calculate average response time
  const calculateAverageResponseTime = useCallback(() => {
    const statusHistory = service.statusHistory || [];
    const days = last30Days;

    // Create a map to store response times for each day
    const responseTimeMap = new Map();

    // Iterate through the status history
    for (const statusCheck of statusHistory) {
      // Extract the date from the status check timestamp
      const date = new Date(statusCheck.timestamp).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // If date is not present in the map, initialize it with an array
      if (!responseTimeMap.has(date)) {
        responseTimeMap.set(date, []);
      }

      // Push the response time to the array for that date
      responseTimeMap.get(date).push(statusCheck.responseTime);
    }

    // Calculate the average response time for each day
    const averageResponseTimePerDay = {};
    for (const [date, responseTimes] of responseTimeMap.entries()) {
      const totalResponseTime = responseTimes.reduce(
        (

sum, time) => sum + time,
        0
      );
      const averageResponseTime = Math.floor(
        totalResponseTime / responseTimes.length
      );

      // Store the average response time for the date
      averageResponseTimePerDay[date] = averageResponseTime;
    }

    const dateLeftWithoutResponseTime =
      days.length - Object.keys(averageResponseTimePerDay).length;

    for (let i = 0; i < dateLeftWithoutResponseTime; i++) {
      averageResponseTimePerDay[days[i]] = 0;
    }

    const result = Object.entries(averageResponseTimePerDay).map(
      ([date, averageResponseTime]) => ({
        date,
        averageResponseTime,
      })
    );

    // Sort the result array based on the date in ascending order
    const sortedResult = result.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setAverageTimestamp(sortedResult);
    setUpcomingPlannedMaintenace([]);
    calculateUpcomingPlannedMaintenance();
  }, [last30Days, service]);

  // useEffect to handle service changes and calculate average response time
  useEffect(() => {
    last2PlannedOutageOutage(service);
    calculateAverageResponseTime();
  }, [calculateAverageResponseTime, service]);

  // Function to calculate last 24 hours uptime percentage
  const calculateLast24HoursUptimePercentage = (
    serviceHistory,
    lastEntryTimestamp
  ) => {
    const last24HoursHistory = serviceHistory?.filter(
      (entry) =>
        new Date(entry?.timestamp).getTime() >= Date.now() - 24 * 60 * 60 * 1000
    );

    const dailyUptimePercentages = [];

    const currentDate = new Date(); // Get the current date once, as it will be the same for all iterations

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

    const dailyStatusHistory = last24HoursHistory?.filter(
      (entry) =>
        new Date(entry?.timestamp).getTime() >= startOfDay &&
        new Date(entry?.timestamp).getTime() <= endOfDay
    );

    if (dailyStatusHistory?.length > 0) {
      const firstCheck = dailyStatusHistory[0];
      const lastCheck = dailyStatusHistory[dailyStatusHistory?.length - 1];

      const totalUptime = dailyStatusHistory.reduce((uptime, entry) => {
        if (entry.statusCode === 200) {
          const nextEntryIndex = dailyStatusHistory?.indexOf(entry) + 1;
          const endTime =
            nextEntryIndex < dailyStatusHistory?.length
              ? new Date(
                  dailyStatusHistory[nextEntryIndex]?.timestamp
                ).getTime()
              : endOfDay;
          uptime += endTime - new Date(entry?.timestamp).getTime();
        }
        return uptime;
      }, 0);

      const totalDayTime = dailyStatusHistory.reduce((totaltime, entry) => {
        const nextEntryIndex = dailyStatusHistory.indexOf(entry) + 1;
        const endTime =
          nextEntryIndex < dailyStatusHistory?.length
            ? new Date(dailyStatusHistory[nextEntryIndex]?.timestamp).getTime()
            : endOfDay;
        totaltime += endTime - new Date(entry?.timestamp).getTime();
        return totaltime;
      }, 0);

      const adjustedUptime = Math.min(totalUptime, totalDayTime);
      const uptimePercentage = (adjustedUptime / totalDayTime) * 100 || 0;

      dailyUptimePercentages.push({
        date: currentDate.toLocaleDateString(),
        uptimePercentage: uptimePercentage.toFixed(2),
      });

      return dailyUptimePercentages[0].uptimePercentage;
    }
  };

  // If data is loading, display Loading component
  if (loadingData) {
    return (
      <Loading setLoadingData={setLoadingData} service={service} delay="2" />
    );
  }

  // Rendering History component
  return (
    <Container className="d-flex">
      <Row className="graphContainer d-flex flex-row">
        <Col lg="8" md="12">
          <div className="serviceWrapper">
            <div className="serviceTitleContainer">
              <h3>{service?.name}</h3>
            </div>

            <div
              className="serviceStausContainer"
              style={{
                background:
                  service?.statusHistory?.length > 0 &&
                  service?.statusHistory[service?.statusHistory?.length - 1]
                    .statusCode === 200
                    ? "#5CB85C"
                    : "#BB0000",
              }}
            >
              <span>
                {service?.statusHistory?.length > 0 &&
                service?.statusHistory[service?.statusHistory?.length - 1]
                  .statusCode === 200
                  ? "Up"
                  : "Down"}
              </span>
            </div>
          </div>
          <div className="serviceDataContainer">
            <div className="averageContainer">
              <h6>
                Overall uptime{" "}
                <span style={{ fontSize: ".8rem" }}>(last 24 hours)</span>
              </h6>
              <span>{overAllUpTime} %</span>
            </div>
            <div className="responeTimeContainer">
              <h6>Average response</h6>
              <span>
                {`${(
                  averageTimestamp
                    .filter((entry) => entry.averageResponseTime !== 0)
                    .reduce(
                      (start, entry) => start + entry.averageResponseTime,
                      0
                    ) /
                  averageTimestamp.filter(
                    (entry) => entry.averageResponseTime !== 0
                  )?.length
                ).toFixed(2)} ms`}
              </span>
            </div>
            <div className="graphSection">
              <h4>30-days response time</h4>
              <span>
                The system displays the average response time data for a maximum
                of 30 days for the service or the maximum available

 historical
                data in the database.
              </span>
              <div>
                {loading === "pending" ? (
                  <Loading />
                ) : loading === "rejected" ? (
                  "Something went wrong!"
                ) : (
                  <Graph
                    days={last30Days}
                    averageTimestamp={averageTimestamp}
                    type="responseTime"
                    service={service}
                  />
                )}
              </div>
            </div>

            <div className="graphSection">
              <h4>30-days Availability</h4>
              <span>
                The system will display the service's availability for the last
                30 days.
              </span>
              <Report/>
            </div>
            <div>
              {loading === "pending" ? (
                <Loading />
              ) : loading === "rejected" ? (
                "Something went wrong!"
              ) : (
                <Graph
                  days={last30Days}
                  averageTimestamp={averageTimestamp}
                  type="availability"
                  service={service}
                />
              )}
            </div>
          </div>
        </Col>

        <Col lg="3" md="12" className="d-flex justify-content-end">
          {loading === "pending" ? (
            <Loading />
          ) : loading === "rejected" ? (
            "Something went wrong!"
          ) : (
            <div className="statusConatiner">
              {service?.statusHistory ? (
                <div className="pastIncident">
                  <h5>Live Status</h5>
                  {
                    <StatusBar
                      service={service}
                      data={
                        service?.statusHistory[
                          service?.statusHistory?.length - 1
                        ]
                      }
                      type={
                        service?.statusHistory[
                          service?.statusHistory?.length - 1
                        ].statusCode == 200
                          ? "operational"
                          : "outage"
                      }
                    />
                  }
                </div>
              ) : (
                ""
              )}
              {service?.errorRecords?.length > 0 ? (
                <div className="pastIncident">
                  <h5>Past Outage</h5>
                  {pastOutage.map((incident, index) => (
                    <StatusBar
                      service={service}
                      data={incident}
                      key={index}
                      type="outage"
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {upcomingPlannedMaintenance?.length > 0 ? (
                <div className="pastIncident">
                  <h5>Upcoming Planned Maintenance</h5>
                  {upcomingPlannedMaintenance?.map((activity, index) => (
                    <StatusBar
                      service={service}
                      data={activity}
                      key={index}
                      type="planned maintenance"
                    />
                  ))}
                </div>
              ) : (
                ""
              )}

              {pastPlannedOutage?.length > 0 ? (
                <div className="pastIncident">
                  <h5>Past Planned Maintenance</h5>
                  {pastPlannedOutage?.map((activity, index) => (
                    <StatusBar
                      service={service}
                      data={activity}
                      key={index}
                      type="planned maintenance"
                    />
                  ))}
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default History; // Exporting History component

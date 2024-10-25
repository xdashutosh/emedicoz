import "../../../assets/css/event/style.css";
import "../../../assets/new_design/css/footer.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../apiConfig";
import axiosInstance from "../../../API/axiosConfig";

const Eventcenter = () => {
  setTimeout(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, 0);

  const userid = sessionStorage.getItem("id");
  const [eventcenterData, setEventData] = useState([]);

  useEffect(() => {
    const eventId = localStorage.getItem("eventId");
    console.log("Event ID local:", eventId);

    if (eventId) {
      axiosInstance
        .post(`/v1_data_model/courses/home/get_event_wise_center`, {
          user_id: userid,
          event_id: eventId,
        })
        .then((response) => {
          setEventData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  useEffect(() => {
    console.log(eventcenterData, "eventcenter");
  }, [eventcenterData]);

  return (
    <>
      <div className="page-content">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="#">Home</a>
              </li>
              <li>List Center</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="list-center">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <p>Showing Event In India</p>
            </div>
            <input
              type="hidden"
              id="eventdefaultid"
              name="center"
              value="1076"
            />
            <input type="hidden" id="subdefaultid" name="subid" value="32" />
            {eventcenterData.map(
              (
                course,
                index // Added index parameter
              ) => (
                <div
                  className="col-12 col-sm-6s col-md-6 col-lg-6 col-xl-6"
                  key={index} // Added key attribute
                >
                  <div className="show-event active">
                    <ul>
                      <li>
                        <img src="https://partner.damsdelhi.com/assets/images/face-to-face/location-img.svg" />
                      </li>
                      <li>
                        {course.event_vanue}
                        <span className="text-block">{course.address}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            )}
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="next-btn getsubid">
                <Link to="/Eventbooking">Next</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Eventcenter;

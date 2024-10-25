import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import "../MyAttentdance/style.css"

import { Spin } from "antd";

const Attendence = () => {
  const [loading, setLoading] = useState(false);
  const [attendData, setAttendData] = useState([]);
  const [selectBtn, setSelectBtn] = useState("1");

  const userID = sessionStorage.getItem("id");

  const spanStyle = {
   
  };

  const btnTitle = [
    { id: "1", title: "Today" },
    { id: "2", title: "Weekly" },
    { id: "3", title: "Monthly" },
    { id: "4", title: "Year" },
  ];

  const getAllAttendance = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/v1_data_model/courses/home/get_users_attendance",
        {
          user_id: userID,
          filter_by: id,
        }
      );
      setAttendData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAttendance(selectBtn);
  }, [selectBtn]);
  return (
    <div className="Attendence">
      <div className="container">
        <div className="myAttendance">
          <div className="AttendanceChild">
            {btnTitle.map((val, i) => (
              <span
                style={{
                  ...spanStyle,
                  backgroundColor: selectBtn === val.id ? "#071952" : "#fff",
                  color: selectBtn === val.id ? "white" : "black",
                }}
                key={i}
                onClick={() => setSelectBtn(val.id)}
              >
                {val.title}
              </span>
            ))}
          </div>
          {loading ? (
            <div
              style={{
                height: "56vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <>
              {attendData?.map((item, i) => (
                <div className="groupSec">
                  <div className="groupChild">
                    <b>{item?.event_name}</b>
                    <span>{item?.event_type}</span>
                  </div>
                  <div className="childText"
                    style={{
                      
                    }}
                  />
                  <div className="belowText">
                    <span>
                      <b>Date & Time:</b> {item?.date_time}
                    </span>
                    <span style={{color:"red"}}>{item?.attendence &&"Absent"}</span>
                  </div>
                  <div className="belowText">
                    <span>
                      <b>Location</b>: {item?.event_vanue}
                    </span>
                  </div>
                  <div className="belowText">
                    <span>
                      <b>Attendance Date:</b> {item?.attendence_date}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      </div>
  );
};

export default Attendence;

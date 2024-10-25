import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/recorded-video/style.css";
import "../../assets/css/recorded-video/responsive.css";
import axiosInstance from "../../API/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecordedTopic = () => {
  const user_id = sessionStorage.getItem("id");
  const [recordedSubjectTopic, setRecordedSubjectTopic] = useState([]);
  const [recordedvideo, setRecordedvideo] = useState([]);

  const recordedSubjectId = JSON.parse(
    localStorage.getItem("recorded_subject_id")
  );
  const getAllRecordedTopic = async () => {
    let courseId = JSON.parse(localStorage.getItem("course_Id"));
    try {
      const response = await axiosInstance.post(
        "/v1_data_model/courses/Recorded_course/get_recorded_subject_topic",
        { user_id: user_id, course_id: courseId, subject_id: recordedSubjectId }
      );

      setRecordedSubjectTopic(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllRecordedTopic();
  }, []);

  const getrecordedvideo = async (index, course_id, subject_id, topic_id) => {
    let courseId = JSON.parse(localStorage.getItem("course_Id"));
    try {
      const response = await axiosInstance.post(
        "/v1_data_model/courses/Recorded_course/get_recorded_topic_video",
        {
          user_id: user_id,
          course_id: course_id,
          subject_id: subject_id,
          topic_id: topic_id,
        }
      );
      //console.log("vediolist", response.data.data);
      setRecordedvideo(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [toggles, setToggles] = useState(
    Array(recordedvideo.length).fill(false)
  );
  const handleToggle = (index, course_id, subject_id, topic_id) => {
    //alert(index);
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    console.log(newToggles);
    setToggles(newToggles);
    getrecordedvideo(index, course_id, subject_id, topic_id);
  };
  const handleModel = () => {
    toast.success(
      "If you want to open or watch lecture Video go to the eMedicoz mobile app"
    );
  };

  return (
    <div className="RecordedTopic">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>{recordedSubjectTopic[0]?.topic_name}</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="recorded-video-course">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 banner_back">
              {/* <img
                src="https://d2enu63wt1sf3u.cloudfront.net/course_file_meta/4911212Plab.jpg"
                alt="Banner Icon"
              /> */}
              <img src="../images/recorded-banner.png" alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h2>Topic</h2>
            </div>
            {recordedSubjectTopic.map((item, index) => (
              <div
                key={index}
                className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6"
              >
                <div className="accordion">
                  <div className="card">
                    <div
                      className="card-header position-relativep"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleToggle(
                          index,
                          item.course_id,
                          item.subject_id,
                          item.id
                        )
                      }
                    >
                      <a className="card-title">
                        <img
                          src={
                            item.faculty_profile
                              ? item.faculty_profile
                              : "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/login_logo.png"
                          }
                          alt=""
                          style={{}}
                        />
                        {item.topic_name}
                      </a>
                      <span className="arow">
                        <em className="fa fa-angle-right float-right mt-4"></em>
                      </span>
                    </div>

                    {toggles[index] &&
                      recordedvideo.map((vedio, key) => (
                        <div className="card-body collapse show px-3">
                          <Link to={"javascript:;"} className="oth-sec">
                            <div className="boxSubmenu">
                              <p>
                                {vedio.type == "video" ? (
                                  <img
                                    src={
                                      "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/icon/play-icon.png"
                                    }
                                    alt=""
                                    title=""
                                    style={{ width: "30px", height: "30px" }}
                                  />
                                ) : (
                                  <img
                                    src={
                                      "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/icon/play-icon.png"
                                    }
                                    alt=""
                                    title=""
                                    style={{ width: "30px", height: "30px" }}
                                  />
                                )}
                                {vedio.title}&nbsp;
                              </p>

                              <p className="ml-3">
                                {vedio.duration}min
                                <span>
                                  <em
                                    className="fa fa-eye viewEye float-right text-blue"
                                    onClick={() => handleModel()}
                                  ></em>
                                </span>
                              </p>
                            </div>
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecordedTopic;

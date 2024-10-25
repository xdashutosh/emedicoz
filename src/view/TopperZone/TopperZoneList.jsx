import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import "../TopperZone/style.css";
import axiosInstance from "../../API/axiosConfig";

const TopperszoneList = () => {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState(1);

  // Function to handle tab click
  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const [TopperData, setTopperZoneData] = useState([]);
  const [TopperDatas, setTopperZoneDatas] = useState([]);
  const [TopperDatas1, setTopperZoneDatas1] = useState([]);
  const user_id = sessionStorage.getItem("id")
    ? sessionStorage.getItem("id")
    : 4;

  useEffect(() => {
    // Fetch NEET PG data
    axiosInstance
      .post(
        `/v1_data_model/topper_zone/topper_zone/topper_zone_list_by_id`,
        {
          user_id: user_id,
          topper_cat_id: 3,
        }
      )
      .then((response) => {
        setTopperZoneDatas(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching NEET PG data:", error);
      });

    // Fetch INICET data
    axiosInstance
      .post(
        `/v1_data_model/topper_zone/topper_zone/topper_zone_list_by_id`,
        {
          user_id: user_id,
          topper_cat_id: 1,
        }
      )
      .then((response) => {
        setTopperZoneData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching INICET data:", error);
      });

    axiosInstance
      .post(
        `/v1_data_model/topper_zone/topper_zone/topper_zone_list_by_id`,
        {
          user_id: user_id,
          topper_cat_id: 4,
        }
      )
      .then((response) => {
        setTopperZoneDatas1(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching INICET data:", error);
      });
  }, [user_id]);

  return (
    <>
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>Topper Zone</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="topper_zone">
        <div className="container">
          <div className="row">
            {/* Tab buttons */}
            <div className="btn_tabbing mb-3">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                  <button
                    onClick={() => handleTabClick(1)}
                    className={activeTab === 1 ? "active" : ""}
                  >
                    INICET
                  </button>
                  <button
                    onClick={() => handleTabClick(2)}
                    className={activeTab === 2 ? "active" : ""}
                  >
                    NEET PG
                  </button>

                  <button
                    onClick={() => handleTabClick(3)}
                    className={activeTab === 3 ? "active" : ""}
                  >
                    FMGE
                  </button>
                </div>
              </div>
            </div>

            {/* Tab content */}
            <div className="Tabbing_data">
              {activeTab === 1 && (
                <div>
                  <div className="row">
                    {TopperData.map((result, index) => (
                      <div
                        className="col-lg-6 col-md-12 col-sm-12 col-12"
                        key={index}
                      >
                        <div className="testimonialTopper mb-4">
                          <div className="picbg topz">
                            <img src={result.image_url} alt="img" />
                          </div>
                          <div className="testimonial-profile">
                            <h3 className="title">{result.name}</h3>
                            <div className="post">
                              Rank{" "}
                              <span className="badge badge-secondary">
                                {result.rank}
                              </span>
                            </div>
                          </div>
                          <p>{result.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <div className="row">
                    {TopperDatas.map((result, index) => (
                      <div
                        className="col-lg-6 col-md-12 col-sm-12 col-12"
                        key={index}
                      >
                        <div className="testimonialTopper mb-4">
                          <div className="picbg topz">
                            <img src={result.image_url} alt="img" />
                          </div>
                          <div className="testimonial-profile">
                            <h3 className="title">{result.name}</h3>
                            <div className="post">
                              Rank{" "}
                              <span className="badge badge-secondary">
                                {result.rank}
                              </span>
                            </div>
                          </div>
                          <p>{result.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <div className="row">
                    {TopperDatas1.map((result, index) => (
                      <div
                        className="col-lg-6 col-md-12 col-sm-12 col-12"
                        key={index}
                      >
                        <div className="testimonialTopper mb-4">
                          <div className="picbg topz">
                            <img src={result.image_url} alt="img" />
                          </div>
                          <div className="testimonial-profile">
                            <h3 className="title">{result.name}</h3>
                            <div className="post">
                              Score{" "}
                              <span className="badge badge-secondary">
                                {result.score}
                              </span>
                            </div>
                          </div>
                          <p>{result.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TopperszoneList;

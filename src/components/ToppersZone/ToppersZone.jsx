import "../../assets/css/home-page/style.css";
import "../../assets/css/home-page/responsive.css";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../API/axiosConfig";

const Topperszone = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [topperData, setTopperData] = useState([]);
  const [ModelData, setSelectedModeVal] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const scrollContainerRef = useRef(null);
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft - 500,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollLeft + 500,
        behavior: "smooth",
      });
    }
  };

  const handleShow = (mode) => {
    setSelectedModeVal(mode);
    setShow(true);
  };

  const user_id = sessionStorage.getItem("id")
    ? sessionStorage.getItem("id")
    : 4;

  const getTopperHandler = async () => {
    try {
      const { data } = await axiosInstance.post(
        "/v1_data_model/topper_zone/topper_zone/topper_zone_list_by_id",
        { user_id: user_id, topper_cat_id: activeTab }
      );
      setTopperData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTopperHandler();
  }, [activeTab]);

  return (
    <section className="HometopperZone position-relative">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="zonetext">
              <h3 className="font-weight-bold">
                Toppers <span>Zone</span>
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12">
            <div>
              {/* Tab buttons */}
              <div className="btn_tabbing">
                <div className="row">
                  <div className="col-9 col-md-9 col-lg-9">
                    <button
                      onClick={() => setActiveTab(1)}
                      className={activeTab === 1 && "active"}
                    >
                      INICET
                    </button>
                    <button
                      onClick={() => setActiveTab(3)}
                      className={activeTab === 3 && "active"}
                    >
                      NEET PG
                    </button>
                    <button
                      onClick={() => setActiveTab(4)}
                      className={activeTab === 4 && "active"}
                    >
                      FMGE
                    </button>
                  </div>
                  <div className="col-3 col-md-3 col-lg-3 text-right">
                    <Link to="/topper-zone" className="see-btn">
                      See all
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tab content */}
              <div className="Tabbing_data scroll-group">
                <div>
                  <div className="row" ref={scrollContainerRef}>
                    {topperData?.map((resullt, index) => (
                      <div
                        className="col-12 col-md-6 col-lg-3 article-img"
                        key={index}
                      >
                        <div className="testimonial">
                          <div className="pictesti">
                            <img src={resullt.image_url} />
                          </div>
                          <div className="testimonial-profile">
                            <h3 className="title">{resullt.name}</h3>
                            <div className="post">
                              {activeTab > 3 ? "Score" : "Rank"}

                              <span className="badge badge-secondary">
                                {activeTab > 3 ? resullt.score : resullt.rank}
                              </span>
                            </div>
                          </div>
                          <p className="description111">
                            <span>{resullt.message} </span>
                            <Link
                              data-name="Dr. Anirudh Vutukuri"
                              data-src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/2923940rank 2.PNG"
                              className="reed"
                              onClick={() => handleShow(resullt)}
                            >
                              Read More
                            </Link>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                padding: "25px 10px 0",
                color: "#F16136",
              }}
            >
              <FaArrowAltCircleLeft
                onClick={handleScrollLeft}
                size={32}
                style={{ marginRight: "25px", width: "25px" }}
              />
              <FaArrowAltCircleRight
                onClick={handleScrollRight}
                size={32}
                style={{ width: "25px" }}
              />
            </div>
          </div>
        </div>
        {/* Begin: Model Code  */}
        <Modal show={show} onHide={handleClose} className="readModel">
          <Modal.Header closeButton>
            {/*<Modal.Title>Modal heading</Modal.Title>*/}
          </Modal.Header>

          <Modal.Body className="content">
            <img className="expandedImg" src={ModelData.image_url} alt="img" />
            <h3 className="text-center name-title">{ModelData.name}</h3>
            <p className="text-center">
              {activeTab === 4 ? (
                <div>
                  <span className="green-text">Score</span>{" "}
                  <span>{ModelData.score}</span>
                </div>
              ) : (
                <div>
                  <span className="green-text">Rank</span>{" "}
                  <span>{ModelData.rank}</span>
                </div>
              )}
            </p>
            <p>{ModelData.message}</p>
          </Modal.Body>
        </Modal>
        {/* End: Model Code  */}
      </div>
    </section>
  );
};

export default Topperszone;

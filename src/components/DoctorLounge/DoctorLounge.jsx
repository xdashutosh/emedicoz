import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Button, Badge, Image, Col } from "react-bootstrap";
import { FaPlay } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import Login from "../Login/Login";

const YoutubeModal = ({ show, onHide, videoUrl, title }) => {
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const preventInspect = (event) => {
      if (
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
        (event.ctrlKey && event.keyCode === 73)
      ) {
        // Ctrl+I
        event.preventDefault();
      }
    };

    window.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("keydown", preventInspect);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("keydown", preventInspect);
    };
  }, []);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      // Set the size of the modal to large
      className="closeBtn"
    >
      <Modal.Header closeButton />
      <Modal.Title style={{ padding: "10px 10px 0px" }}>{title}</Modal.Title>
      <Modal.Body>
        {" "}
        {/* Set the height to 70% of viewport height */}
        <div className="embed-responsive embed-responsive-16by9">
          <video src={videoUrl} controls autoplay controlsList="nodownload" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

function DoctorLounge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [targeturl, settargeturl] = useState(null);
  const [videoData, setvidData] = useState([]);
  const [videoTitle, setTitle] = useState("");
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userID = sessionStorage.getItem("id");


  const navigate = useNavigate();
  useEffect(() => {
    const getHomeVideo = async () => {
      const response = await axiosInstance.post(
        `/v1_data_model/unique_selling_point/usp/podcast_home_list_new`,
        {}
      );
      if (response.status) {
        setvidData(response?.data?.data);
      }
    };
    getHomeVideo();
  }, []);

  const handleShow = (url, tit) => {
    setVideoUrl(url);
    setTitle(tit);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? videoData.length - 1 : prevIndex - 1
      );
    }
  };

  const nextSlide = () => {
    if (currentIndex < videoData.length / 3 - 1) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
    }
  };

  const handlerClose = () => {
    setSignInModalOpen(false);
  };

  const handleSignInSuccess = () => {
    setSignInModalOpen(false);
  };
  const handlerCheckstore = () => {
    settargeturl("/store");
    if (userID != null) {
      setIsAuthenticated(true);
      navigate(`/store`);
    } else {
      setSignInModalOpen(true);
    }
  };

  const handlerCheckevent = () => {
    settargeturl("/event");
    if (userID != null) {
      setIsAuthenticated(true);
      navigate(`/event`);
    } else {
      setSignInModalOpen(true);
    }
  };

  const handlerCheckalllounge = () => {
    settargeturl("/all-lounge");
    if (userID != null) {
      setIsAuthenticated(true);
      navigate(`/all-lounge`);
    } else {
      setSignInModalOpen(true);
    }
  };
  // const handlerChecknews = ()=>{
  //   if(userID!=null){
  //     setIsAuthenticated(true);
  //     navigate(`/news-and-article`)
  //   }else{
  //     setSignInModalOpen(true);
  //   }

  // }
  const handlerCheckcbt = () => {
    settargeturl("/cbt");
    if (userID != null) {
      setIsAuthenticated(true);
      navigate(`/cbt`);
    } else {
      setSignInModalOpen(true);
    }
  };

  return (
    <section className="doctorLodge position-relative">
      <div className="container">
        <div className="row">
          <div className="col-8 col-sm-8 col-md-9 col-lg-10 col-xl-10">
            <div className="globe_heading">
              <h2 className="font-weight-bold text-left">
                Doctor's <span>Lounge </span>
              </h2>
            </div>
          </div>
          <div className="col-4 col-sm-4  col-md-3 col-lg-2 text-right">
            <Link to="/all-lounge" className="see-btn">
              See all
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="video_area">
              <div id="demo" className="carousel slide" data-ride="carousel">
                {videoData && (
                  <div>
                    {[...Array(Math.ceil(videoData?.length / 3)).keys()].map(
                      (index) => (
                        <div
                          key={index}
                          className={`carousel-item mobileWrap ${
                            index === currentIndex ? "active" : ""
                          }`}
                        >
                          <div className="row">
                            {videoData
                              ?.slice(index * 3, (index + 1) * 3)
                              .map((itm, i) => (
                                <Col key={index} md={4} className="hoverVideo">
                                  <div className="videHeightbg">
                                    <img
                                      src={itm.icon}
                                      alt="Video Banner"
                                      style={{}}
                                    />

                                    <div className="titleVideo">
                                      <FaPlay
                                        onClick={() =>
                                          handleShow(itm.video, itm.video_title)
                                        }
                                        size={22}
                                      />
                                    </div>
                                  </div>
                                  <p>{itm.video_title}</p>
                                </Col>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center nextPreBTn">
            <button type="button" onClick={prevSlide}>
              <em className="fa fa-arrow-left"></em>
            </button>
            <button type="button" onClick={nextSlide}>
              <em className="fa fa-arrow-right"></em>
            </button>
          </div>
        </div>
      </div>

      <YoutubeModal
        show={showModal}
        onHide={handleClose}
        videoUrl={videoUrl}
        title={videoTitle}
      />

      <div className="LinkCategories">
        <div className="container">
          <h2>Categories</h2>
          <div className="Linkdata">
            <div className="catImg">
              <span onClick={handlerCheckstore} defaultValue={"store"}>
                <div className="medimart">
                  <img
                    src={`${window.IMG_BASE_URL}/medimart.png`}
                    alt="store"
                  />
                </div>
                <h3>MediMart</h3>
              </span>
            </div>
            <div className="catImg">
              <span onClick={handlerCheckcbt}>
                <div className="medimart cbt">
                  <img src={`${window.IMG_BASE_URL}/cbt.png`} alt="" />
                </div>
                <h3>CBT</h3>
              </span>
            </div>
            <div className="catImg">
              <span onClick={handlerCheckevent}>
                <div className="medimart event">
                  <img src={`${window.IMG_BASE_URL}/medimart.png`} alt="" />
                </div>
                <h3>Event</h3>
              </span>
            </div>
            <div className="catImg">
              <span onClick={handlerCheckalllounge}>
                <div className="medimart podacast">
                  <img src={`${window.IMG_BASE_URL}/cbt.png`} alt="" />
                </div>
                <h3>Podcast</h3>
              </span>
            </div>
            <div className="catImg">
              <Link to="/news-and-article">
                <div className="medimart newsdata">
                  <img src={`${window.IMG_BASE_URL}/medimart.png`} alt="" />
                </div>
                <h3>News & Article</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {isSignInModalOpen && (
        <Login
          targeturl={targeturl}
          handlerClose={handlerClose}
          setIsAuthenticated={setIsAuthenticated}
          handleSignInSuccess={handleSignInSuccess}
          setSignInModalOpen={setSignInModalOpen}
        />
      )}
    </section>
  );
}
export default DoctorLounge;

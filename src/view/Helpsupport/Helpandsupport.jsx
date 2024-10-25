import "../Helpsupport/style.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { Image } from "react-bootstrap";
import Login from "../../components/Login/Login";

const Helpandsupport = ({ setIsAuthenticated }) => {
  const sess_id = sessionStorage.getItem("id");
  // console.log(sess_id)
  const [activeIndex, setActiveIndex] = useState(null);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const divRef = useRef(null);
  const handleRight = () => {
    if (divRef.current) {
      divRef.current.scrollLeft += 300; // Adjust scroll amount as needed
    }
  };

  const handleLeft = () => {
    if (divRef.current) {
      divRef.current.scrollLeft -= 300; // Adjust scroll amount as needed
    }
  };

  const userid = sessionStorage.getItem("id")
    ? sessionStorage.getItem("id")
    : 4;
  const [topicList, setTopicList] = useState([]);
  const [fetchLive, setfetchLivecourse] = useState([]);
  const [catid, setcatid] = useState("16");
  const [titlename, settitlename] = useState("Live Courses");
  const [filteredCourses, setfilterCourse] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/v1_data_model/help_support/get_help_support_Category`
        );
        // console.log(response.data.data);
        setTopicList(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchLiveCourse = async () => {
      try {
        const response = await axiosInstance.post(
          `/v1_data_model/help_support/get_help_and_support_by_category_web`,
          { user_id: userid }
        );
        // console.log(response.data);
        setfetchLivecourse(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    fetchLiveCourse();
  }, []);

  const handlecard = (data) => {
    setcatid(data.id);
    settitlename(data.title);
  };

  // console.log(topicList)
  useEffect(() => {
    const filterCourse = fetchLive.filter((course) => course.category == catid);

    setfilterCourse(filterCourse);
  }, [catid, fetchLive]);

  const HandleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (SearchTerm) {
      const ultrafil = filteredCourses?.filter((data) =>
        data.question.toLowerCase().includes(SearchTerm.toLowerCase())
      );
      setfilterCourse(ultrafil);
    } else {
      setfilterCourse(fetchLive);
    }
  }, [SearchTerm]);

  /* Active tab */

  useEffect(() => {
    if (topicList && topicList.length > 0) {
      setActiveItem(topicList[0]); // Set the first item as the default active item
    }
  }, [topicList]);
  const [activeItem, setActiveItem] = useState(null);
  const handleClick = (item) => {
    setActiveItem(item);
    handlecard(item);
  };

  const handlerClose = () => {
    setSignInModalOpen(false);
  };

  const handleSignInSuccess = () => {
    setSignInModalOpen(false);
  };

  const handlerCheck = () => {
    //console.log(userObj);
    if (sess_id) {
      navigate(`/raise-query/${userid}DTweb`);
    } else {
      setSignInModalOpen(true);
    }
  };

  return (
    <>
      <div className="Helpsupport">
        <div className="page-content position-relative">
          <div className="breadcrumb-row">
            <div className="container">
              <ul className="list-inline">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>Help & Support</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="commanColor"></div>
        <div className="container">
          <div className="helpsupportBanner">
            <div className="row">
              <div className="col-6 col-sm-6 col-md-6 col-lg-6 helpText">
                <h1>We are happy to help you !</h1>
              </div>
              <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                <div className="helpImg">
                  <img src={`${window.IMG_BASE_URL}/help-support.png`} alt="Help Support" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="news-artcile-area">
          <div className="container">
            <div className="searchTextbg position-relative">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="input-group md-form form-sm form-2">
                    <input
                      className="form-control my-0 py-1 amber-border searchTheKey"
                      id="searchTheKey"
                      type="text"
                      placeholder="Search for your queries"
                      aria-label="Search"
                      value={SearchTerm}
                      onChange={HandleSearch}
                    />
                    <div className="input-group-append">
                      <a className="search_icon">
                        <span className="input-group-text">
                          <i className="fa fa-search"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="topicText">
              <div className="row">
                <div className="col-12 col-md-12">
                  <h2 className="text-center">
                    Choose the topic you need help with?
                  </h2>
                </div>
              </div>
            </div>

            <div className="live-cources" id="matchKey">
              <div className="item-text" style={{}}>
                <div className="group-set" ref={divRef}>
                  {topicList?.map((item) => (
                    <div
                      key={item.id} // Assuming each item has a unique id
                      className={`groupset-child ${
                        activeItem === item ? "active" : ""
                      }`}
                      onClick={() => handleClick(item)}
                    >
                      <img
                        src={item.app_img}
                        onError={(e) => {
                          e.target.src =
                            "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/emedicoz-logo.png";
                        }}
                        alt="Emedicoz Logo"
                      />
                      <span className="span-con">{item.title}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignSelf: "center" }}>
                  <FaArrowLeft
                    style={{ marginRight: "10px" }}
                    onClick={handleLeft}
                  />
                  <FaArrowRight onClick={handleRight} />
                </div>
              </div>

              <div className="tab-content">
                <div id="cat12" className="tab-pane  active ">
                  <div className="need-live-courses">
                    <div className="row">
                      <div className="col-12 col-md-12 col-lg-12">
                        <h3 className="text-center">
                          You need help with ({titlename})
                        </h3>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-12 col-md-12 col-lg-12">
                        <div className="frequently">
                          <img src={`${window.IMG_BASE_URL}/frequently-ask.png`} />
                          <span>Frequently Asked Questions?</span>
                        </div>
                      </div>
                    </div>
                    <div className="accordianBg">
                      <div className="row">
                        <div className="col-12 col-md-12 col-lg-12">
                          <div id="main">
                            <div className="accordion listingAc">
                              {filteredCourses.length != 0 ? (
                                filteredCourses?.map((live, index) => (
                                  <div
                                    className="card"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      toggleAccordion(index);
                                    }}
                                    aria-expanded={activeIndex === index}
                                    key={index}
                                  >
                                    <div className="card-childbg" style={{}}>
                                      <div className="card-header">
                                        {live.question}
                                      </div>
                                      {activeIndex === index ? (
                                        <FaArrowUp />
                                      ) : (
                                        <FaArrowDown />
                                      )}
                                    </div>

                                    <div
                                      className={`collapse ${
                                        activeIndex === index ? "show" : ""
                                      }`}
                                      aria-labelledby={`faqhead${index}`}
                                      data-parent="#faq"
                                    >
                                      <div className="card-body">
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: live.answer,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    src="https://i.ibb.co/TkRCGdR/file-issue1.png"
                                    style={{ height: "50%", width: "50%" }}
                                  />
                                  <h2>No data found!</h2>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="supportbtn">
                    <a
                      href="mailto:helpdesk@damsdelhi.com"
                      className="helpecontact"
                      target="_blank"
                    >
                      <em
                        className="fa fa-envelope-o"
                        style={{ marginright: "10px" }}
                      ></em>{" "}
                     helpdesk@damsdelhi.com
                    </a>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="supportbtn">
                    <a
                      href="https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question"
                      className="helpecontact"
                      target="_blank"
                    >
                      <img
                        src={`${window.IMG_BASE_URL}/whatsapp.png`}
                        style={{ width: "30px", marginright: "10px" }}
                      />{" "}
                      +91-9899664533
                    </a>
                  </div>
                </div>
                {/* <div className="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div className="supportbtn raisequery" onClick={handlerCheck}>
                    <Link
                    //  to={"/raise-query"}
                    >
                      Technical Support
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSignInModalOpen && (
        <Login
          handlerClose={handlerClose}
          setIsAuthenticated={setIsAuthenticated}
          handleSignInSuccess={handleSignInSuccess}
          setSignInModalOpen={setSignInModalOpen}
        />
      )}
    </>
  );
};
export default Helpandsupport;

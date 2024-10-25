import "../../assets/css/event/style.css";
import "../../assets/css/event/responsive.css";
import "../../assets/new_design/css/footer.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";
import Modal from "react-modal";
import axiosInstance from "../../API/axiosConfig";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    border: "0px",
    fontSize: "18px",
    fontWeight: "600",
    borderRadius: "20px",
    width: "30%",
  },
};

Modal.setAppElement("#root");

const Eventlist = () => {
  const navigate = useNavigate();
  const handleBookOnline = (eventId) => {
    localStorage.setItem("eventId", eventId);
    navigate("/eventcenter");
  };

  const handleEvent = (eventId) => {
    localStorage.setItem("eventId", eventId);
    setIsOpen(true);
    // navigate("/Eventbooking");
  };

  const [catlist, setallcat] = useState([]);
  const [eventlistdata, seteventlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [SearchTerm, setSearchTerm] = useState("");
  const [filterlist, setfilterlist] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  // State to keep track of active category

  const user_id = sessionStorage.getItem("id");
  const city_id = null;
  const cat_id = null;
  const event_name = null;
  useEffect(() => {
    setActiveCategory(0);
    axiosInstance
      .post(`/v1_data_model/courses/home/get_all_events`, {
        user_id: user_id,
        city_id: city_id,
        cat_id: cat_id,
        event_name: event_name,
      })
      .then((response) => {
        setallcat(response?.data?.data?.cat_wise_event_list);
 
        seteventlist(response.data.data.cat_wise_event_list[0].event_list);
        // console.log(response.data.data.cat_wise_event_list[0].event_list)
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);


  const handleCategoryClick = async(categoryId, categoryName) => {

          const res = await axiosInstance
          .post(`/v1_data_model/courses/home/get_all_events`,{user_id:user_id});
          setActiveCategory(categoryId)
          categoryId==0?seteventlist(res.data.data.cat_wise_event_list[0].event_list):categoryId==10?seteventlist(res.data.data.cat_wise_event_list[1].event_list):categoryId==11?seteventlist(res.data.data.cat_wise_event_list[2].event_list):categoryId==20?seteventlist(res.data.data.cat_wise_event_list[3].event_list):seteventlist(res.data.data.cat_wise_event_list[0].event_list)
  };

  useEffect(() => {
    if (SearchTerm) {
      const fildata = eventlistdata?.filter((item) =>
        item.title.toLowerCase().includes(SearchTerm.toLowerCase())
      );
      setfilterlist(fildata);
    } else {
      setfilterlist(eventlistdata);
    }
  }, [SearchTerm, eventlistdata]);

  const HandleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="EventList">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li style={{ color: "#434343" }}>Events</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="event_module">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div
                className="row dams-center"
                id="divShowHide"
                style={{ display: "none" }}
              ></div>
              <div className="tab-content" id="addeventtype">
                <div id="new-delhi" className="tab-pane active">
                  <div className="upcom_event">
                    <div className="row position-relative">
                      <div className="col-12 position-relative">
                        <div className="search_btng ">
                          <input
                            type="text"
                            className="form-control"
                            id="search"
                            aria-describedby="filterIt"
                            placeholder="Search all event"
                            value={SearchTerm}
                            onChange={HandleSearch}
                          />

                          <i className="fa fa-search"></i>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-lg-12">
                        <ul className="nav nav-pills" role="tablist" id="event">
                          {catlist?.map((eventcat) => (
                            <li className="nav-item" key={eventcat.id}>
                              <Link
                                className={`nav-link ${
                                  eventcat.id === 0 && activeCategory === null
                                    ? "active"
                                    : ""
                                } ${
                                  activeCategory === eventcat.id ? "active" : ""
                                }`}
                                data-toggle="pill"
                                href="#dvt"
                                data-event-id="0"
                                onClick={() =>
                                  handleCategoryClick(
                                    eventcat.id,
                                    eventcat.name
                                  )
                                }
                              >
                                {eventcat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-12 col-lg-12">
                        <div id="eventListAjax">
                          <div className="tab-content" id="add-event">
                            <div id="dvt" className="tab-pane active">
                              <div className="dvt_sec">
                                <div className="row">
                                  {filterlist?.map((event) => (
                                    <div
                                      className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 sec_pd"
                                      key={event.id}
                                    >
                                      <Link to={"#"}></Link>
                                      <div className="event_prt">
                                        <Link to={"#"}>
                                          <div className="img_sec position-relative">
                                            <img
                                              src={event.cover_image}
                                              alt=""
                                            />
                                          </div>
                                        </Link>
                                        <div className="text_sec">
                                          <Link to={"#"}>
                                            <div className="row m-0">
                                              <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                                <div className="matter">
                                                  <h5>{event.title}</h5>
                                                  <h6>
                                                    {event.event_start_date},
                                                    {event.event_vanue},
                                                    {event.event_start_time}
                                                  </h6>
                                                </div>
                                              </div>
                                              <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                                <div className="event-type">
                                                  <h5>Event Type</h5>
                                                  {parseInt(
                                                    event.availability_course,
                                                    10
                                                  ) === 1 && <h6>Online</h6>}
                                                  {parseInt(
                                                    event.availability_course,
                                                    10
                                                  ) === 2 && (
                                                    <h6 className="face-text">
                                                      Face to Face
                                                    </h6>
                                                  )}
                                                  {parseInt(
                                                    event.availability_course,
                                                    10
                                                  ) === 3 && (
                                                    <h6 className="blue-text">
                                                      Online | Face to Face
                                                    </h6>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                          <div className="row m-0 border-dashed">
                                            <Link to={"#"}>
                                              <div className="col-2 position-relative">
                                                <div className="price-text">
                                                  <p>
                                                    <span className="text-set">
                                                      {event.mrp == 0 ? (
                                                        <span
                                                          style={{
                                                            color: "green",
                                                          }}
                                                        >
                                                          Free
                                                        </span>
                                                      ) : (
                                                        `₹${event.mrp}`
                                                      )}{" "}
                                                      {event.event_id}
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </Link>
                                            <div className="col-10">
                                              <div className="on-btn">
                                                <Link to={"#"}></Link>
                                                <Link to={"#"}>
                                                  <span></span>
                                                </Link>

                                                {event.availability_course ===
                                                  "2" ||
                                                event.availability_course ===
                                                  "3" ? (
                                                  <button
                                                    className="btn"
                                                    onClick={() =>
                                                      // handleBookOnline(event.id)
                                                      handleEvent(event.id)
                                                    }
                                                  >
                                                    Book Face To Face
                                                  </button>
                                                ) : (
                                                  <button
                                                    className="btn"
                                                    onClick={() =>
                                                      handleEvent(event.id)
                                                    }
                                                  >
                                                    Book Online
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-12">
                                            <div className="onwrd"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div
            className=""
            style={{
              padding: "25px 15px",
              textAlign: "center",
              borderRadius: "6px",
              border: "1px solid #eee",
            }}
          >
            This Feature currently available in mobile app
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default Eventlist;

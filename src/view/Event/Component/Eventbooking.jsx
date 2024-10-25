import "../../../assets/css/event/style.css";
import "../../../assets/new_design/css/footer.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../network/cartSlice";

const Eventbooking = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const userid = sessionStorage.getItem("id");
  const [courseData, setCourseData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [rating, setStateRating] = useState(1);
  const [message, setMessage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalShow, setModalShow] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangeRating = (e) => {
    setStateRating(e.target.value);
  };
  const handleChangemessage = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const eventId = localStorage.getItem("eventId");

    console.log("Event ID local2:", eventId);
    axiosInstance
      .post(`/v1_data_model/courses/home/get_event_detaile`, {
        user_id: userid,
        course_id: eventId,
      })
      .then((response) => {
        if (response.data) {
          setCourseData(response.data.data.event_detaile);
          setModalData(response.data.data.event_detaile.installment);
          console.log("Event data list:", courseData);
        } else {
          console.log("API returned empty data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Add [] as dependency array to run the effect only once
  console.log(courseData);
  console.log(modalShow);

  const buynow = (id) => {
    let subid;
    if (activeIndex === 0) {
      subid = id;
    } else {
      subid = activePlan;
    }
    const requestData = {
      user_id: userid,
    };

    const requestData2 = {
      user_id: userid,
      course_id: courseData.id,
      subscription_id: subid,
      course_start_date: "",
      facetofacecenter_id: courseData.subcenter_id,
      is_part_payment: 0,
      course_registration_amount: "",
      pending_amount: "",
      payment_id: "",
      id_fr_learning_center_detail: "",
      booking_type: "",
      partner_member_id: "",
      is_cbt: "",
      is_combo_master: 0,
      combo_course_id: "",
    };

    const jwt_token = JSON.parse(localStorage.getItem("jwt_token"));

    axiosInstance
      .post("/v1_data_model/user/User_cart/clear_cart", requestData)
      .then((response) => {

        dispatch(clearCart())
        addCart(requestData2);
      })
      .catch((error) => {
        console.error("Error fetching Stream list data:", error);
      });
  };
  const addCart = (requestData2) => {
    axiosInstance
      .post("/v1_data_model/user/user_cart/add_course_to_cart", requestData2)
      .then((response) => {
        console.log(response);
        if (response.data.status === true) {
          navigate("/addToCart");
          location.reload();
          toast.success("Event has been added to cart", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (response.data.status === false) {
          navigate("/addToCart");
          location.reload();
          toast.error("Event already added in cart", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching list data:", error);
      });
  };

  const handlesave = (e) => {
    axiosInstance
      .post(`/v1_data_model/courses/home/add_review_to_events`, {
        user_id: userid,
        rating: rating,
        text: message,
        course_id: localStorage.getItem("eventId"),
      })
      .then((response) => {
        // console.log(response.data.message);
        if (response.data.message) {
          handleClose();
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.log("API returned empty data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <div className="page-content">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="#">Home</a>
              </li>
              <li>Mega Revision Course</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="revision_course">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
              <div className="banner_img1">
                <img src={courseData.cover_image} alt="" />
              </div>
              <div className="about">
                <h1>Description</h1>
                <p></p>
                <p
                  dangerouslySetInnerHTML={{ __html: courseData.description }}
                ></p>
                <p></p>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
              <div className="target_part">
                <p className="blue-text">
                  {" "}
                  <em className="fa fa-calendar-o"></em>
                  {courseData.event_start_date} - {courseData.event_end_date} |{" "}
                  {courseData.event_start_time} - {courseData.event_end_time}
                </p>
                <p>
                  {" "}
                  <em className="fa fa-map-marker"></em>{" "}
                  {courseData.event_vanue}
                </p>
                <p>
                  {" "}
                  <em className="fa fa-window-maximize"></em> Event Type:
                  FaceToFace
                </p>
                <p>
                  {" "}
                  <em className="fa fa-inbox"></em>Available Seat:{" "}
                  {courseData.avalable_sheat}
                </p>
                <p>
                  {" "}
                  <em className="fa fa-star-half-o"></em>
                  {courseData.avrage_rating}&nbsp;
                  <span className="text-gry">4 Rating</span>
                  <span className="rate">
                    <>
                      <Button className="btn rate-btn" onClick={handleShow}>
                        Rate Now
                      </Button>

                      <Modal
                        show={show}
                        onHide={handleClose}
                        style={{ marginTop: "125px;" }}
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div class="text-exp">
                            <h3>Give Your Experience</h3>
                            <img
                              src="https://dams-test.s3.ap-south-1.amazonaws.com/course_file_meta/9473673146210DVT 2023.jpg"
                              alt=""
                            />
                            <fieldset class="rate-star">
                              <input
                                type="radio"
                                required="required"
                                id="rating10"
                                name="rating"
                                value="5"
                                onChange={handleChangeRating}
                              />
                              <label for="rating10" title="5 stars"></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating9"
                                name="rating"
                                value="5"
                                onChange={handleChangeRating}
                              />
                              <label
                                class="half"
                                for="rating9"
                                title="4 1/2 stars"
                              ></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating8"
                                name="rating"
                                value="4"
                                onChange={handleChangeRating}
                              />
                              <label for="rating8" title="4 stars"></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating7"
                                name="rating"
                                value="4"
                                onChange={handleChangeRating}
                              />
                              <label
                                class="half"
                                for="rating7"
                                title="3 1/2 stars"
                              ></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating6"
                                name="rating"
                                value="3"
                                onChange={handleChangeRating}
                              />
                              <label for="rating6" title="3 stars"></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating5"
                                name="rating"
                                value="3"
                                onChange={handleChangeRating}
                              />
                              <label
                                class="half"
                                for="rating5"
                                title="2 1/2 stars"
                              ></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating4"
                                name="rating"
                                value="2"
                                onChange={handleChangeRating}
                              />
                              <label for="rating4" title="2 stars"></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating3"
                                name="rating"
                                value="2"
                                onChange={handleChangeRating}
                              />
                              <label
                                class="half"
                                for="rating3"
                                title="1 1/2 stars"
                              ></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating2"
                                name="rating"
                                value="1"
                                onChange={handleChangeRating}
                              />
                              <label for="rating2" title="1 star"></label>
                              <input
                                type="radio"
                                required="required"
                                id="rating1"
                                name="rating"
                                value="1"
                                onChange={handleChangeRating}
                              />
                              <label
                                class="half"
                                for="rating1"
                                title="1/2 star"
                              ></label>
                            </fieldset>
                            <textarea
                              rows="4"
                              cols="50"
                              name="comment"
                              form="usrform"
                              onChange={handleChangemessage}
                            >
                              {" "}
                            </textarea>
                          </div>
                          <span class="error" id="username_err">
                            {" "}
                          </span>
                        </Modal.Body>
                        <Modal.Footer>
                          {/* <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button> */}
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn sub"
                              onClick={handlesave}
                            >
                              Submit
                            </button>
                          </div>
                        </Modal.Footer>
                      </Modal>
                    </>
                  </span>
                </p>
                <p>
                  <em className="fa fa-credit-card"></em> ₹{" "}
                  {courseData.before_discount_mrp
                    ? courseData.before_discount_mrp
                    : courseData.mrp}
                  <span>
                    <button
                      className="btn buy_btntc"
                      onClick={() => setModalShow(1)}
                    >
                      Buy Ticket
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {modalShow === 1 ? (
            <div
              className="modal subscriptionbg show"
              id="buy_now980"
              style={{ paddingRight: "17px", display: "block" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header ">
                    <h4 className="modal-title Class_className__yAM1H">
                      Select Plan Subscription
                    </h4>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      onClick={() => setModalShow(0)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <section className="subscription-data">
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <div className="slider">
                            <img
                              src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/new-images.png"
                              alt=""
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          <div className="tab-pane active">
                            <div className="show-center">
                              <div className="row">
                                {/* <h3>{courseData1[0].title}</h3><span>{courseData1[0].mrp}</span> */}

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                  {modalData.map((module, index) => (
                                    <div
                                      key={module.id}
                                      className={`dams-center plan ${
                                        index === activeIndex ? "active" : ""
                                      }`}
                                      onClick={() =>
                                        handlePlanClick(index, module.id)
                                      }
                                      data-id={module.id}
                                    >
                                      <div className="row">
                                        <div className="col-2 col-sm-2 col-md-1 col-lg-1 col-xl-1 map">
                                          <div className="round"></div>
                                          <div className="active-img">
                                            <span>
                                              <img
                                                src="https://i.ibb.co/SPbrbh2/Layer-44.png"
                                                alt=""
                                              />
                                            </span>
                                          </div>
                                        </div>

                                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                          <div className="month-text">
                                            <h5>{module.name}</h5>
                                          </div>
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-7 col-lg-7 col-xl-7 dams-text">
                                          <h3>
                                            <em className="fa fa-rupee"></em>
                                            {module.is_purchased === "1"
                                              ? module.mrp
                                              : module.amount_description
                                              ? module.amount_description
                                                  .payment[0]
                                              : ""}
                                          </h3>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="continuebtn">
                                <a
                                  href="javascript:;"
                                  onClick={() =>
                                    buynow(courseData.installment[0].id)
                                  }
                                >
                                  Proceed to pay
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};
export default Eventbooking;

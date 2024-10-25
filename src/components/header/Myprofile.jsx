import React, { useState, useRef, useEffect } from "react";
import "../../assets/newjs/style.css";
import "../../assets/new_design/css/style.css";
import "../../assets/css/home-page/responsive.css";
import "../../assets/css/shortcodes/shortcodes.css";
import "../../assets/css/mega-menu.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../API/axiosConfig";

import { clearCart } from "../../network/cartSlice";

function Myprofile({ setIsAuthenticated }) {
  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const userid = sessionStorage.getItem("id");
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getCartData = async () => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/user_cart/get_user_cart_data",
        { user_id: userid }
      );
      setCartData(res?.data?.data?.list);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  const closeNav = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const resdata = sessionStorage.getItem("userData");
    const userDataObj = JSON.parse(resdata);
    sessionStorage.setItem("jwt_token", userDataObj.jwt_token);
    setUserData(userDataObj);
  }, []);

  const handleLogout = async () => {
    try {
      const { id, device_tokken } = userData;
      await axiosInstance.post(
        `/v1_data_model/user/registration/logout_old_deveices`,
        {
          user_id: id,
          device_tokken: device_tokken,
        }
      );
      sessionStorage.clear();
      localStorage.clear();
      dispatch(clearCart());
      setIsAuthenticated(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const openNav = () => {
    setIsOpen(true);
  };

  const handlerBookSale = () => {
    navigate("/ebooksale");
    closeNav();
  };

  const handlerPublishBook = () => {
    navigate("/publishbook");
    closeNav();
  };
  const handlerOval = () => {
    navigate("/podcast");
    closeNav();
  };
  const handlerMyCourse = () => {
    navigate("/my-course");
    closeNav();
  };
  const handlerMyScorecard = () => {
    navigate(`/score-card/${userid}`);
    closeNav();
  };
  const handlerBookmark = () => {
    navigate("/bookmark");
    closeNav();
  };
  const handlerMyAddress = () => {
    navigate("/myaddress");
    closeNav();
  };
  const handlerMyOrder = () => {
    navigate("/myorder");
    closeNav();
  };
  const handlerMyPayment = () => {
    navigate("/my-payment");
    closeNav();
  };
  const handlerStore = () => {
    navigate("/store");
    closeNav();
  };
  const handlerCbt = () => {
    navigate("/cbt");
    closeNav();
  };
  const handlerEvent = () => {
    navigate("/event");
    closeNav();
  };
  const handlerDoc = () => {
    navigate("/all-lounge");
    closeNav();
  };
  const handlerMyAtt = () => {
    navigate("/attendance");
    closeNav();
  };

  const handleCash = () => {
    navigate("/cashrefund");
    closeNav();
  };
  const handleEarn = () => {
    navigate("/refer-earn");
    closeNav();
  };

  const handleHelp = () => {
    navigate("/help-and-support");
    closeNav();
  };
  const handlerProfile = () => {
    navigate(`/profilenew/${userid}`);
    closeNav();
  };
  const handleEarnList = () => {
    navigate("/refer-list");
    closeNav();
  };

  const handleJoin = () => {
    navigate("/join-affiliate");
    closeNav();
  };

  return (
    <>
      <li>
        <div id="main">
          <span
            className="humburgerIcon"
            onClick={openNav}
            style={{ cursor: "pointer" }}
          >
            <img
              src={
                // userData?.profile_picture
                //   ? userData.profile_picture
                //   :

                "https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/icons.png"
              }
              className="onclck-prfl-a"
            />
            {/* &nbsp; <em className="caret fa fa-caret-down"></em> */}
          </span>
        </div>
      </li>

      {cart.length > 0 && (
        <li>
          <Link to={"/addToCart"}>
            <img
              src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/cart.svg"
              className="locate-img-b"
            />
          </Link>
          <span className="wcart" id="cart_length">
            {cart.length}
          </span>
        </li>
      )}

      {isOpen && (
        <div
          ref={profileRef}
          id="mySidenav"
          className="sidenav w-340"
          style={{ width: "400px" }}
          // onMouseLeave={closeNav}
        >
          <a className="closeIcon" onClick={() => setIsOpen(false)}>
            ×
          </a>
          <div className="new-mega-menu" style={{ borderBottom: "none" }}>
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 col-3 rp1">
                <div className="new-user-profile">
                  <img
                    src={
                      userData?.profile_picture
                        ? userData?.profile_picture
                        : "./main_logo.png"
                    }
                    alt="My Profile"
                    title="My Profile"
                  />
                </div>
              </div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-9 lp1">
                <div className="new-profile-name">
                  <h1>{userData.name}</h1>
                  <h2>{userData.email}</h2>
                  <h3>{userData.mobile}</h3>
                </div>
              </div>
            </div>
          </div>

          <div
            className="college-detail"
            id="divMsg"
            style={{ display: "none" }}
          >
            <h2>Find Your College Details</h2>
            <form method="post">
              <div className="form-group">
                <em className="fa fa-university"></em>{" "}
                <label for="">College Name</label>
                <select className="form-control" id="college"></select>
              </div>
              <div className="form-group">
                <em className="fa fa-globe"></em>
                <label for="">Degree</label>
                <select className="form-control" id="degree">
                  <option>Select Degree</option>
                  <option data-degree_program="Others">Others</option>
                  <option data-degree_program="AIIMS PG ">AIIMS PG </option>
                  <option data-degree_program="PGI Chandigarh">
                    PGI Chandigarh
                  </option>
                  <option data-degree_program="JIMPER PG">JIMPER PG</option>
                  <option data-degree_program="NIMHANS">NIMHANS</option>
                  <option data-degree_program="NEET PG">NEET PG</option>
                </select>
              </div>
              <div className="form-group">
                <em className="fa fa-calendar"></em>
                <label for="">Year</label>
                <select className="form-control" id="year">
                  <option>Select Year</option>
                  <option data-year="2020">2020</option>
                  <option data-year="2021">2021</option>
                  <option data-year="2022">2022</option>
                  <option data-year="2023">2023</option>
                  <option data-year="2024">2024</option>
                </select>
              </div>
              <button
                type="button"
                className="btn subbtn text-center"
                onclick="profile_update()"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="quick-links">
            <div className="row brdr-btm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="quick-links-txt">
                  <h2>Quick Links</h2>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="quick-links-box">
                  <ul>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerPublishBook}>
                        <img
                          className="designimg"
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/publish.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Publish Book</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerBookSale}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/salebook.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Book Sales</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerEvent}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/event.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Event</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerOval}>
                        {/* <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/mega-menu/podcast.png"
                          alt=""
                          title=""
                        /> */}
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/podcast.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Podcast</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerStore}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/medimart.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">MediMart</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerCbt}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/cbt.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">CBT</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerDoc}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/doctor.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Doctor Lounge</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerProfile}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/user.webp"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Profile</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="quick-links">
            <div className="row brdr-btm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="quick-links-txt">
                  <h2>My Profile</h2>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="quick-links-box">
                  <ul>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyCourse}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/course.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Courses</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyScorecard}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/scorecard.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Score Card</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerBookmark}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/bookmark.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Bookmark</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyAddress}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/address.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Address</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyOrder}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/order.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Orders</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyPayment}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/payment.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Payment</span>
                      </a>
                    </li>

                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handlerMyAtt}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/scorecard.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">My Attendance</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handleCash}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/cash-refund.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Wallet</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handleEarn}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/cash-refund.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Refer & Earn</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handleEarnList}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/detail.webp"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Refer User Details</span>
                      </a>
                    </li>
                    <li style={{ cursor: "pointer" }}>
                      <a onClick={handleJoin}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/affiliate.svg"
                          alt=""
                          title=""
                        />
                        <span className="d-block">Join Affilaite</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="errow-box">
            <div className="row brdr-btm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="errow-div">
                  <ul>
                    <li>
                      <a onClick={handleHelp}>
                        <img
                          src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/mega-menu/help-support.png"
                          alt=""
                          title=""
                        />
                        <span className="d-block">
                          Help &amp; <br />
                          Support
                          <i className="fa fa-chevron-circle-right fafa-scnd"></i>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {userData && (
            <div className="app-set app-set-a">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="log-btn">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default Myprofile;

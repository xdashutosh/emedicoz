import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";
import SignInModal from "../SignInModal/SignInModal";
import {
  FaAngleLeft,
  FaAngleRight,
  FaArrowDown,
  FaArrowLeft,
} from "react-icons/fa";
import Login from "../Login/Login";

const Nav = ({ setIsAuthenticated }) => {
  const [expand, setExpand] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const userid = sessionStorage.getItem("id");

  const called = () => {
    setSignInModalOpen(true);
  };

  const handlerClose = () => {
    setSignInModalOpen(false);
    // setCounter(62);
    // setPhoneNumber("");
    // setOtpDigits(["", "", "", ""]);
    // setOtpModalOpen(false);
    // setToggleEmailOrPhone("number");
  };

  const handleSignInSuccess = () => {
    setSignInModalOpen(false);
  };

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; 
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // You can adjust the scrolling amount here
    }
  };

  return (
    <>
      <section className="topMenuIcon">
        <div className="container">
          <div
            className={`topnav ${isMenuOpen ? "responsive" : ""}`}
            id="myTopnav"
            ref={scrollContainerRef}

          style={userid ? {width:"100%"} : {width:'55%', margin:'0 auto'}}
          >
            {userid && (
              <FaAngleLeft
                className="fa fa-angle-left iconSet"
                onClick={scrollLeft}
              />
            )}
            {!userid ? (
              <>
               
                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/event.svg" alt="" />
                  </span>
                  Event
                </Link>

                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/medimart.svg" alt="" />
                  </span>
                  MediMart
                </Link>

                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/cbt.svg" alt="" />
                  </span>
                  CBT
                </Link>

                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/podcast.svg" alt="" />
                  </span>
                  Podcast
                </Link>

                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/doctor.svg" alt="" />
                  </span>
                  Doctor Lounge
                </Link>

                <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="../images/article.svg" alt="" />
                  </span>
                  News & Article
                </Link>

                {/* <Link className="anchor-link " onClick={called}>
                  <span className="d-block">
                    <img src="./images/refer-earn..svg" alt="" />
                  </span>
                  Refer & Earn
                </Link> */}
              </>
            ) : (
              <>
                <Link
                  className="anchor-link"
                  to={userid ? "/event" : () => setIsSignInModalOpen(true)}
                >
                  <span className="d-block">
                    <img src="../images/event.svg" alt="" />
                  </span>
                  Event
                </Link>
                <Link className="anchor-link" to={userid ? "/store" : called}>
                  <span className="d-block">
                    <img src="../images/medimart.svg" alt="" />
                  </span>
                  MediMart
                </Link>
                <Link className="anchor-link" to={"/cbt"}>
                  <span className="d-block">
                    <img src="../images/cbt.svg" alt="" />
                  </span>
                  CBT
                </Link>
                <Link className="anchor-link" to={"/podcast"}>
                  <span className="d-block">
                    <img src="../images/podcast.svg" alt="" />
                  </span>
                  Podcast
                </Link>
                <Link className="anchor-link" to={"/all-lounge"}>
                  <span className="d-block">
                    <img src="../images/doctor.svg" alt="" />
                  </span>
                  Doctor Lounge
                </Link>
                <Link className="anchor-link" to={"/news-and-article"}>
                  <span className="d-block">
                    <img src="../images/article.svg" alt="" />
                  </span>
                  News & Article
                </Link>
                {/* <Link className="anchor-link" to={"/refer-detail"}>
                  <span className="d-block">
                    <img src="../images/refer.svg" alt="" />
                  </span>
                  Referral Detail
                </Link>

                <Link className="anchor-link" to="/refer-earn">
                  <span className="d-block">
                    <img src="./images/refer-earn.svg" alt="" />
                  </span>
                  Refer & Earn
                </Link>  */}

                <Link className="anchor-link" to="/myorder">
                  <span className="d-block">
                    <img src="../images/order.svg" alt="" />
                  </span>
                  My Order
                </Link>

                <Link className="anchor-link" to={"/my-course"}>
                  <span className="d-block">
                    <img src="../images/course.svg" alt="" />
                  </span>
                  My Course
                </Link>
                <Link className="anchor-link" to={`/score-card/${userid}`}>
                  <span className="d-block">
                    <img src="../images/scorecard.svg" alt="" />
                  </span>
                  Scorecard
                </Link>
                <Link className="anchor-link" to={"/myaddress"}>
                  <span className="d-block">
                    <img src="../images/address.svg" alt="" />
                  </span>
                  My Address
                </Link>

                <Link className="anchor-link" to={"/my-payment"}>
                  <span className="d-block">
                    <img src="../images/payment.svg" alt="" />
                  </span>
                  My Payments
                </Link>
                <Link className="anchor-link" to={"/ebooksale"}>
                  <span className="d-block">
                    <img src="../images/salebook.svg" alt="" />
                  </span>
                  My Book Sales
                </Link>

                <Link className="anchor-link" to={"/publishbook"}>
                  <span className="d-block">
                    <img src="../images/publish.svg" alt="" />
                  </span>
                  Publish Book
                </Link>

                <Link className="anchor-link" to={"/bookmark"}>
                  <span className="d-block">
                    <img src="../images/bookmark.svg" alt="" />
                  </span>
                  My Bookmarks
                </Link>

                <Link className="anchor-link" to={"/attendance"}>
                  <span className="d-block">
                    <img src="../images/payment.svg" alt="" />
                  </span>
                  My Attendance
                </Link>

                <Link className="anchor-link" to={"/cashrefund"}>
                  <span className="d-block">
                    <img src="../images/cash-refund.svg" alt="" />
                  </span>
                    Cash Refund
                </Link>
                {/* <Link className="anchor-link" to={"/profilenew"}>
                  <span className="d-block">
                    <img src="../images/profile-update.svg" style={{ width:'30px' , height:'30px', margin:'0px'}} alt="" />
                  </span>
                    Profile Update
                </Link> */}

              </>
            )}
            {userid && (
              <FaAngleRight
                className="fa fa-angle-right iconSetRight"
                onClick={scrollRight}
              />
            )}
          </div>
        </div>
      </section>
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

export default Nav;

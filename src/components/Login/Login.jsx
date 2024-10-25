import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../../API/axiosConfig";
import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({
  handlerClose,
  setIsAuthenticated,
  handleSignInSuccess,
  setSignInModalOpen,
  targeturl,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [counter, setCounter] = useState(62);
  const [error, setError] = useState("");
  const [toggleEmailOrPhone, setToggleEmailOrPhone] = useState("number");
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");

  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const openOtpModal = async (e) => {
    e.preventDefault();
    if (toggleEmailOrPhone === "number") {
      console.log("first");
      if (!phoneNumber) {
        toast.error("Please enter your number");
      } else if (phoneNumber.length <= 9) {
        toast.error("Enter valid number");
      } else {
        try {
          setLoading(true);
          const res = await axiosInstance.post(
            `/v1_data_model/user/registration/login_authentication_v2`,
            { mobile: phoneNumber }
          );
          setLoading(false);
          toast.success(`sent otp on your number ${phoneNumber}`);
          setOtpModalOpen(true);
        } catch (err) {
          console.log(err);
        }
      }
    } else if (toggleEmailOrPhone === "email") {
      if (!email) {
        toast.error("Please enter your email");
      } else if (!isValid) {
        toast.error("Please enter valid email");
      } else {
        try {
          setLoading(true);
          const res = await axiosInstance.post(
            `/v1_data_model/user/registration/login_authentication_v2`,
            { email: email }
          );
          setLoading(false);
          toast.success(`sent otp on your email ${email}`);
          setOtpModalOpen(true);
        } catch (err) {
          console.log(err);
        }
        // toast.success(`Sent otp on your number ${email} `);
        // setOtpModalOpen(true);
      }
    }
  };

  const handleClick = () => {
    setCounter(62);
  };

  const handlerResetOtp = () => {
    setCounter(60);
    setToggleEmailOrPhone("number");
    setPhoneNumber("");
    setEmail("");
    setOtpModalOpen(false);
    setOtpDigits(["", "", "", ""]);
    // setSignInModalOpen(false);
  };

  const resendOtp = async () => {
    handleClick();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/v1_data_model/user/registration/login_authentication_v2`,
        { mobile: phoneNumber ? phoneNumber : email }
      );
      setLoading(false);
      toast.success(
        phoneNumber
          ? `sent otp on your number ${phoneNumber}`
          : `sent otp on your email ${email}`
      );
      setOtpModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move focus to the next input field if the current field is filled
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleBackspace = (index, event) => {
    // Move focus to the previous input field if backspace is pressed in an empty field
    if (index > 0 && event.key === "Backspace" && !otpDigits[index]) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const checkEmptyElement = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].trim().length === 0) {
        return true; // Found an empty element
      }
    }
    return false; // No empty element found
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (checkEmptyElement(otpDigits)) {
      toast.error("Please enter otp");
    } else {
      try {
        const enteredOtp = otpDigits.join("");
        const demoOne = phoneNumber
          ? { otp: enteredOtp, mobile: phoneNumber }
          : { otp: enteredOtp, email: email };
        const response = await axiosInstance.post(
          `/v1_data_model/user/registration/login_authentication_v2`,
          demoOne
        );

        if (response.data.status === true) {
          sessionStorage.setItem(
            "userData",
            JSON.stringify(response.data.data)
          );
          sessionStorage.setItem("mobile", response.data.data.mobile);
          sessionStorage.setItem("email", response.data.data.email);
          sessionStorage.setItem("id", response.data.data.id);
          if (response.data.data.is_course_register === "1") {
            localStorage.setItem("allData", JSON.stringify(response.data.data));
            sessionStorage.setItem("jwt_token", response.data.data.jwt_token);
            localStorage.setItem(
              "idTocredentials",
              response?.data?.data?.is_course_register
            );
            sessionStorage.setItem(
              "is_course_register",
              response.data.data.is_course_register
            );
            setIsAuthenticated(true);
            setOtpModalOpen(false);
            setSignInModalOpen(false);
            handleSignInSuccess;

            toast.success("User authentication successful!");
            setCounter(62);
            setPhoneNumber("");
            setEmail("");
            setOtpDigits(["", "", "", ""]);
            setToggleEmailOrPhone("number");

            if (targeturl == null) {
              window.location.reload();
            }
            // navigate("/");
            if (targeturl.endsWith("b")) {
              navigate(`/raise-query/${response?.data?.data?.id}DTweb`);
              window.location.reload();
            } else if (targeturl) {
              navigate(targeturl);
              window.location.reload();
            } else {
              window.location.reload();
            }
          } else {
            sessionStorage.setItem(
              "is_course_register",
              response.data.data.is_course_register
            );
            navigate("/user-registration");
            setCounter(62);
            setPhoneNumber("");
            setEmail("");
            setOtpDigits(["", "", "", ""]);
            setSignInModalOpen(false);
            setOtpModalOpen(false);
            setToggleEmailOrPhone("number");
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
          toast.error("Please Enter Valid OTP.");
          // });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value.toLowerCase());
    const isValidEmail = /\S+@\S+\.\S+/.test(value);
    setIsValid(isValidEmail);
  };

  const handleNumberValidate = (e) => {
    const input = e.target.value;
    console.log(input);
    // const numberRegex = /^[0-9\b]+$/;
    // const numberRegex = /^\d+$/;
    const numberRegex = /^-?\d*\.?\d+$/;

    if (input === "" || (numberRegex.test(input) && input.length <= 10)) {
      setPhoneNumber(input);
      setError("");
    } else {
      toast.error("Please enter a number");
      setTimeout(() => {}, 6000);
    }
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <section className="login-popup">
      <div className="modal modal-open show modal-container">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body login_area">
              <div className="row">
                <div className="col-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                  <div className="popLeftPart">
                    <img
                      src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/signIn.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-7 col-md-7 col-lg-7 col-xl-7">
                  <div className="modal-header close_btn pop-modal position-relative">
                    <button
                      type="button"
                      className="close"
                      onClick={handlerClose}
                    >
                      ×
                    </button>
                  </div>
                  <div className="login-logo otpLOg">
                    <div className="text-center logoSec"></div>
                    <div className="login-logo_text">
                      {!isOtpModalOpen && (
                        <>
                          <h2>
                            <span classname="welcomText">Welcome!</span> Sign up
                            or Login
                            {/* <span className="d-block enroll-title">
                                            Application for NEET PG Preparation
                                          </span> */}
                          </h2>
                        </>
                      )}
                    </div>
                    {!isOtpModalOpen ? (
                      <form name="loginFormbyPhone">
                        <div className="login-input-holder">
                          <div
                            className="login-input-group position-relative"
                            id="login-email-phone"
                          >
                            {toggleEmailOrPhone === "number" ? (
                              <>
                                <img
                                  className="flagbbg"
                                  style={{ height: "15px" }}
                                  src="https://i.ibb.co/Jv4wzpG/indian-flag.jpg"
                                  alt=""
                                />
                                <input
                                  style={{
                                    padding: "10px 10px 5px 45px",
                                  }}
                                  type="text"
                                  name="phoneNumber"
                                  placeholder="Mobile Number"
                                  onChange={handleNumberValidate}
                                  className="fieldSelectorId inp-title"
                                  value={phoneNumber}
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  className="flagbbg"
                                  src="https://i.ibb.co/zZ5SXvt/mail.png"
                                  style={{
                                    width: "20px",
                                    height: "auto",
                                    position: "absolute",
                                    left: "0px",
                                    top: "12px",
                                  }}
                                  alt=""
                                />

                                <input
                                  style={{
                                    padding: "10px 10px 5px 45px",
                                  }}
                                  type="email"
                                  name="email"
                                  placeholder="Please enter your email"
                                  className="fieldSelectorId inp-title"
                                  value={email}
                                  onChange={handleEmail}
                                />
                              </>
                            )}
                          </div>
                        </div>
                        {/* {phoneNumber.length >= 10 ? ( */}
                        <input
                          className="common-bottom-btn"
                          onClick={openOtpModal}
                          value={loading ? "Please wait...." : "Continue"}
                        />

                        <div className="email-acc">
                          <a>
                            {toggleEmailOrPhone === "number" ? (
                              <span
                                onClick={() => {
                                  setPhoneNumber("");
                                  setToggleEmailOrPhone("email");
                                }}
                              >
                                Login Using Email
                              </span>
                            ) : (
                              <span
                                onClick={() => {
                                  setEmail("");
                                  setToggleEmailOrPhone("number");
                                }}
                              >
                                Login Using Number
                              </span>
                            )}
                          </a>
                        </div>
                      </form>
                    ) : (
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="login-logo1">
                          <form
                            className="digit-group text-center otp-form"
                            name="otpvarfy_new"
                          >
                            <div className="login-logo_text">
                              <h2>
                                Enter the code sent to your phone
                                <span className="phone_and_email"></span>
                                <br />
                                <span
                                  style={{ color: "#00A651" }}
                                  id="email_here"
                                >
                                  {phoneNumber
                                    ? `XXXXX${phoneNumber.substring(5)}`
                                    : email}
                                  <CiEdit
                                    onClick={handlerResetOtp}
                                    style={{
                                      marginLeft: "10px",
                                      fontSize: "22px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </span>
                              </h2>
                            </div>
                            <div className="form-group otp_box">
                              {otpDigits.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  className="otp-field"
                                  style={{ boxShadow: "1px 1px 2px black" }}
                                  value={digit}
                                  maxLength="1"
                                  onChange={(e) =>
                                    handleOtpChange(index, e.target.value)
                                  }
                                  onKeyDown={(e) => handleBackspace(index, e)}
                                  ref={inputRefs.current[index]}
                                />
                              ))}
                            </div>
                            <div id="error_message_here"></div>
                            <div className="form-group">
                              <input
                                type="hidden"
                                name="mobile"
                                className="form-control"
                                required=""
                                placeholder="Mobile"
                                value="mobile"
                                id="mobile"
                                maxLength="1"
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="hidden"
                                name="eb_details_id"
                                className="form-control"
                                required=""
                                value="number"
                                maxLength="1"
                              />
                            </div>
                            <div className="form-group">
                              <a
                                onClick={counter > 0 ? "" : resendOtp}
                                style={{
                                  color: "grey ",
                                  cursor: "pointer",
                                }}
                                className="resend"
                                id="otp_resend"
                              >
                                {loading ? (
                                  "Sending OTP..."
                                ) : (
                                  <>
                                    {counter > 0
                                      ? `Resend OTP in ${counter} seconds`
                                      : "Didnt recieve OTP? RESEND OTP"}
                                  </>
                                )}
                              </a>
                            </div>
                            <div className="form-group verify-btn">
                              <button
                                type="submit"
                                name="submit"
                                value="submit"
                                className="common-bottom-btn"
                                onClick={handleOtpVerification}
                              >
                                Verify & Proceed
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    {/* <div className="login-permission">
                                    <img
                                      src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/signIn-pop/lock_assets.png"
                                      className="login-permisson-icon"
                                      alt=""
                                    />
                                    We never post without your permission
                                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

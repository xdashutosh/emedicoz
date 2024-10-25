import React, { useState, useEffect } from "react";
import "../../assets/css/home-page/style.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Spin } from "antd";
import Faculties from "../Faculties/Faculties";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Login/Login";

function Banner({ inspire, setIsModalOpen, setIsAuthenticated, dynamicData }) {
  //console.log(dynamicData.leaderShip)
  const sess_id = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    query: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [course, setCourse] = useState("NEET/NEXT");
  const [loading, setLoading] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors, [name]: "" };

      switch (name) {
        case "name":
          if (value.length < 3) {
            newErrors[name] = "Please enter a valid name.";
          }
          break;
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[name] = "Invalid email format.";
          }
          break;
        case "phone":
          if (value.length !== 10) {
            newErrors[name] = "Enter a valid phone number.";
          }
          break;
        case "query":
          if (value.length < 20 || value.split(" ").length < 5) {
            newErrors[name] = "Write at least 5 words.";
          }
          break;
        default:
          break;
      }

      return newErrors;
    });
  };

  const validateForm = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    let newErrors = { ...initialValues };

    if (!value.name) {
      newErrors.name = "Please fill the name field.";
    } else if (value.name.length < 3) {
      newErrors.name = "Please enter a valid name.";
    }

    if (!value.email) {
      newErrors.email = "Please fill the email field.";
    } else if (!emailRegex.test(value.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!value.phone) {
      newErrors.phone = "Please fill the phone field.";
    } else if (value.phone.length !== 10) {
      newErrors.phone = "Phone number should be 10 digits.";
    }

    if (!value.query) {
      newErrors.query = "Please fill the Query field.";
    } else if (
      value.query.length < 20 ||
      value.query.split(" ").length < 5
    ) {
      newErrors.query = "Write at least 5 words.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formValues);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) {
      return;
    } else {
      try {
        setLoading(true);
        const payload = [
          { Attribute: "FirstName", Value: formValues.name },
          { Attribute: "mx_Course_Interested", Value: course }, // Assuming LastName is used for the course
          { Attribute: "EmailAddress", Value: formValues.email },
          { Attribute: "Phone", Value: formValues.phone },
          { Attribute: "Query", Value: formValues.query },
          { Attribute: "Origin", Value: "WEB API" },
          { Attribute: "Source", Value: "Website" },
        ];

        const accessKey = "u$r45f5345dc58024f5630a465b7843c5f2";
        const secretKey = "504c84ded6911f7f9580092d813a4132c3674748";
        const apiUrl = `https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=${accessKey}&secretKey=${secretKey}`;

        const res = await axios.post(apiUrl, payload);

        if (res.data.Status === "Success") {
          // toast.success("Thank you! Your request has been submitted.");
          setFormValues(initialValues); // Reset the form values
          setErrors(initialValues); // Clear errors
          setCourse("");
          setLoading(false);
          setIsModalOpen(true);
          setShow(false);
        } else {
          toast.error("Submission failed, please try again.");
          setLoading(false);
        }
      } catch (err) {
        toast.error(err.response.data.ExceptionMessage);
        setLoading(false);
      }
    }
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let img2 = `${window.IMG_BASE_URL}/2.svg`
  let img3 = `${window.IMG_BASE_URL}/3.svg`
  let img4 = `${window.IMG_BASE_URL}/4.png`
  let img5 = `${window.IMG_BASE_URL}/5.png`
  let img6 = `${window.IMG_BASE_URL}/6.png`
  let img7 = `${window.IMG_BASE_URL}/7.png`
  let img8 = `${window.IMG_BASE_URL}/8.png`
  let img9 = `${window.IMG_BASE_URL}/9.png`

  const images = [
    // { img: img1, heading: "PDF Notes" },
    { img: img2, heading: "Recorded Course" },
    { img: img3, heading: "Live Class" },
    { img: img4, heading: "Recorded Class" },
    { img: img7, heading: "Live Class" },
    { img: img6, heading: "Recorded Class" },
    { img: img5, heading: "PDF Notes" },
    { img: img8, heading: "Live Class" },
    { img: img9, heading: "Recorded Class" },
  ];

  const handlerCheck = () => {
    // console.log(userObj)
    if (sess_id) {
      navigate(`/raise-query/${sess_id}`);
    } else {
      setShow(false);
      setSignInModalOpen(true);
    }
  };

  const handlerClose = () => {
    setSignInModalOpen(false);
  };

  const handleSignInSuccess = () => {
    setSignInModalOpen(false);
  };

  return (
    <>
      <div className="page-content position-relative home_banner">
        <div className="homeColor"></div>
        {/* <div className="homebackground"></div> */}
        <div className="container">
          <div className="New_home">
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-7 col-xl-7">
                <div className="textHome">
                  <h1>
                    Most <span style={{ color: "#F16136" }}>Experienced</span>{" "}
                    <span className="d-block">
                      Medical{" "}
                      <span style={{ color: "#F16136" }}>Education</span>
                    </span>{" "}
                    Platform -{" "}
                    <span style={{ color: "#F16136" }}>Since 1999 </span>
                  </h1>
                  <h3>India’s First Live Medical Education Platform</h3>
                  {/* <button className="connect" onClick={handleShow}>Let's Connect</button> */}
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-5 col-xl-5">
                <div className="webRegisterform">
                  <h2>Need More information? Request A Call Back!</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <input
                            name="name"
                            type="name"
                            value={formValues.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className={`form-control valid-character ${errors.name ? "is-invalid" : ""
                              }`}
                          />
                          {errors.name && (
                            <div className="invalid-feedback">{errors.name}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <input
                            name="email"
                            type="email"
                            value={formValues.email}
                            onChange={handleChange}
                            placeholder="Email ID"
                            className={`form-control ${errors.email ? "is-invalid" : ""
                              }`}
                          />
                          {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <input
                            name="phone"
                            type="number"
                            value={formValues.phone}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            className={`form-control int-value ${errors.phone ? "is-invalid" : ""
                              }`}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue < 0) {
                                e.target.value = '';
                              } else if (inputValue.length > 10) {
                                e.target.value = inputValue.slice(0, 10);
                              }
                            }}
                          />
                          {errors.phone && (
                            <div className="invalid-feedback">{errors.phone}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="form-group">
                          <select
                            style={{
                              backgroundColor: "#fff8ee",
                              border: "none",
                              color: "#757575",
                            }}
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                          >
                            <option value="NEET/NEXT">NEET PG/NEXT</option>
                            <option value="INICET">INICET</option>
                            <option value="FMGE">FMGE</option>
                            <option value="NEET SS">NEET SS</option>
                            <option value="USMLE">USMLE</option>
                            <option value="PLAB">PLAB</option>
                            <option value="NEET MDS">NEET MDS</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <textarea
                            name="query"
                            value={formValues.query}
                            onChange={handleChange}
                            rows="1"
                            placeholder="Type your query..."
                            className={`form-control ${errors.query ? "is-invalid" : ""
                              }`}
                          ></textarea>
                          {errors.query && (
                            <div className="invalid-feedback">{errors.query}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button
                          type="submit"
                          disabled={loading ? true : false}
                          className="btn btn-primary"
                        >
                          {loading ? <Spin /> : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <Link to="/" className="popLinkbtn" onClick={handleShow}>
            <img src="../category-icon.svg" alt="Icon" />
          </Link>
        </div>

        <section className="omniChannel">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/tilteimg.svg`}
                alt=""
              />

              <span>Omni Channel</span> Presence
            </h2>
            <div className="channelGroup">
              <div className="omniText">
                <img src={`${window.IMG_BASE_URL}/img1.svg`} alt="" />
                <h3>Back 2 Basic</h3>
                <h5>Recorded | Crisp | Conceptual</h5>
              </div>
              <div className="omniText">
                <img src={`${window.IMG_BASE_URL}/img2.svg`} alt="" />
                <h3>Ultimate Live</h3>
                <h5>Two Way Interactive</h5>
              </div>

              <div className="omniText">
                <img src={`${window.IMG_BASE_URL}/img3.svg`} alt="" />
                <h3>Face To Face</h3>
                <h5>All Over India</h5>
              </div>
            </div>
          </div>
        </section>

        <section className="LeadershipTeam">
          <div className="bgbackgroud"></div>
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/leadertitle.svg`}
                alt=""
              />
              <span>Our Leadership</span>Team
            </h2>
            <div className="groupImg">
              {dynamicData.leaderShip.map((itm) => (
                <div className="LeaderText">
                  <img src={itm?.image} alt={itm?.name} width="50%" />
                  {/* <img src="../images/homePage/sumerSir.png" alt="" /> */}
                  <div className="leaderText">
                    <h3>{itm?.name}</h3>
                    <h5>{itm?.specification}</h5>
                    <p>{itm?.description}</p>
                  </div>
                </div>
              ))}
              {/* <div className="LeaderText">
                <img src="../images/homePage/deeptiMam.png" alt="" />
                <div className="leaderText">
                  <h3>Dr. Deepti Bahl</h3>
                  <h5>MBBS, MS - Obstetrics & Gynaecology</h5>
                  <p>
                    Dr. Deepti Bahl is a Gynecologist and has an experience of
                    13 years in this field. She completed MBBS from U.Delhi in
                    2004 and MS-Obstetrics & Gynaecology from Lady Hardinge
                    Medical College, New Delhi in 2009...
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <Faculties />

        <section className="PremiumApp">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/premium.svg`}
                alt=""
              />
              <span>Premium</span>App Based Learning
            </h2>
            <div className="appbased">
              <div className="appgroup">
                <div className="roundImg">
                  <img src={`${window.IMG_BASE_URL}/download.svg`} alt="" />
                </div>
                <div className="appText">
                  <h3>1 million</h3>
                  <p>Downloads</p>
                </div>
              </div>
              <div className="appgroup">
                <div className="roundImg coursebg">
                  <img src={`${window.IMG_BASE_URL}/course.svg`} alt="" />
                </div>
                <div className="appText">
                  <h3>Democratizing</h3>
                  <p>Medical Education</p>
                </div>
              </div>
              <div className="appgroup">
                <div className="roundImg locbg">
                  <img src={`${window.IMG_BASE_URL}/location.svg`} alt="" />
                </div>
                <div className="appText">
                  <h3>Face To Face Centres</h3>
                  <p>All Over India</p>
                </div>
              </div>
              <div className="appgroup">
                <div className="roundImg videobg">
                  <img src={`${window.IMG_BASE_URL}/star-rating.svg`} alt="" />
                </div>
                <div className="appText">
                  <h3>4.5 Star</h3>
                  <p>App Rating</p>
                </div>
              </div>
              <div className="appgroup">
                <div className="roundImg custombg">
                  <img src={`${window.IMG_BASE_URL}/customer.svg`} alt="" />
                </div>
                <div className="appText">
                  <h3>24x7</h3>
                  <p>Dedicated Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="DepthAnalytic">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/depth.svg`}
                alt=""
              />
              <span>In-Depth</span>Analytics
            </h2>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
                <div className="analyticSec">
                  <div className="depthgroup">
                    <img src={`${window.IMG_BASE_URL}/streak.svg`} alt="" />
                    <h4>Maintain Streak</h4>
                  </div>
                  <div className="depthgroup">
                    <img src={`${window.IMG_BASE_URL}/q-bank.svg`} alt="" />
                    <h4>Q-Bank Analysis</h4>
                  </div>
                  <div className="depthgroup">
                    <img src={`${window.IMG_BASE_URL}/test-series.svg`} alt="" />
                    <h4>Test Series Analysis</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="GoatArea">
          <h3 className="goattile">G.O.A.T</h3>
          <div className="container">
            <div className="toptile">
              <h2>
                <img
                  className="titleimg"
                  src={`${window.IMG_BASE_URL}/goattitle.svg`}
                  alt=""
                />
                <span>DAMS QBank </span>With (Video Solutions)
              </h2>
            </div>

            <div className="row m-0">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <div className="textPara">
                  {/* <h3 className="goat">G.O.A.T</h3> */}
                  {/* <img  src="../images/homePage/goat_img.svg" alt=""/> */}
                  <p>
                    25000+ Questions to Practice. Questions framed by Faculty
                    with teaching experience of decades
                  </p>
                  <p>
                    Each Questions comes with instant Video Solution to have
                    instantaneous doubt solving.
                  </p>
                  {/* <p>Separate section for Integrated Questions, Match the
                        following and Multiple completion for INICET.</p> */}
                  {/* <p>Clinical Vignettes for NEXT.</p> */}
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <div className="videosec">
                  <img src={`${window.IMG_BASE_URL}/videoImg.svg`} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="MultiFeatured">
          <div>
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/multi-app.svg`}
                alt=""
              />
              <span>Multi</span>Featured App
            </h2>

            <div className="slider">
              <div className="slider-wrapper">
                {images?.map((src, index) => (
                  <div
                    className="imgbox"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "end",
                      marginRight: "50px",
                    }}
                  >
                    <h3>{src.heading}</h3>
                    <img
                      key={index}
                      src={src?.img}
                      style={{
                        height:
                          src?.heading == "Recorded Class"
                            ? "27vh"
                            : src?.heading == "PDF Notes"
                              ? "35vh"
                              : "40vh",
                        minWidth:
                          src?.heading == "Recorded Class"
                            ? "18vw"
                            : src?.heading == "PDF Notes"
                              ? "10vw"
                              : "12vw",
                      }}
                      alt={`Slide ${index}`}
                      className="slider-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="testSeriesArea">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/exam.svg`}
                alt=""
              />
              <span>Test Series</span>With (Video Solutions)
            </h2>
            <div className="row m-0">
              <div className="col-12 col-sm-7 col-md-7 col-lg-7 col-xl-7">
                <div className="textPara">
                  <p>
                    Online Test Series include.{" "}
                    <b>Subject wise Tests, Grand Tests & Mock Test.</b>{" "}
                    <span className="d-block">
                      This gives you access to highest number of practise tests
                      in the industry with Video solutions for understanding the
                      correct MCQ skill and application of concepts.{" "}
                      <b>
                        Special MOCK test for FMGE and INICET as well included
                        in Online Test Series.
                      </b>
                    </span>{" "}
                  </p>
                  <h4>Compete With</h4>
                  <h3>1 Lakh + Students</h3>
                </div>
              </div>
              <div className="col-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
                <div className="videosec">
                  <img src={`${window.IMG_BASE_URL}/series-img.svg`} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="exclusiveCourse">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/eximg.svg`}
                alt=""
              />
              <span>Special </span>Courses Available
            </h2>
            <div className="courseGroup">
              <div className="courseinner">
                <img src={`${window.IMG_BASE_URL}/course1.svg`} alt="" />
                <h3>FMGE</h3>
                <p>
                  DAMS is known as one-stop solution provider for MCI Screening
                  that...
                </p>
              </div>
              <div className="courseinner">
                <img src={`${window.IMG_BASE_URL}/course2.svg`} alt="" />
                <h3>USMLE</h3>
                <p>
                  DAMS provides India’s First & only Class room programme along
                  with...
                </p>
              </div>
              <div className="courseinner">
                <img src={`${window.IMG_BASE_URL}/course3.svg`} alt="" />
                <h3>NEET MDS</h3>
                <p>
                  We provide comprehensive coaching for BDS graduates appearing
                  for...
                </p>
              </div>
              <div className="courseinner">
                <img src={`${window.IMG_BASE_URL}/course4.png`} alt="" />
                <h3>NURSING</h3>
                <p>
                  Nursing course trains students to perform pre and
                  post-operation
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="RevisionCourse">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/revicon.svg`}
                alt=""
              />
              <span>Best</span>Revision Courses
            </h2>
            <div className="row">
              <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                <div className="revision">
                  <img src={`${window.IMG_BASE_URL}/lecture1.svg`} alt="" />
                  <h3>DAMS Visual Treat (DVT)</h3>
                </div>
              </div>
              <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                <div className="revision">
                  <img src={`${window.IMG_BASE_URL}/lecture2.svg`} alt="" />
                  <h3>DAMS FMGE Xpress (DFX)</h3>
                </div>
              </div>
              <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                <div className="revision">
                  <img src={`${window.IMG_BASE_URL}/lecture3.svg`} alt="" />
                  <h3>Center Based Test (CBT)</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="overIndiasec">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/globe.svg`}
                alt=""
              />
              <span>Pan- </span>India Face To Face Classes
            </h2>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12 col-xl-12">
                <div className="mapbgimg">
                  <h2>
                    DAMS Face To Face{" "}
                    <span className="mobilebreak">Centers</span>
                  </h2>
                  <div className="faceTofaceimg">
                    <div className="row">
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face1.svg`} alt="" />
                      </div>
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face2.svg`} alt="" />
                      </div>
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face3.svg`} alt="" />
                      </div>
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face4.svg`} alt="" />
                      </div>
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face5.svg`} alt="" />
                      </div>
                      <div className="imgset col-4 col-lg-4">
                        <img src={`${window.IMG_BASE_URL}/face6.svg`} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="HowitWork">
          <div className="container">
            <h2>
              <img
                className="titleimg"
                src={`${window.IMG_BASE_URL}/work.svg`}
                alt=""
              />
              <span>App</span>Based Courses
            </h2>
          </div>
        </section>
      </div>

      <div className="container">
        {/* Begin: Model Code  */}
        <Modal
          show={show}
          backdrop={false}
          onHide={() => setShow(false)}
          className="LinkMixModel"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="content raiseData">
            <ul>
              <li>
                <Link to="/contact">
                  <img src={`${window.IMG_BASE_URL}/contact-icon.svg`} />
                  Contact Us
                </Link>
              </li>
              <li>
                <a onClick={handlerCheck}>
                  <img src={`${window.IMG_BASE_URL}/rase-icon.svg`} />
                  Raise Your Query
                </a>
              </li>
            </ul>
          </Modal.Body>
        </Modal>
        {/* End: Model Code  */}
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
}

export default Banner;

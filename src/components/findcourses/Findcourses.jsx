import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import { toast } from "react-toastify";

const Findcourses = () => {
  const nav = useNavigate();
  const [stateData, setStateData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [stateValue, setStateValue] = useState("");
  const [citiesValue, setCitiesValue] = useState("");
  const [contentData, setContentData] = useState([
    { name: "Content type", value: "0" },
    { name: "Face to face", value: "1" },
  ]);
  const [selectedValue, setSelectedValue] = useState("1");

  const coursesData = [
    {
      ref: "https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question",
      img_url: "https://i.ibb.co/941WRCJ/cr-img.png",
      heading: "NEET PG",
      para: "Our two decades plus of success in ensuring thousands of selections in PG Medical Entrance Exams NEETPG has...",
    },
    {
      ref: "https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question",
      img_url: "https://i.ibb.co/941WRCJ/cr-img.png",
      heading: "FMGE (Delhi Only)",
      para: "DAMS is known as one-stop solution provider for MCI Screening that makes it indispensable for all medical aspirants. Now it emerges as phenomenon%..",
    },
    {
      ref: "https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question",
      img_url: "https://i.ibb.co/941WRCJ/cr-img.png",
      heading: "USMLE EDGE",
      para: "DAMS provides India's First and only className room programme along with counseling programme. Our programme includes classNameroom coaching, test series..",
    },
    {
      ref: "https://api.whatsapp.com/send?phone=919899664533&amp;text=Hello,%20I%20have%20a%20question",
      img_url: "https://i.ibb.co/941WRCJ/cr-img.png",
      heading: "NEET MDS ",
      para: "We provide comprehensive coaching for BDS graduates appearing for NEET-MDS entrance with top medical and dental faculty team. We also provide guidan.",
    },
  ];

  const getStates = async () => {
    try {
      const response = await axiosInstance.post(
        "v1_data_model/courses/Home/find_state",
        { country_id: 1, center_type: selectedValue }
      );
      setStateData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeState = (e) => {
    setCitiesValue("");
    setStateValue(e.target.value);
  };
  useEffect(() => {
    getStates();
  }, []);

  const getCities = async () => {
    try {
      const res = await axiosInstance.post(
        "v1_data_model/courses/Home/find_city",
        {
          state_id: stateValue,
          center_type: selectedValue,
        }
      );
      setCitiesData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlerFaceToFace = (e) => {
    setSelectedValue(e);
    // setStateValue("")
  };

  useEffect(() => {
    if (stateValue) {
      getCities();
    }
  }, [stateValue]);

  useEffect(() => {
    if (contentData.length > 0) {
      setSelectedValue(contentData[1]?.value);
    }
  }, [contentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stateValue || !citiesValue) {
      toast.error(
        !stateValue ? "please select state first..." : "please select city"
      );
    } else {
      // console.log(selectedValue,stateValue,citiesValue)
      try {
        const res = await axiosInstance.post(
          "/v1_data_model/courses/Home/find_center",
          {
            center_type: selectedValue,
            state_id: stateValue,
            city_id: citiesValue,
          }
        );
        nav("/find_center", { state: { data: res.data.data } });
        // console.log(res.data.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section className="course-section">
      <div className="container">
        <div className="row rowbg">
          {coursesData &&
            coursesData?.map((itm, i) => (
              <div className="col-6 col-sm-6 col-md-3 col-lg-3 " key={i}>
                <div className="item courses bordr-right">
                  <div className="single-item thumb">
                    <div
                      className="thumb-box"
                      style={{
                        backgroundColor: i % 2 == 0 ? "#F3E5F5" : "#FFEBEE",
                      }}
                    >
                      <img src={itm.img_url} alt={itm.heading} />
                    </div>
                  </div>
                  <h2>{itm.heading}</h2>
                  <p>{itm.para}</p>
                  <a className="btncourse cartbtn" href={itm.ref}>
                    <i
                      className="fa fa-whatsapp"
                      aria-hidden="true"
                      style={{ color: "white" }}
                    ></i>{" "}
                    Connect
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="searchText">
        <div className="bgbackg"></div>
        <div className="container">
          <h5 className="searchhead sblue">
            Find DAMS eMedicoz Learning Centre
          </h5>
          <form action="find-center" method="post" className="findcenterBg">
            <div className="row">
              <div className="col-6 col-md-3">
                <div className="input-group md-form form-sm form-2 pl-0">
                  <select
                    name="c"
                    className="form-control my-0 py-1 amber-border"
                    onChange={(e) => handlerFaceToFace(e.target.value)}
                    value={selectedValue}
                  >
                    {contentData?.map((itm, i) => (
                      <option key={i} value={itm.value}>
                        {" "}
                        {itm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="input-group md-form form-sm form-2 pl-0">
                  <select
                    name="country"
                    className="form-control my-0 py-1 amber-border"
                    value="1"
                  >
                    <option defaultValue="" value="0">
                      Select Country
                    </option>
                    <option value="1">India</option>
                  </select>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="input-group md-form form-sm form-2 pl-0">
                  <select
                    name="state"
                    className="form-control my-0 py-1 amber-border"
                    onChange={handleChangeState}
                    value={stateValue}
                  >
                    <option>Select State</option>
                    {stateData &&
                      stateData?.map((itm, i) => (
                        <option key={i} value={itm.STATE_ID}>
                          {itm.STATE_NAME}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="input-group md-form form-sm form-2 pl-0">
                  <select
                    name="city"
                    className="form-control my-0 py-1 amber-border"
                    value={citiesValue}
                    onChange={(e) => setCitiesValue(e.target.value)}
                  >
                    <option>Select City</option>
                    {citiesData &&
                      citiesData?.map((itm, i) => (
                        <option value={itm.CITY_ID}>{itm.CITY_NAME}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-12 search_bar">
                <div
                  className="input-group md-form form-sm form-2 pl-0"
                  id="submit"
                >
                  <input
                    type="submit"
                    value="Search"
                    onClick={handleSubmit}
                    className="form-control my-0 py-1 amber-border"
                    style={{
                      cursor: "pointer",
                      background: "transparent",
                      color: "#fff",
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default Findcourses;

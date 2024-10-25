import "../../assets/css/home-page/style.css";
import "../../assets/css/home-page/responsive.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../API/axiosConfig";
import { Spinner } from "react-bootstrap";

const GetTheApp = () => {
  const [emailData, setEmailData] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const emailResent = async (result) => {
    const email  = validateEmail(emailData)
   if(!emailData){
    toast.error("Please enter a email")
   }else if(email === true){

     try {
       setLoading(true);
       const res = await axiosInstance.post(
         `/v1_data_model/AppDownload/App_sent_link`,
         { email: emailData }
       );
       toast.success(res.data.data);
       setEmailData("")
       setLoading(false);
     } catch (err) {
       console.log(err);
       setLoading(false);
     }
   }else{
    toast.error("Please enter valid email")
   }
  };
  return (
    <section className="learning-app position-relative">
      <div className="container">
      <div className="greenback">
        <div className="row ">
          <div className="col-12 col-sm-7 col-md-7 col-lg-7 col-xl-7">
            <div className="right-data">
              <h2>Get The <span>Learning App</span></h2>
              <p>
                Medical Experts In Your Pocket
              </p>
              <div className="radio-check">
                <form action="#" method="post" id="form_data">
                  <div className="hide-show-yes">
                    <div className="row">
                      <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                        <input
                          type="email"
                          value={emailData}
                          name="email"
                          onChange={(e) => setEmailData(e.target.value)}
                          placeholder="Enter Email"
                          className="email-box"
                        />
                      </div>
                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <a
                        type="button"
                          className="shre-link share_link"
                          onClick={emailResent}
                          style={{color:"white"}}
                        >
                          {loading ? <Spinner/> : "Share App Link"}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="hide-show-no" style={{ display: "none" }}>
                    <div className="row">
                      <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                        <div className="form-area">
                          <div className="form-inner"></div>
                        </div>
                      </div>

                      <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <a
                          className="shre-link share_link"
                          data-value="phone"
                        >
                          Share App Link
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="Download-app">
                <p>Download The App</p>
                <a href="https://play.google.com/store/apps/details?id=com.emedicoz.app&amp;hl=en">
                  <img src={`${window.IMG_BASE_URL}/googleplayimg.svg`} alt="" />
                </a>
                <a href="https://apps.apple.com/us/app/emedicoz/id1263112084">
                  <img src={`${window.IMG_BASE_URL}/appstoreimg.svg`} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <div className="app-img">
              <img src={`${window.IMG_BASE_URL}/appImg.png`} />
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};
export default GetTheApp;

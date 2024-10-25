import React, { useEffect } from "react";
import "../Sitemap/style.css"
import { Link } from 'react-router-dom';

let Sitemap = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="Sitemap">
        <div className="page-content position-relative">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <ul className="list-inline">
                  <li>
                    <a href={"/"}>Home </a>
                  </li>
                  <li>Sitemap</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="sitemapArea">
          <div className="container">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <h2
                className="font-weight-bold"
              >
                Sitemap
              </h2>
            </div>
              {/* <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56069.7241538836!2d77.15950734659364!3d28.55901786900714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3162cfd3333%3A0x436e168c82259356!2sDelhi%20Academy%20of%20Medical%20Sciences%20(P)%20Ltd!5e0!3m2!1sen!2sin!4v1714049719437!5m2!1sen!2sin"
                  style={{ width: "100%", height: "400px" }}
                ></iframe>
            </div> */}
              <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <div class="sitemap">
                  <ul className="topList">
                        <li><Link to="javascript:;">Home</Link></li>
                        <li><a href="javascript:;" className="topLink">Event</a></li>
                        <li><a href="javascript:;" className="topLink">MediMart</a></li>
                        <li><a href="javascript:;" className="topLink">CBT</a></li>
                        <li><a href="javascript:;" className="topLink">Podcast</a></li>
                        <li><a href="javascript:;" className="topLink">Doctor Lounge</a></li>
                        <li><a href="javascript:;" className="topLink">News & Article</a></li>
                        <li><a href="javascript:;" className="topLink">My Course</a></li>
                        <li><a href="javascript:;" className="topLink">Scorecard</a></li>
                      
                  </ul>
                <ul id="primaryNav" className="col6">
                    {/* <li id="home">
                      <a href="/">Home</a>
                    </li> */}

                    <li>
                      <a href="javascript:;">Header Links</a>
                      <ul>
                       
                        <li><a href="javascript:;">My Payments</a></li>
                        <li><a href="javascript:;">My Book Sales</a></li>
                        <li><a href="javascript:;">Publish Book</a></li>
                        <li><a href="javascript:;">My Bookmarks</a></li>
                        <li><a href="javascript:;">My Attendance</a></li>
                        <li><a href="javascript:;">Cash Refund</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:;">Quick Links</a>
                      <ul>
                        <li><a href="javascript:;">Career</a></li>
                        <li><a href="javascript:;">Help & Support</a></li>
                        <li><a href="javascript:;">Find Centres</a></li>
                        <li><a href="javascript:;"> Franchise Opportunity</a></li>
                        <li><a href="javascript:;">CSR</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:;">Policy</a>
                      <ul>
                        <li><a href="javascript:;">Privacy Policy</a></li>
                        <li><a href="javascript:;">Disclaimer</a></li>
                        <li><a href="javascript:;">Terms & Conditions</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:;">Other Links</a>
                      <ul>
                        <li><a href="javascript:;">About us</a></li>
                        <li><a href="javascript:;">Contact us</a></li>
                        <li><a href="javascript:;">News & Articles</a></li>
                        <li><a href="javascript:;">Student Info</a></li>
                        <li><a href="javascript:;">Topper Zone</a></li>
                      </ul>
                    </li>

                    <li>
                      <a href="javascript:;">Course Plan</a>
                      <ul>
                        <li><a href="javascript:;">NEET PG NEXT</a></li>
                        <li><a href="javascript:;">TND Courses NEET PG INICET</a></li>
                        <li><a href="javascript:;">1st Year 2nd Year MBBS</a></li>
                        <li><a href="javascript:;">FMGE</a></li>
                        <li><a href="javascript:;">USMLE, PLAB</a></li>
                        <li><a href="javascript:;">NEET MDS</a></li>
                        <li><a href="javascript:;">MEDICAL CME</a></li>
                        <li><a href="javascript:;">Resident Teaching   NEET SS</a></li>
                        <li><a href="javascript:;">Nursing</a></li>
                      </ul>
                    </li>
                  </ul>
                  
                </div>
              </div>
          </div>
        </div>
    </div>
  );
};
export default Sitemap;

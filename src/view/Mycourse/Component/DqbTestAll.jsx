import "../../../assets/css/study-test/style.css";
import "../../../assets/css/study-test/responsive.css";
//import "../../../assets/css/study-test/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const DqbTestAll = () => {
  const navigate = useNavigate();

  const user_id = sessionStorage.getItem("id");
  const topic_id = localStorage.getItem("topicId");
  const course_id = localStorage.getItem("courseDqbId");
  const [testSeriesList, setTestSeries] = useState();

  useEffect(() => {
      const fetchatQbnkSeries = async () => {
        try {
          const responses = await axiosInstance.post(
            `/v1_data_model/courses/Course/test_series_course_type_test`,
            { user_id: user_id, course_id: course_id }
          );
          setTestSeries(responses.data.data.test_series);
          console.log("dqbbbtest",responses.data.data.test_series);
         
        } catch (err) {
          console.log(err);
        }
      };

      fetchatQbnkSeries();
  }, [user_id, course_id]);
  useEffect(() => {
    console.log("Test series list changed:", testSeriesList);
  }, [testSeriesList]);


  const StartNew = (testid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
      // Open the new window
      // window.open(`/test-home/dq/${user_id}t${testid}`, "_blank", features);//for open with instruction
      window.open(`/test-panel/dq/${user_id}t${testid}`, "_blank", features);

    } catch (error) {
      console.log(error);
    }
  };

  const StartPaused = (testid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

      // Open the new window
      window.open(`/test-panel/dq/paused/${user_id}t${testid}`, "_blank", features);
    
    } catch (error) {
      console.log(error);
    }
  };

  const ResultView = (sid) => {
    console.log("review")
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

      // Open the new window
    
      window.open(`/testresult/dq/${user_id}s${sid}`, "_blank", features);
    } catch (error) {
      console.log(error);
    }
  };
const checkresult = (data)=>{
  console.log(data);
}




  return (
    <div className="page-content">
      <div className="breadcrumb-row">
        <div className="container">
          <ul className="list-inline">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
            <Link to={'/my-course/course-dqb'}>Test &gt;</Link>
            </li>{" "}
            &gt;All Test
          </ul>
        </div>
      </div>
      <section className="test-studytabbibg mt-5">
        <div className="container clearfix ">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="rightcont Ophtha-center">
                <div className="all-test-page">
                  <div className="tab-content" id="v-pills-tabContent">
                    <div
                      className=""
                      id="quetion-bank"
                      role="tabpanel"
                      aria-labelledby="quetion-bank"
                    >
                      <div
                        className="tab-pane show active"
                        id="test-study"
                        role="tabpanel"
                        aria-labelledby="test-study"
                      >
                        <div className="tab-content path">
                          <div id="active-tab" className="tab-pane active">
                            <div className="row">
                                {testSeriesList?.map((result)=>(
                                    result.topic_id == topic_id ? (
                                    <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                                    <div className="pathlogy-group position-relative">
                                      <div className="row" onClick={()=>checkresult(result)}>
                                        <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9">
                                          <h3>
                                            <span>
                                              <img
                                                src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/path-icon.svg"
                                                alt=""
                                              />
                                            </span>
                                            {result.test_series_name}
                                          </h3>
                                        </div>
                                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                                          <div className="reattempt">
                                          {result.is_paused === '0' ? (
                                                    <button
                                                      to={""}
                                                      onClick={() =>
                                                        ResultView(
                                                          result.is_user_attemp
                                                        )}
                                                      className="buton"
                                                    >
                                                      Review
                                                    </button>
                                                  ) : result.is_paused === '1' ? (
                                                    <button
                                                      className="buton"
                                                      onClick={() =>
                                                        StartPaused(
                                                          result.test_series_id
                                                        )
                                                      }
                                                    >
                                                      Resume
                                                    </button>
                                                  ) : result.is_user_attemp === '' ? (
                                                    <button
                                                      className="buton"
                                                      onClick={() =>
                                                            StartNew(
                                                              result.element_fk
                                                            )}
                                                    >
                                                      Start Test
                                                    </button>
                                                  ):('')}

                                          
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>) : (
              <span></span>
            )

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
      </section>
    </div>
  );
};

export default DqbTestAll;

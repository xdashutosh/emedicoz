import "../../assets/css/study-test/style.css";
import "../../assets/css/study-test/responsive.css";
//import "../../assets/css/study-test/bootstrap.min.css";
import { useState, useEffect } from "react";
import axiosInstance, { API_BASE_URL } from "../../API/axiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import {FaBookmark, FaClock, FaPen} from 'react-icons/fa'

function CoursesDqb() {
  const navigate = useNavigate();
  const handleDqbSeries = (topicId, courseDqbId) => {
    localStorage.setItem("topicId", topicId);
    localStorage.setItem("courseDqbId", courseDqbId);
    navigate("/dqb-test-all");
  };
  const [qbankCourseTopicList, setQbankCourseTopices] = useState([]);
  const [courseInformationList, setCourseInformation] = useState([]);
  const [Search, SetSearch] = useState("");
  const [filterList, SetFilterlist] = useState([]);
  const [topicStatus, SetTopicStatus] = useState("All");
  const [testSeriesList, setTestSeries] = useState();


  const user_id = sessionStorage.getItem("id");
  const course_id = localStorage.getItem("course_Id")
    ? JSON.parse(localStorage.getItem("course_Id"))
    : 385;
  //window.alert(user_id);
  useEffect(() => {
    const fetchQbankCourse = async () => {
      try {
        const response = await axiosInstance.post(
          `/v1_data_model/courses/crs/get_qbankcourse`,
          { user_id: user_id, course_id: course_id }
        );
        // console.log(response.data.data);
        setCourseInformation(response?.data?.data);
        console.log(response?.data?.data);
        setQbankCourseTopices(response?.data?.data?.curriculam?.topics);
      } catch (err) {
        console.log(err);
      }
    };
    //if(topicStatus){
    const fetchattemptsPausedCompleted = async () => {
      try {
        const responses = await axiosInstance.post(
          `/v1_data_model/courses/Course/test_series_course_type_test`,
          { user_id: user_id, course_id: course_id }
        );
        setTestSeries(responses.data.data.test_series);
      } catch (err) {
        console.log(err);
      }
    };

    // }
    fetchattemptsPausedCompleted();

    fetchQbankCourse();

    //filterData();
  }, []);

  console.log(testSeriesList);
 
  

  useEffect(() => {
    console.log(Search);
    console.log(qbankCourseTopicList);
    if(Search)
    {
      const data = qbankCourseTopicList.filter((itm) =>
      itm.title.toLowerCase().includes(Search.toLowerCase())
    );

    SetFilterlist(data);
    }
    else{
      SetFilterlist(qbankCourseTopicList);
    }
   
  }, [Search,qbankCourseTopicList]);


  const StartNew = (testid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;
      // Open the new window
      window.open(`/test-home/dq/${user_id}t${testid}`, "_blank", features);
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

  const handleAllTopics = ()=>{
    // window.location.reload();
    SetTopicStatus("All")
  }


  return (
    <div>
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li style={{ color: "#434343" }}>Qbank</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="test-studytabbibg">
        <div className="container clearfix ">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-3 col-lg-3"></div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12" id="main_id">
              <div className="rightcont">
                <div className="all-test-page">
                  <div className="tab-content" id="v-pills-tabContent">
                    <div className="tabdatashow">
                      <Link to={'/bookmarks'}>
                        <div className="commanGroup">
                          <FaBookmark size={24}/>
                          <h6>All Bookmarked</h6>
                        </div>
                      </Link>
                      <Link to={'/custom-qbank'}>
                        <div className="commanGroup">
                          <FaPen size={24}/>
                          <h6>Custom QBank</h6>
                        </div>
                      </Link>
                      <Link to={'/damsdeck'}>
                        <div className="commanGroup">
                          <FaClock size={24}/>
                          <h6>Dams Deck</h6>
                        </div>
                      </Link>
                    </div>
                    <div
                      className="tab-pane show active"
                      id="quetion-bank"
                      role="tabpanel"
                      aria-labelledby="quetion-bank"
                    >
                      <div className="filter-search">
                        <div className="row">
                          <ul className="nav nav-pills" role="tablist">

                          <li className="nav-item col-6 col-sm-3 col-md-3 col-lg-3">
                              <a
                                className="nav-link tabs"
                               
                               onClick={handleAllTopics}
                              >
                                <img
                                  src="https://png.pngtree.com/element_our/png/20181208/list-icon-png_265066.jpg"
                                  style={{ filter: "initial" }}
                                  alt=""
                                />
                               All Topics
                              </a>
                            </li>

                            <li className="nav-item col-6 col-sm-3 col-md-3 col-lg-3">
                              <a
                                className="nav-link tabs"
                                href="javscript:void(0)"
                                onClick={() => SetTopicStatus("total_attempts")}
                              >
                                <img
                                  src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/attemps-icon.png"
                                  style={{ filter: "initial" }}
                                  alt=""
                                />
                                Total Attempts(
                                {courseInformationList.total_attempted
                                  ? (courseInformationList.total_complete +courseInformationList.total_paused)
                                  : 0}
                                )
                              </a>
                            </li>
                            <li className="nav-item col-6 col-sm-3 col-md-3 col-lg-3">
                              <Link
                                className="nav-link tabs"
                                href="javscript:void(0)"
                                onClick={() => SetTopicStatus("paused")}
                              >
                                <img
                                  src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/p-icon.png"
                                  style={{ filter: "initial" }}
                                  alt=""
                                />
                                Paused(
                                {courseInformationList.total_paused
                                  ? courseInformationList.total_paused
                                  : 0}
                                )
                              </Link>
                            </li>
                            <li className="nav-item col-6 col-sm-3 col-md-3 col-lg-3">
                              <Link
                                className="nav-link tabs"
                                href="javscript:void(0)"
                                onClick={() => SetTopicStatus("completed")}
                              >
                                <img
                                  src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/comp-icon.png"
                                  style={{ filter: "initial" }}
                                  alt=""
                                />
                                Completed(
                                {courseInformationList.total_complete
                                  ? courseInformationList.total_complete
                                  : 0}
                                )
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                     







                      {topicStatus=='All'?( <Form.Select aria-label="Default select example" onChange={(e) => {
                                  SetSearch(e.target.value);
                                }} style={{marginBottom:'30px'}}>
          <option value={""}>All</option>
                                {qbankCourseTopicList?.map((result) => (
                                  <option value={result.title} id={result.id}>
                                    {result.title}
                                  </option>
                                ))}                         
      
    </Form.Select>):(<></>)}
 



                 
                      {topicStatus ==='All' ? ( 
                        <div className="tab-content">
                          <div id="total-attemps" className="tab-pane active">
                            <div className="quetionbanktab">
                              <div className="row m-0" id="option-selected">
                                {filterList?.map((result) => (
                                  <div className="col-6 col-sm-3 col-md-3 col-lg-3">
                                    <a
                                      onClick={() =>
                                        handleDqbSeries(
                                          result.topic_id,
                                          course_id
                                        )
                                      }
                                    >
                                      <div className="border-box">
                                        <div className="imgbox">
                                          <img
                                            src={result.sub_img_url}
                                            alt=""
                                          />
                                        </div>
                                        <h4>{result.title}</h4>
                                        <div className="numeric">
                                          <h3 id="h3" data-rate="">
                                            {result.completed}/{result.total}
                                            <i className="fa fa-angle-right float-right"></i>
                                          </h3>
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                 
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p></p>
                      )}
                    </div>
                  </div>

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
                              {topicStatus === "total_attempts"
                                ? testSeriesList?.map((results) =>
                               (results.is_paused=="1" || results.is_user_attemp) ? (
                                      <div className="col-12 col-sm-12 col-md-6 col-lg-4 pdleft">
                                        <div className="pathlogy-group position-relative">

                                          {(results.is_user_attemp && results.is_paused==0) ?( <div className="row" onClick={() =>
                                                        ResultView(
                                                          results.is_user_attemp
                                                        
                                                        )}>
                                            <div className="col-9 col-sm-9 col-md-9 col-lg-9" >
                                              <h3>
                                                <span>
                                                  <img
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/path-icon.svg"
                                                    alt=""
                                                  />
                                                </span>
                                                {results.test_series_name}
                                                {results.is_user_attemp}
                                              </h3>
                                            </div>
                                            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                             <div className="pausebtn">
                                              <span   >
                                                  <img
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/tick-icon.svg"
                                                    alt=""
                                                  />
                                                </span>
                                              </div>
                                              
                                            </div>
                                          </div>):(

                                            results.is_paused!=0 && (
                                              <div className="row" onClick={() =>
                                                StartPaused(
                                                  results.test_series_id
                                                )
                                              }>
                                               <div className="col-9 col-sm-9 col-md-9 col-lg-9">
                                                 <h3>
                                                   <span>
                                                     <img
                                                       src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/path-icon.svg"
                                                       alt=""
                                                     />
                                                   </span>
                                                   {results.test_series_name}
                                                   {results.is_paused}
                                                 </h3>
                                               </div>
                                               <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                                <div className="pausebtn">
                                                 <span   >
                                                     <img
                                                      src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/pause-btn.png"
                                                       alt=""
                                                     />
                                                   </span>
                                                 </div>
                                                 
                                               </div>
                                             </div>
                                            )

                                            
                                          )}
                                         
                                        
                                        </div>
                                      </div>
                                    ) : (
                                     <></>
                                    )
                                  )
                                : topicStatus === "paused"
                                ? testSeriesList?.map((results) =>
                                    results.is_paused == "1" ? (
                                      <div className="col-12 col-sm-12 col-md-6 col-lg-4 pdleft">
                                        <div className="pathlogy-group position-relative">
                                          <div className="row"  onClick={() =>
                                              StartPaused(
                                                results.test_series_id
                                              )}>
                                            <div className="col-9 col-sm-9 col-md-9 col-lg-9">
                                              <h3>
                                                <span>
                                                  <img
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/path-icon.svg"
                                                    alt=""
                                                  />
                                                </span>
                                                {results.test_series_name}
                                              </h3>
                                             
                                            </div>
                                            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                              <div className="pausebtn">
                                              <div className="pausebtn"><Link to={""}><img src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/pause-btn.png" alt="" /></Link></div>
                                              </div>
                                            </div>
                                          </div>
                                        
                                        </div>
                                      </div>
                                    ) : (
                                   <></>
                                    )
                                  )
                                : topicStatus === "completed"
                                ? testSeriesList?.map((results) =>
                               (results.is_user_attemp && results.is_paused==0) ? (
                                      <div className="col-12 col-sm-12 col-md-6 col-lg-4 pdleft">
                                        <div className="pathlogy-group position-relative">
                                          <div className="row" onClick={() =>
                                                        ResultView(
                                                          results.is_user_attemp
                                                        
                                                        )}>
                                            <div className="col-9 col-sm-9 col-md-9 col-lg-9">
                                              <h3>
                                                <span>
                                                  <img
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/path-icon.svg"
                                                    alt=""
                                                  />
                                                </span>
                                                {results.test_series_name}
                                              </h3>
                                              
                                            </div>
                                            <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                              <div className="pausebtn">
                                                <Link to={""}>
                                                  <img
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/study-test/tick-icon.svg"
                                                    alt=""
                                                  />
                                               </Link>
                                              </div>
                                            </div>
                                          </div>
                                         
                                        </div>
                                      </div>
                                    ) : (
                                     <></>
                                    )
                                  )
                                : <></>}
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
}

export default CoursesDqb;

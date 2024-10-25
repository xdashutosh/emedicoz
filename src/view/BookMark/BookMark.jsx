import "../../assets/css/bookmark/style.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";
import axiosInstance from "../../API/axiosConfig";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";

const Bookmarklist = () => {
  const navigate = useNavigate();
  const id = sessionStorage.getItem("id");
  const user_id = sessionStorage.getItem("id");
  const [status, setStatus] = useState("Q");
  const [loading, setLoading] = useState(false);
  const [arrowToggle, setArrowToggle] = useState(null);
  const [audioToggle, setAudioToggle] = useState(false);
  const [audioData, setAudioData] = useState({});

  const [bookmarkData, setBookmarkData] = useState({
    daily_quiz_count: "",
    podcast_count: "",
    video_count: "",
    wishlist_count: "",
  });
  const [qbListData, setQbListData] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [podcastData, setPodcastData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const [mybookmarkList, setMybookmarkList] = useState([]);

  const getCalled = async () => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/courses/course/my_bookmarks",
        { user_id: user_id, stream_id: "1" }
      );

      setBookmarkData({
        daily_quiz_count: res?.data?.data?.daily_quiz_count,
        podcast_count: res?.data?.data?.podcast_count,
        video_count: res?.data?.data?.video_count,
        wishlist_count: res?.data?.data?.wishlist_count,
      });

      const response = await axiosInstance.post(
        "v1_data_model/fanwall/Fan_wall/bookmark_category_list",
        { user_id: user_id, stream: "1", q_type_dqb: "2", type: "QUIZ" }
      );
      // console.log(response?.data?.data)
      const data = response?.data?.data.filter((itm) => itm.total > 0);
      // console.log(data)
      setQbListData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCalledWishListRequest = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "v1_data_model/courses/course/get_user_courses_wishlist",
        {
          user_id: id,
        }
      );
      setWishlistData(res?.data?.data?.course_list);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const getCalledPodcastRequest = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "v1_data_model/podcasts/podcast/get_bookmarked_podcast",
        {
          user_id: id,
        }
      );
      setPodcastData(res?.data?.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const getCalledVideoRequest = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "v1_data_model/courses/course/get_video_bookmark_list",
        {
          user_id: id,
        }
      );
      setVideoData(res?.data?.data?.vedio_list);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getCalledToggle = async (id) => {
    try {
      const response = await axiosInstance.post(
        "v1_data_model/fanwall/Fan_wall/bookmark_list",
        {
          user_id: user_id,
          steam: "",
          last_post_id: "",
          tag_id: id,
          test_series_id: "",
          q_type_dqb: "2",
          type: "QUIZ",
          search_text: "",
        }
      );
      setMybookmarkList(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSectionClick = (index) => {
    // console.log(index);
    setArrowToggle(arrowToggle === index ? null : index);
    getCalledToggle(index);
  };

  useEffect(() => {
    getCalled();
  }, []);

  useEffect(() => {
    if (status === "W") {
      getCalledWishListRequest();
    } else if (status === "P") {
      getCalledPodcastRequest();
    } else if (status === "V") {
      getCalledVideoRequest();
    }
  }, [status]);

  const handlerAudio = (data) => {
    console.log(data)
    setAudioToggle(true);
    setAudioData(data);
  };


  return (
    <div className="Bookmarklist ">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li style={{ color: "#434343" }}>My Notes</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-block BookMarkdata">
        <div className="container book_cont">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="profile-content-bx">
                <div className="tab-content">
                  <div className="tab-pane active">
                    <div className="test-curriculum my-bookmark">
                      <div className="profile-head">
                        <h3>My Bookmark</h3>
                      </div>
                      <ul className="nav nav-tabs curriculum-tab">
                        {bookmarkData.daily_quiz_count ? (
                          <li className={`nav-item ${status === "Q" ? "active" : ""}`} onClick={() => setStatus("Q")}>
                          <Link className="nav-link bookmark_tab_btn">
                            Bookmarked
                            <div className="ttbf">
                              <p>
                                Q Bank
                                <span className="roundbg float-right">
                                  {bookmarkData.daily_quiz_count}
                                </span>
                              </p>
                            </div>
                          </Link>
                        </li>
                        ) : (
                          ""
                        )}

                        {bookmarkData.podcast_count ? (
                          // <li className="nav-item">
                          //   <Link className="nav-link bookmark_tab_btn active show"
                          //     onClick={() => setStatus("P")}
                          //   >
                          //     Oval Window Podcast
                          //     <div className="ttbf">
                          //       <p>
                          //         Bookmarked
                          //         <span className="roundbg float-right">
                          //           {bookmarkData.podcast_count}
                          //         </span>
                          //       </p>
                          //     </div>
                          //   </Link>
                          // </li>

                          <li className={`nav-item ${status === "P" ? "active" : ""}`} onClick={() => setStatus("P")}>
                            <Link className="nav-link bookmark_tab_btn">
                              Oval Window Podcast
                              <div className="ttbf">
                                <p>
                                  Bookmarked
                                  <span className="roundbg float-right">
                                    {bookmarkData.podcast_count}
                                  </span>
                                </p>
                              </div>
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}

                        {bookmarkData?.video_count ? (
                          <li className={`nav-item ${status === "V" ? "active" : ""}`} onClick={() => setStatus("V")}>
                            <Link className="nav-link bookmark_tab_btn">
                              Videos
                              <div className="ttbf">
                                <p>
                                  Bookmarked
                                  <span className="roundbg float-right">
                                    {bookmarkData.video_count}
                                  </span>
                                </p>
                              </div>
                            </Link>
                          </li>
                        ) : (
                          ""
                        )}
                        {bookmarkData.wishlist_count ? (
                          <li className={`nav-item ${status === "W" ? "active" : ""}`} onClick={() => setStatus("W")}>
                          <Link className="nav-link bookmark_tab_btn">
                            Wishlist
                            <div className="ttbf">
                              <p>
                                Bookmarked
                                <span className="roundbg float-right">
                                  {bookmarkData.wishlist_count}
                                </span>
                              </p>
                            </div>
                          </Link>
                        </li>
                        ) : (
                          ""
                        )}
                      </ul>

                      {/* Condition based */}
                      {status == "Q" ? (
                        <>
                          {qbListData.length > 0 ? (
                            <>
                              {qbListData?.map((itm, i) => (
                                <div
                                  key={i}
                                  className="tab-content1"
                                  style={{ position: "relative" }}
                                >
                                  <div
                                    className="loaderajax"
                                    style={{ display: "none" }}
                                  >
                                    <img
                                      alt="loader"
                                      src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/Double Ring-1s-200px.svg"
                                    />
                                  </div>

                                  <div className="tab-pane fade show active">
                                    <div id="post_list">
                                      <div className="widget curriculum-emez" style={{marginBottom:'12px'}}>
                                        <div className="widget-post-bx">
                                          <div className="widget-post clearfix">
                                            <div
                                              className="listbox_bookmark text-center"
                                              style={{
                                                background: "#297E22",
                                              }}
                                            >
                                              <h1>{itm.text.charAt(0)}</h1>
                                            </div>
                                            <div className="ttr-post-info">
                                              <div className="ttr-post-header flex-grow-1">
                                                <span
                                                  className="float-right"
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() =>
                                                    handleSectionClick(itm.id)
                                                  }
                                                >
                                                  {arrowToggle === itm.id ? (
                                                    <IoMdArrowDropdown
                                                      size={25}
                                                    />
                                                  ) : (
                                                    <IoMdArrowDropright
                                                      size={25}
                                                    />
                                                  )}
                                                </span>
                                                <h6 className="post-title">
                                                  <a className="feeddetails">
                                                    {itm.text}{" "}
                                                    <span>({itm.total})</span>
                                                  </a>
                                                </h6>
                                              </div>
                                            </div>
                                          </div>
                                          {arrowToggle === itm.id && (
                                            <ul>
                                              {mybookmarkList?.map((it, i) => (
                                                <li>
                                                  <div
                                                    dangerouslySetInnerHTML={{
                                                      __html: it.question,
                                                    }}
                                                  />
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            "No data found"
                          )}
                        </>
                      ) : status == "P" ? (
                        <>
                          <div className="row">
                            {audioToggle && (
                              <>
                                <div
                                  class="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                                  style={{
                                    display: "block",
                                    marginTop: "30px",
                                    cursor:"pointer"
                                  }}
                                >
                                  <div
                                    class="allpodcast-group-big-music-plyr menu1"
                                  >
                                    <div class="row">
                                      <div class="col-lg-1 col-sm-2 col-md-2 col-2">
                                        <div class="audio-img-big-m-ply">
                                          <img
                                            src={audioData.thumbnail_image}
                                            alt=""
                                            style={{  }}
                                          />
                                        </div>
                                      </div>
                                      <div class="col-lg-9 col-sm-8 col-md-8 col-8">
                                        <div class="audio-mid-big-m-ply">
                                          <h3>{audioData.title}</h3>
                                          <p>Dr Sumer Sethi </p>
                                        </div>
                                      </div>

                                      <div class="col-lg-2 col-sm-2 col-md-2 col-2 text-right">
                                        <ul>
                                          <li>
                                            <a
                                              onClick={() =>
                                                setAudioToggle(false)
                                              }
                                            >
                                              <i class="fa fa-close"></i>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>

                                      <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                                        <div class="player paused">
                                          <div class="row"></div>
                                          <audio
                                            class="audio182"
                                            src={audioData.audio_url}
                                            // autoPlay
                                            controls
                                          ></audio>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {podcastData.map((pod, i) => (
                              <div
                                className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4"
                                key={i}
                                style={{cursor:"pointer"}}
                                onClick={() => handlerAudio(pod)}
                              >
                                <div className="course_type">
                                  <div className="row">
                                    <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                      <img
                                        src={pod?.thumbnail_image}
                                        style={{ width: "80%" }}
                                        alt=""
                                      />
                                    </div>
                                    <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                      <h2>{pod?.title}</h2>
                                      <h3>{`${pod?.created_at} -  ${pod?.views} Plays`}</h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : status == "V" ? (
                        <>
                          <div className="row">
                            {videoData.map((video, i) => (
                              <div
                                className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4"
                                key={i}
                                onClick={()=>toast.warning("If you want play this video then go to mobile app...")}
                              >
                                <div className="course_type">
                                  <div className="row">
                                    <div className="col-3 col-sm-2 col-md-3 col-lg-2 col-xl-2">
                                      <img
                                        className="videosvg"
                                        src="video.svg"
                                        style={{ width: "80%", height: "35px" }}
                                        alt=""
                                      />
                                    </div>
                                    <div className="col-9 col-sm-10 col-md-9 col-lg-10 col-xl-10">
                                      <h2>{video?.video_title}</h2>
                                      <h3>Video Length:{video?.duration}</h3>
                                      {/* <ul>
                                          <li>
                                            <Link href="javascriptvoid:(0)">
                                              Enroll
                                            </Link>
                                          </li>
                                        </ul> */}
                                    </div>
                                    {/* <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                        <div className="enroll_now">
                                          <button className="btn full_amount">
                                            View Details
                                          </button>
                                        </div>
                                      </div> */}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        status == "W" && (
                          <>
                            <div className="row">
                              {wishlistData.map((wishData, i) => (
                                <div
                                onClick={()=>toast.warning("If you want play this video then go to mobile app...")}
                                  className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4"
                                  key={i}
                                  style={{cursor:"pointer"}}
                                >
                                  <div className="course_type">
                                    <div className="row">
                                      <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                        <img
                                          src={wishData?.cover_image}
                                          alt=""
                                        />
                                      </div>
                                      <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                        <h2>{wishData.title}</h2>
                                        <h3>Enrolled:{wishData?.learner}</h3>
                                       
                                      </div>
                                      
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarklist;

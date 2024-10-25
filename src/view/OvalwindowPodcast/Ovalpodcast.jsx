import "../../assets/css/podcast/style.css";
import "../../assets/css/podcast/responsive.css";
import "../../assets/css/shortcodes/shortcodes.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import "../OvalwindowPodcast/components/Sidebar";
import Sidebar from "../OvalwindowPodcast/components/Sidebar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "antd";
import axiosInstance from "../../API/axiosConfig";

const Ovalpodcast = () => {
  const userid = sessionStorage.getItem("id");
  const [TopTrending, setTrending] = useState([]);
  const [MyLibrary, setMyLibrary] = useState([]);
  const [MostPlayed, setMostPlayed] = useState([]);
  const [AudioData, setAudioData] = useState();
  const [Audiostatus, setAudioStatus] = useState(false);
  const [PodcastId, setPodcastId] = useState(0);

  const [latestdata, setlatest] = useState([]);
  const [AuthorChanneldata, setauthorchannel] = useState([]);
  //const [isActive, setIsActive] = useState(false);
  const [podCastdata, setPodCastData] = useState([{}]);
  const [Podcast, setPodcast] = useState("podcast");

  const toggleIsActive = (result) => {
    setPodcast("channelstatus");
    axiosInstance
      .post(`/v1_data_model/podcasts/podcast/get_podcast_data`, {
        user_id: userid,
        author_id: result.id,
        sort_by: "",
        page: 1,
      })
      .then((response) => {
        setPodCastData(response.data.data.my_podcast);
      })
      .catch((error) => {
        console.log("Error fetching Pod Cast Data:", error);
      });
  };

  const bookmarkEvent = (id, isBookmarked) => {
    console.log(id, isBookmarked);
    const isRemoveBookmark = isBookmarked ? 1 : 0; // Toggle between bookmark and unmark
    axiosInstance
      .post(`/v1_data_model/podcasts/podcast/bookmarked_podcast`, {
        user_id: userid,
        podcast_id: id,
        is_remove_bookmark: isRemoveBookmark,
      })
      .then((response) => {
        if (response.data.message == "Podcast bookmarked successfully") {
          setPodcastId(id);
          getlibdata();
          fetchData();
          mostplayeddata();
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (
          response.data.message ==
          "Podcast removed from bookmarked successfully"
        ) {
          setPodcastId(0);
          fetchData();
          getlibdata();
          mostplayeddata();

          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        // Update the TopTrending data to reflect the bookmark state change
        setTrending((prevTrending) =>
          prevTrending.map((podcast) =>
            podcast.id === id
              ? { ...podcast, is_bookmarked: !isBookmarked }
              : podcast
          )
        );
      })
      .catch((error) => {
        console.log("Error updating bookmark status:", error);
      });
  };

  const handleAudioData = (result) => {
    setAudioStatus(true);
    setAudioData(result);
  };

  const [arraySidebarData, setArrayData] = useState([
    {
      name: "All Podcast",
      value: "podcast",
      image:
        "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/podcast/episodes.png",
      class: "nav-link active show",
    },
    {
      name: "Channels",
      value: "channels",
      image:
        "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/podcast/channels.png",
      class: "nav-link",
    },
    {
      name: "My Library",
      value: "mylibrary",
      image:
        "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/podcast/bookmarks.png",
      class: "nav-link",
    },
    {
      name: "Most Played",
      value: "mostplayed",
      image:
        "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/podcast/most-view.png",
      class: "nav-link",
    },
  ]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        `/v1_data_model/podcasts/podcast/podcast_front_page`,
        { user_id: userid }
      );
      setTrending(response.data.data[0].data);
      setlatest(response.data.data[1].data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userid]);

  const mostplayeddata = async () => {
    axiosInstance
      .post(`/v1_data_model/podcasts/podcast/get_podcast_data`, {
        user_id: userid,
        sort_by: "mostviewed",
      })
      .then((response) => {
        setMostPlayed(response?.data?.data?.my_podcast);
      })
      .catch((error) => {
        console.log("Error fetching My Podcast data:", error);
      });
  };
  useEffect(() => {
    mostplayeddata();
  }, [userid]);

  useEffect(() => {
    axiosInstance
      .post(`/v1_data_model/podcasts/podcast/get_podcast_author_channel_list`, {
        user_id: userid,
        stream_id: 1,
      })
      .then((response) => {
        setauthorchannel(response.data.data);
      })
      .catch((error) => {
        console.log("Error fetching Author Channel Data data:", error);
      });
  }, []);

  const getlibdata = async () => {
    axiosInstance
      .post(`/v1_data_model/podcasts/podcast/get_bookmarked_podcast`, {
        user_id: userid,
        sort_by: "",
        page: 1,
      })
      .then((response) => {
        setMyLibrary(response?.data?.data);
        console.log(response?.data);
      })
      .catch((error) => {
        console.log("Error fetching Pod Cast Data:", error);
      });
  };
  useEffect(() => {
    getlibdata();
  }, [userid]);

  const formatTime = (seconds) => {
    return `${pad(Math.floor(seconds / 3600))}:${pad(
      Math.floor((seconds % 3600) / 60)
    )}:${pad(seconds % 60)}`;
  };
  const pad = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <>
      <div className="Ovalpodcast">
        <div className="page-content position-relative">
          <div className="breadcrumb-row">
            <div class="container">
              <ul className="list-inline">
                <li>
                  <Link to={"/"}>Home</Link>
                </li>
                <li>Oval Podcast</li>
              </ul>
            </div>
          </div>
        </div>
        <section className="podacst-episodes-tbing">
          <div className="container clearfix ">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <Sidebar
                  sidebarData={arraySidebarData}
                  setPodcast={setPodcast}
                />
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="rightside">
                  <div className="tab-content" id="v-pills-tabContent">
                    {Podcast == "podcast" && Podcast.length ? (
                      <div className="tab-pane show active ">
                        <div className="tab-content">
                          <h3 className="">Latest</h3>

                          <div className="row" id="append_podcast">
                            {Audiostatus == true ? (
                              <div
                                class="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                                style={{ display: "block" }}
                              >
                                <div
                                  class="allpodcast-group-big-music-plyr menu1"
                                  style={{ display: "block" }}
                                >
                                  <div class="row">
                                    <div class="col-lg-1 col-sm-2 col-md-2 col-2">
                                      <div class="audio-img-big-m-ply">
                                        <img
                                          src={AudioData.thumbnail_image}
                                          alt=""
                                          style={{ borderRadius: "50%" }}
                                        />
                                      </div>
                                    </div>
                                    <div class="col-lg-9 col-sm-8 col-md-8 col-8">
                                      <div class="audio-mid-big-m-ply">
                                        <h3>{AudioData.title}</h3>
                                        <p>Dr Sumer Sethi </p>
                                      </div>
                                    </div>

                                    <div class="col-lg-2 col-sm-2 col-md-2 col-2 text-right">
                                      <ul>
                                        <li>
                                          <a
                                            onClick={() =>
                                              setAudioStatus(false)
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
                                          src={AudioData.audio_url}
                                          // autoPlay
                                          controls
                                          controlsList="nodownload"
                                        >
                                          {" "}
                                        </audio>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}

                            {TopTrending.length == 0 ? (
                              <p>No order found</p>
                            ) : (
                              TopTrending.map((Toppodcastlist, index) => (
                                <div className="col-lg-6 col-xl-4 col-sm-6 col-md-6 col-12">
                                  <div className="allpodcast-group">
                                    <div className="row">
                                      <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                        <div className="audio-img">
                                          <img
                                            src={Toppodcastlist.thumbnail_image}
                                            alt=""
                                            style={{ borderRadius: "50%" }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-6 col-md-6 col-6">
                                        <div className="audio-mid">
                                          <h3>{Toppodcastlist.title}</h3>
                                          <p>
                                            {Toppodcastlist.created_by}
                                            <span
                                              className="new-btn"
                                              style={{ display: "none" }}
                                            >
                                              New
                                            </span>
                                            <span
                                              className="dwof"
                                              id="downld182"
                                              style={{ display: "none" }}
                                            >
                                              <Link to={""}>
                                                Downloaded Offline
                                              </Link>
                                            </span>
                                          </p>
                                          <ul>
                                            <li>
                                              <Link
                                                to={""}
                                                style={{ cursor: "pointer" }}
                                                className="bookmk"
                                              >
                                                <i
                                                  style={{ color: "#071952" }}
                                                  className={
                                                    Toppodcastlist.is_bookmarked
                                                      ? "fa fa-bookmark bokmrk"
                                                      : "fa fa-bookmark-o bokmrk2"
                                                  }
                                                  onClick={(e) => {
                                                    bookmarkEvent(
                                                      Toppodcastlist.id,
                                                      Toppodcastlist.is_bookmarked
                                                    );
                                                  }}
                                                ></i>
                                              </Link>
                                            </li>
                                            <li>
                                              <Tooltip title="This feature is only available in the App">
                                                <a
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default action of the link
                                                  }}
                                                >
                                                  <img
                                                    id="undo"
                                                    style={{
                                                      cursor: "pointer",
                                                      marginLeft: "1px",
                                                    }}
                                                    data-id="182"
                                                    data-user="384460"
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/download.svg"
                                                    alt="Download Icon"
                                                  />
                                                </a>
                                              </Tooltip>
                                            </li>
                                            <li>
                                              <Link to={""}>
                                                <img
                                                  id="done"
                                                  className="del182"
                                                  src="#"
                                                  alt=""
                                                />{" "}
                                              </Link>
                                            </li>
                                            <li>
                                              <img src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/445755Path_12997.png" />
                                              <span className="play1">
                                                Total Play{}{" "}
                                              </span>{" "}
                                              {Toppodcastlist.views}
                                            </li>
                                            {/* Other list items */}
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-sm-4 col-md-4 col-4 pd-left">
                                        <div className="song-time">
                                          <div className="play">
                                            <a
                                              onClick={() =>
                                                handleAudioData(Toppodcastlist)
                                              }
                                              data-playerid="182"
                                              className="ppbutton fa fa-play ply182"
                                              data-src={
                                                Toppodcastlist.audio_src
                                              }
                                            ></a>
                                          </div>
                                          <h5>
                                            DURATION{" "}
                                            {formatTime(
                                              Toppodcastlist.duration
                                            ).split("00:")}
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="tab-content">
                          <h3 lassName="my-3">Top</h3>
                          <div className="row" id="append_podcast">
                            {latestdata.length === 0 ? (
                              <p>No order found</p>
                            ) : (
                              latestdata.map((latestlist, index) => (
                                <div className="col-lg-6 col-xl-4 col-sm-6 col-md-6 col-12">
                                  <div className="allpodcast-group">
                                    <div className="row">
                                      <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                        <div className="audio-img">
                                          <img
                                            src={latestlist.thumbnail_image}
                                            alt=""
                                            style={{ borderRadius: "50%" }}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-sm-6 col-md-6 col-6">
                                        <div className="audio-mid">
                                          <h3>{latestlist.title}</h3>
                                          <p>
                                            {latestlist.created_by}
                                            <span
                                              className="new-btn"
                                              style={{ display: "none" }}
                                            >
                                              New
                                            </span>
                                            <span
                                              className="dwof"
                                              id="downld182"
                                              style={{ display: "none" }}
                                            >
                                              <Link
                                                to={""}
                                                href="javascript:void(0)"
                                              >
                                                Downloaded Offline
                                              </Link>
                                            </span>
                                          </p>
                                          <ul>
                                            <li>
                                              <Link
                                                to={""}
                                                style={{ cursor: "pointer" }}
                                                className="bookmk"
                                              >
                                                <i
                                                  style={{ color: "#071952" }}
                                                  className={
                                                    latestlist?.is_bookmarked
                                                      ? "fa fa-bookmark bokmrk"
                                                      : "fa fa-bookmark-o bokmrk2"
                                                  }
                                                  onClick={(e) => {
                                                    bookmarkEvent(
                                                      latestlist.id,
                                                      latestlist.is_bookmarked
                                                    );
                                                  }}
                                                ></i>
                                              </Link>
                                            </li>
                                            <li>
                                              <Tooltip title="This feature is only available in the App">
                                                <a
                                                  href="#"
                                                  onClick={(e) => {
                                                    e.preventDefault(); // Prevent the default action of the link
                                                  }}
                                                >
                                                  <img
                                                    id="undo"
                                                    style={{
                                                      cursor: "pointer",
                                                      marginLeft: "1px",
                                                    }}
                                                    data-id="182"
                                                    data-user="384460"
                                                    src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/download.svg"
                                                    alt="Download Icon"
                                                  />
                                                </a>
                                              </Tooltip>
                                            </li>
                                            <li>
                                              <Link to={""} href="">
                                                <img
                                                  id="done"
                                                  className="del182"
                                                  src="#"
                                                  alt=""
                                                />{" "}
                                              </Link>
                                            </li>
                                            <li style={{ fontSize: "10px" }}>
                                              <img src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/445755Path_12997.png" />
                                              <span className="play1">
                                                Total Play{" "}
                                              </span>{" "}
                                              {latestlist.created_by}
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-sm-4 col-md-4 col-4 pd-left">
                                        <div className="song-time">
                                          <div className="play">
                                            <a
                                              onClick={() =>
                                                handleAudioData(latestlist)
                                              }
                                              data-playerid="182"
                                              className="ppbutton fa fa-play ply182"
                                              data-src="https://d2enu63wt1sf3u.cloudfront.net/doc_folder/381909_1703072352208_audio.wav"
                                            ></a>
                                          </div>
                                          <h5>
                                            DURATION{" "}
                                            {formatTime(
                                              latestlist.duration
                                            ).split("00:")}
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p></p>
                    )}

                    {Podcast == "mostplayed" && Podcast.length ? (
                      <div className="tab-content" id="mostviewed">
                        <div
                          className="tab-pane show active "
                          id="podcast0"
                          role="tabpanel"
                          aria-labelledby="podcast-episodes"
                        >
                          <div className="tab-content">
                            <h3 lassName="my-3"></h3>
                            <div className="row" id="append_podcast">
                              {Audiostatus == true ? (
                                <div
                                  class="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                                  id="hide182"
                                  style={{ display: "block" }}
                                >
                                  <div
                                    id="menu182"
                                    class="allpodcast-group-big-music-plyr menu1"
                                    style={{ display: "block" }}
                                  >
                                    <div class="row">
                                      <div class="col-lg-1 col-sm-2 col-md-2 col-2">
                                        <div class="audio-img-big-m-ply">
                                          <img
                                            src={AudioData.thumbnail_image}
                                            alt=""
                                            style={{ borderRadius: "50%" }}
                                          />
                                        </div>
                                      </div>
                                      <div class="col-lg-9 col-sm-8 col-md-8 col-8">
                                        <div class="audio-mid-big-m-ply">
                                          <h3>{AudioData.title}</h3>
                                          <p>Dr Sumer Sethi </p>
                                        </div>
                                      </div>

                                      <div class="col-lg-2 col-sm-2 col-md-2 col-2  text-right">
                                        <ul>
                                          <li>
                                            <a
                                              onClick={() =>
                                                setAudioStatus(false)
                                              }
                                            >
                                              <i
                                                class="fa fa-close"
                                                aria-hidden="true"
                                                style={{}}
                                              ></i>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>

                                      <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                                        <div class="player paused">
                                          <div class="row"></div>
                                          <audio
                                            id="audio"
                                            class="audio182"
                                            prelaod=""
                                            src={AudioData.audio_url}
                                            // autoPlay
                                            controls
                                            controlsList="nodownload"
                                          >
                                            {" "}
                                          </audio>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}

                              {MostPlayed.length === 0 ? (
                                <p>No order found</p>
                              ) : (
                                MostPlayed.map((latestlist, index) => (
                                  <div className="col-lg-6 col-xl-4 col-sm-6 col-md-6 col-12">
                                    <div className="allpodcast-group">
                                      <div className="row">
                                        <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                          <div className="audio-img">
                                            <img
                                              src={latestlist.thumbnail_image}
                                              alt=""
                                              style={{ borderRadius: "50%" }}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 col-md-6 col-6">
                                          <div className="audio-mid">
                                            <h3>{latestlist.title}</h3>
                                            <p>
                                              {latestlist.created_by}
                                              <span
                                                className="new-btn"
                                                style={{ display: "none" }}
                                              >
                                                New
                                              </span>
                                              <span
                                                className="dwof"
                                                id="downld182"
                                                style={{ display: "none" }}
                                              >
                                                <Link
                                                  to={""}
                                                  href="javascript:void(0)"
                                                >
                                                  Downloaded Offline
                                                </Link>
                                              </span>
                                            </p>
                                            <ul>
                                              <li>
                                                <Link
                                                  to={""}
                                                  style={{ cursor: "pointer" }}
                                                  className="bookmk"
                                                >
                                                  <i
                                                    style={{ color: "#071952" }}
                                                    className={
                                                      latestlist?.is_bookmarked ==
                                                      1
                                                        ? "fa fa-bookmark bokmrk"
                                                        : "fa fa-bookmark-o bokmrk2"
                                                    }
                                                    onClick={(e) => {
                                                      bookmarkEvent(
                                                        latestlist.id,
                                                        latestlist.is_bookmarked
                                                      );
                                                    }}
                                                  ></i>
                                                </Link>
                                              </li>

                                              <li>
                                                <Tooltip title="This feature is only available in the App">
                                                  <a
                                                    href="#"
                                                    onClick={(e) => {
                                                      e.preventDefault(); // Prevent the default action of the link
                                                    }}
                                                  >
                                                    <img
                                                      id="undo"
                                                      style={{
                                                        cursor: "pointer",
                                                        marginLeft: "1px",
                                                      }}
                                                      data-id="182"
                                                      data-user="384460"
                                                      src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/download.svg"
                                                      alt="Download Icon"
                                                    />
                                                  </a>
                                                </Tooltip>
                                              </li>
                                              <li>
                                                <Link to={""} href="">
                                                  <img
                                                    id="done"
                                                    className="del182"
                                                    src="#"
                                                    alt=""
                                                  />{" "}
                                                </Link>
                                              </li>
                                              <li style={{ fontSize: "10px" }}>
                                                <img src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/445755Path_12997.png" />
                                                <span className="play1">
                                                  Total Play{" "}
                                                </span>{" "}
                                                {latestlist.created_by}
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-4 pd-left">
                                          <div className="song-time">
                                            <div className="play">
                                              <a
                                                onClick={() =>
                                                  handleAudioData(latestlist)
                                                }
                                                data-playerid="182"
                                                className="ppbutton fa fa-play ply182"
                                                data-src="https://d2enu63wt1sf3u.cloudfront.net/doc_folder/381909_1703072352208_audio.wav"
                                              ></a>
                                            </div>
                                            <h5>
                                              DURATION{" "}
                                              {formatTime(
                                                latestlist.duration
                                              ).split("00:")}
                                            </h5>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p></p>
                    )}

                    {Podcast == "mylibrary" && MyLibrary.length ? (
                      <div className="tab-content" id="mostviewed">
                        <div
                          className="tab-pane show active "
                          id="podcast0"
                          role="tabpanel"
                          aria-labelledby="podcast-episodes"
                        >
                          <div className="tab-content">
                            <h3 lassName="my-3"></h3>
                            <div className="row" id="append_podcast">
                              {Audiostatus == true ? (
                                <div
                                  class="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                                  id="hide182"
                                  style={{ display: "block" }}
                                >
                                  <div
                                    id="menu182"
                                    class="allpodcast-group-big-music-plyr menu1"
                                    style={{ display: "block" }}
                                  >
                                    <div class="row">
                                      <div class="col-lg-1 col-sm-2 col-md-2 col-2">
                                        <div class="audio-img-big-m-ply">
                                          <img
                                            src={AudioData.thumbnail_image}
                                            alt=""
                                            style={{ borderRadius: "50%" }}
                                          />
                                        </div>
                                      </div>
                                      <div class="col-lg-9 col-sm-8 col-md-8 col-8">
                                        <div class="audio-mid-big-m-ply">
                                          <h3>{AudioData.title}</h3>
                                          <p>Dr Sumer Sethi </p>
                                        </div>
                                      </div>

                                      <div class="col-lg-2 col-sm-2 col-md-2 col-2  text-right">
                                        <ul>
                                          <li>
                                            <a
                                              onClick={() =>
                                                setAudioStatus(false)
                                              }
                                            >
                                              <i
                                                class="fa fa-close"
                                                aria-hidden="true"
                                                style={{}}
                                              ></i>
                                            </a>
                                          </li>
                                        </ul>
                                      </div>

                                      <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                                        <div class="player paused">
                                          <div class="row"></div>
                                          <audio
                                            id="audio"
                                            class="audio182"
                                            prelaod=""
                                            src={AudioData.audio_url}
                                            // autoPlay
                                            controls
                                            controlsList="nodownload"
                                          >
                                            {" "}
                                          </audio>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              {MyLibrary.length === 0 ? (
                                <p>No order found</p>
                              ) : (
                                MyLibrary.map((result, index) => (
                                  <div className="col-lg-6 col-xl-4 col-sm-6 col-md-6 col-12">
                                    <div className="allpodcast-group">
                                      <div className="row">
                                        <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                          <div className="audio-img">
                                            <img
                                              src={result.thumbnail_image}
                                              alt=""
                                              style={{ borderRadius: "50%" }}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 col-md-6 col-6">
                                          <div className="audio-mid">
                                            <Tooltip
                                              placement="top"
                                              title={result.title}
                                            >
                                              <h3 style={{ cursor: "pointer" }}>
                                                {result.title}
                                              </h3>
                                            </Tooltip>
                                            <p>
                                              {result.created_by}
                                              <span
                                                className="new-btn"
                                                style={{ display: "none" }}
                                              >
                                                New
                                              </span>
                                              <span
                                                className="dwof"
                                                id="downld182"
                                                style={{ display: "none" }}
                                              >
                                                <Link
                                                  to={""}
                                                  href="javascript:void(0)"
                                                >
                                                  Downloaded Offline
                                                </Link>
                                              </span>
                                            </p>
                                            <ul>
                                              <li>
                                                <Link
                                                  to={""}
                                                  style={{ cursor: "pointer" }}
                                                  className="bookmk"
                                                >
                                                  <i
                                                    style={{ color: "#071952" }}
                                                    className="fa fa-bookmark bokmrk"
                                                    onClick={(e) => {
                                                      bookmarkEvent(
                                                        result?.id,
                                                        1
                                                      );
                                                    }}
                                                  ></i>
                                                </Link>
                                              </li>
                                              <li>
                                                <Tooltip title="This feature is only available in the App">
                                                  <a
                                                    href="#"
                                                    onClick={(e) => {
                                                      e.preventDefault(); // Prevent the default action of the link
                                                    }}
                                                  >
                                                    <img
                                                      id="undo"
                                                      style={{
                                                        cursor: "pointer",
                                                        marginLeft: "1px",
                                                      }}
                                                      data-id="182"
                                                      data-user="384460"
                                                      src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/download.svg"
                                                      alt="Download Icon"
                                                    />
                                                  </a>
                                                </Tooltip>
                                              </li>
                                              <li>
                                                <Link to={""} href="">
                                                  <img
                                                    id="done"
                                                    className="del182"
                                                    src="#"
                                                    alt=""
                                                  />{" "}
                                                </Link>
                                              </li>
                                              <li style={{ fontSize: "10px" }}>
                                                <img src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/445755Path_12997.png" />
                                                <span className="play1">
                                                  Total Play{" "}
                                                </span>{" "}
                                                {result.created_by}
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-4 col-md-4 col-4 pd-left">
                                          <div className="song-time">
                                            <div className="play">
                                              <a
                                                onClick={() =>
                                                  handleAudioData(result)
                                                }
                                                data-playerid="182"
                                                className="ppbutton fa fa-play ply182"
                                                data-src="https://d2enu63wt1sf3u.cloudfront.net/doc_folder/381909_1703072352208_audio.wav"
                                              ></a>
                                            </div>
                                            <h5>
                                              DURATION{" "}
                                              {formatTime(
                                                result.duration
                                              ).split("00:")}
                                            </h5>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p></p>
                    )}

                    <div className="tab-pane"></div>

                    {Podcast === "channels" && Podcast.length ? (
                      <div className="tab-pane active show">
                        <div className="row">
                          {AuthorChanneldata?.map((result, i) => (
                            <div className="col-lg-3 col-sm-3 col-md-6 col-12">
                              <div className="channel-grp">
                                <div className="chnl-img">
                                  <img src={result.image} alt="" />
                                </div>
                                <Link
                                  to={""}
                                  style={{ cursor: "pointer" }}
                                  className="chanelwaise"
                                  onClick={(e) => {
                                    toggleIsActive(result);
                                  }}
                                >
                                  <h4>Podcast by: {result.name}</h4>
                                </Link>
                                <Link
                                  to={""}
                                  data-toggle="pill"
                                  className="chanelwaise"
                                >
                                  <p className="m-0 p-0">
                                    <i className="fa fa-angle-right"></i>
                                  </p>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="tab-content" id="mostviewed">
                        {Podcast === "channelstatus" && podCastdata.length ? (
                          <div className="tab-pane show active ">
                            <div className="tab-content">
                              <h3 lassName="my-3"></h3>
                              <div className="row" id="append_podcast">
                                {Audiostatus == true ? (
                                  <div
                                    class="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                                    id="hide182"
                                    style={{ display: "block" }}
                                  >
                                    <div
                                      id="menu182"
                                      class="allpodcast-group-big-music-plyr menu1"
                                      style={{ display: "block" }}
                                    >
                                      <div class="row">
                                        <div class="col-lg-1 col-sm-2 col-md-2 col-2">
                                          <div class="audio-img-big-m-ply">
                                            <img
                                              src={AudioData?.thumbnail_image}
                                              alt=""
                                              style={{ borderRadius: "50%" }}
                                            />
                                          </div>
                                        </div>
                                        <div class="col-lg-9 col-sm-8 col-md-8 col-8">
                                          <div class="audio-mid-big-m-ply">
                                            <h3>{AudioData?.title}</h3>
                                            <p>Dr Sumer Sethi </p>
                                          </div>
                                        </div>

                                        <div class="col-lg-2 col-sm-2 col-md-2 col-2  text-right">
                                          <ul>
                                            <li>
                                              <a
                                                onClick={() =>
                                                  setAudioStatus(false)
                                                }
                                              >
                                                <i
                                                  class="fa fa-close"
                                                  aria-hidden="true"
                                                  style={{}}
                                                ></i>
                                              </a>
                                            </li>
                                          </ul>
                                        </div>

                                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                                          <div class="player paused">
                                            <div class="row"></div>
                                            <audio
                                              id="audio"
                                              class="audio182"
                                              prelaod=""
                                              src={AudioData?.audio_url}
                                              // autoPlay
                                              controls
                                              controlsList="nodownload"
                                            >
                                              {" "}
                                            </audio>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {podCastdata.length === 0 ? (
                                  <p>No order found</p>
                                ) : (
                                  podCastdata.map((latestlist, index) => (
                                    <div className="col-lg-6 col-xl-4 col-sm-6 col-md-6 col-12">
                                      <div className="allpodcast-group">
                                        <div className="row">
                                          <div className="col-lg-2 col-sm-2 col-md-2 col-2">
                                            <div className="audio-img">
                                              <img
                                                src="https://d2enu63wt1sf3u.cloudfront.net/profile_images/381909_1703072371367_image.jpg"
                                                alt=""
                                                style={{ borderRadius: "50%" }}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6 col-sm-6 col-md-6 col-6">
                                            <div className="audio-mid">
                                              <h3>{latestlist.title}</h3>
                                              <p>
                                                {latestlist.created_by}
                                                <span
                                                  className="new-btn"
                                                  style={{ display: "none" }}
                                                >
                                                  New
                                                </span>
                                                <span
                                                  className="dwof"
                                                  id="downld182"
                                                  style={{ display: "none" }}
                                                >
                                                  <Link
                                                    to={""}
                                                    href="javascript:void(0)"
                                                  >
                                                    Downloaded Offline
                                                  </Link>
                                                </span>
                                              </p>
                                              <ul>
                                                <li>
                                                  <Link
                                                    to={""}
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    className="bookmk"
                                                  >
                                                    <i
                                                      style={{
                                                        color: "#071952",
                                                      }}
                                                      className={
                                                        latestlist?.is_bookmarked
                                                          ? "fa fa-bookmark bokmrk"
                                                          : "fa fa-bookmark-o bokmrk2"
                                                      }
                                                      onClick={(e) => {
                                                        bookmarkEvent(
                                                          latestlist.id,
                                                          latestlist.is_bookmarked
                                                        );
                                                      }}
                                                    ></i>
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Tooltip title="This feature is only available in the App">
                                                    <a
                                                      href="#"
                                                      onClick={(e) => {
                                                        e.preventDefault(); // Prevent the default action of the link
                                                      }}
                                                    >
                                                      <img
                                                        id="undo"
                                                        style={{
                                                          cursor: "pointer",
                                                          marginLeft: "1px",
                                                        }}
                                                        data-id="182"
                                                        data-user="384460"
                                                        src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/download.svg"
                                                        alt="Download Icon"
                                                      />
                                                    </a>
                                                  </Tooltip>
                                                </li>
                                                <li>
                                                  <Link to={""} href="">
                                                    <img
                                                      id="done"
                                                      className="del182"
                                                      src="#"
                                                      alt=""
                                                    />{" "}
                                                  </Link>
                                                </li>
                                                <li
                                                  style={{ fontSize: "10px" }}
                                                >
                                                  <img src="https://dams-apps-production.s3.ap-south-1.amazonaws.com/course_file_meta/445755Path_12997.png" />
                                                  <span className="play1">
                                                    Total Play{" "}
                                                  </span>{" "}
                                                  {latestlist.created_by}
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="col-lg-4 col-sm-4 col-md-4 col-4 pd-left">
                                            <div className="song-time">
                                              <div className="play">
                                                <a
                                                  onClick={() =>
                                                    handleAudioData(latestlist)
                                                  }
                                                  data-playerid="182"
                                                  className="ppbutton fa fa-play ply182"
                                                  data-src="https://d2enu63wt1sf3u.cloudfront.net/doc_folder/381909_1703072352208_audio.wav"
                                                ></a>
                                              </div>
                                              <h5>
                                                {" "}
                                                DURATION{" "}
                                                {formatTime(
                                                  latestlist.duration
                                                ).split("00:")}
                                              </h5>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p></p>
                        )}
                      </div>
                    )}

                    <div className="tab-pane">
                      <div className="row"></div>
                    </div>
                    <div className="tab-pane">
                      <div className="row">
                        <div
                          className="col-lg-12 col-sm-12 col-md-12 col-12 plyr"
                          id="hide_three180"
                          style={{ display: "none" }}
                        >
                          <div
                            id="menu_three180"
                            className="allpodcast-group-big-music-plyr menu1"
                          >
                            <div className="row">
                              <div className="col-lg-1 col-sm-2 col-md-2 col-2">
                                <div className="audio-img-big-m-ply">
                                  <img
                                    src="https://d2enu63wt1sf3u.cloudfront.net/profile_images/0F6BF47E-EE2A-4E2A-BF69-2AD13D37C2AD-772-0000004E963D9C62.png"
                                    alt=""
                                    style={{ borderRadius: "50%" }}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-9 col-sm-8 col-md-8 col-8">
                                <div className="audio-mid-big-m-ply">
                                  <h3>True voice quiz</h3>
                                  <p>
                                    Fahim{" "}
                                    <span
                                      className="new-btn-big-m-plyr"
                                      style={{ display: "none" }}
                                    >
                                      New
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-2 col-sm-2 col-md-2 col-2  text-right">
                                <ul>
                                  <li>
                                    <Link to={""}>
                                      <i
                                        className="fa fa-close"
                                        aria-hidden="true"
                                        style={{}}
                                      ></i>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane"
                        id="author-podcast-data"
                        role="tabpanel"
                        aria-labelledby="podcast-my-library"
                      >
                        <div className="row">
                          <div
                            className="col-lg-12 col-sm-12 col-md-12 col-12"
                            id="hide1"
                            style={{ display: "block" }}
                          >
                            <div
                              id="menu1"
                              className="allpodcast-group-big-music-plyr menu1"
                            >
                              <div className="row">
                                <div className="col-lg-1 col-sm-2 col-md-2 col-2">
                                  <div className="audio-img-big-m-ply">
                                    <img
                                      src=""
                                      alt=""
                                      style={{ borderRadius: "50%" }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-9 col-sm-8 col-md-8 col-8">
                                  <div className="audio-mid-big-m-ply">
                                    <h3></h3>
                                    <p>
                                      <span
                                        className="new-btn-big-m-plyr"
                                        style={{ display: "none" }}
                                      >
                                        New
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-lg-2 col-sm-2 col-md-2 col-2  text-right">
                                  <ul>
                                    <li>
                                      <Link to={""}>
                                        <i
                                          className="fa fa-close"
                                          aria-hidden="true"
                                          style={{}}
                                        ></i>
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                                <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                                  <div className="player paused">
                                    <div className="info">
                                      <div className="time">
                                        <span className="current-time">
                                          0:00
                                        </span>
                                        <span className="progress">
                                          <span></span>
                                        </span>
                                        <span className="duration">
                                          02:17:36
                                        </span>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-lg-2 col-sm-12 col-md-12 col-12">
                                        <div className="dropdown">
                                          <button
                                            id="options1"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                            role="button"
                                            className="btn btn-secondary dropdown-toggle btndropdown"
                                            type="button"
                                            data-toggle="dropdown"
                                            style={{
                                              backgroundColor: "#636363",
                                            }}
                                          >
                                            Speed 1X
                                            <span className="caret"></span>
                                          </button>
                                          <ul
                                            id="setting"
                                            className="dropdown-menu"
                                          >
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(1)"
                                                type="button"
                                              >
                                                Speed 1x
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(1.2)"
                                                type="button"
                                              >
                                                Speed 1.2x
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(1.5)"
                                                type="button"
                                              >
                                                Speed 1.5x
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(1.7)"
                                                type="button"
                                              >
                                                Speed 1.7x
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(2)"
                                                type="button"
                                              >
                                                Speed 2x
                                              </button>
                                            </li>
                                            <li>
                                              <button
                                                data-playerspeedid1=""
                                                onclick="setPlaySpeed1(3)"
                                                type="button"
                                              >
                                                Speed 3x
                                              </button>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="col-lg-8 col-sm-12 col-md-12 col-12">
                                        <div className="actions">
                                          <button className="">
                                            <img
                                              onclick="rewindAudio();"
                                              src="https://dev.emedicoz.com/qa/emedicoz-website/assets/images/podcast/backward.png"
                                              alt=""
                                              className="bwd"
                                            />
                                          </button>
                                          <button className="button play-pause">
                                            <div className="arrow"></div>
                                          </button>
                                          <button className="">
                                            <img
                                              onclick="forwardAudio();"
                                              src="https://dev.emedicoz.com/qa/emedicoz-website/assets/images/podcast/forward.png"
                                              alt=""
                                              className="fwd"
                                            />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="col-lg-2 col-sm-12 col-md-12 col-12">
                                        <button
                                          id="mute"
                                          type="button"
                                          style={{
                                            marginTop: "3px",
                                            marginLeft: "-8px",
                                          }}
                                        ></button>
                                      </div>
                                    </div>
                                    <audio
                                      prelaod=""
                                      className="audio"
                                      src=""
                                      controlsList="nodownload"
                                    ></audio>
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Ovalpodcast;

// import React from "react";
import "../../assets/css/shortcodes/shortcodes.css";
import "../../assets/css/signIn-pop/style.css";
import "../../assets/newjs/style.css";
import "../../assets/newjs/responsive.css";
import React, { useState, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import axiosInstance from "../../API/axiosConfig";
import { FaClipboard, FaHeart, FaThumbsUp } from "react-icons/fa";
import { notification } from "antd";

const NewsArticledetails = () => {
  const { id } = useParams();

  const userid = sessionStorage.getItem("id")
    ? sessionStorage.getItem("id")
    : 4;
  const [newarticel, setnewart] = useState(null);

  // Begin: pop up code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [countAdd, setCountAdd] = useState(null);
  const [isfav, setisfav] = useState(null);

  console.log(countAdd);

  const getCalled = async () => {
    axiosInstance
      .post(
        `/v1_data_model/courses/News_articles/get_articles_detail`,
        {
          user_id: userid,
          article_id: id,
        }
      )
      .then((response) => {
        setisfav(response?.data?.data?.user_bookmark)
        console.log(response?.data?.data);
        setnewart(response?.data?.data?.article);
        setCountAdd(response?.data?.data?.user_like);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  // End: pop up code

useEffect(() => {
    if (id) {
      getCalled();
    }
  }, [userid]);

  const handleLike = async (num) => {

    await axiosInstance.post(
      "v1_data_model/courses/News_articles/update_like_bookmark_status",
      {
        article_id: newarticel?.article_id,
        user_id: userid,
        is_bookmarked: "",
        type: newarticel?.type,
        is_liked: num,
      }
    );
    notification.open({
      message: (
        <span>
          <FaThumbsUp style={{ marginRight: "8px" }} />
          <span>{countAdd === "0" ? "Liked" : "Disliked"}</span>
        </span>
      ),
      duration: 2,
      placement: "bottom",
      // Duration in seconds
    });
    getCalled();
  };

  const handleFav = async (num) => {
    await axiosInstance.post(
      "v1_data_model/courses/News_articles/update_like_bookmark_status",
      {
        article_id: newarticel?.article_id,
        user_id: userid,
        is_bookmarked: num,
        type: newarticel?.type,
      }
    );
    notification.open({
      message: (
        <span>
          <FaHeart style={{ marginRight: "8px" }} />
          <span>{isfav == "0" ? "added to favourite" : "removed from favourite"}</span>
        </span>
      ),
      duration: 2,
      placement: "bottom",
      // Duration in seconds
    });
    getCalled();
  };

  const HandleShare = () => {
    const textToCopy = `https://emedicoz.com/news-article/${id}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notification.open({
          message: (
            <span>
              <FaClipboard style={{ marginRight: "8px" }} />
              <span>Link copied to clipboard!</span>
            </span>
          ),
          duration: 2,
          placement: "bottom",
          // Duration in seconds
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const formatSecondsToDate = (seconds) => {
    if (seconds) {
      // Create a new Date object using the seconds
      const date = new Date(Number(seconds));

      // Define options for formatting the date
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      };

      // Format the date
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      // Return the formatted date string
      return formattedDate;
    }
  };

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // }, []);

  return (
    <div className="NewsArticle">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="/">Home</a>
              </li>
              <li>Articles</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="article-full">
        <div className="container">
          <div className="sectionBorder">
            <div className="row">
              <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                <h1>{newarticel?.title}</h1>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                <div className="articles-share-group">
                  <ul>
                    <p id="p1" style={{ display: "none" }}>
                      news-and-article/375
                    </p>

                    <li>
                      <Link to={"#"} className="reed" onClick={HandleShare}>
                        <em className="fa fa-share"></em> Share
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={"#"}
                        className="reed"
                        onClick={() => handleLike(countAdd === "0" ? 0 : 1)}
                      >
                        {countAdd==1?<span><FaThumbsUp color="red"/> Liked</span>:<span><FaThumbsUp/> Like</span>}
                        
                      </Link>
                     
                    </li>
                    <span style={{ display: "none" }} id="book">
                      375
                    </span>
                    <li>
                      <Link to={"#"} className="reed"  onClick={() => handleFav(isfav == "0" ? 0 : 1)}>
                        {" "}
                        {isfav==1?<FaHeart color="red"/>:<FaHeart/>}
                        &nbsp; Favourite
                      </Link>
                   
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-3 col-6">
                <div className="article-views-group">
                  <img
                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/News-Article/total-view.png"
                    alt="img-1"
                  />
                  <h5>
                    Total Views:
                    <br />
                    <span>{newarticel?.views}</span>
                  </h5>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-6">
                <div className="article-views-group">
                  <img
                    className="bg1"
                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/News-Article/total-like.png"
                    alt="img-1"
                  />
                  <h5>
                    Total Likes:
                    <br />
                    <span>{newarticel?.likes}</span>
                  </h5>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-6">
                <div className="article-views-group">
                  <img
                    className="bg2"
                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/News-Article/publish_by.png"
                    alt="img-1"
                  />
                  <h5>
                    Published By:
                    <br />
                    <span>{newarticel?.created_by}</span>
                  </h5>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-6">
                <div className="article-views-group">
                  <img
                    className="bg3"
                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/News-Article/publish-on.png"
                    alt="img-1"
                  />
                  <h5>
                    Published On:
                    <br />
                    <span>
                      {formatSecondsToDate(Number(newarticel?.creation_date))}
                    </span>
                  </h5>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-lg-12 col-12">
                <div className="article-pehragraph">
                  <div
                    dangerouslySetInnerHTML={{ __html: newarticel?.content }}
                  />
                  <figure className="image">
                    {/* <img src={newarticel?.image} /> */}
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Begin: Model Code  */}
      <Modal show={show} onHide={handleClose} className="articlemsg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="content">
          <p>
            eMedicoz.com says
            <br />
            copyed Url
          </p>
          <button
            className="btn bg-primary text-white float-right"
            onClick={NewsArticledetails}
          >
            OK
          </button>
        </Modal.Body>
      </Modal>
      <Modal show={show1} onHide={handleClose1} className="articlemsg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="content">
          <div className="text-center">
            <img
              src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/login_logo.png"
              alt=""
            />
            <p className="tectbg">THIS FEATURE IS AVAILABLE FOR APP ONLY</p>
          </div>

          <div className="app-imgBg text-center">
            <Link
              target="_blank"
              to={"https://itunes.apple.com/us/app/emedicoz/id1263112084?mt=8"}
            >
              {" "}
              <img
                src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/newjs/img/about/77-layersand.png"
                alt=""
              />
            </Link>
            <Link
              target="_blank"
              to={
                "https://play.google.com/store/apps/details?id=com.emedicoz.app&amp;hl=en"
              }
            >
              {" "}
              <img
                src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/newjs/img/about/77-layers.png"
                alt=""
              />
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      {/* End: Model Code  */}
    </div>
  );
};

export default NewsArticledetails;

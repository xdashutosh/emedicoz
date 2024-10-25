import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import {
  FaArrowRight,
  FaClipboard,
  FaComment,
  FaEye,
  FaInfo,
  FaPlay,
  FaShare,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import { Avatar, notification } from "antd";

const YoutubeModal = ({
  show,
  onHide,
  videoUrl,
  title,
  likes,
  views,
  vid,
  catid,
  isLikeStatus,
}) => {
  const user_id = sessionStorage.getItem("id");

  const [showCom, setshowCom] = useState(false);
  const [comtext, setcomText] = useState(null);
  const [comList, setcomList] = useState([]);
  const [likeStatus, setLikeStatus] = useState(isLikeStatus); // Track like/dislike status
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const preventInspect = (event) => {
      if (
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
        (event.ctrlKey && event.keyCode === 73)
      ) {
        // Ctrl+I
        event.preventDefault();
      }
    };

    window.addEventListener("contextmenu", preventContextMenu);
    window.addEventListener("keydown", preventInspect);

    return () => {
      window.removeEventListener("contextmenu", preventContextMenu);
      window.removeEventListener("keydown", preventInspect);
    };
  }, []);

  useEffect(() => {
    if (isLikeStatus !== null) {
      setLikeStatus(isLikeStatus); // Initialize likeStatus when isLikeStatus is available
    }
  }, [isLikeStatus]); // This useEffect runs whenever isLikeStatus changes

  useEffect(() => {
    console.log("isLikeStatus:", isLikeStatus);
    console.log("likeStatus:", likeStatus);
  }, [isLikeStatus, likeStatus]);

  useEffect(() => {
    if (likes != 0) {
      setLikeCount(Number(likes)); // Initialize likeStatus when isLikeStatus is available
    }
  }, [likes]); // This useEffect runs whenever isLikeStatus changes

  const toggleLike = async () => {
    try {
      const newLikeStatus = likeStatus == 1 ? 0 : 1; // Toggle between liked and not liked
      const res = await axiosInstance.post(
        "v1_data_model/podcasts/Podcast_view/add_update_like",
        {
          user_id,
          is_like: newLikeStatus,
          video_id: vid,
        }
      );

      if (res.status === 200) {
        setLikeStatus(newLikeStatus); // Update like status
        setLikeCount((prevCount) =>
          newLikeStatus == 1 ? prevCount + 1 : prevCount - 1
        ); // Adjust like count

        notification.open({
          message: (
            <span>
              <FaClipboard style={{ marginRight: "8px" }} />
              <span>
                {newLikeStatus === 1
                  ? "Liked the video!"
                  : "Disliked the video!"}
              </span>
            </span>
          ),
          duration: 2,
          placement: "bottom",
        });
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const handleComment = async () => {
    const res = await axiosInstance.post(
      "v1_data_model/podcasts/Podcast_view/podcast_addupdate_video_comment",
      {
        user_id: user_id,
        comment: comtext,
        video_id: vid,
        pvideo_id: catid,
      }
    );

    setcomList(res?.data?.data?.comment_list.reverse());
  };

  const HandleShare = () => {
    const textToCopy = `https://emedicoz.com/video/${encodeURIComponent(
      videoUrl
    )}`;
    // const textToCopy = `${videoUrl}`;
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
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      // Set the size of the modal to large
      className="closeBtn"
    >
      <Modal.Header closeButton />
      <Modal.Title
        style={{ padding: "10px 15px 0px", fontSize: "17px !important" }}
      >
        {title}
      </Modal.Title>
      <Modal.Body>
        {" "}
        {/* Set the height to 70% of viewport height */}
        <div className="embed-responsive embed-responsive-16by9">
          <video src={videoUrl} controls autoplay controlsList="nodownload" />
        </div>
        <div className="likeComment">
          <div className="view">
            <h6>{views}</h6>
            <FaEye />
          </div>
          <div className="likeBg">
            <h6>{likeCount}</h6>
            <FaThumbsUp
              style={{
                color: likeStatus == 1 ? "darkblue" : "gray",
                cursor: "pointer",
              }}
              onClick={toggleLike}
            />
          </div>
          <div className="comment">
            <h6></h6>
            <FaComment onClick={() => setshowCom(!showCom)} />
          </div>
          <div className="share">
            <h6 className=""></h6>
            <FaShare onClick={HandleShare} />
          </div>
        </div>
        {showCom && (
          <>
            <div className="d-flex">
              <input
                value={comtext}
                onChange={(e) => setcomText(e.target.value)}
                className="rounded"
                placeholder="write your comment..."
                style={{ padding: "2px", width: "100%" }}
              />
              <button
                onClick={handleComment}
                className="btn-primary p-2 m-2 rounded"
              >
                Done
              </button>
            </div>
            {comList?.map((data) => (
              <div
                className="d-flex align-center p-1 m-2 "
                style={{ borderTop: "0.5px solid gray" }}
              >
                <Avatar src={data?.profile_picture} />

                <h6 style={{ marginInline: "10px" }}>{data?.comment}</h6>
                <p style={{ fontSize: "10px" }}>
                  <b>By:</b>
                  {data?.username}
                </p>
              </div>
            ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

const Lounge = () => {
  const user_id = sessionStorage.getItem("id");
  const { id } = useParams();
  const [videoData, setvidData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setTitle] = useState("");
  const [likes, setlikes] = useState(0);
  const [views, setviews] = useState(0);
  const [Vid, setvid] = useState(null);
  const [CatId, setCatId] = useState(null);
  const [likestatus, setlikestatus] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getAllCat = async () => {
      const response = await axiosInstance.post(
        `/v1_data_model/unique_selling_point/usp/podcast_video_listv2`,
        { user_id: user_id, id: id }
      );
      console.log(response);
      if (response.status) {
        setvidData(response?.data?.data);
      }
    };
    getAllCat();
  }, [showModal]);

  const handleClose = () => setShowModal(false);
  const handleShow = (url, tit, like, view, vid, cid, isliked) => {
    setVideoUrl(url);
    setTitle(tit);
    setShowModal(true);
    setlikes(like);
    setviews(view);
    setvid(vid);
    setCatId(cid);
    setlikestatus(isliked);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="Lounge">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            {/* <ul className="list-inline">
                    <li><a href={'/'}>Home</a></li>
                    <li>Quizzes & Events</li>
                </ul> */}
          </div>
        </div>
      </div>
      <div className="All-LoudgeData">
        <div className="container">
          <h2>{videoData[0]?.category}</h2>
          <Row>
            {videoData?.map((itm, index) => (
              <Col key={index} sm={12} md={6} lg={4}>
                <div
                  className="videotextData"
                  style={{}}
                  onClick={() =>
                    handleShow(
                      itm.video,
                      itm.video_title,
                      itm.total_like,
                      itm.total_views,
                      itm.id,
                      itm.cat_id,
                      itm?.is_like
                    )
                  }
                >
                  <h5>{itm.video_title}</h5>
                  <img
                    className="loudgeImg"
                    src={itm.icon}
                    alt="Video Banner"
                    style={{}}
                  />
                  <div className="videoInner" style={{}}>
                    <FaPlay
                      size={20}
                      color="white"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <YoutubeModal
            show={showModal}
            onHide={handleClose}
            videoUrl={videoUrl}
            title={videoTitle}
            vid={Vid}
            catid={CatId}
            likes={likes}
            views={views}
            isLikeStatus={likestatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Lounge;

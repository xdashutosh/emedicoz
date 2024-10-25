import React, { useState, useEffect } from "react";
import Banner from "../../components/banner/Banner";
import Coursesclassroom from "../../components/classroomCourses/Coursesclassroom";
import Findcourses from "../../components/findcourses/Findcourses";
import Courses from "../../components/course/Courses";
import Topperszone from "../../components/ToppersZone/ToppersZone";
import GetTheApp from "../../components/getTheApp/GetTheApp";
import ImpactAtscale from "../../components/Impactscale/ImpactAtscale";
import Storiesinspire from "../../components/StoriesThatInspire/Storiesinspire";
import LatestNewsArticles from "../../components/LatestNews/LatestNewsArticles";
import EMedicozFeatured from "../../components/eMedicozFeatured/EMedicozFeatured";
import Dailyquiz from "../../components/DailyQuiz/Dailyquiz";
import axiosInstance from "../../API/axiosConfig";
import { Spinner } from "react-bootstrap";
import DoctorLounge from "../../components/DoctorLounge/DoctorLounge";
import { useLocation } from "react-router-dom";
import SharedItem from "../Ecommerce/Component/SharedItem";
import { Modal } from "antd";
import "../Homepage/style.css";
import leadthanks from "./leadthanks.svg";
import { toast } from "react-toastify";
import SharedCat from "../../components/course/SharedCat";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Homepage = ({ isAuthenticated, setIsAuthenticated }) => {
  const query = useQuery();
  const bookId = query.get("book_id");
  const catId = query.get("cat_id");

  const user_id = sessionStorage.getItem("id");
  const creId = sessionStorage.getItem("is_course_register");
  const [allData, setAllData] = useState({
    videoData: null,
    homeData: null,
    inspire: null,
    dailyQuiz: [],
  });
  // console.log(allData)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dynamicData, setDynamicData] = useState({
    leaderShip: [],
    multiFeatureApp: [],
    speacialCourse: [],
    premiumAppBase: [],
    omniChannel: [],
    bestRevistion: [],
    panIndiaFace: [],
    category: [],
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // console.log(allData);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const user_data = user_id ? user_id : 4;

  const fetchDataAfterComponentRender = async () => {
    try {
      const resOne = await axiosInstance.post(
        `/v1_data_model/video/Video_channel/get_web_video`,
        { user_id: user_data }
      );
      const resTwo = await axiosInstance.post(
        `/v1_data_model/courses/Home/get_homescreen_myplan`,
        { user_id: user_data }
      );

      const resThree = await axiosInstance.post(
        `/v1_data_model/banner/Banner/get_banner`
      );
      setAllData({
        videoData: resOne?.data?.data,
        homeData: resTwo?.data?.data,
        inspire: resThree?.data?.data,
        dailyQuiz: resTwo?.data?.data?.daily_quiz,
      });
      setIsLoading(false); // Set loading to false after data fetch
    } catch (err) {
      console.log(err);
    }
  };

  const getDynamicHandlerForHomeScreen = async () => {
    try {
      const { data } = await axiosInstance.post(
        "/v1_data_model/getDynamicWebData"
      );

      // console.log("Dynamic->",data.data)
      if (data.status === true) {
        setDynamicData({
          bestRevistion: data?.data?.bestRevisionCourses,
          leaderShip: data?.data?.leader_ship,
          multiFeatureApp: data?.data?.multi_feature_app,
          speacialCourse: data?.data?.spacel_course_available,
          premiumAppBase: data?.data?.premium_app_based_learning,
          omniChannel: data?.data?.omniChannelPresence,
          panIndiaFace: data?.data?.panIndiafacetoFace,
          category: data?.data?.Categories,
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataAfterComponentRender();
    getDynamicHandlerForHomeScreen();
  }, []);

  useEffect(() => {
    if (isModalOpen === true) {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  }, [isModalOpen]);

  return (
    <>
      {bookId ? (
        <SharedItem setIsAuthenticated={setIsAuthenticated} bookid={bookId} />
      ) : catId ? (
        <SharedCat setIsAuthenticated={setIsAuthenticated} catid={catId} />
      ) : (
        <div>
          {isLoading ? (
            <div
              style={{
                height: "100vh",
                width: "132px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
              }}
            >
              <Spinner
                style={{
                  width: "100px",
                  height: "100px",
                }}
              />
            </div>
          ) : (
            <>
              <Banner
                inspire={allData?.inspire}
                setIsModalOpen={setIsModalOpen}
                setIsAuthenticated={setIsAuthenticated}
                dynamicData={dynamicData}
              />
              <Coursesclassroom />
              <Findcourses />
              <Courses
                data={allData?.homeData?.category}
                isAuthenticated={isAuthenticated}
              />
              {creId === "1" ? <Dailyquiz dailyQuizData={allData} /> : null}
              <DoctorLounge />
              <Topperszone />
              <GetTheApp />
              <ImpactAtscale />
              <Storiesinspire videoData={allData?.videoData} />

              <LatestNewsArticles
                newzData={allData?.homeData?.latest_article_and_news}
              />
              <EMedicozFeatured />
            </>
          )}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="leadPopup">
          <img src={leadthanks}></img>
          <h3>Thank You!</h3>
          <p>Your request has been received.</p>
          <h4>We will be in touch and contact you soon!</h4>
        </div>
      </Modal>
    </>
  );
};

export default Homepage;

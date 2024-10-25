import React, { useEffect, useState } from "react";
import { CiViewList, CiTimer } from "react-icons/ci";
import { RiBodyScanLine } from "react-icons/ri";
import axiosInstance from "../../../API/axiosConfig";
import { useLocation } from "react-router-dom";
import { Avatar, Button, List, Modal, Spin, Table } from "antd";
import "../new/style.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { toast } from "react-toastify";

const AllDailyQuiz = () => {
  const location = useLocation();
  const [loading, setLoading] = useState([]);
  const [isatm, setatm] = useState([]);
  const [allData, setAllData] = useState({
    daily_quiz: [],
  });
  const [topFive, setTopFive] = useState([]);
  const [drawerModal, setDrawerModal] = useState(false);
  const [arrModal, setArrModal] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);
  const [arrLoading, setArrLoading] = useState(false);
  const [arrData, setArrData] = useState([]);
  const arr = [
    {
      name: "My Attempt",
      img: `${window.IMG_BASE_URL}/type.svg`,
      value: "MyAttempt",
    },
    {
      name: "Archives",
      img: `${window.IMG_BASE_URL}/type.svg`,
      value: "Archives",
    },
    {
      name: "Scorecard",
      img: `${window.IMG_BASE_URL}/type.svg`,
      value: "Scorecard",
    },
  ];
  const [availableArr, setAvailableArr] = useState([]);

  const getRankFunction = async (da) => {
    try {
      const { data } = await axiosInstance.post(
        "/v1_data_model/courses/test_series/get_test_series_daily_quiz_basic_result_vc",
        {
          user_id: location?.state,
          date: da,
          // date: "2024-08-21",
        }
      );
      console.log(data);
      if (data.status === true) {
        setAvailableArr(data?.data);
      } else {
        setAvailableArr([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTopThree = async (id) => {
    try {
      const { data } = await axiosInstance.post(
        "/v1_data_model/courses/Test_series_result/get_top_100",
        {
          user_id: location?.state,
          test_series_id: id,
        }
      );

      setTopFive(data.data);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
      const day = String(today.getDate()).padStart(2, "0");
      // console.log(`${year}-${month}-${day}`);
      getRankFunction(`${year}-${month}-${day}`);
      setMainLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getHomeScreenAPI = async () => {
    try {
      setMainLoading(true);
      const { data } = await axiosInstance.post(
        "/v1_data_model/courses/Home/get_homescreen_data",
        {
          user_id: location?.state,
        }
      );
      if (data.status === true) {
        setAllData({
          daily_quiz: data.data.daily_quiz,
        });
        console.log(data.data.daily_quiz);
        let arr1 = data?.data?.daily_quiz?.filter(
          (data) => data.segment_id == 0
        );
        setatm(arr1);
        // console.log(arr1)
        getTopThree(data?.data?.daily_quiz[0]?.id);
      }
    } catch (error) {
      console.log(error);
      setMainLoading(false);
    }
  };

  const convertTimestampToDate = (timestamp) => {
    // Convert Unix timestamp to milliseconds
    const date = new Date(timestamp * 1000);

    // Format the date as "DD MMM YYYY"
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const formatTime = (seconds) => {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros if needed
    if (hrs < 10) hrs = "0" + hrs;
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;

    return `${hrs}:${mins}:${secs}`;
  };

  const convertTime = (milliseconds) => {
    const date = new Date(parseInt(milliseconds));

    const hrs = date.getUTCHours();
    const mins = date.getUTCMinutes();
    const secs = date.getUTCSeconds();

    // Format the time components to have at least two digits
    const hours = hrs.toString().padStart(2, "0");
    const minutes = mins.toString().padStart(2, "0");
    const seconds = secs.toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    getHomeScreenAPI();
  }, []);

  const columns = [
    {
      title: "Rank",
      render: (text, record, index) => index + 1,
      key: "rank",
    },
    {
      title: "Learner",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Time",
      dataIndex: "time_spent",
      key: "time_spent",
      render: (text) => formatTime(text),
    },
    {
      title: "Right",
      dataIndex: "correct_count",
      key: "correct_count",
      render: (text, record) => (
        <div style={{ width: "150px" }}>
          <div style={{ color: "green" }}>Right: {record.correct_count}</div>
          <div style={{ color: "red" }}>Wrong: {record.incorrect_count}</div>
          <div style={{ color: "grey" }}>Skipped: {record.non_attempt}</div>
        </div>
      ),
    },
  ];

  const handleStart = (testid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

      // Open the new window
      window.open(
        `/test-home/dqb/${location.state}s${testid}`,
        "_blank",
        features
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleReview = (sid) => {
    try {
      const width = screen.availWidth;
      const height = screen.availHeight;
      const left = 0;
      const top = 0;
      const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

      // Open the new window
      window.open(
        `/testresult/dqb/${location.state}s${sid}`,
        "_blank",
        features
      );
    } catch (error) {
      console.log(error);
    }
  };

  const closeArr = () => {
    setArrData([]);
    setArrModal(false);
  };

  const getCalledArr = async (id) => {
    try {
      setArrLoading(true);
      const { data } = await axiosInstance.post(
        "/v1_data_model/courses/Dailyquiz/get_list",
        {
          user_id: location?.state,
          last_id: 0,
          complete: id,
        }
      );
      if (data.status === true) {
        setArrData(data.data);
        setArrLoading(false);
      } else {
        setArrData([]);
        setArrLoading(false);
      }
    } catch (error) {
      console.log(error);
      setArrLoading(false);
    }
  };

  useEffect(() => {
    if (arrModal === "MyAttempt") {
      getCalledArr(1);
    } else if (arrModal === "Archives") {
      getCalledArr("");
    } else if (arrModal === "Scorecard") {
      // setDrawerModal(true)
      // setArrModal(false)
    }
  }, [arrModal]);

  const handleCheck = () => {
    // console.log(availableArr[0]);
    if (availableArr[0]?.test_segment_id.length === 0) {
      toast.error("Please attempt today's daily challenge to get the result");
    } else {
      console.log(availableArr[0]?.test_segment_id);
      handleReview(availableArr[0]?.test_segment_id);
    }
  };

  return (
    <>
      <div className="container">
        {mainLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40vh",
            }}
          >
            <Spin />
          </div>
        ) : (
          <div className="DailyData">
            <div className="dailyInner">
              <div className="dialybanner">
                <div className="textWidth">
                  <h4>Today's Daily Challenge</h4>
                  <span className="playbtn">
                    {isatm?.length > 0 ? (
                      <Button onClick={() => handleStart(isatm[0]?.id)}>
                        Play Now
                      </Button>
                    ) : (
                      <Button>Attempted</Button>
                    )}
                  </span>
                </div>
                <div className="imgbanner">
                  <img src={`${window.IMG_BASE_URL}/comp.svg`} width="100%" />
                </div>
              </div>

              <div className="dailyMiddle">
                {allData?.daily_quiz?.map((itm, i) => (
                  <div className="middleInner" key={i}>
                    <div className="Innersec">
                      <div className="topic">
                        <img src={`${window.IMG_BASE_URL}/anatomy-icon.png`} />
                        <RiBodyScanLine />
                        <div className="totalTopic">
                          <i>Topic</i>
                          <b>{itm?.test_series_name}</b>
                        </div>
                      </div>
                      <span>
                        {convertTimestampToDate(itm?.test_start_date)}
                      </span>
                    </div>
                    <div className="belowSec">
                      <div className="bottominner">
                        <CiViewList />
                        <img src={`${window.IMG_BASE_URL}/qa-icon.png`} />
                        <div className="bottomData">
                          <i>{itm?.total_questions}</i>
                          <b>Total no of questions</b>
                        </div>
                      </div>
                      <div className="bottomData1">
                        <img src={`${window.IMG_BASE_URL}/watch-icon.png`} />
                        <div className="para">
                          <p className="m-0" style={{ fontWeight: "600" }}>
                            {itm?.time_in_mins} min
                          </p>
                          <p className="m-0">Duration</p>
                        </div>
                      </div>
                    </div>
                    <div className="btnData">
                      {itm?.segment_id &&
                        itm?.segment_id != "" &&
                        itm?.segment_id != 0 ? (
                        <button
                          onClick={() => handleReview(itm?.segment_id)}
                          style={{
                            background: "dodgerblue",
                            color: "white",
                            padding: "0px 14px",
                            borderRadius: "4px",
                          }}
                        >
                          Already Attempted
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStart(itm?.id)}
                          style={{
                            background: "gray",
                            color: "white",
                            padding: "0px 14px",
                            borderRadius: "4px",
                          }}
                        >
                          Start Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="middleSecData">
                <span>
                  <i>Today's Leaderboard</i>
                </span>
                <div className="middlepart">
                  {topFive?.slice(0, 3).map((itm, i) => (
                    <div className="middleInner" key={i}>
                      <img
                        src={
                          itm.profile_picture === ""
                            ? `${window.IMG_BASE_URL}/no.svg`
                            : itm?.profile_picture
                        }
                        width="25%"
                        style={{ borderRadius: "50%", height: "60px" }}
                      />

                      <div
                        style={{
                          background: "#46a3f9",
                          width: "20px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "50%",
                          height: "20px",
                          color: "white",
                          margin: "-10px 0px",
                        }}
                      >
                        {i + 1}
                      </div>
                      {/* <span>{formatTime(itm?.creation_time)}</span> */}
                      <span>{formatTime(itm?.time_spent)}</span>
                      <p>{itm?.name}</p>
                      <p>
                        {itm?.marks}
                        <span className="lightDark">Out of 20</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="showData">
                  <p className="TextData" onClick={() => setDrawerModal(true)}>
                    Show All
                  </p>
                </div>
              </div>

              <div className="Areabanner">
                <div className="imgbb">
                  <img
                    src={`${window.IMG_BASE_URL}/41.svg`}
                    width="100%"
                  />
                </div>
                <div className="viewReport">
                  <h5>Your Rank</h5>
                  <p>View today's report</p>
                  <span onClick={handleCheck} className="viewAll">
                    View All
                  </span>
                </div>
                <div
                  className={
                    availableArr[0]?.test_segment_id.length != "0" &&
                    "roundNumber"
                  }
                >
                  {availableArr[0]?.test_segment_id.length === "0"
                    ? "-"
                    : availableArr[0]?.user_rank}
                </div>
              </div>

              <div className="boxadata">
                {arr?.map((itm, i) => (
                  <div
                    className="boxdataInner"
                    key={i}
                    onClick={() => setArrModal(itm.value)}
                  >
                    <img src={itm?.img} width="30%" />
                    <p>{itm.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        className="detailModel"
        title="Basic Modal"
        open={drawerModal}
        onOk={() => setDrawerModal(false)}
        onCancel={() => setDrawerModal(false)}
      >
        <Table columns={columns} dataSource={topFive} />
      </Modal>

      <Modal
        className="detailModel"
        title={
          arrModal === "MyAttempt"
            ? "My Attempt"
            : arrModal === "Archives"
              ? "Archives"
              : "Scorecard"
        }
        open={arrModal}
        onOk={closeArr}
        onCancel={closeArr}
      >
        {arrLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin />
          </div>
        ) : (
          <>
            {arrModal === "MyAttempt" || arrModal === "Archives" ? (
              <List
                itemLayout="horizontal"
                dataSource={arrData}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <p
                        style={{
                          border:
                            item?.segment_id != "" && item?.segment_id != 0
                              ? "1px solid green"
                              : "1px solid dodgerblue",
                          padding: "0px 10px",
                          borderRadius: "5px",
                          color:
                            item?.segment_id != "" && item?.segment_id != 0
                              ? "green"
                              : "dodgerblue",
                        }}
                      >
                        {item?.segment_id != "" && item?.segment_id != 0 ? (
                          <Button
                            onClick={() => handleReview(item?.segment_id)}
                          >
                            Completed
                          </Button>
                        ) : (
                          <Button onClick={() => handleStart(item?.id)}>
                            Start
                          </Button>
                        )}
                      </p>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        item?.segment_id != "" && item?.segment_id != 0 ? (
                          <FaRegCheckCircle />
                        ) : (
                          <FaRegCirclePlay />
                        )
                      }
                      title={<a href="https://ant.design">{item.dq_title}</a>}
                      description={convertTimestampToDate(item.test_start_date)}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Table columns={columns} dataSource={topFive} />
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default AllDailyQuiz;

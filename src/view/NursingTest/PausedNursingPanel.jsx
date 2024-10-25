import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCircle, FaLock, FaLockOpen, FaPause, FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { Button, ModalBody, Spinner, Tab } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Timeline, notification } from "antd";
import axiosInstance from "../../API/axiosConfig";
import ResetTest from "./ResetTest";
import NoSleep from "nosleep.js";

const customStyles1 = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "10%",
    transform: "translate(-50%, -50%)",
  },
};
const customStyles2 = {
  content: {
    top: "70%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    height:'500px',
    width:'600px',
    transform: "translate(-50%, -20%)",
  },
};


Modal.setAppElement("#root");

const PausedNursingPanel = () => {
  const { id } = useParams();
  const user_id = id.split("t")[0];
  const test_series_id = id.split("t")[1];

  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [tab, setTab] = useState(1);
  const [totaltime, settotaltime] = useState(0);

  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(true);

  const [disableNav, setDisableNav] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [allmarked, setallmarked] = useState([]);

  const [quesArray, setQuesArray] = useState([]);
  const [Attempted, setattempted] = useState(null);
  const [UnAttempted, setunatempted] = useState(null);
  const [marked, setmarked] = useState(null);
  const [sectionArr, setSecArr] = useState([]);
  const [TimeInSec, setTimeInSec] = useState(null);

  const [modalIsOpen1, setIsOpen1] = useState(false);
  const [totQue, settotQue] = useState(0);
  const [LastView, setLastView] = useState(null);
  const [qdump, setquedump] = useState([]);
  const [count, setCount] = useState(0);
  const [quepersec, setquepersec] = useState(0);
  const [DeviceId, setDeviceID] = useState(null);
  const [resultload, setresultload] = useState(true);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Additional logic when online
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Additional logic when offline
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axiosInstance.post(
        `/v1_data_model/test-series/TestSeries/get_test_question_data/`,
        { user_id: user_id, test_series_id: test_series_id }
      );

      const response1 = await axiosInstance.post(
        `/v1_data_model/test-series/TestSeries/nurshing_test_instruction`,
        { user_id: user_id, test_id: test_series_id }
      );
      // console.log(response.data.data)

      setTestData(response?.data?.data);
      console.log("testttttseriesss Nursing ", response?.data);
      console.log(response?.data?.data?.active_ques);
      setTab(Number(response?.data?.data?.active_ques));
      setLastView(response?.data?.data?.active_ques);
      setCount(Number(response?.data?.data?.section_time_spent));
      settotaltime(Number(response?.data?.data?.basic_info?.time_in_mins));

      setTimeLeft(Number(response?.data?.data?.time_spent));
      const questionsArray = Object.values(
        response?.data?.data?.question_bank || {}
      ).map((question) => question.question);
      setQuesArray(questionsArray);
      setquedump(response?.data?.data?.question_dump);

      const multiple = Math.floor(
        Number(response?.data?.data?.active_ques) /
          Number(response1?.data?.data?.section[0]?.no_of_questions)
      );

      console.log(multiple)
      if(Number(response?.data?.data?.active_ques)% Number(response1?.data?.data?.section[0]?.no_of_questions) ==0)
        {
          console.log("same questions")
          setTimeInSec(
            Number(response?.data?.data?.basic_info?.time_in_mins) * 60 -
              Number(response1?.data?.data?.section[0].section_timing) *
                60 *
                (multiple -1)
          );
        }
        else{
          setTimeInSec(
            Number(response?.data?.data?.basic_info?.time_in_mins) * 60 -
              Number(response1?.data?.data?.section[0].section_timing) *
                60 *
                multiple
          );
        }
  
      
    } catch (err) {
      console.log(err);
    }
  };

  const getSec = async () => {
    const response = await axiosInstance.post(
      `/v1_data_model/test-series/TestSeries/nurshing_test_instruction`,
      { user_id: user_id, test_id: test_series_id }
    );
    console.log("Instruction", response?.data?.data);

    setSecArr(response?.data?.data?.section);
    setquepersec(Number(response?.data?.data?.section[0]?.no_of_questions));
    // const timesec = localStorage.getItem(test_series_id);
    // console.log(timesec);
  };

  //  console.log(timeLeft);

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
    fetchdata();
    getSec();
  }, []);

  const [userSelections, setUserSelections] = useState([]);

  const handleNext = () => {
    const currentPartName = testData?.question_bank[tab - 1]?.part_name;
    const nextPartName = testData?.question_bank[tab]?.part_name;
    if (currentPartName == nextPartName) {
      if (tab < testData?.question_bank.length) {
        if (currentPartName != nextPartName) {
          setTimeLeft(
            Number(testData?.question_bank[tab - 1]?.section_timing) * 60
          );
        }

        setTab((prevTab) => prevTab + 1);
      }
    } else {
      notification.open({
        message:
          "All questions from this sections are attempted, once the timer of this section completes you will be taken to the next section.",
        duration: 2, // Duration in seconds
      });
    }
  };

  useEffect(() => {
    setLastView(tab);
    console.log(tab);
  }, [tab]);

  const getNumberOfQuestions = (partName) => {
    const section = sectionArr?.find((sec) => sec.part_name === partName);
    return section ? section.no_of_questions : null;
  };
  useEffect(() => {
    if (tab <= testData?.question_bank.length) {
      console.log(timeLeft)
      if (timeLeft == 0) {
        setCount(0);
        const currentPartName = testData?.question_bank[tab - 1]?.part_name;
        const numberOfQuestions = getNumberOfQuestions(currentPartName);
        const PrevPartName =
          testData?.question_bank[tab - (Number(numberOfQuestions) + 1)]
            ?.part_name;
        const NextPartName =
          testData?.question_bank[tab + (Number(numberOfQuestions) - 1)]
            ?.part_name;
        const numberOfQuestionsPrev = getNumberOfQuestions(PrevPartName);
        if (PrevPartName) {
          settotQue((prevq) => prevq + Number(numberOfQuestionsPrev));
        }

        setTimeInSec(
          (prevtime) =>
            prevtime -
            Number(testData?.question_bank[tab - 1]?.section_timing) * 60
        );
        let tabcounter = sectionArr.length;

        console.log("nextpart", NextPartName, quepersec);

        if (PrevPartName && NextPartName) {
          if (NextPartName == "SEC C" || NextPartName == "Sec C") {
            console.log("section c", Number(quepersec) * 2 + 1);
            setTab(Number(quepersec) * 2 + 1);
            setTimeLeft(
              Number(testData?.question_bank[tab - 1]?.section_timing) * 60
            );
          } else if (NextPartName == "SEC D" || NextPartName == "Sec D") {
            console.log("section d", Number(quepersec) * 3 + 1);
            setTab(Number(quepersec) * 3 + 1);
            setTimeLeft(
              Number(testData?.question_bank[tab - 1]?.section_timing) * 60
            );
          } else if (NextPartName == "SEC E" || NextPartName == "Sec E") {
            console.log("section e", Number(quepersec) * 4 + 1);

            setTab(Number(quepersec) * 4 + 1);
            setTimeLeft(
              Number(testData?.question_bank[tab - 1]?.section_timing) * 60
            );
          }

          // setTab(Number(quepersec)*Math.floor(((Number(tab)/Number(quepersec))))  + 1);
        } else if (!NextPartName) {
          setTimeLeft(0);
        } else {
          console.log("section b", Number(quepersec) * 1 + 1);
          settotQue((prevq) => prevq + Number(numberOfQuestions));
          setTab(Number(numberOfQuestions) + 1);
          setTimeLeft(
            Number(testData?.question_bank[tab - 1]?.section_timing) * 60
          );
        }
      }
    }
  }, [timeLeft]);

  const handlePrev = () => {
    const currentPartName = testData?.question_bank[tab - 1]?.part_name;
    const PrevPartName = testData?.question_bank[tab - 2]?.part_name;

    if (currentPartName == PrevPartName) {
      if (tab > 1) {
        setTab((prevTab) => prevTab - 1);
      }
    } else {
      notification.open({
        message: "Section change is not valid!",
        duration: 2, // Duration in seconds
      });
    }
  };

  const handleOptionClick = (option, optionNo, qid, correctAns) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [tab]: option,
    }));

    const existingIndex = userSelections.findIndex(
      (selection) => selection.qid === qid
    );

    if (optionNo == correctAns) {
    }
    // Prepare the new selection object
    const newSelection = {
      is_correct: optionNo == correctAns ? 1 : 0,
      optionTicked: optionNo,
      qid: qid,
    };

    // If the question ID already exists, update the existing selection
    if (existingIndex !== -1) {
      const updatedSelections = [...userSelections];
      updatedSelections[existingIndex] = newSelection;
      setUserSelections(updatedSelections);
    } else {
      // If the question ID does not exist, add the new selection to the array
      setUserSelections([...userSelections, newSelection]);
    }
  };

  useEffect(() => {
    if (testData && testData.question_dump) {
      const updatedSelectedOptions = {};

      testData.question_dump.forEach((question) => {
        // Extract the question ID and the selected option
        const { question_id, answer } = question;

        // Find the corresponding question in testData.question_bank
        const questionIndex = testData.question_bank.findIndex(
          (que) => que.qid === question_id
        );

        if (questionIndex !== -1) {
          // Select the option based on the answer from question_dump
          updatedSelectedOptions[questionIndex + 1] =
            testData.question_bank[questionIndex][`option_${answer}`];
        }
      });

      setSelectedOptions(updatedSelectedOptions);
    }
  }, [testData]);

  const handleMark = (opt) => {
    if (!allmarked.includes(opt)) {
      allmarked.unshift(opt);
    } else {
      const index = allmarked.indexOf(opt);
      // If value is found in the array, remove it
      if (index !== -1) {
        allmarked.splice(index, 1);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) =>
          prevTimeLeft > 0 ? prevTimeLeft - 1 : 0
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSubmit = async () => {
    if (timeLeft <= 0) {
      setattempted(userSelections.length);
      setunatempted(testData?.question_bank.length - userSelections.length);
      setmarked(allmarked.length);
      setIsOpen1(true);
      // setIsOpen(true);
    } else {
      notification.open({
        message: "Test could not be submit before time!",
        duration: 2, // Duration in seconds
      });
    }
  };

  let subtitle;

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  const attemptedMap = userSelections.reduce((acc, ans) => {
    acc[ans.qid] = ans;
    return acc;
  }, {});

  const newArr = testData?.question_bank.map((question, index) => ({
    order: index + 1,
    question_id: question.id,
    answer: attemptedMap[question.id]
      ? attemptedMap[question.id].optionTicked.toString()
      : "",
    onscreen: 5, // Assuming default value is 5
    guess: 0, // Assuming default value is 0
    review: 0, // Assuming default value is 0
    part: question?.part, // Assuming default value is an empty string
    section_id: question?.section_id, // Assuming default value is 0
    unanswered: attemptedMap[question.id] ? "1" : "",
  }));

  testData?.question_bank?.forEach((item) => {
    // Find the corresponding part_name from sectionArr
    let section = sectionArr?.find((section) => section.id == item.part);

    // If a matching section is found, push the part_name into TestData
    if (section) {
      item.part_name = section.part_name;
      item.section_timing = section.section_timing;
    }
  });

  newArr?.forEach((item) => {
    const foundItem = qdump.find((q) => q.question_id === item.question_id);
    if (foundItem && foundItem.answer) {
      item.answer = foundItem.answer;
    }
  });

  let nonEmptyAnswerCount = 0;

  useEffect(() => {
    let nonEmptyAnswerCount = 0;
    newArr?.forEach((obj) => {
      // Check if the 'answer' field is not empty
      if (obj.answer !== "") {
        // Increment the counter
        nonEmptyAnswerCount++;
      }
    });

    setattempted(nonEmptyAnswerCount);
  }, [newArr]);

  // Now TestData will have part_name added to each item

  const handlefinal = async () => {
    // Create a new FormData object
    setresultload(false);
    const formData = new FormData();

    // Append key-value pairs to the FormData object
    formData.append("user_id", user_id);
    formData.append("question_dump", JSON.stringify(newArr));
    formData.append("test_series_id", test_series_id);
    formData.append("time_spent", totaltime * 60);
    formData.append("state", "0");
    formData.append("last_view", "171945");
    formData.append("section_time_spent", "0");
    formData.append("section_part_id", "0");

    // Send a POST request with the FormData object
    const response = await axiosInstance.post(
      "/v1_data_model/test-series/TestSeries/save_test_series",
      formData
    );

    console.log(response?.data);
    setresultload(true);
    if (response?.data?.data?.result_time == "") {
      navigate(`/testresult/nur/${user_id}s${response?.data?.data?.id}`);
    } else {
      navigate(`/testwait/${response?.data?.data?.result_time}`);
    }
    // const width = screen.availWidth;
    // const height = screen.availHeight;
    // const left = 0;
    // const top = 0;
    // const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

    // const newWindow = window.open(
    //   `/testresult/nur/${user_id}s${response?.data?.data?.id}`,
    //   "_blank",
    //   features
    // );

    // // Ensure content is loaded before focusing
    // newWindow.addEventListener('load', () => {
    //   newWindow.focus();
    // });
  };

  const preventSelection = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (TimeInSec == 0) {
      console.log(TimeInSec);
      setIsOpen1(true);
    }
  }, [TimeInSec]);
  console.log(TimeInSec);

  const HandleDirectJump = (ind) => {
    const currentPartName = testData?.question_bank[tab - 1]?.part_name;
    const jumpPartName = testData?.question_bank[ind]?.part_name;
    if (currentPartName == jumpPartName) {
      setTab(ind + 1);
    } else {
      notification.open({
        message:
          "All questions from this sections are attempted, once the timer of this section completes you will be taken to the next section.",
        duration: 2, // Duration in seconds
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  console.log(count);

  useEffect(() => {
    if (DeviceId != "1211") {
      return; // If deviceID is present, do not run the rest of the useEffect
    }

    const handleUnload = async (event) => {
      event.preventDefault();
      event.returnValue =
        "Your test has been paused here! come back to resume..";

      // Save test data when the user closes the window or the system shuts down
      await saveTestData();

      return ""; // Required for Chrome
    };

    const saveTestData = async () => {
      try {
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("question_dump", JSON.stringify(newArr));
        formData.append("test_series_id", test_series_id);
        formData.append(
          "time_spent",
          Number(testData?.question_bank[0]?.section_timing) * 60 - count
        );
        formData.append("state", 1); // Assuming '1' represents an incomplete state
        formData.append("last_view", LastView);
        formData.append("section_time_spent", count);
        formData.append("section_part_id", LastView);
        formData.append("cbt_device_type", "1211");

        // Send a POST request with the FormData object
        await axiosInstance.post(
          "/v1_data_model/test-series/TestSeries/save_test_series",
          formData
        );
      } catch (error) {
        console.error("Error saving test data:", error);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user_id, test_series_id, newArr, count, LastView]);

  const handleSecBar = (currentSec, compareSec) => {
    if (currentSec != compareSec) {
      notification.open({
        message:
          "All questions from this sections are attempted, once the timer of this section completes you will be taken to the next section.",
        duration: 5, // Duration in seconds
      });
    }
  };

  useEffect(() => {
    const noSleep = new NoSleep();
    noSleep.enable(); // Enable NoSleep to prevent system from sleeping

    // Return a cleanup function to disable NoSleep when the component unmounts
    return () => {
      noSleep.disable();
    };
  }, []);

  useEffect(() => {
    const CheckDevice = async () => {
      const res = await axiosInstance.post(
        "v1_data_model/test-series/TestSeries/get_check_device_type",
        { user_id: user_id, test_series_id: test_series_id }
      );
      console.log(res?.data?.data?.cbt_device_type);
      setDeviceID(res?.data?.data?.cbt_device_type);
    };

    CheckDevice();
  }, []);


  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  const [imgurl,setimgurl] = useState("");
     

const HandleImg = (e)=>{
  if(e.target.tagName=="IMG")
  {

    setimgurl(e.target.src);
    setIsOpen2(true);
  }
}


  if (DeviceId != "1211" ) {
    return <ResetTest user_id={user_id} test_series_id={test_series_id} />;
  } else {
    return (
      <>
        <div className="TestPanel">
          <div className="container">
            <div className="testcont">
              <div className="quecont">
                <h3 style={{ color: "red" }}>
                  ALERT: Don't click reload/refresh this page otherwise your
                  test will be restart
                </h3>
                <div className="stopwatch">
                  <div>{formatTime(timeLeft)}</div>
                </div>

                <h4 style={{}}>{testData?.basic_info?.test_series_name}</h4>
                {testData?.question_bank?.map((que, index) => (
                  <>
                    {tab === index + 1 && (
                      <>
                        <div className="groupwith">
                          <div style={{ width: "70%" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              {sectionArr?.map((data) => (
                                <Button
                                  style={{
                                    backgroundColor:
                                      que?.part_name == data.part_name
                                        ? "#071952"
                                        : "gray",
                                  }}
                                  onClick={() =>
                                    handleSecBar(
                                      que?.part_name,
                                      data?.part_name
                                    )
                                  }
                                >
                                  {" "}
                                  {que?.part_name == data.part_name ? (
                                    <FaLockOpen />
                                  ) : (
                                    <FaLock />
                                  )}{" "}
                                  {data.part_name}
                                </Button>
                              ))}
                            </div>
                            <h5>Q.{index + 1}</h5>
                            <h4 style={{ color: "red" }}>
                              {" "}
                              {isOnline ? "" : "You are Offline!"}
                            </h4>
                            <div className="question-container">
      <div
       onClick={HandleImg} title="Click to zoom!"
                              dangerouslySetInnerHTML={{ __html: que.question }}
                            />

  

      

    
    </div>
                            

                            {[
                              que.option_1,
                              que.option_2,
                              que.option_3,
                              que.option_4,
                            ].map((option, i) => (
                              <div
                                key={i + 1}
                                className="optionlist"
                                style={{
                                  backgroundColor:
                                    selectedOptions[tab] === option
                                      ? "skyblue"
                                      : "white",
                                }}
                                onClick={() =>
                                  handleOptionClick(
                                    option,
                                    i + 1,
                                    que.id,
                                    que.answer
                                  )
                                }
                              >
                                <h5 className="optionNo">
                                  {String.fromCharCode(65 + i)}
                                </h5>
                                <div
                                  dangerouslySetInnerHTML={{ __html: option }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div></div>

                        <div>
                          <Modal
                            isOpen={modalIsOpen1}
                            onAfterOpen={afterOpenModal}
                            style={customStyles1}
                            contentLabel="Example Modal"
                          >
                            <h2
                              style={{ textAlign: "center", padding: "10px" }}
                            >
                              Exam Over!
                            </h2>
                            <h4 style={{ textAlign: "center" }}>
                              You have successfully completed the EXAM
                            </h4>

                            <div style={{ width: "100%", textAlign: "center" }}>
                              <button
                                style={{ width: "40%" }}
                                disabled={!isOnline}
                                className="modal-but"
                                onClick={handlefinal}
                              >
                                {isOnline ? (
                                  resultload ? (
                                    "Review Result"
                                  ) : (
                                    <Spinner />
                                  )
                                ) : (
                                  "Connect to Internet!"
                                )}
                              </button>
                            </div>
                          </Modal>
                        </div>

                        <div className="bottom-nav">
                          <Button onClick={handlePrev} disabled={disableNav}>
                            Prev
                          </Button>

                          <button onClick={() => handleMark(index + 1)}>
                            {allmarked.includes(index + 1)
                              ? "UnMark"
                              : " Mark for review"}
                          </button>

                          <Button onClick={handleNext} disabled={disableNav}>
                            {testData?.question_bank.length > tab
                              ? "Next"
                              : "Finish"}
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </div>

              <div className="que-status-cont">
                <div style={{ flexGrow: 1 }}>
                  <h4>Review Questions</h4>
                  <div className="reviewQues" style={{minHeight:'100vh'}}>
                    {testData?.question_bank.map((que, index) => (
                      <button
                        className="que-no-box"
                        key={que.qid}
                        style={{
                          backgroundColor: allmarked.includes(index + 1)
                            ? "blue"
                            : selectedOptions && selectedOptions[index + 1]
                            ? "green"
                            : "#BEC6A0",
                          textAlign: "center",
                          padding: "5px",
                          minWidth: "40px",
                          color: "white",
                          borderRadius: "4px",
                        }}
                        disabled={disableNav}
                        onClick={() => HandleDirectJump(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="mb-2">
                    <FaCircle size={8} color="green" />
                    <span> Attempted</span>
                  </div>

                  <div className="mb-3">
                    <FaCircle size={8} color="#d3d3d3" />
                    <span> Skipped</span>
                  </div>

                  <div className="mb-3">
                    <FaCircle size={8} color="blue" />
                    <span> Marked</span>
                  </div>
                </div>

                <span className="submitBtn" onClick={handleSubmit}>
                  SUBMIT
                </span>
              </div>
            </div>
          </div>
          <Modal
                          isOpen={modalIsOpen2}
                          onAfterOpen={afterOpenModal}
                          style={customStyles2}
                          contentLabel="Example Modal"
                          
                        >
                          

                           <ModalBody>
                          <div style={{display:"flex",flexDirection:'column'}}>

                          <Button style={{width: 'fit-content'}} onClick={()=>setIsOpen2(false)}>X</Button>
                            <img src={imgurl} style={{height:'400px',width:'100%'}} />
                          </div>
                          </ModalBody>
                        
                        </Modal>
        </div>
      </>
    );
  }
};

export default PausedNursingPanel;
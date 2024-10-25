import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import "../Helpsupport/style.css";
import React, { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";

import Modal from "react-bootstrap/Modal";
import { Spin } from "antd";
import toast, { Toaster } from "react-hot-toast";

const RaiseQuery = () => {
  // const userID = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState([]);
  const [toggleStatus, setToggleStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  //console.log(statusData, "test test");
  const profilePic = sessionStorage.getItem("profilePic");
  const defaultImageUrl =
    "https://cdn-icons-png.flaticon.com/512/206/206853.png";

  const { id } = useParams();
  const userIdT = id.endsWith("T") ? id.slice(0, -1) : id;
  //console.log(id, 'new user id')
  // Begin: form submit code
  useEffect(() => {
    if (id.includes("T")) {
      setToggleStatus(false);
    }
  }, []);
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    subject: "",
    phone: "",
    query: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles([...files, ...event.dataTransfer.files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const inputRef = useRef(null);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const category = event.currentTarget[0].value;

    if (
      !formData.firstname ||
      !formData.email ||
      !formData.phone ||
      !formData.query ||
      !formData.subject
    ) {
      toast.error("Please fill all the fields....");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", id);
    formDataToSend.append("username", formData.firstname);
    formDataToSend.append("phone_no", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("problem_type", category);
    formDataToSend.append("description", formData.query);
    formDataToSend.append("subject", formData.subject);
    files.forEach((file, index) => {
      formDataToSend.append(`qry_img[${index}]`, file);
    });

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/v1_data_model/StudentQueryQproblem",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.status === false) {
        toast.success(data.message);
      } else {
        navigate(`/ticket/${id}`, { state: data.data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCheckStatus = async () => {
      try {
        const { data } = await axiosInstance.post(
          "/v1_data_model/get_all_student_queries"
        );
        const filterData = data?.data?.filter((itm) => itm.user_id === userIdT);

        const res = await axiosInstance.post(
          "/v1_data_model/get_all_student_problem_type"
        );

        // setCategoryList(res.data.message);
        setCategoryList(res.data.data);

        setStatusData(filterData);
      } catch (error) {
        console.log(error);
      }
    };
    getCheckStatus();
  }, []);

  // Begin: pop up code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);

  const [tid, settid] = useState(null);
  const [qid, setqid] = useState(null);
  const [msg, setmsg] = useState(null);
  const [adminmsg, setadminmsg] = useState([]);
  const [usermsg, setusermsg] = useState([]);
  const [userDefalt, setuserDefaltMsg] = useState([]);
  //console.log("userDefalt", usermsg[0].user_name);

  const [attachedImage, setAttachedImage] = useState(null);
  const handleShow = async (qid, tid) => {
    settid(tid);
    setqid(qid);
    // userID

    const res = await axiosInstance.post(
      `/v1_data_model/StudentQueryQproblem/showMsglist`,
      { user_id: id, ticket_id: tid, student_query_id: qid }
    );
    console.log("messageee stack", res?.data?.data?.userDefaltMsg);
    setuserDefaltMsg(res?.data?.data?.userDefaltMsg);
    setadminmsg(res?.data?.data?.adminMsglist);
    setusermsg(res?.data?.data?.userMsglist);

    setShow(true);
  };

  // End: pop up code

  const handleFileChanges = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedImage(e.target.files[0]); // Store the file object directly
    }
  };

  const handlesubmitmsg = async () => {
    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("ticket_id", tid);
    formData.append("student_query_id", qid);
    formData.append("meassage", msg);
    formData.append("sender", "user");

    if (attachedImage) {
      formData.append("sender_img", attachedImage); // Append file object directly
    }

    try {
      const res = await axiosInstance.post(
        `/v1_data_model/StudentQueryQproblem/send_meassage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        toast.success(res.data.statuscode);
      } else {
        toast.error(res.data.statuscode);
      }
      setmsg("");
      setAttachedImage(null);
      setShow(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  function convertDateToHHMM(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const combinedMessages = [
    ...adminmsg.map((msg) => ({ ...msg, isAdmin: true })),
    ...usermsg.map((msg) => ({ ...msg, isAdmin: false })),
  ];
  combinedMessages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  // const handleClose = () => setShow(false);

  const [zoomsrc, setsrc] = useState("");
  const handleshowimg = (src) => {
    setShow1(true);
    setsrc(src);
  };

  return (
    <>
      <Toaster />
      <div className="RaiseQuery" style={{ zIndex: 1000 }}>
        <div className="container">
          <a className="homebg" href="/">
            Home
          </a>
          <div className="bannerPart">
            <h1>Raise your Query</h1>
          </div>
        </div>

        <div className="container">
          <div className="QueryForm">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {toggleStatus ? (
                <h3>How can we contact you?</h3>
              ) : (
                <h3>Status</h3>
              )}
              {statusData?.length > 0 && (
                <button
                  onClick={() => setToggleStatus(!toggleStatus)}
                  style={{
                    padding: "10px 20px",
                    background: toggleStatus ? "green" : "red",
                    color: "white",
                  }}
                >
                  {toggleStatus ? "See Your Ticket Status" : "Raise Your Query"}
                </button>
              )}
            </div>
            {toggleStatus && (
              <>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      height: "50vh",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="formData">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Choose Your category *</label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                          >
                            {categoryList?.map((itm, i) => (
                              <option key={i} value={itm?.id}>
                                {itm?.problem_type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div className="form-group">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <label>Name *</label>
                            <label>{!formData.firstname}</label>
                          </div>
                          <input
                            type="text"
                            name="firstname"
                            placeholder="Your name.."
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Email Id *</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Your email id Number.."
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Mobile No *</label>
                          <input
                            type="number"
                            name="phone"
                            placeholder="Your Mobile Number.."
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Subject *</label>
                          <input
                            type="text"
                            name="subject"
                            placeholder="subject.."
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                          <label>Description of Query *</label>
                          <textarea
                            name="query"
                            placeholder="Enter Details.."
                            value={formData.query}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="col-12 col-sm-4 col-md-4 col-lg-2">
                        <div className="form-group uploadGroup">
                          <label>Select image:</label>
                          <input
                            type="file"
                            ref={inputRef}
                            name="file"
                            id="fileInput"
                            multiple
                            accept=".png,.jpg,.jpeg"
                            onChange={handleFileChange}
                          />
                          <div
                            className="upload-area"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={handleImageClick}
                          >
                            {/* <input
                              ref={inputRef}
                              type="file"
                              id="fileInput"
                              name="file"
                              multiple
                              accept=".png,.jpg,.jpeg"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            /> */}
                            {/* <svg
                              alt="Upload"
                              version="1.1"
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              style={{ fill: "rgb(235, 238, 240)" }}
                            >
                              <path d="M25.807 13.381c-0.908-4.588-4.952-8.048-9.807-8.048-3.856 0-7.196 2.185-8.864 5.381-4.012 0.432-7.136 3.827-7.136 7.952 0 4.419 3.581 8 8 8h17.333c3.681 0 6.667-2.985 6.667-6.667 0-3.52-2.736-6.372-6.193-6.619zM16 10.667l6.667 6.667h-4v5.333h-5.333v-5.333h-4l6.667-6.667z"></path>
                            </svg> */}
                            {/* <h5>Upload image</h5> */}
                          </div>
                        </div>
                      </div>

                      {files.length > 0 && (
                        <div className="col-12 col-sm-10 col-md-10 col-lg-10">
                          <div className="form-group">
                            {/* <label>Show Images:</label> */}
                            <div
                              className="preview-images"
                              style={{ display: "flex" }}
                            >
                              {files.map((file, index) => (
                                <div key={index} className="preview-image">
                                  <img
                                    style={{ margin: "5px" }}
                                    width="100px"
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                        <input
                          type="submit"
                          value="Submit"
                          className="subbtn"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {!toggleStatus && (
            <div className="tableDateshow">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tr>
                  <th>Name</th>
                  <th>Email Id</th>
                  <th>Contact No.</th>
                  <th>Ticket Description</th>
                  <th>Ticket Id</th>
                  <th>Status</th>
                  <th>View Message</th>
                </tr>
                {statusData?.map((itm, i) => (
                  <tr>
                    <td>{itm?.username}</td>
                    <td>{itm?.email}</td>
                    <td>{itm?.phone_no}</td>
                    <td>{itm?.description}</td>
                    <td>{itm?.ticket_id}</td>
                    <td
                      style={{
                        color:
                          itm?.status === "0"
                            ? "#4833FE"
                            : itm?.status === "1"
                            ? "#66E821"
                            : itm?.status === "2"
                            ? "#E82121"
                            : itm?.status === "3"
                            ? "#FFBF00"
                            : "black",
                        fontWeight: "bold",

                        textAlign: "center",
                      }}
                    >
                      {itm?.status === "0"
                        ? "New"
                        : itm?.status === "1"
                        ? "Close"
                        : itm?.status === "2"
                        ? "Reopen"
                        : itm?.status === "3"
                        ? "In Progress"
                        : "Pending"}
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        className="viewPop"
                        onClick={() => handleShow(itm?.id, itm?.ticket_id)}
                      >
                        View/Send Message
                      </button>
                      {/* <button type="button" className="SendPop" onClick={handleShow1}>Send</button> */}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          )}

          {/* Begin: Model Code  */}
          <Modal show={show} onHide={handleClose} className="ViewModel">
            <Modal.Header closeButton>
              <div
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                  color: "#F16136",
                }}
              >
                Ticket ID: {tid}
              </div>
              <div className="msg left-msg staticdata mt-4">
                <div className="msg-img1"></div>
                <div className="msg-bubble">
                  <div className="msg-info ">
                    <div className="msg-info-name">{usermsg[0]?.user_name}</div>
                    <div className="msg-info-time"></div>
                  </div>
                  <div className="description">{userDefalt.description}</div>
                  <div>
                    {Object.keys(userDefalt)
                      .filter((key) => !isNaN(key))
                      .map((key) => (
                        <>
                          <img
                            key={userDefalt[key].image_id}
                            style={{ margin: "5px", zIndex: 1000 }}
                            width="100px"
                            src={userDefalt[key].image.replace(/\\\//g, "/")}
                            alt="Sender"
                            onClick={() => setShow1(true)}
                          />
                          <button
                            onClick={() =>
                              handleshowimg(
                                userDefalt[key].image.replace(/\\\//g, "/")
                              )
                            }
                            style={{
                              zIndex: 1000,
                              padding: "30px",
                              paddingInline: "40px",
                              marginLeft: "-100px",
                            }}
                          ></button>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body className="content">
              <section className="msger">
                <main className="msger-chat">
                  {combinedMessages.map((msg, index) =>
                    msg.isAdmin ? (
                      <div className="msg left-msg" key={index}>
                        <div className="msg-img"></div>
                        <div className="msg-bubble">
                          <div className="msg-info">
                            <div className="msg-info-name">Admin</div>
                            <div className="msg-info-time">
                              {convertDateToHHMM(msg?.created_at)}
                            </div>
                          </div>
                          <div className="msg-text">{msg?.meassage}</div>

                          {msg?.sender_img && (
                            <>
                              <img
                                key={msg?.sender_img}
                                style={{ margin: "5px" }}
                                width="100px"
                                src={msg?.sender_img.replace(/\\\//g, "/")}
                                alt="Sender"
                              />

                              <button
                                onClick={() =>
                                  handleshowimg(
                                    msg?.sender_img.replace(/\\\//g, "/")
                                  )
                                }
                                style={{
                                  zIndex: 1000,
                                  padding: "30px",
                                  paddingInline: "40px",
                                  marginLeft: "-100px",
                                }}
                              ></button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="msg right-msg" key={index}>
                        <div
                          className="msg-img"
                          style={{
                            backgroundImage: `url(${
                              profilePic || defaultImageUrl
                            })`,
                          }}
                        ></div>

                        <div className="msg-bubble">
                          <div className="msg-info">
                            <div className="msg-info-name">
                              {msg?.user_name}
                            </div>
                            <div className="msg-info-time">
                              {convertDateToHHMM(msg?.created_at)}
                            </div>
                          </div>
                          {/* <div className="msg-text">{msg?.meassage}</div>
                          <img
                            style={{ margin: "5px" }}
                            width="100px"
                            src={msg?.sender_img.replace(/\\\//g, "/")}
                            alt="Sender"
                          /> */}

                          <div>
                            {msg?.meassage &&
                              msg?.sender_img.replace(/\\\//g, "/") !==
                                "null" && (
                                <div className="msg-text">{msg?.meassage}</div>
                              )}
                            {msg?.sender_img.replace(/\\\//g, "/") &&
                              msg?.sender_img.replace(/\\\//g, "/") !== "" && (
                                <>
                                  <img
                                    style={{ margin: "5px" }}
                                    width="100px"
                                    src={msg?.sender_img.replace(/\\\//g, "/")}
                                    alt="Sender"
                                  />
                                  <button
                                    onClick={() =>
                                      handleshowimg(
                                        msg?.sender_img.replace(/\\\//g, "/")
                                      )
                                    }
                                    style={{
                                      zIndex: 1000,
                                      padding: "30px",
                                      paddingInline: "40px",
                                      marginLeft: "-100px",
                                    }}
                                  ></button>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </main>

                <div className="msger-inputarea">
                  {attachedImage && (
                    <div className="attached-image">
                      <img
                        src={URL.createObjectURL(attachedImage)}
                        alt="attachment"
                        style={{ maxWidth: "90%", maxHeight: "60px" }}
                      />
                    </div>
                  )}

                  <div className="browseData1">
                    <input
                      type="file"
                      onChange={handleFileChanges}
                      className="msger-file-input"
                      accept="image/*"
                    />
                  </div>
                  <div className="fileUploadData1">
                    <input
                      value={msg}
                      onChange={(e) => setmsg(e.target.value)}
                      type="text"
                      className="msger-input"
                      placeholder="Enter your message..."
                    />
                    <button onClick={handlesubmitmsg}>Send</button>
                  </div>
                </div>
              </section>
            </Modal.Body>
          </Modal>

          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <img src={zoomsrc} />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default RaiseQuery;

import React, { useState, useEffect, useRef } from "react";
import "../Profile/style.css";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";
import { useParams } from "react-router-dom";

import { Button, Checkbox, Input, Modal, Select } from "antd";
import { toast } from "react-toastify";

const ProfileNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listData, setListData] = useState({});
  const [status, setStatus] = useState({});
  const [yearName, setYearName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [genderName, setgenderName] = useState("");
  const [statusData, setStatusData] = useState({});
  const [visibleDiv, setVisibleDiv] = useState();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [colName, setColName] = useState([]);
  const [cName, setCName] = useState([]);
  const [sname, setSName] = useState([]);
  const [errorShow, setErrorShow] = useState("");
  const {
    city_name,
    collage_name,
    list,
    state,
    college_name,
    type_college_name,
    type_city_name,
    type_state,
    course_category,
    type_course_category,
    year_of_study,
    type_year_of_study,
    type_gender,
    gender,
  } = listData;

  // console.log("state->",stateName,"city->",cityName,"college->",collegeName)
  const arr = course_category?.chield_column.split(",");
  const categoryCreate = arr?.map((cat, i) => ({
    id: i + 1,
    name: cat,
  }));

  const genderArr = gender?.chield_column.split(",");
  const yearArr = year_of_study?.chield_column.split(",");
  const yearCreate = yearArr?.map((cat, i) => ({
    id: i + 1,
    name: cat,
  }));

  const [emailToggle, setEmailToggle] = useState(false);

  const getCalled = async () => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/registration/student_profile_update",
        {
          user_id: id,
        }
      );
      setStatusData(res?.data.data);
      if (res?.data.data?.percentage > 99) {
        navigate("/Completed");
      }

      const resp = await axiosInstance.post(
        "/v1_data_model/user/registration/dyanamic_user_fields_list",
        {
          user_id: id,
        }
      );
      setListData(resp.data.data);
      setStatus(resp?.data?.data?.list);

      const a = resp?.data?.data?.college_name?.table_data?.map((itm) => ({
        label: itm.college_name,
        value: itm.id,
      }));
      const b = resp?.data?.data?.city_name?.table_data?.map((itm) => ({
        label: itm.city_name,
        value: itm.id,
      }));
      const c = resp?.data?.data?.state?.table_data?.map((itm) => ({
        label: itm.state_name,
        value: itm.id,
      }));
      setColName(a);
      setCName(b);
      setSName(c);

      console.log("99->", resp?.data?.data?.list?.course_category);

      setCollegeName(resp?.data?.data?.list?.college_name);
      setCourseName(resp.data.data.list.course_category);
      setCityName(resp.data.data.list.city);
      setYearName(resp.data.data.list.year_of_study);
      setStateName(resp.data.data.list.state);
      setgenderName(resp.data.data.list.gender);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerUpdate = async () => {
    // console.log(collegeName);
    if (!collegeName) {
      setErrorShow("please select college");
      setTimeout(() => {
        setErrorShow("");
      }, 1000);
    } else if (!cityName) {
      setErrorShow("please select city");
      setTimeout(() => {
        setErrorShow("");
      }, 1000);
    } else if (!stateName) {
      setErrorShow("please select state");
      setTimeout(() => {
        setErrorShow("");
      }, 1000);
    } else if (!courseName) {
      setErrorShow("please select course");
      setTimeout(() => {
        setErrorShow("");
      }, 1000);
    } else if (!yearName) {
      setErrorShow("please select year");
      setTimeout(() => {
        setErrorShow("");
      }, 1000);
    } else {
      try {
        const { data } = await axiosInstance.post(
          "/v1_data_model/user/registration/student_profile_changes",
          {
            user_id: id,
            college_name: collegeName,
            course_category: courseName,
            city_name: cityName,
            state: stateName,
            year_of_study: yearName,
            gender: genderName,
          }
        );
        console.log(data);
        toast.success("User has been updated");
        getCalled();
        // navigate("/");
        // getCalled();
      } catch (error) {
        console.log(error);
      }
    }
    console.log(collegeName)
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key == "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // const handlerCancel = () => {
  //   setOtp(["", "", "", ""]);
  //   setEmailToggle(false);
  // };

  const sendOtp = async (id) => {
    // id === 1 ? console.log(id, mob.email) : console.log(id, mob.mobile);

    const objEmail = {
      email: status.email,
    };
    const objNum = {
      mobile: status.mobile,
    };
    try {
      const { data } = await axiosInstance.post(
        "v1_data_model/user/registration/login_authentication_v2",
        id === 1 ? objEmail : objNum
      );
      if (data.status === true) {
        toast.success("Otp Send");
        setEmailToggle(id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("->", error);
    }
  };

  const handlerVerified = async () => {
    const otpNum = otp.join("");

    const objEmail = {
      email: status.email,
      otp: otpNum,
    };
    const objNum = {
      mobile: status.mobile,
      otp: otpNum,
    };

    try {
      const { data } = await axiosInstance.post(
        "/v1_data_model/user/registration/login_authentication_v2",
        emailToggle === 1 ? objEmail : objNum
      );
      if (data.status === true) {
        // toast.success("Success");
        getVerified(emailToggle);
      } else {
        toast.error(data.message);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getVerified = async (toggle) => {
    // console.log(id)
    try {
      const { data } = await axiosInstance.post(
        "v1_data_model/user/registration/student_verify_status",
        {
          user_id: id,
          verify_status_type: toggle === 1 ? "1" : "2",
        }
      );
      console.log(data);
      if (data.status === true) {
        toast.success(data.message);
        setOtp(["", "", "", ""]);
        setEmailToggle(false);
        getCalled();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(status)

  const handlerSelectEmailOrNumber = (ids) => {
    setOtp(["", "", "", ""]);
    setVisibleDiv(ids);
    sendOtp(ids);
  };

  const SearchableSelect = ({ options }) => {
    return (
      <Select
        showSearch
        style={{ width: "100%" }}
        value={collegeName}
        // defaultValue={!collegeName && "Select College"}
        onChange={(e) => setCollegeName(e)}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {!collegeName && <Option>Select Course </Option>}
        {options.map((option) => (
          <Option key={option.value} value={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  };

  const SearchableSelectCity = ({ options }) => {
    return (
      <Select
        showSearch
        value={cityName}
        style={{ width: "100%" }}
        onChange={(e) => setCityName(e)}
        placeholder="Select City"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {!cityName && <Option>Select City </Option>}
        {options.map((option) => (
          <Option key={option.value} value={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  };

  const SearchableSelectstate = ({ options }) => {
    return (
      <Select
        showSearch
        value={stateName}
        style={{ width: "100%" }}
        onChange={(e) => setStateName(e)}
        placeholder="Select state"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {!stateName && <Option>Select State </Option>}
        {options.map((option) => (
          <Option key={option.value} value={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  };

  useEffect(() => {
    getCalled();
  }, []);
  return (
    <div className="container">
      <div
        className="ProfileUpdate newProfileUpdate"
        style={{ marginTop: "100px" }}
      >
        {status.email_verify_status === null ||
        status.phone_verify_status === null ? (
          <div className="verifyDiv">
            <h3>Please Verify your email & Number</h3>
            <div>
              {status?.email_verify_status === null && (
                <button
                  className="btnProfile"
                  onClick={() => handlerSelectEmailOrNumber(1)}
                >
                  Email
                </button>
              )}
              {status?.phone_verify_status === null && (
                <button
                  className="btnProfile"
                  onClick={() => handlerSelectEmailOrNumber(2)}
                >
                  Number
                </button>
              )}
            </div>

            {visibleDiv === 1 ? (
              <>
                {status.email_verify_status === null && (
                  <>
                    <div
                      className="numberType"
                      style={{
                        width: emailToggle === 1 ? "60%" : "40%",
                      }}
                    >
                      <Input disabled size="large" placeholder={status.email} />
                    </div>
                    <div className="typebox">
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={value}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleBackspace(e, index)}
                        />
                      ))}
                    </div>
                    <div className="verifyBtn">
                      <Button type="primary" block onClick={handlerVerified}>
                        Verify OTP
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              visibleDiv === 2 && (
                <>
                  {status.phone_verify_status === null && (
                    <>
                      <div
                        className="numberType"
                        style={{
                          width: emailToggle === 1 ? "60%" : "40%",
                        }}
                      >
                        <Input
                          disabled
                          size="large"
                          placeholder={status?.mobile}
                        />
                      </div>
                      <div className="typebox">
                        {otp.map((value, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                          />
                        ))}
                      </div>
                      <div className="verifyBtn">
                        <Button type="primary" block onClick={handlerVerified}>
                          Verify OTP
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )
            )}
          </div>
        ) : (
          <section className="profileNewupdate">
            <div className="container">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                  <div className="avatar-upload">
                    <div className="avatar-preview">
                      <img
                        src={list?.profile_picture}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <label className="control-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your name"
                          disabled
                          value={list?.name}
                        />
                        <span id="error" className="name_error"></span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <label className="control-label">Email</label>

                          <label className="">
                            <b
                              style={{
                                color:
                                  status?.email_verify_status === null
                                    ? "red"
                                    : "green",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                status?.email_verify_status === null &&
                                sendOtp(1)
                              }
                            >
                              {status?.email_verify_status === null
                                ? "Verified Email"
                                : "Verified "}
                            </b>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your email"
                          disabled
                          value={list?.email}
                        />
                        <span id="error" className="email_error"></span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                      <div className="form-group">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <label className="control-label">Phone Number</label>

                          <label className="control-label">
                            <b
                              style={{
                                color:
                                  status?.phone_verify_status === null
                                    ? "red"
                                    : "green",
                              }}
                              onClick={() =>
                                status?.phone_verify_status === null &&
                                sendOtp(2)
                              }
                            >
                              {status?.phone_verify_status === null
                                ? "Verify Number"
                                : "Verified"}
                            </b>
                          </label>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter your Phone Number"
                          disabled
                          value={list?.mobile}
                        />
                        <span id="error" className="phone_error"></span>
                      </div>
                    </div>

                    {/* COLLEGE */}
                    {type_college_name === "selector" && (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="form-group">
                          <label className="control-label">College</label>
                          <label
                            className="control-label"
                            style={{ color: "red", marginLeft: "5px" }}
                          >
                            {errorShow}
                          </label>
                          <SearchableSelect options={colName} />
                        </div>
                      </div>
                    )}
                    {/* CITY */}
                    {type_city_name === "selector" && (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="form-group">
                          <label className="control-label">City</label>
                          <SearchableSelectCity options={cName} />
                        </div>
                      </div>
                    )}
                    {/* state */}
                    {type_state === "selector" && (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="form-group">
                          <label className="control-label">State</label>
                          <SearchableSelectstate options={sname} />
                        </div>
                      </div>
                    )}

                    {/* Course */}
                    {type_course_category === "selector" && (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="form-group">
                          <label className="control-label">Course</label>
                          <select
                            value={!courseName ? "" : courseName}
                            class="form-select"
                            onChange={(e) => setCourseName(e.target.value)}
                          >
                            {!courseName && <option>Select course</option>}
                            {categoryCreate?.map((itm) => (
                              <option key={itm?.id} value={itm?.name}>
                                {itm?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Year */}
                    {type_year_of_study === "selector" && (
                      <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                        <div className="form-group">
                          <label className="control-label">Year</label>
                          <select
                            value={!yearName ? "" : yearName}
                            class="form-select"
                            onChange={(e) => setYearName(e.target.value)}
                          >
                            {!yearName && <option>Select year</option>}
                            {yearCreate?.map((itm) => (
                              <option key={itm?.id} value={itm?.name}>
                                {itm?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {type_gender === "radio" && (
                      <>
                        {genderArr.map((option, index) => (
                          <Checkbox
                            key={index}
                            checked={genderName === option}
                            onChange={() => setgenderName(option)}
                          >
                            {option}
                          </Checkbox>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="subbutton">
                        {status?.phone_verify_status &&
                        status?.email_verify_status ? (
                          <button type="submit" onClick={handlerUpdate}>
                            Update
                          </button>
                        ) : (
                          <button
                            type="submit"
                            onClick={() => {
                              toast.error(
                                "Please first verified email & number"
                              );
                            }}
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfileNew;

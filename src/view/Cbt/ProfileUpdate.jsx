import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../API/axiosConfig";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const user_id = sessionStorage.getItem("id");
  const mobile = sessionStorage.getItem("mobile");
  const [Cbtstream, setCbtstream] = useState([]);
  useEffect(() => {
    // Retrieve user data from session storage
    const resdata = sessionStorage.getItem("userData");
    // Parse the JSON string to an object
    const userDataObj = JSON.parse(resdata);
    const userName = userDataObj.name;

    // Set the user data in state
    setUserData(userDataObj);
    sessionStorage.setItem("name", userDataObj.name);
    localStorage.setItem("email", JSON.stringify(userDataObj.email));
    //localStorage.setItem('jwt_token', JSON.stringify(userDataObj.jwt_token));
    axiosInstance
      .post("/v1_data_model/courses/home/get_cbt_stream")
      .then((response) => {
        setCbtstream(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching  Stream list data:", error);
      });
  }, []);

  // onchange image upload in react js script
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const Profile = "Profile";
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image_path", Profile); // Assuming Profile contains the image path
      formData.append("franchise_img", file);

      axiosInstance
        .post("v1_data_model/courses/home/upload_profile_image", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        })
        .then((response) => {
          setImagePreviewUrl(response.data.data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById("file-upload").click();
  };
  const username = sessionStorage.getItem("name");
  const [inputFields, setInputFields] = useState({
    fullname: username,
    mbbs_percentage: "",
    profile_img: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateValues = (inputValues) => {
    let errors = {};
    if (!inputValues.fullname) {
      errors.fullname = "Please enter full name";
    }

    if (!inputValues.mbbs_percentage) {
      errors.mbbs_percentage = "Please enter MBBS Percentage";
    }
    if (!inputValues.gender) {
      errors.gender = "Gender type";
    }
    if (!inputValues.dob) {
      errors.dob = "Date of birth";
    }

    if (!imagePreview) {
      errors.profile_img = "Upload profile image";
    }
    return errors;
  };
  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });

    if (e.target.name == "fullname") {
      errors.fullname = "";
    }
    if (e.target.name == "mbbs_percentage") {
      errors.mbbs_percentage = "";
    }
    if (e.target.name == "gender") {
      errors.gender = "";
    }
    if (e.target.name == "dob") {
      errors.dob = "";
    }
    if (e.target.name == "Female") {
      errors.gender = "";
    }
  };

  useEffect(() => {
    const resdata = sessionStorage.getItem("userData");
    const userDataObj = JSON.parse(resdata);
    const jwt_token = JSON.parse(localStorage.getItem("jwt_token"));


    const requestData = {
      user_id: 384732,
    };

    const headers = {
      Authorization: `${jwt_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      device_type: 0,
      build_no: 293,
      user_id: 384732,
      stream_id: 1,
      device_token: 170893035239102200000,
      is_web: 1,
    };

    axiosInstance
      .post(
        "https://dev.emedicoz.com/qa/emedicoz-api/v1_data_model/user/user_cart/get_user_cart_data",
        requestData
      )
      .then((response) => {
        setCbtstream(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Stream list data:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formErrors = validateValues(inputFields);
      setErrors(formErrors);
      setSubmitting(true);

      if (Object.keys(formErrors).length === 0) {
        const is_cbt_type = JSON.parse(localStorage.getItem("is_cbt_type"));
        const Cbtid = JSON.parse(localStorage.getItem("Cbtid"));
        const email = JSON.parse(localStorage.getItem("email"));
        const jwt_token = JSON.parse(localStorage.getItem("jwt_token"));
        const profileurl = imagePreviewUrl;
        const res = await axiosInstance.post(
          "/v1_data_model/courses/home/get_cbt_user_profile",
          {
            user_id: user_id,
            mobile: mobile,
            email: email,
            gender: inputFields.gender,
            name: inputFields.fullname,
            reg_cbt: 1,
            dob: inputFields.dob,
            stream: inputFields.stream,
            region_id: 1,
            percentage_cbt: inputFields.mbbs_percentage,
            profile_picture: profileurl,
          }
        );

        if (res.data.data.reg_cbt === "1" || res.data.data.reg_cbt === "0") {
          const res_cart = await axiosInstance.post(
            "/v1_data_model/user/User_cart/clear_cart",
            {
              user_id: user_id,
              course_id: Cbtid,
              facetofacecenter_id: 4,
              is_cbt: is_cbt_type,
            }
          );
          if (res_cart.data.status === true) {
            const res_add_cart = await axiosInstance.post(
              "v1_data_model/user/user_cart/add_course_to_cart",
              {
                user_id: user_id,
                course_id: Cbtid,
                facetofacecenter_id: 4,
                is_cbt: is_cbt_type,
              }
            );
            if (res_add_cart.data.status === true) {
              navigate("/addToCart");
              toast.success("Profile updated successfully.");
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profileUpdation">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>CBT Profile Update</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="profileNew mt-5">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-sm-4 col-md-3 col-lg-2 col-xl-2 detail-form">
                <div className="small-12 position-relative">
                  <div className="circle">
                    <img
                      className="profile-pic"
                      src={
                        imagePreview
                          ? imagePreview
                          : "https://i.ibb.co/Qj5Gxvn/avtar.png"
                      }
                      alt="profile"
                      onClick={handleUploadButtonClick}
                    />
                  </div>

                  <div className="p-image">
                  
                    <input
                      className="file-upload"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      id="file-upload"
                      name="profile_img"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <p>Upload Profile Picture</p>

                {!imagePreview ? (
                  <div className="text-danger text-left">
                    {errors.profile_img}
                  </div>
                ) : null}
              </div>
              <div className="col-12 col-sm-8 col-md-9 col-lg-10 col-xl-10">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label for="">Stream</label>
                      <select
                        className="form-control"
                        id="select-box"
                        name="stream"
                        value={inputFields.stream}
                        onChange={handleChange}
                      >
                        {Cbtstream.map((option) => (
                          <option
                            key={option.COURSE_ID}
                            value={option.COURSE_ID}
                          >
                            {option.COURSE_NAME}
                          </option>
                        ))}
                      </select>
                      {errors.stream ? <p>Full name</p> : null}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label">Email</label>
                      {userData && (
                        <input
                          type="text"
                          className="form-control"
                          id="user_email"
                          name="email"
                          value={userData.email}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label">Phone Number</label>
                      {userData && (
                        <input
                          type="text"
                          className="form-control"
                          name="mobile"
                          value={userData.mobile}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label">Full name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        name="fullname"
                        value={inputFields.fullname}
                        onChange={handleChange}
                      />
                      {errors.fullname ? (
                        <div className="text-danger text-left">
                          {errors.fullname}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label">MBBS Percentage</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mbbs_percentage"
                        name="mbbs_percentage"
                        value={inputFields.mbbs_percentage}
                        onChange={handleChange}
                      />
                      {errors.mbbs_percentage ? (
                        <div className="text-danger text-left">
                          {errors.mbbs_percentage}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group mt-3">
                      <label for="">Gender</label>
                      <div className="row">
                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <input
                              type="radio"
                              id=""
                              name="gender"
                              value="Male"
                              onChange={handleChange}
                            />
                            <label className="sidelable" for="">
                              Male
                            </label>
                          </div>
                          {errors.gender ? (
                            <div className="text-danger text-left">
                              {errors.gender}
                            </div>
                          ) : null}
                        </div>
                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="form-group position-relative">
                            <input
                              type="radio"
                              id=""
                              name="gender"
                              value="Female"
                              onChange={handleChange}
                            />
                            <label className="sidelable" for="">
                              Female
                            </label>
                          </div>
                        </div>
                        <div id="gender-error"></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <div className="form-group">
                      <label className="control-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dob"
                        value={inputFields.dob}
                        onChange={handleChange}
                      />
                      {errors.dob ? (
                        <div className="text-danger text-left">
                          {errors.dob}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-12 text-center mb-5">
                    <button
                      type="submit"
                      className="btn submitBtn"
                      id="btnNext"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ProfileUpdate;

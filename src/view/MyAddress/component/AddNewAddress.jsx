import "../../../assets/css/address-page/style.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import axiosInstance from "../../../API/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";

const AddNewAddress = () => {
  const user_id = sessionStorage.getItem("id");
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [location, setLocation] = useState(null);
  const [pincodeData, setPincodeData] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pincode: "",
    name: "",
    address: "",
    phone: "",
    address_2: "",
    country: "",
    state: "",
    city: "",
    user_id: user_id,
    latitude: "11",
    longitude: 1111,
    default: 0,
    code: 0,
  });
  console.log(formData?.default);
  const trim = formData.address.trim();
  const handleChange = (e) => {

    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "state") {
      fetchCities(e.target.value);
    }
    if (e.target.name === "pincode") {
      if (e.target.value.length <= 6) {
        getPincodeDetails(e.target.value);
      }
     
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, default: e.target.checked ? 1 : 0 });
  };

  const fetchCities = (stateId) => {
    const requestDatacity = {
      user_id: user_id,
      state: stateId,
    };
    axiosInstance
      .post("/v1_data_model/user/Registration/cities", requestDatacity)
      .then((response) => {
        if (response.data && response.data.status === true) {
          setCityList(response.data.data);
        } else {
          setCityList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(trim).length < 5) {
      toast.error("Please write at least 5 words");
    } else if (
      Object.keys(formData.phone).length < 10 ||
      Object.keys(formData.phone).length >= 11
    ) {
      toast.error("Please eneter valid number");
    } else {
      if (formData.default === 0) {
        toast.warning("please select address as a default");
      } else {
        try {
          const response = await axiosInstance.post(
            `/v1_data_model/user/user_cart/add_new_address`,
            formData
          );
          if (response.data.status === true) {
            navigate("/myaddress");
            toast.success("Address Added successfully.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }else{
            toast.error(response.data.message)
          }
        } catch (error) {
          console.error("Error fetching list data:", error);
        }
      }
    }
  };
  useEffect(() => {
    if (user_id) {
      const requestData = {
        user_id: user_id,
      };
      const headers = {
        headers: {},
      };
      // Fetch countries'
      axiosInstance
        .post("/v1_data_model/user/registration/countries", requestData)
        .then((response) => {
          if (response.data && response.data.status == true) {
            setCountryList(response.data.data);
          } else {
            setCountryList([]);
          }
        });
      // Fetch states
      axiosInstance
        .post("/v1_data_model/user/registration/states", requestData)
        .then((response) => {
          if (response.data && response.data.status == true) {
            setStateList(response.data.data);
          } else {
            setStateList([]);
          }
        });
    }
  }, [user_id]);

  const handleCurrentLocationClick = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(showPosition);
  };

  const showPosition = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    if (lat !== "" && lon !== "") {
      try {
        setLoading(true);
        const latlon = `latlng=${lat},${lon}&sensor=true&key=AIzaSyCLbStEu7-F25Xw2B46ciyaagAPk-IpYkY`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${latlon}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLocation(data);
        const addressComponents = data.results[0].address_components;
        const formattedAddress = data.results[0].formatted_address;
        const state = data.results[2].address_components[3].long_name;
        const country = data.results[2].address_components[4].long_name;

        // Find the pincode, state, and city from the address components
        let pincode = "";
        // let state = "";
        let city = "";
        addressComponents.forEach((component) => {
          if (component.types.includes("postal_code")) {
            pincode = component.long_name;
          }
          // else if (component.types.includes("administrative_area_level_1")) {
          //   state = component.long_name;
          // }
          else if (component.types.includes("locality")) {
            city = component.long_name;
          }
        });
        setFormData({
          ...formData,
          pincode: pincode,
          address: formattedAddress,
          state: state,
          city: city,
          country: country,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setLoading(false);
      }
    }
  };
  const getPincodeDetails = (pincode) => {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        if (data[0].Status === "Success") {
          setFormData({
            ...formData,
            pincode: pincode,
            state: data[0].PostOffice[0].State,
            city: data[0].PostOffice[0].District,
            country: data[0].PostOffice[0].Country,
          });
        } else {
          //setPincodeData("No records found for this pin code.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="profileUpdation">
      <div className="page-content bg-white position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/addToCart">Add To Cart</a>
              </li>
              <li>Add Address</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="add-new-address">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <h3>Add a new Address</h3>
              {/* <div className="location" id="currentadd">
                <a onClick={handleCurrentLocationClick}>
                  {!loading && (
                    <img src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/address-page/current-icon.png" />
                  )}
                  {loading ? "loading..." : "Use My current Location"}
                </a>
              </div> */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-3" name="form">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputpincode" className="col-form-label">
                        Pin code
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="number"
                        id="pincode"
                        name="pincode"
                        className="form-control"
                        placeholder="Pin code"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength="6"
                        required
                        onInput={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue < 0) {
                            e.target.value = ''; 
                          } else if (inputValue.length > 6) {
                            e.target.value = inputValue.slice(0, 6);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputFullname" className="col-form-label">
                        Full Name
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label className="col-form-label" htmlFor="address">
                        Address
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        placeholder="Flat House no. ,Building Company, Apartment"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputnumber" className="col-form-label">
                        Phone
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="number"
                        maxLength="10"
                        pattern="(0/91)?[6-9][0-9]{9}"
                        name="phone"
                        className="form-control"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label className="col-form-label" htmlFor="address">
                        Locality/Landmark
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="text"
                        name="address_2"
                        className="form-control"
                        placeholder="Eg Near fortis Hospital"
                        value={formData.address_2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputState" className="col-form-label">
                        City
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <div id="addcity"></div>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder=""
                        value={formData.city}
                        disabled
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputState" className="col-form-label">
                        State
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="text"
                        disabled
                        name="state"
                        className="form-control"
                        // placeholder="Eg Near fortis Hospital"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="inputState" className="col-form-label">
                        Country
                      </label>
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <input
                        type="text"
                        disabled
                        name="country"
                        className="form-control"
                        // placeholder="Eg Near fortis Hospital"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="form-group">
                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-2">
                      <label htmlFor="check" className="col-form-label" />
                    </div>
                    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-10">
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="default"
                          className="custom-control-input"
                          id="customCheck"
                          value={formData.default}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheck"
                        >
                          Set This my default address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                <div className="form-group">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <button type="submit" name="save" className="savebtn">
                        Save
                      </button>
                    </div>
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

export default AddNewAddress;

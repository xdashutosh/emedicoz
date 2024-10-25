import "../../assets/css/address-page/style.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import axiosInstance from "../../API/axiosConfig";
import { Modal } from "antd";

const MyAddress = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userid = sessionStorage.getItem("id");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        "/v1_data_model/user/User_cart/get_address",
        { user_id: userid }
      );
      setData(response.data.data);
      //console.log("addd",response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userid]);

  const handleRemoveCourse = (address_id) => {
    setIsModalOpen(address_id);
  };

  const handleOk = async () => {
    try {
      await axiosInstance.post("v1_data_model/user/user_cart/delete_address", {
        user_id: userid,
        address_id: isModalOpen,
      });

      setIsModalOpen(false);
      toast.success("Address Deleted Successfully");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditAddress = (address_id) => {
    localStorage.setItem("address_id", address_id);
    navigate("/editaddress");
    console.log(address_id);
  };

  const handleSetdefault = async (address_id) => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/user_cart/set_default_address",
        {
          user_id: userid,
          address_id: address_id,
        }
      );
      toast.success("Address changed successfully...");
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="page-content  position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/addToCart">Add To Cart</a>
              </li>
              <li>My Address</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="address-form">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div className="address-front position-relative">
                <h3>
                  My Addresses{" "}
                  <Link to={"/addnewaddress"} className="add_address">
                    <span className="create-button">Add new Address</span>
                  </Link>
                </h3>
                <div className="row">
                  {data.length === 0 ? (
                    <p>No order found</p>
                  ) : (
                    data.map((address, index) => (
                      <div
                        className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"
                        key={index}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className={`default-address ${
                            address.is_default == 1 ? "active" : ""
                          }`}
                        >
                          <a
                            onClick={() => {
                              handleSetdefault(address.id);
                            }}
                          >
                            <div className="position-relative">
                              <h5>{address.name}</h5>

                              {address.is_default == 1 ? (
                                <h4 className="default">Default</h4>
                              ) : null}
                            </div>

                            <p className="">{address.address} </p>
                            <p>
                              {address.state}, {address.city}, {address.country}
                            </p>
                            <p>
                              {address.city}: {address.pincode}
                            </p>

                            <p className="mrg-btm0">
                              Phone No. <strong>{address.phone}</strong>
                            </p>
                          </a>
                          <div className="row ">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                              <div className="edit-update">
                                <a
                                  href="javascript:;"
                                  onClick={() => {
                                    handleEditAddress(address.id);
                                  }}
                                >
                                  <i className="fa fa-pencil"></i> Edit
                                </a>

                                <a
                                  style={{ color: "red" }}
                                  onClick={() => {
                                    handleRemoveCourse(address.id);
                                  }}
                                >
                                  <i className="fa fa-trash"></i> Remove
                                </a>
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
        </div>
      </section>
      <Modal
        title="Delete"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Are you sure want to delete this address</p>
      </Modal>
    </>
  );
};

export default MyAddress;

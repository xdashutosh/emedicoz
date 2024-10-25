import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../../API/axiosConfig";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../API/axiosConfig";
const Coupon = ({
  CourseData,
  setCouponData,
  couponData,
  setGstData,
  couponStatus,
}) => {
  const user_id = sessionStorage.getItem("id");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCouponList, setModalCouponList] = useState([]);
  const [data, setData] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCodes, setCouponCodes] = useState("");
  // console.log("code---");

  const openCuponModalCart = (course_id, product_type) => {
    setModalOpen(true);

    axiosInstance
      .post(`/v1_data_model/coupon/coupon/get_coupon_list`, {
        user_id: user_id,
        course_id: course_id,
        flage: product_type,
      })
      .then((response) => {
        // console.log(response.data.data);
        setModalCouponList(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching coupon data list:", error);
      });
  };

  const closeCuponModalCart = () => {
    setModalOpen(false);
  };
  const handleChange = (event) => {
    // Update the couponCode state when input value changes
    setCouponCodes(event.target.value);
  };

  function handleClick() {
    // Use the couponCode state value when the button is clicked
    applyCoupon(couponCodes);
  }

  const applyCoupon = (couponTitle) => {
    const course = CourseData[0];
    const courseId = course.id;
    const price = course.price;
    const qty = course.qty;
    const isPartPayment = course.is_part_payment;
    const productType = course.product_type;
    const courseType = course.course_type;
    const availabilityCourse = course.availability_course;
    let flag;

    if (productType === "1" || productType === "2") {
      flag = "book";
    } else if (productType === "0" && courseType === "9") {
      if (availabilityCourse === "2") {
        flag = "facetoface";
      } else {
        flag = "online";
      }
    } else {
      flag = "online";
    }

    if (!couponTitle) {
      toast.error("Coupon code field is required");
      return;
    }
    const subscription_id = JSON.parse(localStorage.getItem("subscription_id"));

    let request = {
      user_id: user_id,
      coupon_code: couponTitle,
      is_part_payment: "",
      coupon_for: "",
      coupon_value: "",
      coupon_type: "",
      is_new: "",
      capping_value: "",
      maximum_discount_value: "",
      minimum_value: "",
      coupon_max_use: "",
      flage: flag,
      qty: qty,
      course_price: price,
      is_manual: "is_manual",
      user_use: "",
      eMedicoz_user: "2",
      new_coupon: "1",
      course_subscription_id: subscription_id,
    };

    const coupon = modalCouponList.find(
      (item) => item.coupon_tilte === couponTitle
    );
    if (coupon) {
      request = {
        capping_value: coupon.capping_value,
        is_new: coupon.is_new,
        coupon_type: coupon.coupon_type,
        coupon_for: coupon.coupon_for,
        maximum_discount_value: coupon.maximum_discount_value,
        user_id: user_id,
        coupon_value: coupon.coupon_value,
        coupon_code: couponTitle,
        course_price: price,
        qty: qty,
        coupon_max_use: coupon.coupon_max_use,
        minimum_value: coupon.minimum_value ? coupon.minimum_value : 0,
        is_part_payment: isPartPayment,
        flage: flag,
        user_use: coupon.user_use,
        eMedicoz_user: "",
        is_manual: "",
        new_coupon: "",
        course_subscription_id: subscription_id,
      };
    }
    //console.log("hsdfhdshfsdh", request);
    // if (!coupon) {
    //   toast.error("Coupon not found");
    //   return;
    // }

    axiosInstance
      .post(`/v1_data_model/user/user_cart/apply_cart_coupon`, request)
      .then((response) => {
        if (response.data.status === true && response.data.length !== 0) {
          toast.success("Coupon applied successfully");
          setModalOpen(false);
          setCouponData(response.data.data);

          setCouponApplied(true);
        } else {
          toast.error("Invalid coupon code");
        }
      })
      .catch((error) => {
        console.error("Error applying coupon:", error);
      });
  };
  useEffect(() => {
    if (user_id && couponApplied) {
      const list2 = [];
      CourseData.forEach((course) => {
        // Add to list2 array
        list2.push({
          course_id: course.id,
          net_amount: course.final_amount,
        });
      });
      const defaultAddressId = localStorage.getItem("defaultAddressId");
      const course_list = JSON.stringify(list2);
      const getcartdata = CourseData[0];
      const requestData = {
        user_id: user_id,
        user_address_id: defaultAddressId,
        course_list: course_list,
        offer_discount_amount: couponData.discount_amount,
        reward_discount_amount: 0,
        is_apply_reward_all: 0,
      };
      const headers = {
        headers: {},
      };

      axiosInstance
        .post("/v1_data_model/user/User_cart/calculate_gst", requestData)
        .then((response) => {
          if (response.data && response.data.status == true) {
            setGstData(response.data.data.gst_data[0]);
          } else {
            setGstData([]);
          }
        })
        .catch((error) => {
          //console.log("Error fetching cart data:", error);
        });
    }
  }, [user_id, couponApplied]);

  return (
    <>
      <div className="select-code">
        {!couponApplied ? (
          <div className="row">
            <div className="col-12 col-sm-10 col-md-10 col-lg-10 position-relative">
              <input
                type="text"
                id="coupon_code"
                placeholder="Select Coupon code/Referal code"
                onClick={() =>
                  openCuponModalCart(
                    CourseData[0].id,
                    CourseData[0].product_type === "1" ? "online" : "facetoface"
                  )
                }
                onChange={(e) => setCouponCode(e.target.value)}
                name="code"
                autoComplete="off"
              />
              <span className="cut" id="fa" style={{ display: "none" }}>
                <a href="javascript:void(0)">
                  <i
                    className="fa fa-close close_button"
                    style={{ color: "red" }}
                  ></i>
                </a>
              </span>
            </div>

            <div className="col-12 col-sm-2 col-md-2 col-lg-2">
              <button
                className="btn btn-primary apply_coupon"
                style={{ width: "100%" }}
                onClick={() => applyCoupon(couponCode)}
              >
                Apply
              </button>
            </div>
          </div>
        ) : couponApplied == true && couponStatus == true ? (
          <div className="row">
            <div className="col-12 col-sm-10 col-md-10 col-lg-10 position-relative">
              <input
                type="text"
                id="coupon_code"
                placeholder="Select Coupon code/Referal code"
                onClick={() =>
                  openCuponModalCart(
                    CourseData[0].id,
                    CourseData[0].product_type === "1" ? "online" : "facetoface"
                  )
                }
                onChange={(e) => setCouponCode(e.target.value)}
                name="code"
                autoComplete="off"
              />
              <span className="cut" id="fa" style={{ display: "none" }}>
                <a href="javascript:void(0)">
                  <i
                    className="fa fa-close close_button"
                    style={{ color: "red" }}
                  ></i>
                </a>
              </span>
            </div>

            <div className="col-12 col-sm-2 col-md-2 col-lg-2">
              <button
                className="btn btn-primary apply_coupon"
                style={{ width: "100%" }}
                onClick={() => applyCoupon(couponCode)}
              >
                Apply
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 col-sm-10 col-md-10 col-lg-10 position-relative">
              <input
                type="text"
                id="coupon_code"
                placeholder="Select Coupon code/Referal code"
                data-toggle="modal"
                data-target="#code_pop"
                name="code"
                value={couponData.coupon_code}
                autoComplete="off"
                disabled
              />
              <span className="cut" id="fa">
                <a href={"/addToCart"}>
                  <i
                    className="fa fa-close close_button"
                    style={{ color: "red" }}
                  ></i>
                </a>
              </span>
            </div>
            <div className="col-12 col-sm-2 col-md-2 col-lg-2">
              <a
                href="javascript:void(0)"
                className="btn btn-success disabled"
                style={{ width: "100%" }}
              >
                Applied
              </a>
            </div>
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="couponcode_pop new_couponcode">
          <div
            className="modal"
            id="code_pop"
            style={{ display: "block", paddingRight: "15px" }}
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <button
                    type="button"
                    className="close"
                    onClick={() => closeCuponModalCart()}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-12">
                      <h1>All Coupons</h1>
                    </div>
                    <div className="col-12 col-sm-12 set-aply">
                      <input
                        type="text"
                        id="coupon_codes"
                        placeholder="Select Coupon code/Referal code"
                        autoComplete="off"
                        value={couponCodes} // Bind input value to state
                        onChange={handleChange} // Handle input change
                      />
                      <button
                        className="btn btn-primary apply_coupons"
                        onClick={handleClick} // Call handleClick function when button is clicked
                      >
                        Apply
                      </button>
                    </div>
                    <div className="col-12">
                      {modalCouponList.map((coupon) => (
                        <div className="box" key={coupon.id}>
                          <h2>{coupon.coupon_tilte}</h2>
                          <p>This is for all platform Testing</p>
                          <div className="multibox">
                            <div className="row">
                              <div className="col-6">
                                <h3>{coupon.coupon_tilte}</h3>
                              </div>
                              <div className="col-6">
                                <h4 className="tooltip">
                                  T&C Apply
                                  <span className="tooltiptext">
                                    {coupon.term_conditions}
                                  </span>
                                  <em className="fa fa-info-circle"></em>
                                </h4>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                <h5>
                                  {coupon.coupon_discription}
                                  <button
                                    className={`btn apply_btn${coupon.coupon_tilte}`}
                                    onClick={() =>
                                      applyCoupon(coupon.coupon_tilte)
                                    }
                                  >
                                    Apply
                                  </button>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Coupon;

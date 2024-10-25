import React, { useState, useEffect } from "react";
import axiosInstance from "../../../API/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
let Cbtid = JSON.parse(localStorage.getItem("Cbtid"));
let is_cbt_type = JSON.parse(localStorage.getItem("is_cbt_type"));

const PriceDetail = ({ cgstData, gstData, cartDatas }) => {
  const [cartData, setCartData] = useState([]);
  const [shipingCartData, setShipingCartData] = useState([]);
  const [cartDataGst, setGstCartData] = useState(null);
  const [cartdetails, setcartdetails] = useState(null);
  const [Addr, setAdd] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const userid = sessionStorage.getItem("id");
  const jwtToken = sessionStorage.getItem("jwt_token");
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const defaultAddressId = localStorage.getItem("defaultAddressId");
  const pincode = localStorage.getItem("pincode");
  const nav = useNavigate();
  const get_user_cbt_reg = async () => {
    let Cbtid = JSON.parse(localStorage.getItem("Cbtid"));
    let is_cbt_type = JSON.parse(localStorage.getItem("is_cbt_type"));

    try {
      const res = await axiosInstance.post(
        "/v1_data_model/courses/home/get_user_cbt_reg",
        {
          user_id: userid,
          cbt_id: Cbtid,
          region_id: JSON.parse(localStorage.getItem("region_id")),
          mode: is_cbt_type === "1" ? "CBT" : "IBT",
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getallAdd = async () => {
    const allAdd = await axiosInstance.post(
      `/v1_data_model/user/User_cart/get_address`,
      { user_id: userid }
    );

    if (allAdd?.data?.status) {
      setAdd(true);
    } else {
      setAdd(false);
    }
  };

  useEffect(() => {
    getallAdd();
    const getfirstdata = async () => {
      try {
        const response = await axiosInstance.post(
          "/v1_data_model/user/user_cart/get_user_cart_data",
          { user_id: userid }
        );

        setCartData(response?.data?.data?.list);
        setcartdetails(response?.data?.data);

        if (response?.data?.data?.list[0].is_shipping === "1") {
          const response2 = await axiosInstance.post(
            "/v1_data_model/order/order/get_shipping_charge",
            {
              user_id: userid,
              delivery_postcode: pincode,
              course_id: response?.data?.data?.list[0].id,
            }
          );
          setShipingCartData(response2.data?.data?.shipping_charge);
        } else {
          setShipingCartData([]);
        }

        const list2 = [];
        response?.data?.data?.list?.forEach((course) => {
          list2.push({
            course_id: course.id,
            net_amount: course.final_amount,
          });
        });
        const course_list = JSON.stringify(list2);

        // Call cartgst after setting cartData and course_list
        cartgst(course_list);
      } catch (error) {
        console.error("Error fetching user cart data:", error);
      }
    };

    const cartgst = async (course_list) => {
      try {
        const response = await axiosInstance.post(
          "/v1_data_model/user/User_cart/calculate_gst",
          {
            user_id: userid,
            user_address_id: defaultAddressId,
            course_list: course_list,
            offer_discount_amount: 0,
            reward_discount_amount: 0,
            is_apply_reward_all: 0,
          }
        );

        setGstCartData(response?.data?.data);
      } catch (error) {
        console.error("Error calculating GST:", error);
      }
    };

    getfirstdata();
  }, [userid, defaultAddressId]);

  let courselist = null;

  if (cartData && cartData.length > 0) {
    const firstCartItem = cartData[0];
    if (firstCartItem?.installment) {
      const installmentExpiry =
        firstCartItem?.subscription_data?.amount_description?.expiry; // Access expiry from first installment
      const payment_meta = firstCartItem.subscription_data;

      // if (cartDatas[0].course_type == 1) {
      //   var totalAmount =
      //     gstData !== ""
      //       ? cartDatas[0].final_amount
      //       : cartDataGst?.total_payble_amount;
      // } else {
      //   var totalAmount =
      //     gstData !== ""
      //       ? gstData.total_amount_withgst
      //       : cartDataGst?.total_payble_amount;
      // }

      courselist = [
        {
          course_id: firstCartItem.id,
          product_type: firstCartItem.product_type,
          qty: cartDatas[0].qty,
          course_price: firstCartItem.price,
          payment_mode: 1,
          expiry: installmentExpiry,
          payment_meta: payment_meta,
          is_cbt: 1,
          course_type: firstCartItem.course_type,
        },
      ];
    } else {
      const installmentExpiry = 0;
      const payment_meta = 0;
      courselist = [
        {
          course_id: firstCartItem.id,
          product_type: firstCartItem.product_type,
          qty: cartDatas[0].qty,
          course_price: firstCartItem.price,
          payment_mode: 1,
          expiry: installmentExpiry,
          payment_meta: payment_meta,
          is_cbt: 1,
          course_type: firstCartItem.course_type,
        },
      ];
    }
  }
  sessionStorage.setItem("list", JSON.stringify(courselist));
  
  const WholePayment = async () => {
    let corselist = courselist;

    try {
      const response1 = await axiosInstance.post(
        `/v1_data_model/user/UserPaymentInitialize/initializeCourseTransactionCart`,
        {
          user_id: userid,
          list: JSON.stringify(courselist),
          address_id: localStorage.getItem("defaultAddressId"),
          redeem_amount: "",
          total_price:
            gstData != ""
              ? gstData.total_amount_withgst +
                shipingCartData * cartDatas[0].qty
              : cartDataGst?.total_payble_amount +
                shipingCartData * cartDatas[0].qty,
          coupon_applied: cgstData.coupon_code ? cgstData.coupon_code : "",
          earn_point_course_purchase: "",
          penalty: 0,
          pay_via: "RAZORPAY",
          points_rate: "",
          tax:
            gstData != "" ? gstData.gst_amount : cartDataGst?.total_gst_amount,
          points_used: 0,
          refer_code: "",
          coin_used: "",
          coin_earn: "",
          partner_type: "",
          is_apply_reward_all: "",
          subcenter_id: "",
          course_start_date: "",
          course_id: cartData[0].id,
          redeem_point: "",
          reward_discount: "",
          referral_user_by_partner: "",
          coupon_applied_partial: cgstData.discount_amount
            ? cgstData.discount_amount
            : 0,
          is_referal: "",
          is_cbt: is_cbt_type == null ? "" : is_cbt_type,
          region_id: JSON.parse(localStorage.getItem("region_id")),
          shipping_charge:
            shipingCartData != "" ? shipingCartData * cartDatas[0].qty : 0,
          course_type: cartData.course_type,
          product_type: cartData.product_type,
        }
      );
      const { data } = response1.data;

      if (data.razorpay_orderid === null) {
        toast.error("order id missing");
      } else {
        openTrab(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openTrab = (data) => {
    if (cartDatas[0].course_type == 1) {
      var totalAmount =
        gstData !== ""
          ? cartDatas[0].final_amount
          : cartDataGst?.total_payble_amount;
    } else {
      var totalAmount =
        gstData !== ""
          ? gstData.total_amount_withgst
          : cartDataGst?.total_payble_amount;
    }
    const amountInPaise = Math.round(parseFloat(totalAmount) * 100); // Convert to paise and round to nearest integer
    const finalAmount = Math.max(amountInPaise, 100);
    const options = {
      // key: "rzp_test_21UmuhRjRp7k20", //qa
      key: "rzp_live_6iSc6G3qM2aeDy", //master
      order_id: data.razorpay_orderid,
      amount: finalAmount,
      name: "Delhi Academy of Medical Sciences Pvt Ltd",
      description: "some description",
      image: "http://localhost:5173/src/components/header/login_logo.png",
      handler: async function (response) {
        try {
          setShowSpin(true);
          const res = await axiosInstance.post(
            "v1_data_model/user/User_payment/complete_transaction_cart",
            {
              list: sessionStorage.getItem("list"),
              redeem_amount: 0,
              pre_transaction_id: data.pre_transaction_id,
              post_transaction_id: response.razorpay_payment_id,
              affiliate_referral_code_by: "",
              earn_point_course_purchase: "",
              transaction_status_data: "success",
              user_id: userid,
              pay_via: "RAZORPAY",
            }
          );
          //console.log("response->", response);
          setShowSpin(false);
          nav(
            `/success/${res.data.data.order_id}-${res.data.data.payble_amount}`
          );
          if (res.data.status === true) {
            toast.success(res.data.message);
            sessionStorage.setItem("paymentData", res.data.data);
            const is_cbt_type = JSON.parse(localStorage.getItem("is_cbt_type"));
            if (is_cbt_type) {
              get_user_cbt_reg();
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
      prefill: {
        name: userData.name,
        contact: userData.mobile,
        email: userData.email,
      },
      notes: {
        address: "some address",
      },
      theme: {
        color: "#f15a22",
        hide_topbar: false,
      },
    };
    openPayModal(options);
  };

  const openPayModal = (options) => {
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const MoveToAdd = () => {
    nav("/addnewaddress");
  };
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.post(
          `https://d85g0bvcnm0si.cloudfront.net/v1_data_model/user/UserSetting/getPaymentGateway`,
          {}
        );

        setOptions(response?.data?.data);
        const defaultOption = response?.data?.data.find(
          (option) => option.is_default_gateway == 1
        );
        setSelectedOption(defaultOption ? defaultOption.id : "");
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const PaymentMode = () => {
    setShow(true);
  };

  useEffect(() => {
    if (showSpin) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    }
  }, [showSpin]);
  return showSpin ? (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ height: "100px", width: "100px" }}
      />
    </div>
  ) : (
    <>
      <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
        <div className="left-side">
          <div className="ibox-title">
            <h5>Price Detail</h5>
          </div>
          {cartData !== null &&
            cartDatas.map((productdata) => (
              <div className="table-responsive">
                <table className="table" id="result_here_apply">
                  <tbody>
                    <tr>
                      <td>No. of item(s)</td>
                      <td className="text-right">{productdata.qty}</td>
                    </tr>
                    <tr>
                      <td>item(s) Amount</td>
                      <td className="text-right">
                        <i className="fa fa-rupee mr-1"></i>
                        {productdata.course_type == 1
                          ? productdata.final_amount
                          : productdata.price}
                      </td>
                    </tr>
                    {/* <tr>
                      <td style={{color: '#55b339', fontWeight:'600'}}>eMedicoz Wallet</td>
                      <td className="text-right" style={{color: '#55b339', fontWeight:'600'}}>
                        <i className="fa fa-rupee mr-1"></i>
                        -1000
                      </td>
                    </tr> */}
                    <tr className="couponcol">
                      <>
                        <td id="couponcode">
                          Coupon{" "}
                          {cgstData.coupon_code ? cgstData.coupon_code : ""}
                        </td>
                        <td className="text-right" id="discount_display">
                          <em className="fa fa-rupee mr-1"></em>
                          {cgstData.discount_amount
                            ? cgstData.discount_amount
                            : 0}
                        </td>
                      </>
                    </tr>

                    <tr className="rewardcol">
                      <td id="rewarddisplay" style={{ color: "#55b339", fontWeight:'600' }}>
                        Reward redemption
                      </td>
                      <td
                        className="text-right"
                        id="reward_display"
                        style={{ color: "#55b339", fontWeight:'600' }}
                      >
                        <em className="fa fa-rupee mr-1"></em> 0{" "}
                      </td>
                    </tr>
                    <tr>
                      <td>GST Tax</td>
                      <td className="text-right" id="total_gst_rewardamount">
                        <i className="fa fa-rupee mr-1"></i>
                        {gstData != ""
                          ? gstData.gst_amount
                          : cartDataGst?.total_gst_amount * productdata.qty}


                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>Grand Total</strong>
                      </td>

                      <td className="text-right" id="grandtotal_display">
                        {productdata.course_type == 1 ? (
                          <>
                            {cgstData.length != "" ? (
                              <strong>
                                <i className="fa fa-rupee mr-1"></i>
                                {gstData.total_amount_withgst
                                  ? gstData.total_amount_withgst
                                  : productdata.final_amount}
                              </strong>
                            ) : (
                              <>
                                <i className="fa fa-rupee mr-1"></i>
                                {productdata.final_amount}
                              </>
                            )}
                          </>
                        ) : (
                          <strong>
                            <i className="fa fa-rupee mr-1"></i>
                            {productdata.course_type == 1
                              ? //parseInt(productdata.final_amount)
                                gstData?.total_amount_withgst
                                ? gstData?.total_amount_withgst
                                : cartDataGst?.total_payble_amount
                              : gstData?.total_amount_withgst
                              ? gstData?.total_amount_withgst
                              : cartDataGst?.total_payble_amount}
                          </strong>
                        )}
                      </td>
                    </tr>

                    {shipingCartData != "" ? (
                      <tr>
                        <td>
                          <p>Shiping Charge</p>
                        </td>

                        <td className="text-right" id="grandtotal_display">
                          {productdata == 1 ? (
                            <p>
                              <i className="fa fa-rupee mr-1"></i>
                              {shipingCartData ?(shipingCartData * productdata.qty).toFixed(2) : "0"}
                            </p>
                          ) : (
                            <p>
                              <i className="fa fa-rupee mr-1"></i>
                              {Number(shipingCartData).toFixed(2)}
                            </p>
                          )}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          <div>
            {Addr ? (
              <>
                <button
                  className="btn btn-danger btn-block"
                  onClick={WholePayment}
                >
                  Pay Now
                </button>
                {/* <button
                className="btn btn-danger btn-block"
                onClick={PaymentMode}
              >
                Payment Mode
              </button> */}
              </>
            ) : (
              <button className="btn btn-danger btn-block" onClick={MoveToAdd}>
                Add Address to continue
              </button>
            )}

            <br />
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose a way to pay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ margin: "20px" }}>
            {options?.map((option) => (
              <Form.Check
                key={option.id} // Assuming each option has a unique 'id'
                type="radio"
                label={option.payment_gateway_name} // Assuming each option has a 'name' property
                name="radioGroup"
                id={option.id}
                value={option.id} // Assuming 'id' is unique and suitable for value
                checked={selectedOption === option.id}
                onChange={handleOptionChange}
              />
            ))}

            <Modal.Footer>
              <Button
                onClick={() => WholePayment(selectedOption)}
                variant="primary"
              >
                Pay
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PriceDetail;

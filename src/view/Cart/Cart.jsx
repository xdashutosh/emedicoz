import "../../assets/css/cart-page/style.css";
import "../../assets/css/cart-page/cart-responsive.css";
import "../../assets/css/coupon_code/style.css";
import "../../assets/newjs/style.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosConfig";
import PriceDetails from "../Cart/components/PriceDetails";
import Coupon from "../Cart/components/Coupon";
import Addres from "../Cart/components/Address";
import EarnPoint from "../Cart/components/EarnPoint";
import PayUsingPoint from "../Cart/components/PayUsingPoint";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
// import { Button, Modal } from "react-bootstrap";

const Cart = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [cartData, setCartData] = useState(null);
  const userid = sessionStorage.getItem("id");
  const jwtToken = sessionStorage.getItem("jwt_token");
  const [couponData, setCouponData] = useState({});
  const [gstData, setGstData] = useState([]);
  const [counter, setCounter] = useState("");
  const [couponStatus, setCouponStatus] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState([]);
  const [showAddress,setShowAddress]=useState({})

  const defaultAddressId = localStorage.getItem("defaultAddressId");

  //

  const getCartData = async () => {
    try {
      const res = await axiosInstance.post(
        `/v1_data_model/user/user_cart/get_user_cart_data`,
        { user_id: userid }
      );
      document.getElementById("cart_length").innerHTML =
        res.data.data.list.length;
      // window.alert(res.data.data.list.length);
      setCartData(res?.data?.data?.list);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.post(
        "v1_data_model/user/User_cart/get_address",
        {
          user_id: userid,
        }
      );

      setData(response.data.data);
      const filteredData = response.data.data.filter(
        (address) => address.is_default === "1"
      );
      if (filteredData.length > 0) {
        localStorage.setItem("defaultAddressId", filteredData[0].id);
        localStorage.setItem("pincode", filteredData[0].pincode);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCartData();
    fetchData();
  }, [userid]);

  const handleRemoveCourse = (courseId) => {
    if (userid && jwtToken) {
      const requestData = {
        user_id: userid,
        course_id: courseId,
      };
      axiosInstance
        .post(
          "/v1_data_model/user/user_cart/remove_course_from_cart",
          requestData
        )
        .then((response) => {
          if (response.data && response.data.status === true) {
            document.getElementById("cart_length").innerHTML = 0;
            toast.success("Item has been removed from cart");
            dispatch(removeItemToCart(courseId));

            axiosInstance
              .post(
                "/v1_data_model/user/user_cart/get_user_cart_data",
                requestData
              )
              .then((response) => {
                if (response.data && response.data.status === true) {
                  setCartData(response.data.data.list);
                  localStorage.removeItem("TxnAmount");
                  nav("/");
                } else {
                  setCartData([]);
                  localStorage.removeItem("TxnAmount");
                  nav("/");
                }
              })
              .catch((error) => {
                console.log("Error reloading cart data:", error);
              });
          } else {
            console.log("Error removing course from cart:", response.data);
          }
        })
        .catch((error) => {
          console.log("Error removing course from cart:", error);
        });
    } else {
      console.log("User ID or JWT Token is missing.");
    }
  };

  var i = 1;
  const incrementCount = () => {
    var qty = parseFloat(cartData[0].qty) + i;
    update_book_qty_to_cart(qty);
  };
  var i = 1;
  const decrementCount = () => {
    if (counter !== 1) {
      var qty = parseFloat(cartData[0].qty) - i;

      update_book_qty_to_cart_minus(qty);
    }
  };

  const update_book_qty_to_cart = async (qty) => {
    try {
      const responce = await axiosInstance.post(
        `/v1_data_model/user/user_cart/update_book_qty_to_cart`,
        {
          user_id: userid,
          book_id: cartData[0].id ? cartData[0].id : "",
          variant: cartData[0].variant ? cartData[0].variant : "",
          qty: qty,
        }
      );
      if (responce) {
        getCartData();
        if (responce.data.message == "Book Qty has been added to cart.") {
          setCouponData("");
          setCouponStatus(true);
          toast.success("Item Qty has been added");
        } else {
          toast.success("Item has been added to your cart");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const update_book_qty_to_cart_minus = async (qty) => {
    try {
      const responce = await axiosInstance.post(
        `/v1_data_model/user/user_cart/update_book_qty_to_cart`,
        {
          user_id: userid,
          book_id: cartData[0].id ? cartData[0].id : "",
          variant: cartData[0].variant ? cartData[0].variant : "",
          qty: qty,
        }
      );
      if (responce) {
        getCartData();
        setCouponStatus(true);
        if (responce.data.message == "Book Qty has been added to cart.") {
          setCouponData("");
          toast.success("Item Qty has been removed");
        } else {
          toast.success("Item has been removed from your cart");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlerSelected = async (id) => {
    setShowAddress(id)
    setOpen(id);
  };


  const handleOk = async (data) => {
    try {
      const res = await axiosInstance.post(
        "v1_data_model/user/user_cart/set_default_address",
        {
          user_id: userid,
          address_id: data.id,
        }
      );
     toast.success("Address has been changed")
      setOpen(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };

  /* wallet check */
  // const [isChecked, setIsChecked] = useState(false);
  // const handleCheckboxChange = (event) => {
  //   setIsChecked(event.target.checked);
  // };
  return (
    <>
      <Modal
        open={open}
        onOk={() => handleOk(open)}
        onCancel={handleCancel}
      >
        <p>Are you sure want to select default address?</p>
        <p>Your Address :<b>{showAddress?.address}</b></p>
      </Modal>

      <div className="Cart">
        <div className="page-content position-relative">
          <div
            className="aboutbg"
            style={{
              backgroundImage: `url('https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/newjs/img/footerbg.png')`,
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                  <ul className="list-inline m-0">
                    <li>
                      <a href="/">Home / </a>
                    </li>
                    <li>Cart</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="shoping-cart position-relative">
          <div className="container">
            <input type="hidden" name="user_id" id="user_id1" value="" />
            <h2>My Cart</h2>
            {cartData && cartData.length ? (
              cartData.map((order, index) => (
                <div className="row">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
                    <div className="ibox">
                      <div className="group-item">
                        <div className="row">
                          <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                            <div className="cart-product-img">
                              <a href="javascript:void(0)">
                                {" "}
                                <img
                                  src="https://d2enu63wt1sf3u.cloudfront.net/course_file_meta/b2cb5482ec838ddcd082749b3ad98f51"
                                  alt="ULTIMATE LIVE"
                                  onerror="this.onerror=null; this.src=`https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/emedicoz-logo.png`"
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-8">
                            <div className="product-title">
                              {order.title}
                              <h3>
                                <a href="https://emedicoz.com/courses/detail?title=ULTIMATE LIVE &amp;category_id=980 &amp;combo=0                      &amp;course_type=7"></a>
                              </h3>
                              <div className="small-ratings">
                                <em className="fa fa-star "></em>
                                <em className="fa fa-star "></em>
                                <em className="fa fa-star "></em>
                                <em className="fa fa-star "></em>
                                <em className="fa fa-star "></em>
                                <span className="rating ml-2">
                                  <strong>{order.learner}</strong> | Enrolled{" "}
                                </span>
                              </div>
                            </div>
                            {order.course_type == 1 ? (
                              <span className="rating ml-2">
                                <strong>Course Type :</strong>{" "}
                                {order.course_type == 1 ? "Ecommerce" : ""}
                              </span>
                            ) : (
                              ""
                            )}
                            {order.course_type == 1 ? (
                              <div class="row">
                                <div class="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <div class="icon_add">
                                    <div class="input-group">
                                      <span class="input-group-btn">
                                        {order.qty == 1 ? (
                                          <button
                                            type="button"
                                            class="btn btn-number minus"
                                            data-type="minus"
                                            id="cart_row_id-77"
                                            onClick={decrementCount}
                                            disabled
                                          >
                                            <span class="fa fa-minus"></span>
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            class="btn btn-number minus"
                                            data-type="minus"
                                            id="cart_row_id-77"
                                            onClick={decrementCount}
                                          >
                                            <span class="fa fa-minus"></span>
                                          </button>
                                        )}
                                      </span>
                                      <input
                                        type="text"
                                        name="quant[2]"
                                        class="form-control input-number"
                                        id="getvalue"
                                        value={counter ? counter : order.qty}
                                        min={parseInt(order.qty)}
                                        max="5"
                                        fdprocessedid="vc9w0s"
                                      />
                                      <span
                                        class="input-group-btn"
                                        onclick="alertFix()"
                                      >
                                        <button
                                          type="button"
                                          class="btn btn-number plus"
                                          id="cart_row_id-779"
                                          data-id="779"
                                          onClick={incrementCount}
                                          value={counter}
                                        >
                                          <span class="fa fa-plus"></span>
                                        </button>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                            <div className="delbg text-right">
                              <a
                                onClick={() => {
                                  handleRemoveCourse(order.id);
                                }}
                              >
                                <img
                                  src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/cart-page/del-icon.svg"
                                  alt=""
                                />
                              </a>
                            </div>
                          </div>
                          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div className="monthly-price">
                              <div className="row">
                                <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                  <div
                                    className="heading"
                                    style={{ marginTop: "22px" }}
                                  >
                                    <span>{order.subscription_data.name}</span>
                                  </div>
                                </div>
                                <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                  <div className="price-listing text-right">
                                    <ul>
                                      <li>
                                        <em className="fa fa-rupee mr-1"></em>
                                        {order.course_type == 1
                                          ? order.final_amount
                                          : order.price}

                                        <span className="d-block">
                                          Exclusive of all taxes
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="walletBalance">
                    <input
                      type="checkbox"
                      id=""
                      name=""
                      value="Wallet"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label> Use your <span><em className="fa fa-rupee"></em> 1000 eMedicoz Wallet Balance</span></label>
                  </div> */}
                    <Coupon
                      CourseData={cartData}
                      setCouponData={setCouponData}
                      couponData={couponData}
                      setGstData={setGstData}
                      couponStatus={couponStatus}
                    />
                    {/*Coupon div modal div*/}
                    {/* //MyAddress */}
                    <div className="address-group">
                      <div className="row">
                        <div className="col-5 col-sm-5 col-md-6 col-lg-6 col-xl-6">
                          <h4>Delivery to this address</h4>
                        </div>
                        <div className="col-7 col-sm-7 col-md-6 col-lg-6 col-xl-6 text-right">
                          <a href={"/addnewaddress"}>
                            <em className="fa fa-map-marker fa-fw"></em>Add New
                            Address
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="no-found text-center">
                      <div className="row">
                        {data.length === 0 ? (
                          <p>No Address found</p>
                        ) : (
                          data.map((address, index) => (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => handlerSelected(address)}
                              // onClick={() => setOpen(true)}
                              className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"
                              key={index}
                            >
                              <div
                                className="testimonial"
                                style={{
                                  margin: "0px",
                                  textAlign: "left",
                                  background:
                                    address.is_default === "1"
                                      ? "#ffded4 "
                                      : "#fff",
                                  border:
                                    address.is_default === "1"
                                      ? "1px solid #f15a22 "
                                      : "1px solid #eee",
                                  padding: "6px 15px",
                                  marginBottom: "15px",
                                }}
                              >
                                <p
                                  className="description text-left"
                                  style={{ lineHeight: "25px", padding: "0px" }}
                                >
                                  <i className="fa fa-user fa-fw"></i>
                                  {address.name}
                                </p>
                                <p>
                                  <i className="fa fa-phone fa-fw"></i>
                                  {address.phone}
                                </p>
                                <p>
                                  <i className="fa fa-map-marker fa-fw"></i>
                                  {address.address}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    {/*Myaddress*/}
                    <PayUsingPoint />
                    {/*payusingpoint*/}
                    {/*earnpoint*/}
                    <EarnPoint />
                  </div>
                  <PriceDetails
                    cgstData={couponData}
                    gstData={gstData}
                    cartDatas={cartData}
                  />
                  {/*price*/}
                </div>
              ))
            ) : (
              <p>No order found</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default Cart;

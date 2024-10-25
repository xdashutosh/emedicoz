import "../../assets/css/order-tracking/style.css";
import "../../assets/css/order-tracking/responsive.css";
//import "../../assets/css/order-tracking/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosConfig";
const Ordertracking = () => {
  const userid = sessionStorage.getItem("id");
  const [trackData, SetTrack] = useState([]);

  const tackingObj = localStorage.getItem("transaction_id");

  console.log(tackingObj);
  console.log(userid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/v1_data_model/order/order/get_order_data`,
          {
            user_id: userid,
            transaction_id: localStorage.getItem("transaction_id"),
          }
        );

        //setData(response.data.data);
        console.log(response.data);
        SetTrack(response.data.track_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    //  fetchData();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [userid]);
  console.log(trackData);

  return (
    <>
      <div className="Myorder">
        <div className="page-content position-relative">
          <div className="breadcrumb-row">
            <div className="container">
              <ul className="list-inline">
                <li>
                  <a href={"/"}>Home</a>
                </li>
                <li>My Order</li>
              </ul>
            </div>
          </div>
        </div>

        <section class="order-tracking">
          <div class="container">
            <div class="row">
              <div class="col-12 col-sm-3 col-md-3 col-lg-2 col-xl-2 order-book">
                <img src={localStorage.getItem("cover_image")} />
              </div>
              <div class="col-12 col-sm-9 col-md-9 col-lg-10 col-xl-10">
                <div class="order-text">
                  <h3>
                    {localStorage.getItem("title")
                      ? localStorage.getItem("title")
                      : ""}
                  </h3>
                  <p>Seller: Delhi Academy of Medical Sciences</p>
                  <h4>
                    <span class="price">Price:</span>
                    <span class="offer">
                      ₹{" "}
                      {parseFloat(localStorage.getItem("net_amt")) +
                        parseFloat(localStorage.getItem("gst"))}
                      &nbsp;&nbsp;(
                      {localStorage.getItem("net_amt")
                        ? localStorage.getItem("net_amt")
                        : ""}
                      +
                      {localStorage.getItem("gst")
                        ? localStorage.getItem("gst")
                        : ""}
                      (GST))
                    </span>
                  </h4>
                  <h4>
                    <span class="price">Order ID: </span>
                    <span class="offer">
                      {"EMED00000" + localStorage.getItem("transaction_id")}
                    </span>{" "}
                    <span class="offer">
                      <span class="price">Status: </span>

                      {localStorage.getItem("transaction_status") == 0 ? (
                        <span class="rating" style={""}>
                          Pending
                        </span>
                      ) : localStorage.getItem("transaction_status") == 1 ? (
                        <span class="rating" style={{ color: "green" }}>
                          successful
                        </span>
                      ) : (
                        <span class="rating" style={{ color: "red" }}>
                          Failed
                        </span>
                      )}
                    </span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="row tracking">
              <div class="col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2"></div>
              <div class="col-12 col-sm-12 col-md-12 col-lg-10 col-xl-10">
                <ol class="progtrckr" data-progtrckr-steps="5">
                  <li class="progtrckr-done position-relative">
                    <span>
                      Ordered <br /> Placed
                    </span>
                  </li>
                  {trackData[0] ? (
                    <>
                  {trackData[0]["is_confirmed"] == 1 ? (
                    <>
                      <li class="progtrckr-todo position-relative">
                        <span>
                          Ordered <br /> Confirmed
                        </span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Packed</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Shipped</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Out of Delivery</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Delivery</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li class="progtrckr-todo position-relative">
                        <span>
                          Ordered <br /> Confirmed
                        </span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Packed</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Shipped</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Out of Delivery</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Delivery</span>
                      </li>
                    </>
                  )}
                  </>
                  ):(
                    <>
                    <li class="progtrckr-todo position-relative">
                        <span>
                          Ordered <br /> Confirmed
                        </span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Packed</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Shipped</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Out of Delivery</span>
                      </li>
                      <li class="progtrckr-todo position-relative">
                        <span>Delivery</span>
                      </li>
                      </>

                  )}

                </ol>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 p-0">
                <div class="track-status">
                  <h3>STATUS</h3>
                  <div class="table-responsive">
                    <table class="table">
                      <tbody>
                        <tr>
                          <td class="bold size">
                            <span>
                              <img
                                src="http://localhost/live-emedicoz/ci_4/assets/images/order-tracking/order.svg"
                                alt=""
                              />
                            </span>
                            Ordered Placed
                          </td>
                          <td>{localStorage.getItem("creation_time")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Ordertracking;

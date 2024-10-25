import "../../assets/css/shortcodes/shortcodes.css";
import "../../assets/css/my-order/style.css";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../API/axiosConfig";
//import Ordertracking from "./OrderTracking";
import { Link, useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Myorder = () => {
  const userid = sessionStorage.getItem("id");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setrowsPerPage] = useState(6)
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItem = data?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(data?.length / rowsPerPage);
  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPage))
  }
  const handlePageClick = (PageNumber) => {
    setCurrentPage(PageNumber)
  }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/v1_data_model/courses/My_courses/order_history`,
          { user_id: userid, last_id: "" }
        );
        setData(response?.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [userid]);

  const handleTracking = (
    cover_image,
    title,
    net_amt,
    gst,
    id,
    creation_time,
    transaction_status
  ) => {
    localStorage.setItem("cover_image", cover_image);
    localStorage.setItem("title", title);
    localStorage.setItem("net_amt", net_amt);
    localStorage.setItem("gst", gst);
    localStorage.setItem("transaction_id", id);
    localStorage.setItem("creation_time", creation_time);
    localStorage.setItem("transaction_status", transaction_status);

    navigate("/order-tracking");
  };

  function formatSecondsToDate(seconds) {
    const dateObj = new Date(seconds);
    const day = dateObj.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;

    const formattedDate = `${formattedDay}/${monthName}/${year}`;
    return formattedDate;
  }

  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const toggleVisibility = (id) => {
    const updatedVisibleIndexes = [...visibleIndexes];
    updatedVisibleIndexes[id] = !updatedVisibleIndexes[id];
    setVisibleIndexes(updatedVisibleIndexes);
  };

  const handleDownload = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "Invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInvoice = (oid, cid) => {
    navigate(`/invoice/${oid}C${cid}U${userid}`);
  };

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
        <div className="content-block">
          <div className="section-area my-order section-sp1 p-t20">
            <div className="container">
              <div className="row" id="see_more_order">
                {data.length === 0 ? (
                  <p>No order found</p>
                ) : (
                  currentItem.map((order, id) => (
                    <div
                      key={id}
                      className="col-sm-12 col-12 col-md-6 col-lg-4 hide"
                    >
                      <div className="event-bx">
                        <img
                          className="order-img"
                          src={(
                            order.cover_image ||
                            order.cover_image ||
                            "https://d2enu63wt1sf3u.cloudfront.net/course_file_meta/b2cb5482ec838ddcd082749b3ad98f51"
                          )?.replace(/\\\//g, "/")}
                        />
                        {order.is_paper_book == 1 ? (
                          <input
                            type="submit"
                            className="track-btn text-center"
                            value="order tracking"
                            fdprocessedid="d6e1ex"
                            onClick={() =>
                              handleTracking(
                                order.cover_image,
                                order.title,
                                order.net_amt,
                                order.gst,
                                order.id,
                                order.creation_time,
                                order.transaction_status
                              )
                            }
                          ></input>
                        ) : (
                          ""
                        )}
                        <div className="event-info event-eme">
                          <h4>{order.title}</h4>
                          <p className="lean_pri">
                            <span>
                              <em className="fa fa-rupee"></em>{" "}
                              {order.course_price}
                            </span>
                          </p>
                          <div className="join-text">
                            <ul className="order_summery">
                              <li className="float-left">
                                Status :
                                <span
                                  style={{
                                    color:
                                      order?.transaction_status == 1
                                        ? "green"
                                        : order?.transaction_status == 2
                                        ? "red"
                                        : "blue",
                                  }}
                                >
                                  {order?.transaction_status == 1
                                    ? "Successfull"
                                    : order?.transaction_status == 2
                                    ? "Failed"
                                    : "Refunded"}
                                </span>
                              </li>
                              <li className="float-right text-right">
                                Payment Type:{" "}
                                <span className="defr">Full Time</span>
                              </li>
                            </ul>
                            <ul className="order_summery">
                              <li className="float-left">
                                Validity :{" "}
                                <span>
                                  {formatSecondsToDate(Number(order?.validity))}
                                </span>
                              </li>
                            </ul>

                            {order?.is_cbt == 1 && (
                              <ul className="order_summery">
                                <li className="float-left">
                                  Exam Mode: <span>CBT</span>
                                </li>
                                <li className="float-left">
                                  Exam City: <span>{order?.city_name}</span>
                                </li>
                              </ul>
                            )}
                            <ul className="order_summery">
                              <li className="float-left">
                                Purchased : <span>{order.creation_time}</span>
                              </li>
                            </ul>
                            {/* <button
                              onClick={() =>
                                handleDownload(order?.invoice_download_url)
                              }
                            >
                              <em className="fa fa-download"></em>
                            </button> */}
                            {order?.transaction_status == 1 && (
                              <>
                                <em className="fa fa-download"></em>
                                <button
                                  style={{
                                    padding: "4px",
                                    backgroundColor: "gray",
                                    marginLeft: "5px",
                                    color: "white",
                                    borderRadius: "10px",
                                  }}
                                  onClick={() =>
                                    handleInvoice(
                                      order?.pre_transaction_id,
                                      order?.course_id
                                    )
                                  }
                                >
                                  Download Invoice
                                </button>
                              </>
                            )}
                            <p
                              className="text-center det_in"
                              onClick={() => toggleVisibility(id)}
                            >
                              Invoice detail
                              {visibleIndexes[id] ? (
                                <FaAngleDown />
                              ) : (
                                <FaAngleUp />
                              )}
                            </p>
                            {visibleIndexes[id] ? (
                              <ul className="invoice_data">
                                <li>
                                  Quantity
                                  <span>{order.quantity}</span>
                                </li>
                                <li>
                                  Price
                                  <span>
                                    <em className="fa fa-rupee"></em>{" "}
                                    {order.course_base_price}
                                  </span>
                                </li>
                                <li>
                                  Coupan
                                  <span>
                                    {order.coupon_discount == null
                                      ? "Not Available"
                                      : `-  ${order.coupon_discount}`}
                                  </span>
                                </li>
                                <li>
                                  Shipping Charge
                                  <span>
                                    <em className="fa fa-rupee"></em>{" "}
                                    {order.shipping_charge}
                                  </span>
                                </li>
                                <li>
                                  GST Tax
                                  <span>
                                    <em className="fa fa-rupee"></em>{" "}
                                    {order.total_gst_amount}
                                  </span>
                                </li>
                                <li style={{ fontWeight: "bolder" }}>
                                  Grand Total
                                  <span>
                                    <em className="fa fa-rupee"></em>{" "}
                                    {order.course_price}
                                  </span>
                                </li>
                              </ul>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
              {Array.from({ length: totalPage }, (_, index) => (
                <button onClick={() => handlePageClick(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>{index + 1}</button>
              ))}
              <button onClick={handleNext} disabled={currentPage === totalPage}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Myorder;

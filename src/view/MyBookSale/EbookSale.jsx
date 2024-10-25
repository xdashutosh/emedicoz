import { Button, Col, Radio, Row } from "antd";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import "../../assets/css/publish-book/style.css";
import "../../assets/css/publish-book/responsive.css"

const EbookSale = () => {
  const id = sessionStorage.getItem("id");
  const [tabsValue, setTabsValue] = useState("UN");
  const [unpublisedData, setUnpublisedData] = useState([]);
  const [publisedData, setPublisedData] = useState([]);

 

  const tabs = [
    {
      name: "Unpublised",
      img: "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/publish-book/book-icon.svg",
      value: "UN",
    },
    {
      name: "Publised",
      img: "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/publish-book/book-img.svg",
      value: "P",
    },
    {
      name: "Sales Report",
      img: "https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/publish-book/report-img.svg",
      value: "SR",
    },
  ];

  const getTabData = async () => {
    try {
      const res = await axiosInstance.post(
        "/ebook_sales_model/Ebooksales_details",
        {
          user_id: id,
          page_no: 0,
        }
      );
      setUnpublisedData(res.data.data.record);
    } catch (err) {
      console.log(err);
    }
  };

  const getPublisedCalled = async() =>{
    try {
      const res = await axiosInstance.post(
        "/ebook_sales_model/Ebooksales_details",
        {
          user_id: id,
          page_no: 0,
        }
      );
      const re = res.data.data.record.filter((itm)=>itm.status === 1)
      setPublisedData(re)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (tabsValue === "UN") {
      getTabData();
    }
  }, [tabsValue]);

  useEffect(()=>{
    if (tabsValue === "P") {
      getPublisedCalled()
    }
  },[tabsValue])

  return (
    <div className="EbookSale">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>My Book Sales</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <section className="publish-books-tab">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <ul className="nav nav-pills">
                {tabs.map((itm, i) => (
                  <li
                    className="nav-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => setTabsValue(itm.value)}
                    key={i}
                  >
                    <a
                      className={`nav-link ${
                        tabsValue === itm.value ? "active" : ""
                      } `}
                    >
                      <span className="d-block">
                        <img src={itm.img} />
                      </span>
                      {itm.name}
                    </a>
                  </li>
                ))}
              </ul>
              {tabsValue === "UN" ? (
                <div className="salesbookTab">
                  <Row gutter={16} className="mobileData">
                    {unpublisedData?.map((itm, i) => (
                      <Col
                        className="gutter-row"
                        span={12}
                        key={i}
                        
                      >
                        <div className="bookChild">
                          <div className="imgSide">
                            <img
                              src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/publish-book/book-img1.svg"
                              width="100%"
                            />
                          </div>
                          <div className="textSide">
                            <span>
                              Book Name:<b>{itm.book_title}</b>
                            </span>
                            <span>
                              Book Price:<b>{itm.book_price}</b>
                            </span>
                            <span>
                              Status:
                              <b style={{ color: "#f15a22" }}>Under Review</b>
                            </span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : tabsValue === "P" ? (
                <div className="salesbookTab">
                  <Row gutter={16} className="mobileData">
                    {publisedData?.map((itm, i) => (
                      <Col
                        className="gutter-row"
                        span={12}
                        key={i}
                      >
                        <div className="bookChild">
                          <div className="imgSide">
                            <img
                              src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/publish-book/book-img1.svg"
                              width="100%"
                            />
                          </div>
                          <div className="textSide">
                            <span>
                              Book Name:<b>{itm.book_title}</b>
                            </span>
                            <span>
                              Book Price:<b>{itm.book_price}</b>
                            </span>
                            <span>
                              Status:<b style={{ color: "green" }}>Publised</b>
                            </span>
                          </div>
                        </div>
                      </Col>
                    ))}
                    <Col span={24}>No data found...</Col>
                  </Row>
                </div>
              ) : (
                <div className="DaysTab">
                  <div className="tabData">
                    <Radio.Group
                      size="large"
                      // onChange={(e) => setSize(e.target.value)}
                    >
                      <Radio.Button value="today" className="daybtn">Today</Radio.Button>
                      <Radio.Button value="weekly" className="daybtn">Weekly</Radio.Button>
                      <Radio.Button value="monthly" className="daybtn">Monthly</Radio.Button>
                      <Radio.Button value="yearly" className="daybtn">Yearly</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{marginTop:"40px"}}>
                    <table>
                      <tr>
                        <th>Book Name</th>
                        <th>Unit Sold</th>
                        <th>MRP</th>
                        <th>Selling Price</th>
                        <th>Earning Price</th>
                      </tr>
                      <tr>
                        <td>No data found....</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default EbookSale;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";

const AllLounge = () => {
  // const user_id = sessionStorage.getItem("id");
  const [videoData, setvidData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getAllCat = async () => {
      const response = await axiosInstance.get(
        `/v1_data_model/unique_selling_point/usp/podcast_category_list`
      );
      if (response.status) {
        setvidData(response?.data?.data);
      }
    };
    getAllCat();
  }, []);
  const handleShow = (id) => {
    navigate(`/lounge/${id}`);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="AllLounge">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>Podcast video category</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="LoudgeData">
        <div className="container">
          <Row>
            {videoData?.map((itm, index) => (
              <Col key={index} md={4} style={{ marginBottom: "20px" }}>
                <div
                  class="videoData"
                  style={{}}
                  onClick={() => handleShow(itm.cat_id)}
                >
                  <img src={itm.icon} alt="Video Banner" style={{}} />
                  <div className="videotext" style={{}}>
                    <p style={{}}>{itm.category}</p>
                    <FaArrowRight />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AllLounge;

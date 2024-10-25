import "../../../assets/css/shortcodes/shortcodes.css";
import "../../../assets/css/podcast/style.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import { Link } from "react-router-dom";
import axiosInstance from "../../../API/axiosConfig";

const Sidebar = ({ onDataUpdate, sidebarData, setPodcast }) => {
  // console.log(arrayData);

  const userid = sessionStorage.getItem("id");
  const [itemName, setItemName] = useState("podcast");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `/v1_data_model/podcasts/podcast/get_podcast_author_channel_list`,
          { user_id: userid, stream_id: 1 }
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userid]);

  return (
    <div className="leftside">
      <div className="nav nav-pills nav-pills-custom leftportion">
        {sidebarData?.map((item, i) => (
          <Link
            // className={item.class}
            className={
              item.value === itemName ? "nav-link active show" : "nav-link"
            }
            onClick={() => {
              setPodcast(item.value);
              setItemName(item.value);
            }}
          >
            <span>
              <img className="imgtab" src={item.image} alt="" />
            </span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

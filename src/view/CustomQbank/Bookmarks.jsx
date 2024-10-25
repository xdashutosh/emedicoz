import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosConfig';
import "../../assets/css/bookmark/style.css";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
const Bookmarks = () => {
    const user_id = sessionStorage.getItem("id");
    const [qbListData, setQbListData] = useState([]);
    const [arrowToggle, setArrowToggle] = useState(null);
    const [mybookmarkList, setMybookmarkList] = useState([]);
useEffect(()=>{
    const getdata= async()=>{
        const response = await axiosInstance.post(
            "v1_data_model/fanwall/Fan_wall/bookmark_category_list",
            { user_id: user_id, stream: "1", q_type_dqb: "2", type: "QUIZ" }
          );
          // console.log(response?.data?.data)
          const data = response?.data?.data.filter((itm) => itm.total > 0);
          setQbListData(data);
    }
    getdata();
},[])

const handleSectionClick = (index) => {
    // console.log(index);
    setArrowToggle(arrowToggle === index ? null : index);
    getCalledToggle(index);
  };  const getCalledToggle = async (id) => {
    try {
      const response = await axiosInstance.post(
        "v1_data_model/fanwall/Fan_wall/bookmark_list",
        {
          user_id: user_id,
          steam: "",
          last_post_id: "",
          tag_id: id,
          test_series_id: "",
          q_type_dqb: "2",
          type: "QUIZ",
          search_text: "",
        }
      );
      setMybookmarkList(response?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='DqbBookmarkData'>
      <div className='container'>
        <div>{qbListData?.map((itm, i) => (
            <div
              key={i}
              className="tab-content1"
              style={{ position: "relative" }}
            >
              <div
                className="loaderajax"
                style={{ display: "none" }}
              >
                <img
                  alt="loader"
                  src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/Double Ring-1s-200px.svg"
                />
              </div>

              <div className="tab-pane fade show active">
                <div id="post_list">
                  <div className="widget curriculum-emez">
                    <div className="widget-post-bx">
                      <div className="widget-post clearfix">
                        <div
                          className="listbox_bookmark text-center"
                          style={{
                            background: "#297E22",
                          }}
                        >
                          <h1>{itm.text.charAt(0)}</h1>
                        </div>
                        <div className="ttr-post-info">
                          <div className="ttr-post-header flex-grow-1">
                            <span
                              className="float-right"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleSectionClick(itm.id)
                              }
                            >
                              {arrowToggle === itm.id ? (
                                <IoMdArrowDropdown
                                  size={25}
                                />
                              ) : (
                                <IoMdArrowDropright
                                  size={25}
                                />
                              )}
                            </span>
                            <h6 className="post-title">
                              <a className="feeddetails">
                                {itm.text}{" "}
                                <span>({itm.total})</span>
                              </a>
                            </h6>
                          </div>
                        </div>
                      </div>
                      {arrowToggle === itm.id && (
                        <ul>
                          {mybookmarkList?.map((it, i) => (
                            <li>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: it.question,
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
       </div>
        
  )
}

export default Bookmarks
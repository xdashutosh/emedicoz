import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const LatestNewsArticles = ({ newzData }) => {
  const [selectid, setselectid] = useState(null);

  const navigate = useNavigate();
  const NewsArticle = (id) => {
    // localStorage.setItem("LatestNewsArticlesid", id);
    navigate("/news-article");
  };

  const convertTimestamp = (timestamp) => {
    let date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };
  return (
    <section className="latest_news homeletestNews position-relative">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div
              className="globe_heading"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="font-weight-bold">
                Latest News <span>&amp; Articles</span>
              </h2>
              <span
                className="seeAll"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/news-and-article")}
              >
                See all
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          {newzData?.map((resullt, i) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3"
              key={i}
              onClick={() => navigate(`/news-article/${resullt.id}`)}
            >
              <div
                className="article-img  position-relative"
                style={{ cursor: "pointer" }}
              >
                <img src={resullt.image} alt="img" />
                <a>
                  <h4>{resullt.title}</h4>
                </a>
                <p>{resullt.small_content}</p>
                {/* <div className="like-wish">
                  <ul>
                    <li>
                      <a className="likebook">
                        <i className="fa fa-thumbs-o-up"></i>
                      </a>
                    </li>
                  </ul>
                </div> */}
                <div className="row">
                  <div className="col-7 col-sm-7 col-md-12 col-lg-7 col-xl-7">
                    <div className="publish">
                      <ul>
                        <li>
                          Published By:
                          <span className="ml-2">{resullt.created_by}</span>
                        </li>
                        <li>{convertTimestamp(resullt.creation_date)}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-5 col-sm-5 col-md-12 col-lg-5 col-xl-5">
                    <div className="publish view_like text-right">
                      <ul>
                        <li>
                          <em class="fa fa-eye mr-1"></em>
                          {resullt.views} Views
                        </li>
                        <li>
                          <em class="fa fa-thumbs-o-up mr-1"></em>
                          {resullt.likes} Likes
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default LatestNewsArticles;

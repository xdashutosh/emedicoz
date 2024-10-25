import "../../assets/css/ecommerce/responsive.css";
import "../../assets/css/ecommerce/style.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";
import { Link } from "react-router-dom";
import axiosInstance from "../../API/axiosConfig";

const Store = () => {
  const navigate = useNavigate();
  const handleProduct = (productId) => {
    localStorage.setItem("productId", productId);
    navigate("/product-detail");
  };
  const handleSubCategory = (subId) => {
    localStorage.setItem("subId", subId);
    navigate("/sub-category");
  };

  const [categorylist, setcategorylist] = useState([]);
  const [product_list, setproduct_list] = useState([]);
  const [bannerlist, setbannerlist] = useState([]);
  const [toptrendinglist, settoptrendinglist] = useState([]);
  const [bestsellerlist, setbestsellerlist] = useState([]);
  const [withoutcategorylist, setwithoutcategorylist] = useState([]);




  

  const user_id = sessionStorage.getItem("id");

  useEffect(() => {
    axiosInstance
      .post(
        `/v1_data_model/courses/Ec_product/get_ecomm_category_list`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        console.log(response.data);
        setbannerlist(response.data.banner);
        setcategorylist(response.data.data.category_list);
        setproduct_list(response.data.data.all_product_list);
        settoptrendinglist(response.data.data.top_trending);
        setbestsellerlist(response.data.data.best_seller);
        setwithoutcategorylist(response.data.data.without_category);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);

  return (
    <div className="Store">
      <div className="page-content position-relative">
        <div className="breadcrumb-row d-none">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href="/">Home</a>
              </li>
              <li>Store</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="book-mod-page">
        <div className="container">
          <div className="slider-data">
            <div
              id="carousel-example-1z"
              className="carousel slide carousel-fade mb-5"
              data-ride="carousel"
            >
              {bannerlist?.map((banner) => (
                <div className="carousel-inner active" role="listbox">
                  <div className="carousel-item active">
                    <img
                      className="d-block w-100"
                      src={banner.image_link}
                      alt="image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/*  <div className="search_br position-relative">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="input-group position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for Products"
                    value={searchItem}
                    onChange={handleInputChange}
                  />
                  <button className="btn" type="button">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          */}
          <div className="tagoth_section" id="remove">
            <div className="row">
              <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <h3 className="tt_x">Category</h3>
              </div>
            </div>
          </div>

          <div className="category_detail">
            <div id="bookAjaxList">
              <div className="row">
                {categorylist?.map((category) => (
                  <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center">
                    <a onClick={() => handleSubCategory(category.id)}>
                      <div className="img_bg">
                        <img src={category.cat_img} alt="" />
                      </div>
                      <div className="link_bg">{category.category}</div>
                    </a>
                  </div>
                ))}
              </div>

              <div className="tagoth_section mt-4">
                <div className="row">
                  <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <h3 className="tt_x">Product List</h3>
                  </div>
                  <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-right see">
                    <Link to={"/product-list"}>See all </Link>
                  </div>
                </div>
              </div>
              <div className="tabbing_data_oth">
                <div className="tab-content">
                  <div className="tab-pane active">
                    <div
                      className="owl-carousel owl-theme mt-4 owl-loaded owl-drag"
                      id="quick-buy"
                    >
                      <div className="owl-stage-outer">
                        <div
                          className="owl-stage"
                          style={{
                            width: "1078px",
                            transform: "translate3d(0px, 0px, 0px)",
                            transition: "all 0s ease 0s",
                          }}
                        >
                          {product_list?.map((product) => (
                            <div
                              className="owl-item active"
                              style={{ width: "259.5px", marginRight: "10px" }}
                            >
                              <div className="item position-relative">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() => handleProduct(product.id)}
                                >
                                  <div className="back_bg">
                                    <img
                                      src={product.featured_image}
                                      alt=""
                                      onerror="this.src='https://emedicoz.com/assets/image_not_found.webp'"
                                    />
                                  </div>
                                  <h3>
                                    {product.title}{" "}
                                    <span className="d-block"> </span>
                                  </h3>
                                </a>
                                <p>{product.auther}</p>
                                <div className="edition">
                                  <a href="javascript:;">
                                    {product.publication_date.split("-")[0]}
                                    &nbsp; Edition
                                  </a>
                                </div>

                                <div className="price-img position-relative">
                                  <h4 className="price">
                                    <em className="fa fa-rupee"></em>
                                    {product.discount_paper_price}{" "}
                                    <span>
                                      ({product.discount_paper} % OFF)
                                    </span>
                                  </h4>
                                  <div className="row">
                                    <div className="col-6 col-md-6 col-xl-6">
                                      <del>
                                        <em className="fa fa-rupee"></em>
                                        {product.paper_book_price}{" "}
                                      </del>
                                    </div>
                                    <div className="col-6 col-md-6 col-xl-6 text-right">
                                      <div className="rating">
                                        <em className="fa fa-star"></em>
                                        {product.rating}{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="owl-nav disabled">
                        <button
                          type="button"
                          role="presentation"
                          className="owl-prev disabled"
                        >
                          <span aria-label="Previous">‹</span>
                        </button>
                        <button
                          type="button"
                          role="presentation"
                          className="owl-next disabled"
                        >
                          <span aria-label="Next">›</span>
                        </button>
                      </div>
                      <div className="owl-dots disabled"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tagoth_section">
                <div className="row">
                  <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                    <h3 className="tt_x">Quick Buy</h3>
                  </div>
                  <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-right see">
                    <Link to={"/quick-buy"}>See all </Link>
                  </div>
                </div>
              </div>
              <div className="tabbing_data_oth p-0">
                <div className="tab-content">
                  <div className="tab-pane active">
                    <div
                      className="owl-carousel owl-theme mt-4 owl-loaded owl-drag"
                      id="quick-buy"
                    >
                      <div className="owl-stage-outer">
                        <div
                          className="owl-stage"
                          style={{
                            width: "539px",
                            transform: "translate3d(0px, 0px, 0px)",
                            transition: "all 0s ease 0s",
                          }}
                        >
                          {toptrendinglist?.map((toptrending) => (
                            <div
                              className="owl-item active"
                              style={{ width: "259.5px", marginRight: "10px" }}
                            >
                              <div className="item position-relative">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() => handleProduct(toptrending?.id)}
                                >
                                  <div className="back_bg">
                                    <img
                                      src={toptrending?.featured_image}
                                      alt=""
                                      onerror="this.src='https://emedicoz.com/assets/image_not_found.webp'"
                                    />
                                  </div>
                                  <h3>
                                    {toptrending.title}{" "}
                                    <span className="d-block"> </span>
                                  </h3>
                                </a>
                                <p>{toptrending.auther}</p>
                                <div className="edition">
                                  <a href="javascript:;">
                                    {toptrending.publication_date.split("-")[0]}
                                    &nbsp;Edition
                                  </a>
                                </div>

                                <div className="price-img position-relative">
                                  <h4 className="price">
                                    <em className="fa fa-rupee"></em>
                                    {toptrending.discount_paper_price}{" "}
                                    <span>
                                      ({toptrending.discount_paper} % OFF)
                                    </span>
                                  </h4>
                                  <div className="row">
                                    <div className="col-6 col-md-6 col-xl-6">
                                      <del>
                                        <em className="fa fa-rupee"></em>
                                        {toptrending.paper_book_price}{" "}
                                      </del>
                                    </div>
                                    <div className="col-6 col-md-6 col-xl-6 text-right">
                                      <div className="rating">
                                        <em className="fa fa-star"></em>
                                        {toptrending.rating}{" "}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="owl-nav disabled">
                        <button
                          type="button"
                          role="presentation"
                          className="owl-prev disabled"
                        >
                          <span aria-label="Previous">‹</span>
                        </button>
                        <button
                          type="button"
                          role="presentation"
                          className="owl-next disabled"
                        >
                          <span aria-label="Next">›</span>
                        </button>
                      </div>
                      <div className="owl-dots disabled"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tabbing_data_oth m-0 p-0">
                <div className="tab-content">
                  <div className="tab-pane active">
                    <div
                      className="owl-carousel owl-theme mt-4 owl-loaded owl-drag"
                      id="best-selling"
                    >
                      <div className="owl-stage-outer">
                        {bestsellerlist?.map((bestseller) => (
                          <div
                            className="owl-item active"
                            style={{ width: "259.5px", marginRight: "10px" }}
                          >
                            <div className="item position-relative">
                              <a
                                href="javascript:void(0)"
                                onClick={() => handleProduct(bestseller.id)}
                              >
                                <div className="back_bg">
                                  <img
                                    src={bestseller.featured_image}
                                    alt=""
                                    onerror="this.src='https://emedicoz.com/assets/image_not_found.webp'"
                                  />
                                </div>
                                <h3>
                                  {bestseller.title}{" "}
                                  <span className="d-block"> </span>
                                </h3>
                              </a>
                              <p>{bestseller.auther}</p>
                              <div className="edition">
                                <a href="javascript:;">
                                  {bestseller.publication_date}
                                </a>
                              </div>

                              <div className="price-img position-relative">
                                <h4 className="price">
                                  <em className="fa fa-rupee"></em>
                                  {bestseller.discount_paper_price}{" "}
                                  <span>
                                    ({bestseller.discount_paper} % OFF)
                                  </span>
                                </h4>
                                <div className="row">
                                  <div className="col-6 col-md-6 col-xl-6">
                                    <del>
                                      <em className="fa fa-rupee"></em>
                                      {bestseller.paper_book_price}{" "}
                                    </del>
                                  </div>
                                  <div className="col-6 col-md-6 col-xl-6 text-right">
                                    <div className="rating">
                                      <em className="fa fa-star"></em>
                                      {bestseller.rating}{" "}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="owl-nav disabled">
                        <button
                          type="button"
                          role="presentation"
                          className="owl-prev disabled"
                        >
                          <span aria-label="Previous">‹</span>
                        </button>
                        <button
                          type="button"
                          role="presentation"
                          className="owl-next disabled"
                        >
                          <span aria-label="Next">›</span>
                        </button>
                      </div>
                      <div className="owl-dots disabled"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Store;

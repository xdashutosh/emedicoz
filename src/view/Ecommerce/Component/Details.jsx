import "../../../assets/css/ecommerce/responsive.css";
import "../../../assets/css/ecommerce/style.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../API/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notification } from "antd";
import { FaClipboard } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../network/cartSlice";

const Detail = () => {
  const dispatch = useDispatch()
  const [counter, setCounter] = useState(1);
  const [image, SetImage] = useState("");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [dcid, setdefaultcolorid] = useState(null);
  const [dattid, setdefaultattid] = useState(null);
  const [atid, setattid] = useState(null);
  const [selectedType, setSelectedType] = useState("S");
  const handleSelect = (val, atid) => {
    setSelectedType(val);
    setattid(atid);
    setdefaultattid(null);
  };

  const incrementCount = () => {
    setCounter(counter + 1);
  };

  const decrementCount = () => {
    if (counter !== 1) {
      setCounter(counter - 1);
    }
  };

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id");

  const addcart = (ProductData) => {
    console.log(ProductData);
    var book_id = ProductData.id;
    if (
      ProductData.is_paper_book == 1 ||
      ProductData.is_ebook == 0 ||
      ProductData.is_audiable == 0
    ) {
      var variant = "paper_book_price";
      var attribute_id = atid ? atid : dattid;
      var color_id = dcid;
    } else if (
      ProductData.is_paper_book == 0 ||
      ProductData.is_ebook == 1 ||
      ProductData.is_audiable == 0
    ) {
      var variant = "ebook_price";
    } else if (
      ProductData.is_paper_book == 0 ||
      ProductData.is_ebook == 0 ||
      ProductData.is_audiable == 1
    ) {
      var variant = "audiable_price";
    }
    localStorage.setItem("subID", ProductData.id);

    const jwt_token = JSON.parse(localStorage.getItem("jwt_token"));
    const requestData2 = {
      user_id: userId,
      book_id: book_id,
      variant: variant,
      qty: counter,
      attribute_id: attribute_id,
      color_id: color_id,
    };

    const requestData = {
      user_id: userid,
    };

    axiosInstance
      .post("/v1_data_model/user/User_cart/clear_cart", requestData)
      .then((response) => {
        dispatch(clearCart())
        addCart(requestData2);
        toast.success("Item has been added successfully...");
      })
      .catch((error) => {
        console.error("Error fetching Stream list data:", error);
      });
  };

  const addCart = (requestData2) => {
    localStorage.setItem("CbtType", JSON.stringify("0"));
    axiosInstance
      .post("/v1_data_model/courses/Ec_product/add_book_to_cart", requestData2)
      .then((response) => {
        navigate("/addToCart");
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error("Error fetching list data:", error);
      });
  };
  const userid = sessionStorage.getItem("id");
  const [ProductData, setProductDetail] = useState([]);
  const [BannertData, setBanner] = useState([]);

  const productId = localStorage.getItem("productId");
  useEffect(() => {
    if (productId) {
      axiosInstance
        .post(`/v1_data_model/courses/Ec_product/get_ecomm_product_detail`, {
          user_id: userid,
          book_id: productId,
        })
        .then((response) => {
          setSize(response.data.data.available_size);
          setColor(response.data.data.color);
          setdefaultcolorid(response?.data?.data?.color[0]?.id);
          setdefaultattid(
            response?.data?.data?.available_size[0]?.attribute_id
          );
          setSelectedType(
            response?.data?.data?.available_size[0]?.attribute_name
          );
          setProductDetail(response.data.data.detail);
          setBanner(response.data.data.banner);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  //   const baseUrl = window.location.origin;
  // const url1 = `${baseUrl}/book-detail/${ProductData['id']}`;
  // const url2 = url1.replace("https://", "https://");
  // const url = url2.replace("http://", "http://");

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const textToCopy = `https://emedicoz.com/?book_id=${productId}`;
  const handleShare = () => {
    // const textToCopy = `${videoUrl}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notification.open({
          message: (
            <span>
              <FaClipboard style={{ marginRight: "8px" }} />
              <span>Link copied to clipboard!</span>
            </span>
          ),
          duration: 2,
          placement: "bottom",
          // Duration in seconds
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const whatsappLink = `https://web.whatsapp.com/send?text=${encodeURIComponent(
    textToCopy
  )}`;

  const handleClickwhatsapp = () => {
    window.open(whatsappLink, "_blank");
  };
  return (
    <div className="Detail">
      <div className="page-content position-relative">
        <div className="breadcrumb-row">
          <div className="container">
            <ul className="list-inline">
              <li>
                <a href={"/"}>Home</a>
              </li>
              <li>Detail</li>
            </ul>
          </div>
        </div>
      </div>
      <section className="product-detail">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className="card m-0 border-0">
                <div className="img-display position-relative">
                  {image != "" ? (
                    <div className="img-showcase">
                      <img src={image} alt="" />
                    </div>
                  ) : (
                    <div className="img-showcase">
                      {BannertData.map((result, key) =>
                        key == 0 ? <img src={result.images} alt="" /> : ""
                      )}
                    </div>
                  )}

                  <div class="share-icon circle-bg" onClick={handleClick}>
                    {open == true ? (
                      <i class="icon fa fa-times"> </i>
                    ) : (
                      <i class="icon fa fa-share"> </i>
                    )}
                  </div>
                  {open == true ? (
                    <div class="outer-icons" style={{ opacity: "1" }}>
                      <span>
                        <i
                          onClick={handleClickwhatsapp}
                          class="three fa fa-whatsapp"
                        ></i>
                      </span>

                      <a >
                        <i
                          class="four fa fa-copy"
                          onClick={handleShare}
                          target="_blank"
                        >
                          {" "}
                        </i>
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="img-select">
                  {BannertData.map((result, index) => (
                    <div className="img-item">
                      <a
                        data-id="1"
                        onClick={() => {
                          SetImage(result.images);
                        }}
                      >
                        <img
                          className={result.images === image ? "active" : ""}
                          src={result.images}
                          alt=""
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className="product-text">
                <h3></h3>
                <p className="m-0" style={{ color: "#757575" }}>
                  {ProductData.title}
                </p>
                <div className="rating">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="row">
                       { ProductData.course_review_count > 0 &&<div className="col-3 col-md-4">
                          <p className="m-0">
                            {ProductData.rating}
                            <span>
                              <em className="fa fa-star"></em>
                            </span>
                          </p>
                        </div>}
                        <div className="col-9 col-md-8">
                          <h5>{ProductData.course_review_count} reviews</h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="row">
                        <div className="col-12 col-md-12">
                          <h4>
                            ₹ {ProductData.discount_paper_price}
                            <del>₹ {ProductData.paper_book_price}</del>{" "}
                            <span>({ProductData.discount_paper}% OFF)</span>
                          </h4>
                        </div>
                        <div className="col-12 col-md-12">
                          <h5 className="stock-test">In stock</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row quantity">
                  <div className="col-12 col-md-12">
                    <div className="qty-container">
                      <span className="quantity">Quantity</span>
                      <button
                        className="qty-btn-minus btn-light"
                        type="button"
                        onClick={decrementCount}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                      <input
                        type="text"
                        name="qty"
                        value={counter}
                        className="input-qty"
                        id="input-qty"
                      />
                      <button
                        className="qty-btn-plus btn-light"
                        type="button"
                        onClick={incrementCount}
                      >
                        <em className="fa fa-plus"></em>
                      </button>
                    </div>
                  </div>
                  <div className="col-12 col-md-12">
                    <p>
                      Subject : <span style={{ color: "#000" }}>MBBS</span>
                    </p>
                    <div className="course-year">
                      <button type="button">MBBS</button>
                      <button type="button">Final Year</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            {color && color.length > 0 ? (
              <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                <div className="ColorSize">
                  <h3>Select color</h3>
                  {color.map((result) => (
                    <div
                      className="roundTick"
                      style={{ backgroundColor: `${result.color_code}` }}
                    >
                      <em className="fa fa-check"></em>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
            {size && size.length > 0 ? (
              <div className="col-12 col-sm-12 col-md-9 col-lg-9 radio__group">
                <span>Size</span>
                {size.map((result) => (
                  <div className="radio__button">
                    <span
                      style={{
                        backgroundColor:
                          selectedType == result?.attribute_name
                            ? "green"
                            : "#fff",
                      }}
                      onClick={() =>
                        handleSelect(
                          result?.attribute_name,
                          result?.attribute_id
                        )
                      }
                    >
                      {result?.attribute_name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="feature">
                <h3>Product Description :</h3>
                <ul
                  dangerouslySetInnerHTML={{
                    __html: ProductData.book_description,
                  }}
                ></ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="addition-detail">
                <h3>Additional Details</h3>
                <table className="table">
                  <tr>
                    <td>Brand</td>
                    <td>{ProductData.brand_name}</td>
                  </tr>
                  <tr>
                    <td>Manufacturer/Importer</td>
                    <td>{ProductData.brand_name}</td>
                  </tr>
                  <tr>
                    <td>SKU</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>HSN</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Country of Origin</td>
                    <td>India</td>
                  </tr>
                  <tr>
                    <td>Seller</td>
                    <td>{ProductData.brand_name}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
              <div className="add-cartbtn">
                <button
                  type="button"
                  className="add-cart"
                  onClick={() => addcart(ProductData)}
                >
                  <img
                    src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/ecommerce/cart.svg"
                    alt=""
                  />{" "}
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="buy-bg"
                  onClick={() => addcart(ProductData)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Detail;

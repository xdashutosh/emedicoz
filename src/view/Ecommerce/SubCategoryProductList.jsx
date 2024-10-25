
import "../../assets/css/ecommerce/responsive.css"
import "../../assets/css/ecommerce/style.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../apiConfig";
import axiosInstance from "../../API/axiosConfig";

const SubCategoryProduct = ({productlist,type,sub_category_id,category_id}) => {
  const navigate = useNavigate();
  const userid = sessionStorage.getItem("id");

    const handleProduct = (productId) => {
      localStorage.setItem("productId", productId);
      navigate("/product-detail");
    };
    const [filterlist, setfilterlist] = useState([]);
    const [Search, setsearch] = useState("");

   
    const handleSearchChange = (event) => {
      setsearch(event.target.value);
    };
    useEffect(() => {
      if (Search.trim() === "") {
        // If search is empty, show all books
        setfilterlist(productlist);
      } else {
        // Filter books based on search term
        const filteredBooks = productlist.filter((book) =>
          book?.title?.toLowerCase().includes(Search?.toLowerCase())
        );
        setfilterlist(filteredBooks);
      }
    }, [Search, productlist]);


    const [selectedFilter, setSelectedFilter] = useState('');

    const handleFilterChange = async(event) => {
      const filter = event.target.value;
     const res = await axiosInstance
     .post(
        `/v1_data_model/courses/Ec_product/get_ecomm_see_all_detail`,
        {
          user_id: userid,
          type: type,
          filterby: filter,
          subject_id: "",
          category_id: category_id,
          sub_sub_category_id: "",
          sub_category_id: sub_category_id,
        }
      )
      setSelectedFilter(filter);
      setfilterlist(res?.data?.data);
      console.log("Selected Filter:", filter);
    };

    

  return(
    <div className="SubCategoryProduct">
          <div className="page-content position-relative">
            <div className="breadcrumb-row">
                <div className="container">
                    <ul className="list-inline">
                        <li><a href={'/'}>Home</a></li>
                        <li>Sub Category Product</li>
                    </ul>
                </div>
            </div>
        </div>
      <section className="book-mod-page">
          <div className="container">
          <div className="search_br position-relative">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="input-group position-relative">
                  <input type="text" className="form-control" placeholder="Search for Products" id="search_category" fdprocessedid="9py130"  onChange={handleSearchChange}/>
                  <button className="btn" type="button" fdprocessedid="327h5f">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="tabbing_data_oth short-filter">
            <div className="filter_data">
              <div className="row">
                <div className="col-12 col-md-12">
                    <a href="javascript:;" data-toggle="modal" data-target="#Sort-by">
                      <div className="equal_img">
                        <div className="fliterDatabtn">
                          <div className="sortData">
                            <img src="https://d2enu63wt1sf3u.cloudfront.net/web_assets/images/ecommerce/arrow.svg" alt="" style={{marginRight:'10px'}}/>
                            <h4>Sort by </h4>
                          </div>
                  
                          <button className="sortingbtndata" onClick={handleFilterChange} style={{backgroundColor:selectedFilter === 'ID_DESC'?'#071952':'#9e9b9b'}} value={'ID_DESC'}>Popularity</button>
                          <button className="sortingbtndata" onClick={handleFilterChange} value={'DISCOUNT_DESC'}  style={{backgroundColor:selectedFilter=="DISCOUNT_DESC"?'#071952':'#9e9b9b'}} >Discount (High to Low)</button>
                          <button className="sortingbtndata" onClick={handleFilterChange} value={'MRP_ASC'}  style={{backgroundColor:selectedFilter=="MRP_ASC"?'#071952':'#9e9b9b'}} >Price (Low to High)</button>
                          <button className="sortingbtndata" onClick={handleFilterChange} value={'MRP_DESC'}   style={{backgroundColor:selectedFilter=="MRP_DESC"?'#071952':'#9e9b9b'}} >Price (High to Low)</button>
                        </div>
                      </div>
                    </a>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-md-12">
                <h3>Showing {filterlist?.length} items for “DAMS”</h3>
              </div>
            </div>
            <div className="row" id="ajaxResponce">
            {filterlist?.map((result) => (  
              <div className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3"  id="remove_category">
              
                <div className="item position-relative">
                <a href="javascript:void(0)" onClick={() =>handleProduct(result.id)}>
                    <div className="back_bg">
                      <img src={result.featured_image} alt="" onerror="this.src='http://localhost/live-emedicoz/ci_4/assets/image_not_found.webp'" />
                    </div>
                    <h3>{result.title} <span className="d-block"></span>
                    </h3>
                  </a>
                  <p> {result.auther}</p>
                  <div className="edition">
                    <a href="javascript:void(0);">{result.publication_date} Edition</a>
                  </div>
                  <div className="price-img position-relative">
                    <h4 className="price">
                      <em className="fa fa-rupee"></em>{result.discount_paper_price} <span>({result.discount_paper} % OFF)</span>
                    </h4>
                    <div className="row">
                      <div className="col-6 col-md-6 col-xl-6">
                        <del>
                          <em className="fa fa-rupee"></em>{result.paper_book_price} </del>
                      </div>
                      <div className="col-6 col-md-6 col-xl-6 text-right">
                        <div className="rating">
                          <em className="fa fa-star"></em>{result.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
              ))}
            
              
            
            
            
            </div>
          </div>

          </div>
      </section>
     </div>
  );
}
export default SubCategoryProduct
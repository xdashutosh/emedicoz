import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance, { API_BASE_URL } from "../../../API/axiosConfig";

const address = ({handlerSelected,data}) => {
  const userid = sessionStorage.getItem("id");


  
  return (
    <>
      <div className="address-group">
        <div className="row">
          <div className="col-5 col-sm-5 col-md-6 col-lg-6 col-xl-6">
            <h4>Delivery to this address</h4>
          </div>
          <div className="col-7 col-sm-7 col-md-6 col-lg-6 col-xl-6 text-right">
            <a href={"/myaddress"}>
              <em className="fa fa-map-marker fa-fw"></em>My Address
            </a>
          </div>
        </div>
      </div>
      <div className="no-found text-center">
        <div className="row">
          {data.length === 0 ? (
            <p>No Address found</p>
          ) : (
            data.map((address, index) => (
              <div
              style={{cursor:"pointer"}}
              onClick={()=>handlerSelected(address.id)}
                className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"
                key={index}
              >
                <div
                  className="testimonial"
                  style={{
                    margin: "0px",
                    textAlign: "left",
                    background: address.is_default === "1" ?"#ffded4 ":"#fff",
                    border: address.is_default === "1" ? "1px solid #f15a22 ":"1px solid #eee",
                    padding: "6px 15px",
                    marginBottom: "15px",
                  }}
                >
                  <p
                    className="description text-left"
                    style={{ lineHeight: "25px", padding: "0px" }}
                  >
                    <i className="fa fa-user fa-fw"></i> {address.name}
                  </p>
                  <p>
                    <i className="fa fa-phone fa-fw"></i> {address.phone}{" "}
                  </p>
                  <p>
                    <i className="fa fa-map-marker fa-fw"></i> {address.address}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
export default address;

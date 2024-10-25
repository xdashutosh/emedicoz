import { Spin } from "antd";
import React from "react";

const Coupan = ({
  getCoupanListFetch,
  coupanLoading,
  setCoupanInp,
  coupanInp,
  afterDeductionData,
  handlerClear,
  handlerApplyCoupan,
  
}) => {
  // console.log(afterDeductionData);
  // console.log(Object.keys(afterDeductionData).length);
  return (
    <div className="select-code">
      <div className="row">
        <div className="col-12 col-sm-10 col-md-8 col-lg-8 position-relative">
          <input
            value={coupanInp}
            type="text"
            placeholder="Select Coupon code/Referal code"
            name="code"
            onChange={(e) => setCoupanInp(e.target.value)}
            disabled={Object?.keys(afterDeductionData !== undefined && afterDeductionData)?.length > 0 ?true:false}
          />
          <span className="cut" id="fa" style={{ display: "none" }}>
            <a>
              <i
                className="fa fa-close close_button"
                style={{ color: "red" }}
              ></i>
            </a>
          </span>
        </div>

        <div className="col-6 col-sm-6 col-md-2 col-lg-2">
          {Object?.keys(afterDeductionData !== undefined && afterDeductionData)?.length > 0 ? (
            <button
              onClick={handlerClear}
              className="btn btn-primary apply_coupon"
              style={{ width: "100%",background:"green" }}
            >
              Clear
            </button>
          ) : (
            <button
              onClick={handlerApplyCoupan}
              className="btn btn-primary apply_coupon"
              style={{ width: "100%" }}
            >
              Apply
            </button>
          )}
        </div>
        <div className="col-6 col-sm-6 col-md-2 col-lg-2">
          <button
            onClick={getCoupanListFetch}
            className="btn btn-primary apply_coupon"
            style={{ width: "100%" }}
          >
            {coupanLoading ? <Spin /> : "Coupon List"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupan;

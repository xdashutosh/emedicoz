import React from "react";
import { useNavigate } from "react-router-dom";

const Price = ({
  cartData,
  allData,
  afterDeductionData,
  gstTotalData,
  isChecked,
  coupan,
  handlerOpenPayModal,
  shipingData,
  addressData,
}) => {
  const nav = useNavigate()
  // console.log("Price->",allData)
  return (
    <div className="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
      <div className="left-side">
        <div className="ibox-title">
          <h5>Price Detail</h5>
        </div>
        <div className="table-responsive">
          <table className="table" id="result_here_apply">
            <tbody>
              <tr>
                <td>No. of item(s)</td>
                <td className="text-right">{allData?.list.length}</td>
              </tr>
              <tr>
                <td>item(s) Amount</td>
                <td className="text-right">
                  <i className="fa fa-rupee mr-1"></i>
                  {allData?.course_type === 7
                    ? allData?.final_amount
                    : allData?.course_price}
                </td>
              </tr>
              {isChecked && (
                <tr>
                  <td style={{ color: "#55b339", fontWeight: "600" }}>
                    eMedicoz Wallet
                  </td>
                  <td
                    className="text-right"
                    style={{ color: "#55b339", fontWeight: "600" }}
                  >
                    <i className="fa fa-rupee mr-1"></i>
                    {coupan}
                  </td>
                </tr>
              )}
              {Object?.keys(afterDeductionData !== undefined && afterDeductionData).length !== 0 && (
                <tr className="couponcol">
                  <>
                    <td id="couponcode">
                      Coupon- <b>{afterDeductionData?.coupon_code}</b>
                    </td>
                    <td className="text-right" id="discount_display">
                      <em className="fa fa-rupee mr-1"></em>
                      {afterDeductionData?.discount_amount}
                    </td>
                  </>
                </tr>
              )}
            {addressData.length > 0 &&  <tr>
                <td>GST Tax</td>
                <td className="text-right" id="total_gst_rewardamount">
                  <i className="fa fa-rupee mr-1"></i>
                  {Number(gstTotalData?.total_gst_amount).toFixed(2)}
                </td>
              </tr>}

             {addressData.length > 0 && <tr>
                <td>
                  <strong>Grand Total</strong>
                </td>

                <td className="text-right" id="grandtotal_display">
                  <strong>
                    <i className="fa fa-rupee mr-1"></i>
                    {/* {afterCoupanData?.total_amount} */}
                    {Number(gstTotalData?.total_payble_amount).toFixed(2)}
                  </strong>
                </td>
              </tr>}

              {Object.keys(shipingData).length > 0 && (
                <tr>
                  <td>
                    <p>Shiping Charge</p>
                  </td>

                  <td className="text-right" id="grandtotal_display">
                    {shipingData?.shipping_charge}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          {addressData.length > 0 ? (
            <button
              className="btn btn-danger btn-block"
              onClick={handlerOpenPayModal}
            >
              Pay Now
            </button>
          ) : (
            <button
              className="btn btn-danger btn-block"
              onClick={()=>nav("/addnewaddress")}
            >
              Add Address
            </button>
          )}
          <br />
        </div>
      </div>
    </div>
  );
};

export default Price;

import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import { Button, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const { Paragraph, Text } = Typography;

const ReferList = () => {
  const navigate = useNavigate();
  const [refData, setRefData] = useState({});
  const [loading, setLoading] = useState(false);
  const id = sessionStorage.getItem("id");

  const data = refData?.referral_coupon_code;
  const getApiCalled = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/v1_data_model/user/referral_earn_content/referral_user_list",
        { user_id: id }
      );
      if (data.status === true) {
        setRefData(data?.data);
        setLoading(false);
      } else {
        setRefData([]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiCalled();
  }, []);



  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" 
    });
  }, []);

  return (
    <div className="container">
    <div className="referList">
      <div className="innerRefer">
        <img src={`${window.IMG_BASE_URL}/referByme.svg`} />
        <div className="referText">
          <h5>Get {refData?.validity} Free Course</h5>
          <h6>By refer your friends</h6>

          {refData?.list?.length > 1 && (
            <>
              <Paragraph
                copyable={{
                  text: data,
                }}
              >
                {refData?.referral_coupon_code}
              </Paragraph>

              <h4>Total referrals:{refData?.total_referral_user}</h4>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ width: "50%", margin: "100px auto", textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          {refData?.list?.length > 1 ? (
            <>
              {refData?.list?.map((val, i) => (
                <>
                  <div className="setdatav">
                    <div style={{ padding: "5px" }}>
                      <img src="/images/course.png" width={"60%"} />
                    </div>
                    <div className="setinner" >
                      <span>Course Purchased By {val?.name}</span>
                      <span style={{ color: "#5AB2FF" }}>{val?.course}</span>
                    </div>
                    <div className="setchild">
                      <span className="redeem">
                        Redeemed
                      </span>
                    </div>
                  </div>
                </>
              ))}
              <div
                style={{ width: "50%", margin: "auto", textAlign: "center" }}
              >
                <Button
                  onClick={() => navigate("/refer-earn")}
                  style={{ margin: "10px" }}
                  type="primary"
                >
                  Refer Your Friend
                </Button>
              </div>
            </>
          ) : (
            <div className="noRecord" >
              <span>Sorry, no records found</span>
            </div>
          )}
        </>
      )}
    </div>
     </div>
  );
};

export default ReferList;

import React, { useEffect, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import { Input, Form, Button, Select, Collapse, Spin } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../Refer/style.css";

const { Option } = Select;

const ReferEarn = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("id");
  const [allDataGet, setAllDataGet] = useState({});
  const [catList, setCatList] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [course, setCourse] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");
  const [loading, setLoading] = useState(false);

  const createDynamicLink = async () => {
    const selectedCourse = catList.find((itm) => itm.id === course);
    if (!selectedCourse) return;

    const { availability_course, plan_type, category, category_id, id } =
      selectedCourse;
    const link = `https://emedicoz.com/?refer_id=${id}&referralType=1&plan_type=${plan_type}&category=${category}&category_id=${category_id}&availability_course=${availability_course}`;
    const domainUriPrefix = "https://wn2d8.app.goo.gl";
    const apiKey = "AIzaSyBhFb-c_iSjCZQgjtNu6XvIxhdkTxF-kDU";

    const requestPayload = {
      dynamicLinkInfo: {
        domainUriPrefix,
        link,
        androidInfo: {
          androidPackageName: "com.example.android",
        },
        iosInfo: {
          iosBundleId: "com.example.ios",
        },
      },
    };

    const response = await fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      }
    );

    const data1 = await response.json();
    setDynamicLink(data1.shortLink);
    setLoading(false);
  };

  useEffect(() => {
    if (name && email && mobile && course) {
      createDynamicLink();
    }
  }, [course]);

  const getDetailApiCalled = async () => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/referral_earn_content/referral_earn_content_list",
        { user_id: userId }
      );
      const resp = await axiosInstance.post(
        "/v1_data_model/user/referral_earn_content/referral_earn_course_list",
        { user_id: userId }
      );
      setAllDataGet(res?.data?.data);
      setCatList(resp?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async () => {
    const selectedCourse = catList.find((itm) => itm.id === course);
    if (!selectedCourse) return;

    const { plan_type } = selectedCourse;
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/v1_data_model/user/referral_earn_content/send_referral_earn_user_detail",
        {
          user_id: userId,
          name,
          phone: mobile,
          course_id: course,
          email,
          link: dynamicLink,
          plan_type,
        }
      );

      if (data.status === true) {
        toast.success(data.message);
        navigate("/refer-earn-successfully");
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailApiCalled();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <div className="container">
      <div className="ReferEarn">
        <div className="referImg">
          <img
            src={allDataGet?.referral_banner}
            width="30%"
            alt="Referral Banner"
          />
        </div>
        <div className="referText">
          <h5>{allDataGet?.refer_now_title}</h5>
          <h6>{allDataGet?.referral_link_title}</h6>
          <h3>{allDataGet?.name_title}</h3>
          <div className="formbg">
            <Form
              name="three-input-form"
              onFinish={onFinish}
              initialValues={{ name: "", email: "", mobile: "", cat: null }}
            >
              <div className="row">
                <div className="col-12 col-md-6 col-lg-6">
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter your name!" },
                      {
                        pattern: /^[a-zA-Z\s]+$/,
                        message: "Name must be letters only!",
                      },
                    ]}
                  >
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <Form.Item
                    name="mobile"
                    label="Mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your mobile number!",
                      },
                      {
                        pattern: /^\d{10}$/,
                        message: "Mobile number must be 10 digits!",
                      },
                    ]}
                  >
                    <Input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                  <Form.Item
                    name="cat"
                    label="Course"
                    rules={[
                      { required: true, message: "Please select a course!" },
                    ]}
                  >
                    <Select
                      placeholder="Select an option"
                      onChange={(e) => setCourse(e)}
                    >
                      {catList?.map((val, i) => (
                        <Option value={val?.id} key={i}>
                          {val?.course}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-md-12 col-lg-12">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      {loading ? <Spin /> : "Share Referral"}
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <div className="howitWork">
            <h6>{allDataGet?.how_it_work_title}</h6>
            <div
              dangerouslySetInnerHTML={{
                __html: allDataGet?.how_it_works_content,
              }}
            />
          </div>
          <div className="terms">
            <Collapse
              defaultActiveKey={["1"]}
              items={[
                {
                  key: "1",
                  label: "Term & Conditions",
                  children: (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: allDataGet?.terms_condition,
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferEarn;

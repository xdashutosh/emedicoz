import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../API/axiosConfig";
import { CiTrash } from "react-icons/ci";
import { CheckoutProvider, Checkout } from "paytm-blink-checkout-react";
import { toast } from "react-toastify";
import { Button, Checkbox, List, Modal, Popconfirm, Spin } from "antd";
import Price from "./PriceDetail/Price";
import Address from "./Address/Address";
import Coupan from "./Coupon/Coupan";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import InjectedCheckout from "./Injected-checkout";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../network/cartSlice";
import "../../assets/css/cart-page/style.css";

// Embedded CONFIG
const TxnToken = Cookies.get("TxnToken");
const OrderId = Cookies.get("OrderId");
const TotalAmount = Cookies.get("TotalAmount");

// Function to register the user for CBT
const userId = sessionStorage.getItem("id");
const get_user_cbt_reg = async () => {
  const Cbtid = JSON.parse(localStorage.getItem("Cbtid"));

  try {
    const res = await axiosInstance.post(
      "/v1_data_model/courses/home/get_user_cbt_reg",
      {
        user_id: userId,
        cbt_id: Cbtid,
        region_id: location?.state?.isRegionID,
        mode: location?.state?.isCbtID === "1" ? "CBT" : "IBT",
      }
    );

    const paymentData = JSON.parse(sessionStorage.getItem("paymentData"));

    // Navigate to the success page for CBT with the necessary parameters
    const url = `/sucess_cbt/PT${paymentData.payble_amount}D${paymentData.payment_date}TI${paymentData.transaction_status}OI${paymentData.order_id}`;
    window.location.href = url;

    // const paymentStatus = res.data.data;
    // const url = `/success/PT${paymentStatus.payble_amount}D${paymentStatus.payment_date}TI${paymentStatus.transaction_status}OI${paymentStatus.order_id}`;

    // console.log("get_user_cbt_reg", res);
    // Navigate to the success page for CBT
    //window.location.href = "/sucess_cbt";
  } catch (err) {
    console.log(err);
  }
};
const CONFIG = {
  style: {
    bodyBackgroundColor: "#fafafb",
    bodyColor: "",
    themeBackgroundColor: "#dfa231",
    themeColor: "#ffffff",
    headerBackgroundColor: "#284055",
    headerColor: "#ffffff",
    errorColor: "",
    successColor: "",
    card: {
      padding: "",
      backgroundColor: "",
    },
  },
  jsFile: "",
  data: {
    orderId: OrderId,
    amount: TotalAmount,
    token: TxnToken,
    tokenType: "TXN_TOKEN",
    userDetail: {
      mobileNumber: "",
      name: "",
    },
  },
  merchant: {
    mid: "DelhiA83571901952164",
    name: "Delhi Academy of Medical Science Pvt Ltd",
    logo: "https://damsdelhi.com/src/components/header/login_logo.png",
    redirect: false,
  },
  mapClientMessage: {},
  labels: {},
  payMode: {
    labels: {},
    filter: {
      exclude: [],
    },
    order: ["NB", "CARD", "LOGIN"],
  },
  flow: "DEFAULT",
};

const appendHandler = (config) => {
  const newConfig = { ...config };
  newConfig.handler = {
    notifyMerchant: notifyMerchantHandler,
    transactionStatus,
  };
  return newConfig;
};
const storedCourselistString = sessionStorage.getItem("courselist");
// console.log("list data ", storedCourselistString);
async function transactionStatus(paymentStatus) {
  // console.log("paymentStatus 79 => ", paymentStatus);
  const userid = sessionStorage.getItem("id");
  if (paymentStatus?.STATUS == "TXN_SUCCESS") {
    const res = await axiosInstance.post(
      "v1_data_model/user/User_payment/complete_transaction_cart",
      {
        list: sessionStorage.getItem("courselist"),
        redeem_amount: 0,
        pre_transaction_id: paymentStatus?.ORDERID,
        post_transaction_id: paymentStatus?.TXNID,
        affiliate_referral_code_by: "",
        earn_point_course_purchase: "",
        transaction_status_data: paymentStatus?.STATUS,
        user_id: userid,
        pay_via: "PAYTM",
      }
    );
    // window.location.href = `/success/PT${paymentStatus?.TXNAMOUNT}D${paymentStatus?.TXNDATE}TI${paymentStatus?.TXNID}OI${paymentStatus?.ORDERID}`;
    // window.Paytm.CheckoutJS.close();
    // console.log("res--------", res.data);

    // if (res.data.status == true) {
    //   toast.success(res.data.message);
    //   sessionStorage.setItem("paymentData", res.data.data);
    //   const is_cbt_type = JSON.parse(localStorage.getItem("CbtType"));

    //   if (is_cbt_type === "1") {
    //     get_user_cbt_reg();
    //   } else {
    //     console.log("else 108 => ", res.data.status);
    //     window.location.href = `/success/PT${paymentStatus?.TXNAMOUNT}D${paymentStatus?.TXNDATE}TI${paymentStatus?.TXNID}OI${paymentStatus?.ORDERID}`;
    //     window.Paytm.CheckoutJS.close();
    //   }
    // }
    if (res?.data?.status === true) {
      toast.success(res.data.message);

      // Convert the response data to a JSON string before saving it in session storage
      sessionStorage.setItem("paymentData", JSON.stringify(res.data.data));

      // Retrieve the CBT type from local storage and parse it
      const is_cbt_type = JSON.parse(localStorage.getItem("CbtType"));

      if (is_cbt_type === "1") {
        // Call the function to register the user for CBT
        get_user_cbt_reg();
      } else {
        // Construct the URL with the appropriate parameters
        const paymentStatus = res.data.data;
        const url = `/success/PT${paymentStatus.payble_amount}D${paymentStatus.payment_date}TI${paymentStatus.transaction_status}OI${paymentStatus.order_id}`;

        // Redirect to the success page
        window.location.href = url;

        // Close the Paytm CheckoutJS if it's open
        if (window.Paytm && window.Paytm.CheckoutJS) {
          window.Paytm.CheckoutJS.close();
        }
      }
    }
  } else {
    console.log("paymentStatus 106 => ", paymentStatus);

    window.location.href = `/failed/PT${paymentStatus?.TXNAMOUNT}D${paymentStatus?.TXNDATE}TI${paymentStatus?.TXNID}OI${paymentStatus?.ORDERID}`;
    window.Paytm.CheckoutJS.close();
  }
}

const notifyMerchantHandler = (eventType, data) => {
  // console.log("MERCHANT NOTIFY LOG", eventType, data);
};

const AddCart = () => {
  const dispatch = useDispatch();
  const cValue = sessionStorage.getItem("coupanV");
  const userid = sessionStorage.getItem("id");
  const subId = localStorage.getItem("subID");
  const nav = useNavigate();
  const location = useLocation();

  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoCoupleToggle, setAutoCoupleToggle] = useState();
  const [cartData, setCartData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [coupanValue, setCoupanValue] = useState("");
  const [afterDeductionData, setAfterDeductionData] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [coupanLoading, setCoupanLoading] = useState(false);
  const [coupanListData, setCoupanListData] = useState([]);
  const [coupanToogle, setCoupanToogle] = useState(false);
  const [gstTotalData, setGstTotalData] = useState({});
  const [shipingValue, setShipingValue] = useState("");
  const [productType, setProductType] = useState("");
  const [shipingData, setShipingData] = useState({});
  const mConfigTextAreaRef = useRef();
  const [showAddress, setShowAddress] = useState({});
  const [coupanInp, setCoupanInp] = useState("");
  const [comLoading, setComLoading] = useState(false);
  const [defaultAddressModal, setDefaultAddressModal] = useState(false);
  const [payToggle, setPayToggle] = useState(false);
  const [payModeArr, setPayModeArr] = useState([]);

  const [mConfig, setMConfig] = useState(appendHandler(CONFIG));
  const [checkoutJsInstance, setCheckoutJsInstance] = useState(null);
  const mConfigTextAreaVal = JSON.stringify(mConfig, null, 4);

  const userData = sessionStorage.getItem("userData");
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [showSpin, setShowSpin] = useState(false);

  const [counter, setCounter] = useState("");

  const setOneMinuteCookie = (key, value) => {
    const expires = new Date(new Date().getTime() + 20 * 1000); // 1 minute from now
    Cookies.set(key, value, { expires });
  };

  // when render component the call first time
  const getCartData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/v1_data_model/user/user_cart/get_user_cart_data",
        {
          user_id: userid,
        }
      );

      if (res.data.status === false) {
        setCartData([]);
        setLoading(false);
      } else {
        if (
          res?.data?.data?.list[0]?.is_shipping === "1" ||
          res?.data?.data?.list[0]?.product_type === "2"
        ) {
          setShipingValue(res?.data?.data?.list[0]?.is_shipping);
          setProductType(res?.data?.data?.list[0]?.product_type);
          setIsChecked(true);
        }
        setIsChecked(true);
        setCoupanValue(res?.data?.data?.walletBalanceAmount);
        dispatch(addToCart(res?.data?.data?.list[0]));
        setCartData(res?.data?.data?.list);
        setAllData(res?.data?.data);
        getAddressListRequest();
        handleCheckboxChange();
        setLoading(false);
        // getAddressList();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //if allData has a coupan_code the this api call
  const handlerCoupanApply = async (itm) => {
    const cart = itm?.list[0];

    let flag;
    if (cart?.product_type === "1" || cart?.product_type === "2") {
      flag = "book";
    } else if (cart?.product_type === "0" && cart?.course_type === "9") {
      if (availabilityCourse === "2") {
        flag = "facetoface";
      } else {
        flag = "online";
      }
    } else {
      flag = "online";
    }

    const res = {
      user_id: userid,
      coupon_code: itm?.coupon_code,
      is_part_payment: "",
      coupon_for: "",
      coupon_value: "",
      coupon_type: "",
      is_new: "",

      capping_value: "",
      maximum_discount_value: "",
      minimum_value: "",
      coupon_max_use: "",
      flage: flag,
      qty: 1,
      course_price: cart?.final_amount,
      is_manual: "is_manual",
      user_use: "",
      eMedicoz_user: "2",
      new_coupon: "1",
      course_subscription_id: "0",
      // course_subscription_id: !subId ? "0" : subId,
      check_iscombo: "0",
      check_ismultiorder: 0,
      course_id: cart?.id,
    };

    try {
      setAutoCoupleToggle(true);
      const resp = await axiosInstance.post(
        "/v1_data_model/user/user_cart/apply_cart_coupon",
        res
      );
      console.log("1");
      if (resp.data.status === true) {
        setCoupanInp(resp.data.data.coupon_code);
        setAfterDeductionData(resp?.data?.data);
        toast.success(resp?.data?.message);
        setAutoCoupleToggle(false);
      } else {
        // toast.error(resp.data.message)
        setAutoCoupleToggle(false);
      }
    } catch (error) {
      console.log(error);
      setAutoCoupleToggle(false);
    }
  };

  const getAddressListRequest = async () => {
    try {
      const resp = await axiosInstance.post(
        "/v1_data_model/user/User_cart/get_address",
        {
          user_id: userid,
        }
      );
      setAddressData(resp?.data?.data);
      // getFetchShippingCharges()
    } catch (error) {
      console.log(error);
    }
  };

  const getCoupanListFetch = async () => {
    try {
      setCoupanLoading(true);
      const res = await axiosInstance.post(
        "/v1_data_model/coupon/coupon/get_coupon_list",
        {
          user_id: userid,
          course_id: cartData[0]?.id,
          flage: cartData[0]?.product_type === "0" ? "online" : "book",
          partner_id: "",
        }
      );
      // console.log(res.data.data);
      setCoupanListData(res.data.data);
      setCoupanLoading(false);
      setCoupanToogle(true);
    } catch (err) {
      console.log(err);
      setCoupanLoading(false);
    }
  };

  const getGstCalculate = async (data) => {
    const cName = localStorage.getItem("coupan");
    const cart = cartData[0];
    let flag;
    if (cart.product_type === "1" || cart.product_type === "2") {
      flag = "book";
    } else {
      flag = "online";
    }
    const list = [];
    //console.log("CART DATA->", cartData[0]);
    cartData.forEach((val) => {
      list.push({
        course_id: val.id,
        net_amount: val.is_part_payment === "3" ? val.price : val.final_amount,
      });
    });

    const isDefaultId = data?.filter((val) => val.is_default === "1");

    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/user_cart/calculate_gst",
        {
          course_list: JSON.stringify(list),
          user_id: userid,
          user_address_id: isDefaultId[0]?.id,
          partner_id: "",
          offer_discount_amount: afterDeductionData?.discount_amount
            ? afterDeductionData?.discount_amount
            : "0",
          reward_discount_amount: 0,
          is_apply_reward_all: 0,
          coupon_code: cName,
          flag: flag,
        }
      );
      setGstTotalData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartData();
  }, []);

  useEffect(() => {
    if (allData?.coupon_code) {
      handlerCoupanApply(allData);
    }
  }, [allData]);

  const handleRemoveCourse = async (id) => {
    try {
      const res = await axiosInstance.post(
        "/v1_data_model/user/user_cart/remove_course_from_cart",
        {
          user_id: userid,
          course_id: id,
        }
      );
      toast.success(res.data.message);
      // dispatch(removeFromCart(data));
      getCartData();
    } catch (error) {
      console.log(error);
    }
  };

  const handlerCoupanApplyByUser = async (val) => {
    console.log("line no 416", val);
    localStorage.setItem("coupan", val.coupon_tilte);
    const cart = cartData[0];
    // console.log(cart)
    let flag;
    if (cart.product_type === "1" || cart.product_type === "2") {
      flag = "book";
    } else if (cart.product_type === "0" && cart.course_type === "9") {
      if (cart.availability_course === "2") {
        flag = "facetoface";
      } else {
        flag = "online";
      }
    } else {
      flag = "online";
    }

    const res = {
      user_id: userid,
      coupon_code: val?.coupon_tilte,
      is_part_payment: "",
      coupon_for: val.coupon_for,
      coupon_value: val.coupon_value,
      coupon_type: val.coupon_type,
      is_new: val.is_new,

      capping_value: val?.capping_value,
      maximum_discount_value: val?.maximum_discount_value,
      minimum_value: val?.minimum_value,
      coupon_max_use: val?.coupon_max_use,
      flage: flag,
      qty: 1,
      course_price: flag === "book" ? cart?.final_amount : "",
      // course_price: cart.price * cart.qty,
      is_manual: "",
      user_use: "",
      eMedicoz_user: "",
      new_coupon: "",
      course_subscription_id: cart?.subscription_data.id,
      check_iscombo: val?.check_iscombo,
      check_ismultiorder: val?.check_ismultiorder,
      course_id: cart?.id,
    };
    try {
      console.log("473");
      setAutoCoupleToggle(true);
      const resp = await axiosInstance.post(
        "/v1_data_model/user/user_cart/apply_cart_coupon",
        res
      );
      console.log("2");
      if (resp.data.status === true) {
        setAfterDeductionData(resp?.data?.data);
        setCoupanInp(resp?.data?.data?.coupon_code);
        toast.success(resp.data.message);
        setAutoCoupleToggle(false);
      } else {
        // toast.error(resp.data.message)
        setAutoCoupleToggle(false);
      }
    } catch (error) {
      console.log(error);
      setAutoCoupleToggle(false);
    }
    setIsChecked(false);
    setCoupanToogle(false);
  };

  const handlerClear = async () => {
    setCoupanInp("");
    // handlerCoupanApply(allData);
    const cart = cartData[0];

    let flag;
    if (cart?.product_type === "1" || cart?.product_type === "2") {
      flag = "book";
    } else if (cart?.product_type === "0" && cart?.course_type === "9") {
      if (availabilityCourse === "2") {
        flag = "facetoface";
      } else {
        flag = "online";
      }
    } else {
      flag = "online";
    }

    const res = {
      user_id: userid,
      coupon_code: "",
      is_part_payment: "",
      coupon_for: "",
      coupon_value: "",
      coupon_type: "",
      is_new: "",

      capping_value: "",
      maximum_discount_value: "",
      minimum_value: "",
      coupon_max_use: "",
      flage: flag,
      qty: 1,
      course_price: cart?.final_amount,
      is_manual: "is_manual",
      user_use: "",
      eMedicoz_user: "2",
      new_coupon: "1",
      course_subscription_id: "0",
      check_iscombo: "0",
      check_ismultiorder: 0,
      course_id: cart?.id,
    };

    try {
      setAutoCoupleToggle(true);
      const resp = await axiosInstance.post(
        "/v1_data_model/user/user_cart/apply_cart_coupon",
        res
      );
      setCoupanInp(resp.data.data.coupon_code);
      setAfterDeductionData(resp?.data?.data);
      setIsChecked(false);
      setAutoCoupleToggle(false);
    } catch (error) {
      console.log(error);
      setAutoCoupleToggle(false);
    }
  };

  const handlerApplyCoupan = async () => {
    console.log("line no 554");
    if (!coupanInp) {
      toast.error("Please enter coupon");
    } else {
      const cart = cartData[0];
      let flag;
      if (cart?.product_type === "1" || cart?.product_type === "2") {
        flag = "book";
      } else if (cart?.product_type === "0" && cart?.course_type === "9") {
        if (availabilityCourse === "2") {
          flag = "facetoface";
        } else {
          flag = "online";
        }
      } else {
        flag = "online";
      }
      try {
        // console.log("573");
        setAutoCoupleToggle(true);
        const res = await axiosInstance.post(
          "/v1_data_model/user/user_cart/apply_cart_coupon",
          {
            user_id: userid,
            coupon_code: coupanInp,
            is_part_payment: "",
            coupon_for: "",
            coupon_value: "",
            coupon_type: "",
            is_new: "",
            capping_value: "",
            maximum_discount_value: "",
            minimum_value: "",
            coupon_max_use: "",
            flage: flag,
            qty: "1",
            course_price: cartData[0]?.final_amount,
            is_manual: "is_manual",
            user_use: "",
            eMedicoz_user: 2,
            new_coupon: 1,
            course_subscription_id: cart?.subscription_data.id,
            check_iscombo: 0,
            check_ismultiorder: 0,
            course_id: cart?.id,
          }
        );
        // console.log("4")
        if (res.data.status === true) {
          setCoupanInp(res.data.data.coupon_code);
          setAfterDeductionData(res?.data?.data);
          setIsChecked(false);
          toast.success(res?.data?.message);
          setAutoCoupleToggle(false);
        } else {
          toast.error("Invalid Coupan");

          setCoupanInp("");
          setIsChecked(false);
          setAutoCoupleToggle(false);
        }
      } catch (error) {
        console.log(error);
        setAutoCoupleToggle(false);
      }
      setCoupanToogle(false);
    }
  };

  const handleOk = async (data) => {
    try {
      const res = await axiosInstance.post(
        "v1_data_model/user/user_cart/set_default_address",
        {
          user_id: userid,
          address_id: data.id,
        }
      );
      toast.success("Address has been changed");
      setDefaultAddressModal(false);
      getCartData();
    } catch (err) {
      console.log(err);
    }
  };

  const handlerSelectedAddress = (data) => {
    console.log(data);
    setShowAddress(data);
    setDefaultAddressModal(data);
  };

  const handleCheckboxChange = (event) => {
    // console.log(event)
    setIsChecked(event.target.checked);
  };

  var i = 1;
  const incrementCount = (val) => {
    const filter = cartData.filter((itms) => itms.id === val.id);
    var qty = parseFloat(filter[0].qty) + i;
    update_book_qty_to_cart(qty, val);
  };
  var i = 1;
  const decrementCount = (val) => {
    const filter = cartData.filter((itms) => itms.id === val.id);
    if (counter !== 1) {
      var qty = parseFloat(filter[0].qty) - i;

      update_book_qty_to_cart_minus(qty, val);
    }
  };

  const update_book_qty_to_cart = async (qty, d) => {
    try {
      const responce = await axiosInstance.post(
        `/v1_data_model/user/user_cart/update_book_qty_to_cart`,
        {
          user_id: userid,
          book_id: d.id,
          variant: d.variant,
          qty: qty,
        }
      );
      if (responce) {
        getCartData();
        if (responce.data.message == "Book Qty has been added to cart.") {
          setCouponData("");
          // setCouponStatus(true);
          toast.success("Item Qty has been added");
        } else {
          handlerClear();
          toast.success("Item has been added to your cart");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const update_book_qty_to_cart_minus = async (qty, d) => {
    try {
      const responce = await axiosInstance.post(
        `/v1_data_model/user/user_cart/update_book_qty_to_cart`,
        {
          user_id: userid,
          book_id: d.id,
          variant: d.variant,
          qty: qty,
        }
      );
      if (responce) {
        getCartData();
        // setCouponStatus(true);
        if (responce.data.message == "Book Qty has been added to cart.") {
          setCouponData("");
          toast.success("Item Qty has been removed");
        } else {
          handlerClear();
          toast.success("Item has been removed from your cart");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPaymentModeFetch = async () => {
    // console.log(cartData[0]);
    // if (
    //   cartData[0]?.availability_course === "2" &&
    //   cartData[0]?.product_type === "0"
    // ) {
    //   try {
    //     const res = await axiosInstance.post(
    //       "v1_data_model/user/UserSetting/getPaymentGateway"
    //     );
    //     const pay = res?.data?.data?.filter((itm)=>itm.payment_gateway_name === "Paytm")
    //     setPayModeArr(pay);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    try {
      const res = await axiosInstance.post(
        "v1_data_model/user/UserSetting/getPaymentGateway"
      );
      const pay = res?.data?.data?.filter(
        (itm) => itm.payment_gateway_name === "Paytm"
      );
      setPayModeArr(
        cartData[0]?.availability_course === "2" &&
          cartData[0]?.product_type === "0"
          ? pay
          : res?.data?.data
      );
    } catch (error) {
      console.log(error);
    }
  };

  var fina =
    Object.keys(shipingData).length > 0
      ? shipingData?.shipping_charge + gstTotalData?.total_payble_amount
      : gstTotalData?.total_payble_amount;

  const handlerOpenPayModal = () => {
    if (isChecked === true && fina <= 0) {
      handleinitialize();
    } else {
      setPayToggle(true);
    }
  };

  useEffect(() => {
    if (autoCoupleToggle === false) {
      getGstCalculate(addressData);
    }
  }, [autoCoupleToggle]);

  useEffect(() => {
    if (payToggle) {
      getPaymentModeFetch();
    }
  }, [payToggle]);

  const [payreload, setReload] = useState(false);

  const handlePopUpmodal = async (type) => {
    // console.log("Called", cartData[0].subscription_data);

    let installmentExpiry =
      cartData.length > 0
        ? cartData[0]?.subscription_data?.amount_description?.expiry
        : "0";

    const courselist = cartData.map((item) => {
      return {
        course_id: item.id,
        product_type: item.product_type,
        qty: item.qty,
        payment_mode: item.is_subscription,
        expiry: installmentExpiry ? installmentExpiry : "",
        is_cbt: !item.is_cbt ? "0" : item.is_cbt,
        course_price: item?.mrp,
        // item.is_part_payment === "3" ? item.price : item.final_amount,
        upgrade_course_price:
          item.is_part_payment === "3" ? item.upgrade_course_price : "",
        transaction_id: item.is_part_payment === "3" ? item.transaction_id : "",
        pending_amount: !item.pending_amount ? "0" : item.pending_amount,
        size_name: "",
        subscription_code: "",
        payment_meta: cartData[0].subscription_data,
        payment_id: !item.payment_id ? "0" : item.payment_id,
        partner_member_id: !item.partner_member_id
          ? "0"
          : item.partner_member_id,
        id_fr_learning_center_detail: !item.id_fr_learning_center_detail
          ? "0"
          : item.id_fr_learning_center_detail,
        is_part_payment: !item.is_part_payment ? "0" : item.is_part_payment,
        full_amount: !item.full_amount ? "0" : item.full_amount,
        facetoface_center_id: !item.facetoface_center_id
          ? "0"
          : item.facetoface_center_id,
        booking_type: !item.booking_type ? "0" : item.booking_type,
        availability_course: !item.availability_course
          ? "0"
          : item.availability_course,
        course_start_date: !item.course_start_date
          ? ""
          : item.course_start_date,
        course_discount: "",
        child_courses: "",
        color_name: "",
        net_amount: "",
        // is_multiorder: 0,
      };
    });
    sessionStorage.setItem("courselist", JSON.stringify(courselist));

    const isDefaultAdd = addressData.filter((itm) => itm.is_default === "1");
    try {
      setReload(true);
      const res = await axiosInstance.post(
        "/v1_data_model/user/UserPaymentInitialize/initializeCourseTransactionCart",
        {
          user_id: userid,
          list: JSON.stringify(courselist),
          address_id: isDefaultAdd[0].id,
          redeem_amount: 0,
          total_price:
            Object.keys(shipingData).length > 0
              ? shipingData?.shipping_charge + gstTotalData?.total_payble_amount
              : gstTotalData?.total_payble_amount,
          coupon_applied:
            Object.keys(afterDeductionData).length > 0
              ? afterDeductionData.coupon_code
              : "",
          // earn_point_course_purchase: "",
          penalty: "",
          pay_via: type === "Paytm" ? "PAY_TM" : "RAZORPAY",
          points_rate: "",
          tax: "18",
          points_used: "",
          refer_code: "",
          coin_used: JSON.stringify([
            {
              course_id: "0",
              redeem_point: "",
              reward_discount: "0.0",
            },
          ]),
          coin_earn: 0,
          partner_type: "1",

          is_apply_reward_all: 0,
          subcenter_id: "",
          course_start_date: "",
          referral_user_by_partner: "",
          coupon_applied_partial: "",
          is_multiorder: 0,
          emi_month: "",
          is_emi_payment: 0,
          emi_installment_id: "",
          emi_due_date: "",
          is_referal: "2",
          region_id: "",
          delivery_postcode: 201301,
          shipping_charge:
            Object.keys(shipingData).length > 0
              ? shipingData?.shipping_charge
              : 0,
          flag: cartData[0].product_type === "0" ? "online" : "book",
        }
      );
      if (res?.data?.data?.razorpay_orderid === null) {
        getPaytmCalled(res?.data?.data);
        setReload(false);
      } else {
        openTrab(res.data.data);
        setReload(false);
        setPayToggle(false);
      }
    } catch (error) {
      console.log(error);
      setReload(false);
    }
  };

  const handleinitialize = async () => {
    let installmentExpiry =
      cartData.length > 0
        ? cartData[0]?.subscription_data?.amount_description?.expiry
        : "0";
    const payment_meta = cartData[0]?.subscription_data;
    console.log(cartData, "1024");
    const courselist = cartData.map((item) => {
      return {
        course_id: item.id,
        product_type: item.product_type,
        qty: item.qty,
        child_courses: "",
        color_name: "",
        course_discount: "",
        net_amount: "",
        payment_mode: item.is_subscription,
        expiry: installmentExpiry ? installmentExpiry : "0",
        is_cbt: !item.is_cbt ? "0" : item.is_cbt,
        course_price: item.mrp,
        pending_amount: !item.pending_amount ? "0" : item.pending_amount,
        size_name: "",
        subscription_code: "",
        payment_meta: cartData[0].subscription_data,
        payment_id: !item.payment_id ? "0" : item.payment_id,
        partner_member_id: !item.partner_member_id
          ? "0"
          : item.partner_member_id,
        id_fr_learning_center_detail: !item.id_fr_learning_center_detail
          ? "0"
          : item.id_fr_learning_center_detail,
        is_part_payment: !item.is_part_payment ? "0" : item.is_part_payment,
        full_amount: !item.full_amount ? "0" : item.full_amount,
        facetoface_center_id: !item.facetoface_center_id
          ? "0"
          : item.facetoface_center_id,
        booking_type: !item.booking_type ? "0" : item.booking_type,
        availability_course: !item.availability_course
          ? "0"
          : item.availability_course,
        course_start_date: !item.course_start_date
          ? ""
          : item.course_start_date,
      };
    });
    sessionStorage.setItem("courselist", JSON.stringify(courselist));

    const isDefaultAdd = addressData.filter((itm) => itm.is_default === "1");
    const fin =
      Object.keys(shipingData).length > 0
        ? shipingData?.shipping_charge + gstTotalData?.total_payble_amount
        : gstTotalData?.total_payble_amount;

    try {
      console.log("Line no 884->");
      const res = await axiosInstance.post(
        "/v1_data_model/user/UserPaymentInitialize/initializeCourseTransactionCart",
        {
          user_id: userid,
          list: JSON.stringify(courselist),
          address_id: isDefaultAdd[0].id,
          total_price: fin,
          coupon_applied:
            Object.keys(afterDeductionData).length > 0
              ? afterDeductionData.coupon_code
              : "",
          earn_point_course_purchase: "",
          penalty: "",
          pay_via:
            fin === 0
              ? isChecked === true
                ? "PAY_WALLET"
                : "PAY_COUPON"
              : type === "Paytm"
              ? "PAY_TM"
              : "RAZORPAY",
          points_rate: "",
          tax: "18",
          points_used: "",
          refer_code: "",
          coin_used: JSON.stringify([
            {
              course_id: "0",
              redeem_point: "",
              reward_discount: "0.0",
            },
          ]),
          coin_earn: 0,
          partner_type: "1",
          is_apply_reward_all: "",
          subcenter_id: "",
          course_start_date: "",
          referral_user_by_partner: "",
          coupon_applied_partial: "",
          is_referal: "",
          shipping_charge: 0,
          product_type: cartData[0].product_type,
          region_id: "",
          flag: cartData[0].product_type === "0" ? "online" : "book",
          emi_month: "",
          is_emi_pyment: 0,
          emi_due_date: "",
          delivery_postcode: 201301,
          is_multiorder: 0,
          emi_installment_id: "",
          redeem_amount: 0.0,
        }
      );
      console.log(res);
      if (res?.data?.data?.razorpay_orderid === null) {
        if (fina !== 0) {
          getPaytmCalled(res?.data?.data);
        } else {
          openWallet(res?.data?.data);
        }
      } else {
        openTrab(res.data.data);
        setPayToggle(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openWallet = async (data) => {
    setComLoading(true);
    let installmentExpiry =
      cartData.length > 0
        ? cartData[0]?.subscription_data?.amount_description?.expiry
        : "0";
    const payment_meta = cartData[0]?.subscription_data;
    const courselist = cartData.map((item) => {
      return {
        course_id: item.id,
        product_type: item.product_type,
        qty: item.qty,
        payment_mode: item.is_subscription,
        expiry: "",
        // expiry: installmentExpiry ? installmentExpiry : "0",
        is_cbt: !item.is_cbt ? "0" : item.is_cbt,
        course_price:
          item.is_part_payment === "3" ? item.price : item.final_amount,
        upgrade_course_price:
          item.is_part_payment === "3" ? item.upgrade_course_price : "",
        transaction_id: item.is_part_payment === "3" ? item.transaction_id : "",
        pending_amount: !item.pending_amount ? "0" : item.pending_amount,
        size_name: "",
        subscription_code: "",
        payment_meta: cartData[0].subscription_data,
        payment_id: !item.payment_id ? "0" : item.payment_id,
        partner_member_id: !item.partner_member_id
          ? "0"
          : item.partner_member_id,
        id_fr_learning_center_detail: !item.id_fr_learning_center_detail
          ? "0"
          : item.id_fr_learning_center_detail,
        is_part_payment: !item.is_part_payment ? "0" : item.is_part_payment,
        full_amount: !item.full_amount ? "0" : item.full_amount,
        facetoface_center_id: !item.facetoface_center_id
          ? "0"
          : item.facetoface_center_id,
        booking_type: !item.booking_type ? "0" : item.booking_type,
        availability_course: !item.availability_course
          ? "0"
          : item.availability_course,
        course_start_date: !item.course_start_date
          ? ""
          : item.course_start_date,
        course_discount: "",
        child_courses: "",
        color_name: "",
        net_amount: "",
      };
    });
    console.log("ANUJ 1018");
    const res = await axiosInstance.post(
      "/v1_data_model/user/User_payment/complete_transaction_cart",
      {
        list: JSON.stringify(courselist),
        redeem_amount: 0,
        pre_transaction_id: data?.pre_transaction_id,
        post_transaction_id: new Date().getTime(),
        affiliate_referral_code_by: "",
        earn_point_course_purchase: "",
        transaction_status_data: JSON.stringify([
          {
            STATUS: "TXN_SUCCESS",
            CHECKSUMHASH: "",
            BANKNAME: "",
            ORDERID: data?.pre_transaction_id,
            TXNAMOUNT: "0",
            TXNDATE: "2024-07-17",
            MID: "",
            TXNID: new Date().getTime(),
            RESPCODE: 1,
            PAYMENTMODE: "FREE",
            BANKTXNID: "",
            CURRENCY: "",
            GATEWAYNAME: "",
            RESPMSG: "TXN_SUCCESS_FREE",
          },
        ]),
        user_id: userid,
        pay_via: "PAY_TM",
        walletBalanceAmount: cValue,
      }
    );

    // if (res.data.status === true) {
    //   nav(
    //     `/success/${res.data.data.order_id}-${res.data.data.payble_amount}`
    //   );
    // }
    console.log(res.data.data);
    nav("/complete", { state: data?.pre_transaction_id });
    setComLoading(false);
  };

  const getPaytmCalled = async (data) => {
    try {
      const response2 = await axiosInstance.post(
        `/v1_data_model/user/User_payment/generate_paytm_checksum_new`,
        {
          MID: data?.paytm_mid,
          ORDER_ID: data?.pre_transaction_id,
          PAYTM_MERCHANT_KEY: "5jt552fcui1EYL_@",
          PAYTM_MERCHANT_WEBSITE: "WEBSTAGING",
          CHANNEL_ID: "WEB",
          CUST_ID: userid,
          WEBSITE: "DEFAULT",
          user_id: userid,
          TXN_AMOUNT:
            Object.keys(shipingData).length > 0
              ? shipingData?.shipping_charge + gstTotalData?.total_payble_amount
              : gstTotalData?.total_payble_amount,
          CALLBACK_URL: "",
        }
      );
      //console.log("*****", response2.data);
      if (response2.data.status === false) {
        toast.error(
          "There is issue with payment configuration please contact support team"
        );
      } else {
        const { txnToken, order_id, TXN_AMOUNT } = response2.data;

        setOneMinuteCookie("TxnToken", txnToken);
        setOneMinuteCookie("OrderId", order_id);
        setOneMinuteCookie(
          "TotalAmount",
          Object.keys(shipingData).length > 0
            ? shipingData?.shipping_charge + gstTotalData?.total_payble_amount
            : gstTotalData?.total_payble_amount
        );

        // Update mConfig with new order details
        setMConfig((prevConfig) => ({
          ...prevConfig,
          data: {
            ...prevConfig.data,
            orderId: order_id,
            amount:
              Object.keys(shipingData).length > 0
                ? shipingData?.shipping_charge +
                  gstTotalData?.total_payble_amount
                : gstTotalData?.total_payble_amount,
            token: txnToken,
          },
        }));
        getThirdCalled();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getThirdCalled = async () => {
    const url = "https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/";
    const scriptElement = document.createElement("script");
    scriptElement.async = true;
    scriptElement.src = url.concat(mConfig.merchant.mid);
    scriptElement.type = "application/javascript";
    scriptElement.onload = () => {
      const checkoutJsInstance = getCheckoutJsObj();
      if (checkoutJsInstance.onLoad) {
        checkoutJsInstance.onLoad(() => {
          const TxnToken = Cookies.get("TxnToken");
          const OrderId = Cookies.get("OrderId");
          const TotalAmount = Cookies.get("TotalAmount");
          if (!TxnToken || !OrderId || !TotalAmount) {
            console.error(
              "Missing necessary transaction details from localStorage"
            );
            return;
          }

          const config = {
            ...mConfig,
            handler: {
              notifyMerchant: notifyMerchantHandler,
              transactionStatus,
            },
            data: {
              ...mConfig.data,
              orderId: OrderId,
              amount: TotalAmount,
              token: TxnToken,
            },
          };
          setMConfig(appendHandler(config));
          setCheckoutJsInstance(checkoutJsInstance);
        });
      } else {
        console.error("CheckoutJS onLoad method not available!");
      }
    };
    scriptElement.onerror = (error) => {
      console.error("CheckoutJS script load failed!", error);
    };
    document.body.appendChild(scriptElement);
  };

  const openTrab = (data) => {
    let installmentExpiry =
      cartData.length > 0
        ? cartData[0]?.subscription_data?.amount_description?.expiry
        : "0";
    const payment_meta = cartData[0]?.subscription_data;
    const courselist = cartData.map((item) => {
      return {
        course_id: item.id,
        product_type: item.product_type,
        qty: item.qty,
        payment_mode: item.is_subscription,
        expiry: "",
        is_cbt: !item.is_cbt ? "0" : item.is_cbt,
        course_price:
          item.is_part_payment === "3" ? item.price : item.final_amount,
        upgrade_course_price:
          item.is_part_payment === "3" ? item.upgrade_course_price : "",
        transaction_id: item.is_part_payment === "3" ? item.transaction_id : "",
        pending_amount: !item.pending_amount ? "0" : item.pending_amount,
        size_name: "",
        subscription_code: "",
        payment_meta: {},
        payment_id: !item.payment_id ? "0" : item.payment_id,
        partner_member_id: !item.partner_member_id
          ? "0"
          : item.partner_member_id,
        id_fr_learning_center_detail: !item.id_fr_learning_center_detail
          ? "0"
          : item.id_fr_learning_center_detail,
        is_part_payment: !item.is_part_payment ? "0" : item.is_part_payment,
        full_amount: !item.full_amount ? "0" : item.full_amount,
        facetoface_center_id: !item.facetoface_center_id
          ? "0"
          : item.facetoface_center_id,
        booking_type: !item.booking_type ? "0" : item.booking_type,
        availability_course: !item.availability_course
          ? "0"
          : item.availability_course,
        course_start_date: !item.course_start_date
          ? ""
          : item.course_start_date,
        course_discount: "",
        child_courses: "",
        color_name: "",
        net_amount: "",
      };
    });

    const amountInPaise = Math.round(
      parseFloat(gstTotalData?.total_payble_amount) * 100
    );
    const finalAmount = Math.max(amountInPaise, 100);
    const options = {
      key: "rzp_live_6iSc6G3qM2aeDy",
      order_id: data?.razorpay_orderid,
      amount: finalAmount,
      name: "Delhi Academy of Medical Sciences Pvt Ltd",
      description: "some description",
      image:
        "https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/login_logo.png",
      handler: async function (response) {
        try {
          setShowSpin(true);
          const res = await axiosInstance.post(
            "/v1_data_model/user/User_payment/complete_transaction_cart",
            {
              list: JSON.stringify(courselist),
              redeem_amount: 0,
              pre_transaction_id: data?.pre_transaction_id,
              post_transaction_id: response?.razorpay_payment_id,
              affiliate_referral_code_by: "",
              earn_point_course_purchase: "",
              transaction_status_data: JSON.stringify([
                {
                  STATUS: "TXN_SUCCESS",
                  CHECKSUMHASH: "",
                  BANKNAME: "",
                  ORDERID: data?.pre_transaction_id,
                  TXNAMOUNT:
                    Object.keys(shipingData).length > 0
                      ? shipingData?.shipping_charge +
                        gstTotalData?.total_payble_amount
                      : gstTotalData?.total_payble_amount,
                  TXNDATE: "2024-07-17",
                  MID: "",
                  TXNID: new Date().getTime(),
                  RESPCODE: 1,
                  PAYMENTMODE: "FREE",
                  BANKTXNID: "",
                  CURRENCY: "",
                  GATEWAYNAME: "",
                  RESPMSG: "Txn Success",
                },
              ]),
              user_id: userid,
              pay_via: "RAZORPAY",
              walletBalanceAmount: cValue,
            }
          );
          console.log("response->", res.data.data);

          if (res.data.status === true) {
            toast.success(res.data.message);
            sessionStorage.setItem("paymentData", res.data.data);
            const is_cbt_type = JSON.parse(localStorage.getItem("CbtType"));

            if (is_cbt_type === "1") {
              get_user_cbt_reg();
              setShowSpin(false);
            } else {
              // console.log("Course");
              nav(
                `/success/${res.data.data.order_id}-${
                  Object.keys(shipingData).length > 0
                    ? shipingData?.shipping_charge +
                      gstTotalData?.total_payble_amount
                    : gstTotalData?.total_payble_amount
                }`
              );
              setShowSpin(false);
            }
          }
          console.log(res);
        } catch (err) {
          console.log(err);
          setShowSpin(false);
        }
      },
      prefill: {
        name: userData.name,
        contact: userData.mobile,
        email: userData.email,
      },
      notes: {
        address: "some address",
      },
      theme: {
        color: "#f15a22",
        hide_topbar: false,
      },
    };
    openPayModal(options);
  };

  const openPayModal = (options) => {
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const getFetchShippingCharges = async () => {
    // console.log("first")
    const isPin = addressData.filter((itm) => itm.is_default === "1");
    try {
      const response2 = await axiosInstance.post(
        "/v1_data_model/order/order/get_shipping_charge",
        {
          user_id: userid,
          delivery_postcode: isPin[0].pincode,
          course_id: cartData.map((product) => product.id).join(","),
        }
      );
      setShipingData(response2?.data?.data);
      // setShipingCartData(response2.data?.data?.shipping_charge);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      (shipingValue === "1" && addressData.length > 0) ||
      productType === "2"
    ) {
      getFetchShippingCharges();
    }
  }, [shipingValue, addressData, productType]);

  const getWalletAmountDeduction = async () => {
    try {
      const c =
        coupanValue > gstTotalData?.total_payble_amount
          ? Number(gstTotalData?.total_payble_amount).toFixed(2)
          : coupanValue;
      sessionStorage.setItem("coupanV", c);
      const res = await axiosInstance.post(
        "v1_data_model/user/user_cart/apply_wallet_refund_cart",
        {
          user_id: userid,
          course_id: cartData[0]?.id,
          walletBalanceAmount:
            isChecked === false
              ? ""
              : coupanValue > gstTotalData?.total_payble_amount
              ? Number(gstTotalData?.total_payble_amount).toFixed(2)
              : coupanValue,
          // walletBalanceAmount: isChecked ? coupanValue : "",
        }
      );
      if (res.data.data.wallet_status === 1) {
        getGstCalculate(addressData);
      } else {
        getGstCalculate(addressData);
        setIsChecked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWalletAmountDeduction();
  }, [isChecked]);

  const getCheckoutJsObj = () => {
    if (window && window.Paytm && window.Paytm.CheckoutJS) {
      return window.Paytm.CheckoutJS;
    } else {
      console.error("Checkout instance not found!");
      return null;
    }
  };

  const handlePayFunction = () => {
    setSelectedGateway(null);
    setPayToggle(false);
  };

  const confirm = (itm) => {
    dispatch(removeFromCart(itm));
    handleRemoveCourse(itm.id);
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            height: "30vh",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="Cart">
          <div className="page-content position-relative">
            <div className="aboutbg"></div>
          </div>

          {/* Main Section Starts Here */}
          <section className="shoping-cart position-relative">
            <div className="container">
              {cartData?.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src="https://d2enu63wt1sf3u.cloudfront.net/react_emed_web/empty_cart.webp"
                    style={{}}
                    width="25%"
                  />
                  <h2>No item found....</h2>
                </div>
              ) : (
                <>
                  <h2>My Cart</h2>
                  {showSpin ? (
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        alignItems: "center",
                        height: "30vh",
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
                        {/* ----------------------------------Main Details ---------------------------------- */}
                        {cartData?.map((itm, i) => (
                          <div className="ibox" key={i}>
                            <div className="group-item">
                              <div className="row">
                                <div className="col-3 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                  <div className="cart-product-img">
                                    <a>
                                      <img
                                        src={(
                                          itm.cover_image ||
                                          itm.featured_image ||
                                          "https://d2enu63wt1sf3u.cloudfront.net/course_file_meta/b2cb5482ec838ddcd082749b3ad98f51"
                                        )?.replace(/\\\//g, "/")}
                                        alt="Image"
                                      />
                                    </a>
                                  </div>
                                </div>
                                <div className="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-8">
                                  <div className="product-title">
                                    {itm?.title}
                                    <h3>
                                      <a href="https://emedicoz.com/courses/detail?title=ULTIMATE LIVE &amp;category_id=980&amp;combo=0&amp;course_type=7"></a>
                                    </h3>
                                    <div className="small-ratings">
                                      <em className="fa fa-star "></em>
                                      <em className="fa fa-star "></em>
                                      <em className="fa fa-star "></em>
                                      <em className="fa fa-star "></em>
                                      <em className="fa fa-star "></em>
                                      <span className="rating ml-2">
                                        <strong>{itm?.learner}</strong> |
                                        Enrolled
                                      </span>
                                    </div>
                                  </div>

                                  {itm?.product_type == 1 ? (
                                    <>
                                      <span className="rating ml-2">
                                        <strong>Course Type :</strong>{" "}
                                        {itm?.product_type === "1" ||
                                        itm?.course_type === "1"
                                          ? "Book"
                                          : ""}
                                      </span>
                                      <div className="row">
                                        <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                          <div className="icon_add">
                                            <div className="input-group">
                                              <span className="input-group-btn">
                                                <button
                                                  type="button"
                                                  className="btn btn-number minus"
                                                  data-type="minus"
                                                  id="cart_row_id-77"
                                                  onClick={() =>
                                                    decrementCount(itm)
                                                  }
                                                  disabled={
                                                    itm.qty == 1 ? true : false
                                                  }
                                                >
                                                  <span className="fa fa-minus"></span>
                                                </button>
                                              </span>
                                              <input
                                                type="text"
                                                name="quant[2]"
                                                className="form-control input-number"
                                                id="getvalue"
                                                value={
                                                  counter ? counter : itm.qty
                                                }
                                                min={parseInt(itm.qty)}
                                                max="5"
                                                fdprocessedid="vc9w0s"
                                              />
                                              <span className="input-group-btn">
                                                <button
                                                  type="button"
                                                  className="btn btn-number plus"
                                                  onClick={() =>
                                                    incrementCount(itm)
                                                  }
                                                  value={counter}
                                                  disable={
                                                    loading ? true : false
                                                  }
                                                >
                                                  <span className="fa fa-plus"></span>
                                                </button>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    itm?.product_type == 2 && (
                                      <>
                                        <span className="rating ml-2">
                                          <strong>Course Type:</strong>{" "}
                                          {itm?.product_type === "2" ||
                                          itm?.course_type === "1"
                                            ? "Ecommerce"
                                            : ""}
                                        </span>
                                        <br></br>
                                        {itm?.size_name?.trim() !== "" && (
                                          <span className="rating ml-2">
                                            <strong>Size:</strong>{" "}
                                            {itm?.product_type === "2" ||
                                            itm?.course_type === "1"
                                              ? itm?.size_name
                                              : ""}
                                          </span>
                                        )}
                                        <div className="row">
                                          <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                            <div className="icon_add">
                                              <div className="input-group">
                                                <span className="input-group-btn">
                                                  <button
                                                    type="button"
                                                    className="btn btn-number minus"
                                                    data-type="minus"
                                                    id="cart_row_id-77"
                                                    onClick={() =>
                                                      decrementCount(itm)
                                                    }
                                                    disabled={
                                                      itm.qty == 1
                                                        ? true
                                                        : false
                                                    }
                                                  >
                                                    <span className="fa fa-minus"></span>
                                                  </button>
                                                </span>
                                                <input
                                                  type="text"
                                                  name="quant[2]"
                                                  className="form-control input-number"
                                                  id="getvalue"
                                                  value={
                                                    counter ? counter : itm.qty
                                                  }
                                                  min={parseInt(itm.qty)}
                                                  max="5"
                                                  fdprocessedid="vc9w0s"
                                                />
                                                <span className="input-group-btn">
                                                  <button
                                                    type="button"
                                                    className="btn btn-number plus"
                                                    onClick={() =>
                                                      incrementCount(itm)
                                                    }
                                                    value={counter}
                                                  >
                                                    <span className="fa fa-plus"></span>
                                                  </button>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )
                                  )}
                                </div>
                                <div className="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                                  <div className="delbg text-right">
                                    {/* <CiTrash
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "25px",
                                      }}
                                      onClick={() => {
                                        handleRemoveCourse(itm);
                                      }}
                                    /> */}
                                    <>
                                      {itm?.is_combo_master != "1" && (
                                        <Popconfirm
                                          title={itm?.title}
                                          placement="leftTop"
                                          description="Are you sure want to delete this course/book from cart?"
                                          onConfirm={() => confirm(itm)}
                                          onCancel={cancel}
                                          okText="Yes"
                                          cancelText="No"
                                        >
                                          <CiTrash
                                            style={{
                                              cursor: "pointer",
                                              fontSize: "25px",
                                            }}
                                          />
                                        </Popconfirm>
                                      )}
                                    </>
                                  </div>
                                </div>

                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                  <div className="monthly-price">
                                    <div className="row">
                                      <div className="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                        <div
                                          className="heading"
                                          style={{ marginTop: "22px" }}
                                        >
                                          <span>
                                            {itm?.subscription_data.name}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                                        <div className="price-listing text-right">
                                          <ul>
                                            <li>
                                              <em className="fa fa-rupee mr-1"></em>
                                              {itm.course_type == 1
                                                ? itm.final_amount
                                                : itm.price}
                                              {/* <span className="d-block">
                                                Product Type:{" "}
                                                <b>
                                                  {itm?.product_type === "0"
                                                    ? "Ecom"
                                                    : "Book"}
                                                </b>
                                              </span> */}
                                              <span className="d-block">
                                                Exclusive of all taxes
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* ----------------------------------Wallet Discount---------------------------------- */}
                        <div className="walletBalance">
                          <input
                            type="checkbox"
                            id=""
                            name=""
                            value="Wallet"
                            checked={isChecked}
                            // disabled={
                            //   Object.keys(afterDeductionData).length > 0 && true
                            // }
                            onChange={handleCheckboxChange}
                          />
                          <label>
                            Use your
                            <span>
                              <em className="fa fa-rupee">
                                {" "}
                                {coupanValue > gstTotalData?.total_payble_amount
                                  ? Number(
                                      gstTotalData?.total_payble_amount
                                    ).toFixed(2)
                                  : coupanValue}
                              </em>
                              eMedicoz Wallet Balance
                            </span>
                          </label>
                        </div>

                        {/* ----------------------------------Coupan ---------------------------------- */}
                        <Coupan
                          getCoupanListFetch={getCoupanListFetch}
                          coupanLoading={coupanLoading}
                          afterDeductionData={afterDeductionData}
                          setCoupanInp={setCoupanInp}
                          coupanInp={coupanInp}
                          handlerClear={handlerClear}
                          handlerApplyCoupan={handlerApplyCoupan}
                        />

                        {/* ----------------------------------Address ---------------------------------- */}
                        <Address
                          addressData={addressData}
                          handlerSelectedAddress={handlerSelectedAddress}
                        />
                      </div>

                      {/* ----------------------------------Price Detaols ---------------------------------- */}
                      <Price
                        cartData={cartData}
                        allData={allData}
                        afterDeductionData={afterDeductionData}
                        gstTotalData={gstTotalData}
                        isChecked={isChecked}
                        coupan={coupanValue}
                        handlerOpenPayModal={handlerOpenPayModal}
                        shipingData={shipingData}
                        addressData={addressData}
                        comLoading={comLoading}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
          {/* Main Section End Here */}
        </div>
      )}

      {/* coupan modal */}
      <Modal
        title="Coupan List"
        open={coupanToogle}
        onOk={() => setCoupanToogle(false)}
        onCancel={() => setCoupanToogle(false)}
      >
        <List
          size="small"
          bordered
          dataSource={coupanListData}
          renderItem={(item, i) => (
            <List.Item
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
              }}
              // onClick={() => console.log(item.coupon_tilte)}
            >
              <span>
                {item.coupon_tilte} &nbsp;
                <b style={{ color: "green" }}>{item.coupon_discription}</b>
              </span>
              <Button
                size="small"
                type="primary"
                onClick={() => handlerCoupanApplyByUser(item)}
              >
                Apply
              </Button>
            </List.Item>
          )}
        />
      </Modal>

      {/* Default Address Pop up */}
      <Modal
        open={defaultAddressModal}
        onOk={() => handleOk(defaultAddressModal)}
        onCancel={() => setDefaultAddressModal(false)}
      >
        <p>Are you sure want to select default address?</p>
        <p>
          Your Address :<b>{showAddress?.address}</b>
        </p>
      </Modal>

      {/* open pay modal */}
      <textarea
        cols="50"
        rows="25"
        defaultValue={mConfigTextAreaVal}
        ref={mConfigTextAreaRef}
        style={{ display: "none" }}
      />
      <Modal
        className="CartPopData"
        title="Pay Now"
        footer={null}
        open={payToggle}
        onOk={() => setPayToggle(false)}
        onCancel={handlePayFunction}
      >
        <div className="cartModelBody">
          {payModeArr?.map((itm, i) => (
            <Checkbox
              defaultChecked={false}
              checked={selectedGateway === itm.payment_gateway_name}
              onChange={() => setSelectedGateway(itm.payment_gateway_name)}
            >
              {itm?.payment_gateway_name}
            </Checkbox>
          ))}
        </div>
        <Button
          block
          type="primary"
          disabled={selectedGateway ? false : true}
          // onClick={()=>console.log(selectedGateway)}
          onClick={() => handlePopUpmodal(selectedGateway)}
        >
          {payreload ? <Spin /> : "Pay Now"}
        </Button>
      </Modal>

      <CheckoutProvider
        config={mConfig}
        checkoutJsInstance={checkoutJsInstance}
        openInPopup={true}
        env="STAGE"
      >
        <InjectedCheckout />
        <Checkout />
      </CheckoutProvider>
    </>
  );
};

export default AddCart;

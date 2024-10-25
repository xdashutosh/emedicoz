import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../API/axiosConfig";
import { useParams } from "react-router-dom";
import { FaDownload, FaPrint } from "react-icons/fa";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#eee",
    padding: 5,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  total: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
  },
});

const InvoicePDF = ({ data, filteredOrderHistory, convertSeconds }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text>Invoice</Text>
        <Text>Delhi Academy of Medical Sciences Pvt Ltd</Text>
        <Text>
          205,2nd Floor,Grover Chamber, 4B Pusa Road, KarolBagh, New
          Delhi-110005
        </Text>
        <Text>GST NO. 07AADCD1157F1Z0</Text>
        <Text>CIN: U80900DL2009PTC188962</Text>
      </View>
      <View style={styles.section}>
        <Text>Name: {data?.user_name}</Text>
        <Text>Transaction ID: {data?.pre_transaction_id}</Text>
        <Text>Invoice No: {data?.invoice_no}</Text>
        <Text>Invoice Date: {data?.creation_date}</Text>
        <Text>GST State: {data?.state}</Text>
      </View>
      <View style={styles.section}>
        <Text>Address: {data?.address}</Text>
        <Text>Bill To: {data?.user_name}</Text>
        <Text>Phone: +91-{data?.phone}</Text>
        <Text>State: {data?.state}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>S.No.</Text>
          <Text style={styles.tableColHeader}>SAC Code</Text>
          <Text style={styles.tableColHeader}>Product</Text>
          <Text style={styles.tableColHeader}>Course name</Text>
          <Text style={styles.tableColHeader}>Qty</Text>
          <Text style={styles.tableColHeader}>Amount(in Rs)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>1</Text>
          <Text style={styles.tableCol}>{data?.sac_code}</Text>
          <Text style={styles.tableCol}>{data?.title}</Text>
          <Text style={styles.tableCol}>
            Start Date: {data?.course_start_date} <br />
            End Date: {convertSeconds(data?.validity)}
          </Text>
          <Text style={styles.tableCol}>{data?.quantity}</Text>
          <Text style={styles.tableCol}>₹ {data?.course_net_price}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>2</Text>
          <Text style={styles.tableCol}>Tax GST</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}>
            ₹ {filteredOrderHistory?.total_gst_amount}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>3</Text>
          <Text style={styles.tableCol}>Shipping Charge</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}>
            ₹ {filteredOrderHistory?.shipping_charge}
          </Text>
        </View>
      </View>
      <Text style={styles.total}>
        Total: ₹ {filteredOrderHistory?.course_price}
      </Text>
    </Page>
  </Document>
);

const Invoice = () => {
  const { id } = useParams();
  const oid = id.split("C")[0];
  const cid = id.split("C")[1].split("U")[0];
  const userid = id.split("C")[1].split("U")[1];
  const [data, setData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredOrderHistory, setFilteredOrderHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.post(
          "/v1_data_model/user/user_cart/get_invoice_displays",
          { oid: oid, cid: cid }
        );

        if (res.status === 200) {
          setData(res?.data?.data?.result);

          const orderHistoryRes = await axiosInstance.post(
            "/v1_data_model/courses/My_courses/order_history",
            { user_id: userid, last_id: "" }
          );

          if (orderHistoryRes.status === 200) {
            const orderHistoryData = orderHistoryRes?.data?.data;
            setOrderHistory(orderHistoryData);

            const filteredData = orderHistoryData.filter(
              (order) => order.pre_transaction_id === oid
            );
            setFilteredOrderHistory(filteredData[0]);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [oid, cid, userid]);

  const convertSeconds = (seconds) => {
    if (!seconds) {
      return;
    }
    const date = new Date(Number(seconds));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const printss = useRef();
  const handleprr = () => {
    window.print();
  };
  return (
    <>
      <div ref={printss} className="mainbox">
        <div className="container"  >
          <div className="invoice-card">
            <section className="invoice">
              <div className="border_btm">
                <div className="row">
                  <div className="col-6">
                    <div className="top_left_sec">
                      <img
                        src="https://emedicoz.com/src/components/header/login_logo.png"
                        alt="Logo"
                      />
                      <h3>Delhi Academy of Medical Sciences Pvt Ltd</h3>
                      <p>
                        {" "}
                        205,2nd Floor,Grover Chamber, 4B Pusa Road, KarolBagh,
                        New Delhi-110005
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="top_ryt_sec">
                      <div
                        className="invoice-but"
                        style={{ marginBottom: "20px" }}
                      >
                        <PDFDownloadLink
                          document={
                            <InvoicePDF
                              data={data}
                              filteredOrderHistory={filteredOrderHistory}
                              convertSeconds={convertSeconds}
                            />
                          }
                          fileName="invoice.pdf"
                        >
                          {({ loading }) =>
                            loading ? (
                              "Loading document..."
                            ) : (
                              <FaDownload size={22} />
                            )
                          }
                        </PDFDownloadLink>
                        <button
                          style={{ marginLeft: "40px" }}
                          onClick={handleprr}
                        >
                          <FaPrint size={22} />
                        </button>
                      </div>
                      <h2>Invoice</h2>

                      {/* <img
                    src="https://i.ibb.co/0DN4dWM/bar-cdoe.png"
                    alt="Barcode"
                  /> */}
                      <h4>GST NO. 07AADCD1157F1Z0</h4>
                      <h4>CIN: U80900DL2009PTC188962</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="middle_sec">
                <div className="row">
                  <div className="col-6">
                    <div className="order_id">
                      <ul>
                        <li>
                          Name: <span className="ml-2">{data?.user_name}</span>
                        </li>
                        <li>
                          Transaction Id:{" "}
                          <span className="ml-2">
                            {data?.pre_transaction_id}
                          </span>
                        </li>
                        <li>
                          Invoice No.{" "}
                          <span className="ml-2">{data?.invoice_no}</span>
                        </li>
                        <li>
                          Invoice Date:{" "}
                          <span className="ml-2">{data?.creation_date}</span>
                        </li>
                        <li>
                          GST State: <span className="ml-2">{data?.state}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bill_to order_id">
                      <ul>
                        <li>
                          Address: <span className="ml-2">{data?.address}</span>
                        </li>
                        <li>
                          Bill To:{" "}
                          <span className="ml-2">{data?.user_name}</span>
                        </li>
                        <li>
                          Phone: <span className="ml-2">+91-{data?.phone}</span>
                        </li>
                        <li>
                          State: <span className="ml-2">{data?.state}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom_sec">
                <div className="row">
                  <div className="col-12">
                    <div className="table-responsive">
                      <table className="table m-0">
                        <thead>
                          <tr>
                            <th scope="col">S.No.</th>
                            <th scope="col">SAC Code</th>
                            <th scope="col">Product</th>
                            <th scope="col">Course name</th>
                            <th scope="col">Qty</th>
                            <th scope="col">Amount(in Rs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>{data?.sac_code}</td>
                            <td>{data?.title}</td>
                            <td>
                              <span>{data?.title}</span>
                              <span className="d-block">
                                Start Date {data?.course_start_date}
                              </span>
                              <span>
                                End Date {convertSeconds(data?.validity)}
                              </span>
                            </td>
                            <td className="text-center">{data?.quantity}</td>
                            <td>
                              ₹ {data?.course_net_price} <br></br>
                              {/* <span>
                            Coupon({filteredOrderHistory?.coupon_applied}) -₹{" "}
                            {filteredOrderHistory?.coupon_discount}
                          </span> */}
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Tax GST</td>
                            <td colSpan={3}></td>
                            <td>₹ {filteredOrderHistory?.total_gst_amount}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td>Shipping Charge</td>
                            <td colSpan={3}></td>
                            <td>₹ {filteredOrderHistory?.shipping_charge}</td>
                          </tr>
                          {/* <tr>
                        <td></td>
                        <td>Shipping Charge ' . Tax GST</td>
                        <td colSpan={3}></td>
                        <td>₹ {totalAmount}</td>
                      </tr> */}
                          <tr>
                            <td colSpan={6}>
                              <table className="totalbotom">
                                <tr>
                                  <td className="bill">
                                    <span className="total">Total:</span> ₹
                                    {filteredOrderHistory?.course_price}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="tbl_txt">
                      <h3>
                        "This is a computer generated invoice and does not
                        require a signature"
                      </h3>
                    </div>
                    <div className="link_txt">
                      <p>*Cheque/Pay orders subject to realization.</p>
                      <p>*Fee is not refundable.</p>
                      <p>
                        *It is advised to consult a legal professional/lawyer/CA
                        before taking any input credit of GST.
                      </p>
                      <p>
                        *GST Invoice to student/student parent firm/student
                        associate firm is issued only on their specific request.
                      </p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="footer_navi">
                      <ul>
                        <li>011-4009 4009</li>
                        <li>|</li>
                        <li>www.eMedicoz.com</li>
                        <li>|</li>
                        <li>support@damsdelhi.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <div className="pdfdownload">
          <PDFDownloadLink
            document={<MyDocument data={data} />}
            fileName="Invoice.pdf"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </div> */}
          </div>
        </div>

        {/* Print and Download Buttons */}
      </div>
    </>
  );
};

export default Invoice;

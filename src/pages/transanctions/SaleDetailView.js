import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, InputAdornment, MenuItem, TextField,Tooltip,Chip } from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";
import queryString from "query-string";
import { useLocation } from "react-router";

export default function SaleDetailView() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [txnType, setTxnType] = useState("1");
  const [PG, setPG] = useState("all");
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { REACT_APP_MERCHANT_URL } = process.env;

  const handlePayoutBreakView = (UTR) => {
    console.log(data);
    let temp = JSON.stringify(data);
    //localStorage.setItem("settlement",temp);
     //window.open(`http://localhost:3000/superadmin-payouts/breakup?id=${UTR}`);
    window.open(`${REACT_APP_MERCHANT_URL}/settlements/breakup?id=${UTR}`);
  }

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/transaction/get/transactions/sale-detail", {
           params: {
            iOrder: id
          }
        })
        .then((response) => {
          setData(response.data.data[0]);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, lastNdays, fromDate, toDate]);

  return (
    <>
      <h3 style={{marginLeft: "20px"}}>#MPY{data.ORDERNO}</h3>
      <Box
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "0px",
          borderRadius: "4px"
        }}
        m={2}
      >
      </Box>
      <div className="detail_view_outer" style={{marginLeft: "25px",marginRight: "25px",backgroundColor: "white",paddingTop: "25px",borderRadius: "5px",padding: "20px"}}>

        <div style={{display: "flex"}}>
          <div className="left" style={{width: "48%"}}>
            <div style={{backgroundColor:"#bdcedd",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold",marginRight: "20px"}}>
              <span>Settlement Status</span>
             
              {
                (data.Merchant_Settlement_Status === "YES" && data.SplitAdded === "YES") ? (
                  <span style={{float: "right"}}>Settled</span>
                ) : null
              }
              {
                (data.Merchant_Settlement_Status === "No" && data.SplitAdded === "YES") ? (
                  <span style={{float: "right"}}>Settlement in progress</span>
                ) : null
              }
              {
                (data.Success === "No") ? (
                  <span style={{float: "right"}}>-</span>
                ) : null
              }
              {
                (data.Success === "Yes" && data.SplitAdded === "NO") ? (
                  <span style={{float: "right"}}>order to be closed</span>
                ) : null
              }
              
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Settlement Time</span>
              <span style={{float: "right"}}>{data.Merchant_Settlemen_date ? moment(data.Merchant_Settlemen_date).format("MMM Do YYYY, h:mm:ss a"): "-"}</span>
            </div>
          </div>
          <div className="right" style={{width: "48%"}}>
            <div style={{backgroundColor:"#bdcedd",height: "37px",paddingLeft: "6px",paddingTop: "5px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold"}}>
              <span>UTR No.</span>
              <span style={{float: "right"}}>
                {
                  data.Merchant_Settlement_UTR ? (
                    <div className="UTR"
                        onClick={() => {
                          handlePayoutBreakView(data.Merchant_Settlement_UTR);
                        }}>
                     {data.Merchant_Settlement_UTR}
                    </div>
                    
                  ): "-"
                }
                
              </span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Order No</span>
              <span style={{float: "right"}}>{data.ORDERNO}</span>
            </div>
          </div>
        </div>

        <div style={{display: "block",marginTop: "40px"}}>
          <div style={{backgroundColor:"rgb(175 175 175)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold",marginRight: "41px"}}>Transaction Information</div>
          <div style={{display: "flex"}}>
            <div className="left" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Merchant Id</span>
                <span style={{float: "right"}}>{data.MID}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Transaction Id</span>
                <span style={{float: "right"}}>{data.ORDERNO}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Transaction Time</span>
                <span style={{float: "right"}}>{moment(data.TxnTime).format("MMM Do YYYY, h:mm:ss a")}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Payment Id</span>
                <span style={{float: "right"}}>{data.paymentId}</span>
              </div>
            </div>
            <div className="right" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Payment Gateway</span>
                <span style={{float: "right"}}>Payu</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Merchant Payment Id</span>
                <span style={{float: "right"}}>{data.MER_paymentId}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Payment Initiated Time</span>
                <span style={{float: "right"}}>{data.SplitAdded === "YES" ? moment(data.Splitadded_Time).format("MMM Do YYYY, h:mm:ss a") : "-" }</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Payment Released Time</span>
                <span style={{float: "right"}}>{data.SplitReleased === "YES" ? moment(data.ReleasedTime).format("MMM Do YYYY, h:mm:ss a") : "-"}</span>
              </div>

            </div>
          </div>
        </div>

        <div style={{display: "flex",marginTop: "40px"}}>
          <div className="left" style={{width: "48%"}}>
            <div style={{backgroundColor:"#bdcedd",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold",marginRight: "20px"}}>
              <span>Payment Collection - Breakup</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Product Value Amount</span>
              <span style={{float: "right"}}>{data.Product_Value_without_GST}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>GST on Product Value</span>
              <span style={{float: "right"}}>{data.GST_on_Products}</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Delivery Charges Collected</span>
              <span style={{float: "right"}}>{data.Delivery_charges_collected_without_GST}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Package & Conv. Fee Collected</span>
              <span style={{float: "right"}}>{data.Package_and_convenience_fee}</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>GST on Charges Collected</span>
              <span style={{float: "right"}}>{data.GST_on_charges_collected}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Total Payment Collected</span>
              <span style={{float: "right"}}>{data.Transaction_Amount_Req}</span>
            </div>
          </div>
          <div className="right" style={{width: "48%"}}>
            <div style={{backgroundColor:"#bdcedd",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold"}}>
              <span>Settlement - Breakup</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Gross Payment Amount</span>
              <span style={{float: "right"}}>{data.Transaction_Amount_Resp}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Mylapay Fees</span>
              <span style={{float: "right"}}>{data.Mylapay_fee_aggregator_charge}</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Delivery Charges</span>
              <span style={{float: "right"}}>{data.Delivery_Charges_Paid}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>GST on Fee & Charges</span>
              <span style={{float: "right"}}>{data.GST_on_mylapay_fee_and_delivery_charges}</span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Total Deductions</span>
              <span style={{float: "right"}}>{data.Total_deductions}</span>
            </div>
            <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
              <span>Net Payment Amount to Settle</span>
              <span style={{float: "right"}}>{data.AmountToBeSettled}</span>
            </div>
          </div>
        </div>

      </div>
    </>  
  );
}



// <div style={{display: "flex"}}>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Transaction</p>
//             </div>
//             <div className="main_content">
//               <p><b>Txn Type:</b><span style={{marginLeft: "20px"}}>{data.Txntype}</span></p>
//               <p><b>Txn Date & Time:</b><span style={{marginLeft: "20px"}}>{moment(data.TxnTime).format("MMM Do YYYY, h:mm:ss a")}</span></p>
//               <p><b>Product_Value_without_GST:</b><span style={{marginLeft: "20px"}}>₹ {data.Product_Value_without_GST}</span></p>
//               <p><b>GST_on_Products:</b><span style={{marginLeft: "20px"}}>₹ {data.GST_on_Products}</span></p>
//               <p><b>Delivery_charges_collected_without_GST:</b><span style={{marginLeft: "20px"}}>₹ {data.Delivery_charges_collected_without_GST}</span></p>
//               <p><b>Package_and_convenience_fee:</b><span style={{marginLeft: "20px"}}>₹ {data.Package_and_convenience_fee}</span></p>
//               <p><b>GST_on_charges_collected:</b><span style={{marginLeft: "20px"}}>₹ {data.GST_on_charges_collected}</span></p>
//               <p><b>Txn Amount:</b><span style={{marginLeft: "20px"}}>₹ {data.Transaction_Amount_Resp}</span></p>
//             </div>
//           </div>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>GST</p>
//             </div>
//             <div className="main_content">
//               <p><b>Product_Value_without_GST:</b><span style={{marginLeft: "20px"}}>₹{data.Product_Value_without_GST}</span></p>
//               <p><b>GST_on_Products:</b><span style={{marginLeft: "20px"}}>₹{data.GST_on_Products}</span></p>
//               <p><b>Delivery_charges_collected_without_GST:</b><span style={{marginLeft: "20px"}}>₹{data.Delivery_charges_collected_without_GST}</span></p>
//               <p><b>Package_and_convenience_fee:</b><span style={{marginLeft: "20px"}}>₹{data.Package_and_convenience_fee}</span></p>
//               <p><b>GST_on_charges_collected:</b><span style={{marginLeft: "20px"}}>₹{data.GST_on_charges_collected}</span></p>
//             </div>
//           </div>
//         </div> 

//         <div style={{display: "flex"}}>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Merchant Settlement</p>
//             </div>
//             <div className="main_content">
//               <p><b>Merchant_Settlement_Status:</b><span style={{marginLeft: "20px"}}>{data.Merchant_Settlement_Status}</span></p>
//               <p><b>Merchant_Settlement_UTR:</b><span style={{marginLeft: "20px"}}>{data.Merchant_Settlement_UTR ? data.Merchant_Settlement_UTR : "-"}</span></p>
//               <p><b>Merchant_Settlement_Amount:</b><span style={{marginLeft: "20px"}}>{data.Merchant_settle_amount ? data.Merchant_settle_amount : "-"}</span></p>
//               <p><b>Merchant_Settlement_Date:</b><span style={{marginLeft: "20px"}}>{data.Merchant_Settlemen_date ? moment(data.Merchant_Settlemen_date).format("MMM Do YYYY, h:mm:ss a") : "-"}</span></p>
//               <p><b>MER_paymentId:</b><span style={{marginLeft: "20px"}}>{data.MER_paymentId ? data.MER_paymentId : "-"}</span></p>
//             </div>
//           </div>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Aggregator Settlement</p>
//             </div>
//             <div className="main_content">
//               <p><b>AGG_Settlement_Status:</b><span style={{marginLeft: "20px"}}>{data.AGG_Settlement_Status}</span></p>
//               <p><b>AGG_Settlement_UTR:</b><span style={{marginLeft: "20px"}}>{data.AGG_Settlement_UTR ? data.AGG_Settlement_UTR : "-"}</span></p>
//               <p><b>AGG_Settlement_Amount:</b><span style={{marginLeft: "20px"}}>{data.AGG_Settlement_Amount ? data.AGG_Settlement_Amount : "-"}</span></p>
//               <p><b>AGG_Settlement_Date:</b><span style={{marginLeft: "20px"}}>{data.AGG_Settlement_Date ? moment(data.AGG_Settlement_Date).format("MMM Do YYYY, h:mm:ss a") : "-"}</span></p>
//               <p><b>AGG_paymentId:</b><span style={{marginLeft: "20px"}}>{data.AGG_paymentId ? data.AGG_paymentId : "-"}</span></p>
//             </div>
//           </div>
//         </div>  

//         <div style={{display: "flex"}}>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Split Add</p>
//             </div>
//             <div className="main_content">
//               <p><b>Split Added:</b><span style={{marginLeft: "20px"}}>{data.SplitAdded}</span></p>
//               <p><b>Added Time:</b><span style={{marginLeft: "20px"}}>{data.Splitadded_Time ? moment(data.Splitadded_Time).format("MMM Do YYYY, h:mm:ss a") : "-"}</span></p>
//             </div>
//           </div>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Split Release</p>
//             </div>
//             <div className="main_content">
//               <p><b>Split Released:</b><span style={{marginLeft: "20px"}}>{data.SplitReleased}</span></p>
//               <p><b>Released Time:</b><span style={{marginLeft: "20px"}}>{data.ReleasedTime ? moment(data.ReleasedTime).format("MMM Do YYYY, h:mm:ss a") : "-"}</span></p>
//             </div>
//           </div>
//         </div>

//         <div style={{display: "flex"}}>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>Payment Mode/Bank Code</p>
//             </div>
//             <div className="main_content">
//               <p><b>Payment Mode:</b><span style={{marginLeft: "20px"}}>{data.Payment_Mode}</span></p>
//               <p><b>Bank Code:</b><span style={{marginLeft: "20px"}}>{data.Payment_Bank_Code}</span></p>
//             </div>
//           </div>
//           <div style={{width: "45%",border: "1px solid #dfd1d1",borderRadius: "4px",padding: "20px",marginLeft: "35px",marginBottom: "35px"}}>
//             <div className="top_heading" style={{height: "45px",paddingTop: "8px",backgroundColor: "#2caee4",color: "white"}}>
//               <p style={{textAlign: "center",fontWeight: "600",fontSize:"18px",margin: "0px"}}>PG Info</p>
//             </div>
//             <div className="main_content">
//               <p><b>PG Name:</b><span style={{marginLeft: "20px"}}>{data.Pgname}</span></p>
//               <p><b>PG_Commission:</b><span style={{marginLeft: "20px"}}>{data.PG_Commission}</span></p>
//               <p><b>PG_Commission_GST:</b><span style={{marginLeft: "20px"}}>{data.PG_Commission_GST}</span></p>
//               <p><b>PG_Commission_Recon_Diff:</b><span style={{marginLeft: "20px"}}>{data.PG_Commission_Recon_Diff}</span></p>
//               <p><b>PG_Settlement_Recon_Diff:</b><span style={{marginLeft: "20px"}}>{data.PG_Settlement_Recon_Diff}</span></p>
//             </div>
//           </div>
//         </div>
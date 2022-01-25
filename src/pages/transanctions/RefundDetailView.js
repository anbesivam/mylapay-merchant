import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, InputAdornment, MenuItem, TextField } from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import UserAction from "../../components/transanctions/UserAction";
import queryString from "query-string";
import { useLocation } from "react-router";

export default function RefundDetailView() {
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
        .get("/mylapay/transaction/get/transactions/refund-detail", {
           params: {
            iOrder: id
          }
        })
        .then((response) => {
          if(response.data.data.length !== 0){
            setData(response.data.data[0]);
          }
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, lastNdays, fromDate, toDate]);

  return (
    <>
      <h3 style={{marginLeft: "20px"}}>#MPY{data.ORDERNO ? data.ORDERNO : id}</h3>
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
              {/*<span style={{float: "right"}}>{data.Merchant_Settlement_Status === "YES" ? "Refunded" : "Refund in progress"}</span> */}
              {
                !data.Merchant_Refund_Status ? (
                  <span style={{float: "right"}}>-</span>
                ) : null
              }
              {
                data.Merchant_Refund_Status && data.Merchant_Refund_Status === "YES" ? (
                  <span style={{float: "right"}}>Refunded</span>
                ) : null
              }
              {
                data.Merchant_Refund_Status && data.Merchant_Refund_Status === "No" ? (
                  <span style={{float: "right"}}>Refund in progress</span>
                ) : null
              }
              
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
              <span>Settlement Time</span>
              <span style={{float: "right"}}>{data.Merchant_Refund_Date ? moment(data.Merchant_Refund_Date).format("MMM Do YYYY, h:mm:ss a") : "-"}</span>
            </div>
          </div>
          <div className="right" style={{width: "48%"}}>
            <div style={{backgroundColor:"#bdcedd",height: "37px",paddingLeft: "6px",paddingTop: "5px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "500"}}>
              <span>UTR No.</span>
              <span style={{float: "right"}}>
                  {
                    data.Merchant_Refund_UTR ? (
                      <div className="UTR"
                          onClick={() => {
                            handlePayoutBreakView(data.Merchant_Refund_UTR);
                          }}>
                       {data.Merchant_Refund_UTR}
                      </div>
                      
                    ): "-"
                  }
                  
              </span>
            </div>
            <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "500"}}>
              <span>Order No</span>
              {/*<span style={{float: "right"}}>{`MPY${data.ORDERNO}`}</span> */}
              {
                data.ORDERNO ? (
                  <span style={{float: "right"}}>{`MPY${data.ORDERNO}`}</span>   
                ) : <span style={{float: "right"}}>{`MPY${id}`}</span>   
              }
            </div>
          </div>
        </div>

        <div style={{display: "block",marginTop: "40px"}}>
          <div style={{backgroundColor:"rgb(175 175 175)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold",marginRight: "41px"}}>Refund processed  on Cancelled / Returned Products </div>
          <div style={{display: "flex"}}>
            <div className="left" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Merchant Id</span>
                <span style={{float: "right"}}>{data.Merc_Name}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Merchant Payment Id</span>
                <span style={{float: "right"}}>{data.MER_paymentId}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Refund Id</span>
                <span style={{float: "right"}}>{data.Refund_Id ? data.Refund_Id : "-"}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Refund Initiated Time</span>
                <span style={{float: "right"}}>{data.Refund_Time ? moment(data.Refund_Time).format("MMM Do YYYY, h:mm:ss a") : "-"}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Refund Settled Time</span>
                <span style={{float: "right"}}>{data.Merchant_Refund_Date ? moment(data.Merchant_Refund_Date).format("MMM Do YYYY, h:mm:ss a") : "-"}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Payment Gateway</span>
                <span style={{float: "right"}}>Payu</span>
              </div>
            </div>
            <div className="right" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Product Value Amount</span>
                <span style={{float: "right"}}>{data.Product_Value_without_GST}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>GST on Product Value</span>
                <span style={{float: "right"}}>{data.GST_on_Products}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Delivery Charges Collected</span>
                <span style={{float: "right"}}>{data.Delivery_charges_collected_without_GST}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Package & Conv. Fee Collected</span>
                <span style={{float: "right"}}>{data.Package_and_convenience_fee}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>GST on Charges Collected</span>
                <span style={{float: "right"}}>{data.GST_on_charges_collected}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Total Payment Collected - Refunded</span>
                <span style={{float: "right"}}>{data.txnamount}</span>
              </div>

            </div>
          </div>
        </div>

        

      </div>
    </>  
  );
}

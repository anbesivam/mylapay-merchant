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

export default function OrderDetailView() {
  const [data, setData] = useState([]);
  const userData = useSelector((state) => state.auth.userData);
  const [lastNdays, setLastNdays] = useState(7);
  const [fromDate, setFromDate] = useState(moment().subtract(7, "days"));
  const [toDate, setToDate] = useState(moment());
  const [txnType, setTxnType] = useState("1");
  const [PG, setPG] = useState("all");
  const { search } = useLocation();
  const { id } = queryString.parse(search);
  const { REACT_APP_SHOP_URL } = process.env;

  // let subOrder = [
  //   {
  //     iOrder: 804,
  //     iItems_suborder: 1236,
  //     product_code: "",
  //     itemTotal_amount: 5.25,
  //     totalGst_Amount: 0.25,
  //     iProduct_Status: 5,
  //     iCancelledby: 1 
  //   },
  //   {
  //     iOrder: 804,
  //     iItems_suborder: 1237,
  //     product_code: "",
  //     itemTotal_amount: 10.50,
  //     totalGst_Amount: 0.50,
  //     iProduct_Status: 4,
  //     iCancelledby: 1 
  //   },
  //   {
  //     iOrder: 804,
  //     iItems_suborder: 1238,
  //     product_code: "",
  //     itemTotal_amount: 10.50,
  //     totalGst_Amount: 0.50,
  //     iProduct_Status: 4,
  //     iCancelledby: 1 
  //   }
  // ]

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/transaction/get/transactions/order-detail", {
           params: {
            iOrder: id
          }
        })
        .then((response) => {
          setData(response.data.data[0]);
          //console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData, lastNdays, fromDate, toDate]);

  const viewproduct = (iProduct, iProductcategory) => {
    window.open(
      `${REACT_APP_SHOP_URL}/${data.url_name}/${data.Template_Url}/${iProductcategory}/${iProduct}`,
      "_blank"
    );
  }

  const renderTableData = () => {
    if(data.subOrders){
      let subOrder = data.subOrders;
       return subOrder.map((product, index) => {
        const {
          iOrder,
          iItems_suborder,
          iProduct,
          iProductcategory,
          item,
          itemTotal_amount,
          totalGst_Amount,
          iProduct_Status,
          CancelledTime,
          iCancelledby,
        } = product; //destructuring
        return (
          <tr key={iItems_suborder} className="product_list_orderview">
            <td>{iOrder}</td>
            <td>{iItems_suborder}</td>
            <td 
              onClick={() => {
                viewproduct(iProduct, iProductcategory);
              }}
            >
              <a 
                href="javascript:void(0)"
                rel="noreferrer"
                className="mp-link"
              >
                {item}
              </a>
            </td>
            <td>{itemTotal_amount}</td>
            <td>{totalGst_Amount}</td>
            <td>{itemTotal_amount - totalGst_Amount}</td>
            {
             iProduct_Status === 1 ? (<td>New</td>) : null 
            }
            {
             iProduct_Status === 2 ? (<td>Accepted</td>) : null 
            }
            {
             iProduct_Status === 3 ? (<td>Transit</td>) : null 
            }
            {
             iProduct_Status === 4 ? (<td>Closed</td>) : null 
            }
            {
             iProduct_Status === 5 ? (<td>Cancelled</td>) : null 
            }
            <td>{iProduct_Status === 5 ? moment(CancelledTime).format("DD MMM YYYY, h:mm A"): "-"}</td>
            {
              iCancelledby === 1 && iProduct_Status === 5 ? (
                <td>Merchant</td>    
              ) : (<td></td>)
            }
            {
              iCancelledby === 2 && iProduct_Status === 5 ? (
                <td>Customer</td>    
              ) : (<td></td>)
            }
            {
              iCancelledby === 3 && iProduct_Status === 5 ? (
                <td>System</td>    
              ) : (<td></td>)
            }
            
          </tr>
        );
      });
    }
    
   
  }

  return (
    <>
      <h3 style={{marginLeft: "20px"}}>#MPY{data.iOrder}</h3>
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

        <div style={{display: "block",marginTop: "40px"}}>
          <div style={{backgroundColor:"rgb(175 175 175)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold",marginRight: "41px"}}>Order Information</div>
          <div style={{display: "flex"}}>
            <div className="left" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Order Status</span>
                <span style={{float: "right"}}>{data.SplitReleased === "YES" ? "Completed":"Open" }</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Order Total Amount</span>
                <span style={{float: "right"}}>{data.totalAmount}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Order Received Time</span>
                {data.orderDate!=null?
                  <span style={{float: "right"}}>{moment(data.orderDate).format("DD MMM YYYY, h:mm A")}</span>
                :
                <span style={{float: "right"}}>{data.orderDate}</span>}
                
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Order Accepted Time</span>
                {data.Accept_Time!=null?
                <span style={{float: "right"}}>{moment(data.Accept_Time).format("DD MMM YYYY, h:mm A")}</span>
                :
                <span style={{float: "right"}}>{data.Accept_Time}</span>}
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Shipment Type</span>
                <span style={{float: "right"}}>{data.Delivery_Type}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Shipment Time</span>
                {data.Shipment_Time!=null?
                <span style={{float: "right"}}>{moment(data.Shipment_Time).format("DD MMM YYYY, h:mm A")}</span>
                :
                <span style={{float: "right"}}>{data.Shipment_Time}</span>}
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500",marginRight: "20px"}}>
                <span>Delivery Time</span>
                {data.Delivery_Time!=null?
                <span style={{float: "right"}}>{moment(data.Delivery_Time).format("DD MMM YYYY, h:mm A")}</span>
                :
                <span style={{float: "right"}}>{data.Delivery_Time}</span>}
              </div>
            </div>
            <div className="right" style={{width: "48%"}}>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Customer Name</span>
                <span style={{float: "right"}}>{data.customerName}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Customer Email</span>
                <span style={{float: "right"}}>{data.email}</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Customer Contact</span>
                <span style={{float: "right"}}>{data.phone}</span>
              </div>
              <div style={{backgroundColor:"white",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "13px",fontWeight: "500"}}>
                <span>Customer Address:</span>
              </div>
              <div style={{backgroundColor:"rgb(233 235 237)",height: "auto",padding: "13px",fontSize: "13px",fontWeight: "500"}}>
                 <p>{`${data.Building_No},${data.Street_Name},${data.Landmark}-${data.City}`}</p> 
              </div>
            </div>
          </div>
           <div style={{marginTop: "40px"}}>
                <div style={{backgroundColor:"rgb(175 175 175)",height: "37px",paddingLeft: "6px",paddingTop: "10px",paddingRight: "6px",fontSize: "0.9em",fontWeight: "bold"}}>Order - Product Details</div>
                <table id="order_product_details">
                  <tr>
                    <th>Order No.</th>
                    <th>Sub Order No.</th>
                    <th>Product Name</th>
                    <th>Product Value &#8377;</th>
                    <th>GST &#8377;</th>
                    <th>Total Amount &#8377;</th>
                    <th>Order Action Status</th>
                    <th>Action time</th>
                    <th>Cancelled By</th>
                  </tr>
                  {renderTableData()}
                </table>
            </div>
        </div>

        

      </div>
    </>  
  );
}

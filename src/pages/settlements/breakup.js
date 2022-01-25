import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, InputAdornment, MenuItem, TextField,Tooltip,Chip } from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";
import queryString from "query-string";
import { useLocation } from "react-router";

export default function Breakup() {
  const [dataSale, setDataSale] = useState([]);
  const [dataRefund, setDataRefund] = useState([]);
  const [refundDeductions, setRefundDeductions] = useState(0);
  const [saleTotalNetCreditAmount, setSaleTotalNetCreditAmount] = useState(0);
  const [refundTotalNetDebitAmount, setRefundTotalNetDebitAmount] = useState(0);

  const [headerMerchant_Settlement_Date, setHeaderMerchant_Settlement_Date] = useState(0);
  const [headerTransaction_Amount, setHeaderTransaction_Amount] = useState(0);
  const [headerFee_Charges_Deductions, setHeaderFee_Charges_Deductions] = useState(0);
  const [headerNetCreditAmount, setHeaderNetCreditAmount] = useState(0);

  const userData = useSelector((state) => state.auth.userData);

  const { search } = useLocation();
  const { id } = queryString.parse(search);
  let settlement = JSON.parse(localStorage.getItem("settlement"));
  console.log(settlement);
  console.log(settlement[0]);
  //let Settlement_Time = moment(new Date(settlement[0])).format("DD MMM YYYY, h:mm:ss a");
  let UTR_Number = id;
  // let UTR_Number = settlement[1];
  //let sale_count = settlement[2];
  // let Transaction_Amount = settlement[3];
  // let Fee_Charges_Deductions = settlement[4];
  //let Refund_Deductions = settlement[5];
  // Merchant_Settlement_Amount - settlement[7]
  // Refund_Deductions - settlement[5]
  //let Net_Credit_Amount = settlement[7] - (Refund_Deductions ? Refund_Deductions : 0);
  const columnsSale = [
    {
      name: "iOrder",
      label: "Order ID",
      options: {
        sort: true,
      }
    },
    {
      name: "Transaction_Amount_Resp",
      label: "Transaction Amount (₹)",
      options: {
        sort: true
      }
    },
    {
      name: "Total_deductions",
      label: "Fee / Charges DeductionsAdd (₹)",
      options: {
        sort: true
      }
    },
    {
      name: "-",
      label: "-",
      options: {
        sort: true,
      }
    },
    {
      name: "Merchant_Settlement_Amount",
      label: "Net Credit Amount (₹)",
      options: {
        sort: true,
      }
    },
    // {
    //   name: "Date_of_Settlement",
    //   label: "Settlement Date",
    //   options: {
    //     sort: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return moment(new Date(value)).format("DD MMM YYYY, h:mm:ss a");
    //     },
    //   }
    // },
    
  ];

  const columnsRefund = [
    {
      name: "iOrder",
      label: "Order ID",
      options: {
        sort: true,
      }
    },
    {
      name: "Merchant_Refund_Amount",
      label: "Refund Amount (₹)",
      options: {
        sort: true
      }
    },
    {
      name: "-",
      label: "-",
      options: {
        sort: true,
      }
    },
    {
      name: "-",
      label: "-",
      options: {
        sort: true,
      }
    },
    {
      name: "Merchant_Refund_Amount",
      label: "Net Debit Amount (₹)",
      options: {
        sort: true,
      }
    }
  ];

  const customSelect = () => <span></span>;


  // MUI-Datatable Options
  const options = {
    filter: false,
    search: false,
    download: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: false,
    customToolbarSelect: customSelect,
    tableBodyMaxHeight: "calc(100vh - 220px)"
  };

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/payouts/breakup/payu", {
          params: {
            Neft_Utr_Number: id,
          },
        })
        .then((response) => {
          setDataSale(response.data.data[0]);
          setDataRefund(response.data.data[1]);
          
          let Transaction_Amount = 0;
          let Fee_Charges_Deductions = 0;
          let SaleTotalNetCreditAmount = 0;
          let tempSale = response.data.data[0];
          for (let i = 0; i < tempSale.length; i++) {
            SaleTotalNetCreditAmount = SaleTotalNetCreditAmount + tempSale[i].Merchant_Settlement_Amount;
            Transaction_Amount = Transaction_Amount + tempSale[i].Transaction_Amount_Resp;
            Fee_Charges_Deductions = Fee_Charges_Deductions + tempSale[i].Total_deductions;
          }

          setHeaderTransaction_Amount(Transaction_Amount);
          setHeaderFee_Charges_Deductions(Fee_Charges_Deductions);
          setSaleTotalNetCreditAmount(SaleTotalNetCreditAmount);
          setHeaderMerchant_Settlement_Date(moment(tempSale[0].Merchant_Settlement_Date).format("DD MMM YYYY, h:mm:ss a"));

          let RefundTotalNetDebitAmount = 0;
          let tempRefund = response.data.data[1];
          for (let i = 0; i < tempRefund.length; i++) {
            if(tempRefund[i].Merchant_Refund_Amount === "NA"){
              RefundTotalNetDebitAmount = RefundTotalNetDebitAmount + 0;
            } else{
              RefundTotalNetDebitAmount = RefundTotalNetDebitAmount + tempRefund[i].Merchant_Refund_Amount;
            }
          }
          setRefundTotalNetDebitAmount(RefundTotalNetDebitAmount);

          let refund = response.data.data[2];
          let Refund_Deductions = 0;

          if(refund && refund.length > 0){
            Refund_Deductions = refund[0].Merchant_Refund_Amount;
          }
          setRefundDeductions(Refund_Deductions);

          // Header Row Net credit amount 
          // SaleTotalNetCreditAmount - RefundTotalNetDebitAmount
          let temp = SaleTotalNetCreditAmount - RefundTotalNetDebitAmount;
          setHeaderNetCreditAmount(temp);
          // console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData]);

  const renderSaleTableData = () => {
    if(dataSale){
        
       return dataSale.map((data, index) => {
        const {
          iOrder,
          Transaction_Amount_Resp,
          Total_deductions,
          Merchant_Settlement_Amount,
          Refund_Deductions
        } = data; //destructuring
        return (
          <tr key={iOrder} className="product_list_settlement">
            <td>{iOrder}</td>
            <td>{Transaction_Amount_Resp}</td>
            <td>{Total_deductions}</td>
            <td>{Refund_Deductions}</td>
            <td>{Merchant_Settlement_Amount}</td>
          </tr>
        );
      });
    }
   
  }

  const renderRefundTableData = () => {
    if(dataRefund){
      
       return dataRefund.map((data, index) => {
        const {
          iOrder,
          Merchant_Refund_Amount
        } = data; //destructuring
        return (
          <>
          {
            Merchant_Refund_Amount === "NA" ? (
              <tr key={iOrder} className="product_list_settlement">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>  
            ) : (
                <tr key={iOrder} className="product_list_settlement">
                  <td>{iOrder}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{Merchant_Refund_Amount}</td>
                  <td>{Merchant_Refund_Amount}</td>
                </tr>
            ) 
          }
            
          </>  
        );
      });
    }
   
  }

  return (
   <> 
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
      <div style={{marginBottom: "25px",backgroundColor: "white"}}>
        <table id="order_product_details">
          <tr>
            <th>Settlement Time</th>
            <th>UTR Number</th>
            <th>Transaction Amount (₹)</th>
            <th>Fee / Charges Deductions (₹)</th>
            <th>Refund Deductions (₹)</th>
            <th>Net Credit Amount (₹)</th>
          </tr>
          <tr>
            <td>{headerMerchant_Settlement_Date}</td>
            <td>{UTR_Number}</td>
            <td>{Math.round(headerTransaction_Amount * 100) / 100}</td>
            <td>{Math.round(headerFee_Charges_Deductions * 100) / 100}</td>
            {/*<td>{Refund_Deductions ? Refund_Deductions : 0}</td> */}
            <td>{refundDeductions}</td>
            <td>{Math.round(headerNetCreditAmount * 100) / 100}</td>
           {/* <td>{Net_Credit_Amount}</td> */}
          </tr>
        </table>
      </div>

      <div style={{display: "flex",width: "100%",borderTop: "1px solid #dbd6d6",backgroundColor:"white",padding: "13px",fontSize: "14px",fontWeight: "500"}}>  
        <div style={{width: "90%"}}>Add sales(Order breakup)</div>
        <div style={{width: "10%"}}>Rs: {Math.round(saleTotalNetCreditAmount * 100) / 100}</div>
      </div>
      <div style={{marginBottom: "25px",backgroundColor: "white"}}>
        <table id="order_product_details">
          <tr>
            <th style={{width: "30%"}}>Order ID</th>
            <th>Transaction Amount (₹)</th>
            <th style={{width: "20%"}}>Fee / Charges Deductions (₹)</th>
            <th style={{width: "17%"}}>Refund Deductions (₹)</th>
            <th style={{width: "16%"}}>Net Credit Amount (₹)</th>
          </tr>
          {renderSaleTableData()}
        </table>
      </div>

     {/* <div style={{display: "flex",width: "100%",borderTop: "1px solid #dbd6d6",backgroundColor:"white",padding: "13px",fontSize: "14px",fontWeight: "500"}}>  
        <div style={{width: "90%"}}>Add: Sales</div>
        <div style={{width: "10%"}}>Rs: {settlement[5]}</div>
      </div>  
      <MUIDataTable
        className="transanctions-table"
        response="scrollFullHeight"
        data={dataSale}
        columns={columnsSale}
        options={options}
      /> */}
    </Box>
    
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >

      <div style={{display: "flex",width: "100%",borderTop: "1px solid #dbd6d6",backgroundColor:"white",padding: "13px",fontSize: "14px",fontWeight: "500"}}>  
        <div style={{width: "90%"}}>Less Refunds processed from previously settled orders</div>
        <div style={{width: "10%"}}>Rs: {Math.round(refundTotalNetDebitAmount * 100) / 100}</div>
      </div>
      <div style={{marginBottom: "25px",backgroundColor: "white"}}>
        <table id="order_product_details">
          <tr>
            <th style={{width: "30%"}}>Order ID</th>
            <th>-</th>
            <th style={{width: "20%"}}>-</th>
            <th style={{width: "17%"}}>Refund Deductions (₹)</th>
            <th style={{width: "16%"}}>Net Debit Amount (₹)</th>
          </tr>
          {renderRefundTableData()}
        </table>
      </div>

      {/* <div style={{display: "flex",width: "100%",backgroundColor:"white",padding: "13px",fontSize: "14px",fontWeight: "500"}}>  
        <div style={{width: "90%"}}>Less: Refunds</div>
        <div style={{width: "10%"}}>Rs: </div>
      </div>  
      <MUIDataTable
        className="transanctions-table"
        response="scrollFullHeight"
        data={dataRefund}
        columns={columnsRefund}
        options={options}
      /> */}
    </Box>
    </>
  );
}

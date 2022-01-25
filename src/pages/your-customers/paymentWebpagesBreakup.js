import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { Box, TextField,CircularProgress, Dialog, Button,DialogContent,DialogTitle,DialogContentText,DialogActions } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { SaveAlt } from "@material-ui/icons";
import NewCustomer from "../../pages/your-customers/NewCustomer";
import moment from "moment";
import queryString from "query-string";
import { useLocation } from "react-router";

export default function YourCustomers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const [newCustomerDialog, setNewCustomerDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerFields, setCustomerFields] = useState([]);

  const { REACT_APP_MERCHANT_URL } = process.env;
  const { search } = useLocation();
  const { id } = queryString.parse(search);

  const columns = [
    {
      name: "iOrder",
      label: "Order ID",
      options: {
        sort: true,
      },
    },
    {
      name: "customerName",
      label: "Customer Name",
      options: {
        sort: true,
      },
    },
    {
      name: "Email",
      label: "Email",
      options: {
        sort: true,
      },
    },
    {
      name: "Phone",
      label: "Phone",
      options: {
        sort: true,
      },
    },
    {
      name: "packageConvenienceFee",
      label: "Package & Convenience Fee",
      options: {
        sort: true,
      },
    },
    {
      name: "totalGst_Amount",
      label: "GST",
      options: {
        sort: true,
      },
    },
    {
      name: "totalAmount",
      label: "Total Amount",
      options: {
        sort: true,
        customBodyRender: (value) => {
          return "₹" + value;
        },
      },
    },
     {
      name: "fields_count",
      label: "Breakup",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
            if(value > 0){
              return (
                <>
                  <Button
                    onClick={() => {
                      breakupRowClick(tableMeta.rowData);
                    }}
                    style={{
                      backgroundColor: "#2caee4",
                      fontSize: "12px"
                    }}
                    variant="contained"
                    size="medium"
                    color="primary"
                  >
                    View Inputs
                  </Button>
                </>
              );
            } else{
              return null;
            }
            
          
        },
      }
    },
  ];

   const renderTableData = () => {
    return customerFields.map((data, index) => {
      const {
        Input_Lable,
        Input_Value
      } = data; //destructuring
      return (
          <p key={index} style={{height: "50px",marginBottom: "30px"}}>
            <TextField
              style={{marginBottom: "25px",width: "375px"}}
              label={Input_Lable}
              variant="outlined"
              fullWidth
              disabled
              name={Input_Lable}
              value={Input_Value}
            /> 
          </p>
      );
    });
  }


  const breakupRowClick = async (rowData) => {
    console.log(rowData);

    await axios
      .get("/mylapay/transaction/get/customer_list_webpage_fields", {
         params: {
          iOrder: rowData[0]
        }
      })
      .then((response) => {
        //setData(response.data.data[0]);
        console.log(response.data.data);
        let tempFields = response.data.data;
        setCustomerFields(tempFields);
        handleOpen();
      })
      .catch((error) => console.log(error));
    
  };

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: true,
    downloadOptions: {
      filename: `Your_Customers_${moment().format("YYYY-MM-DD")}.csv`,
    },
    viewColumns: false,
    print: false,
    elevation: 0,
    sortOrder: {
      name: "orderDate",
      direction: "desc",
    },
    selectableRows: "none",
    tableBodyMaxHeight: "calc(100vh - 220px)",
    textLabels: {
      toolbar: {
        downloadCsv: "Export to excel",
      },
      body: {
        noMatch: loading ? (
          <CircularProgress />
        ) : (
          "Sorry, no matching records found"
        ),
      },
    },
  };

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get(`/mylapay/transaction/get/customer_list_webpage_breakup?phone=${id}`)
        .then((response) => {
          setData(response.data.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData]);

  const handleDialog = (value) => {
    setDialogOpen(value);
  };
  const handleClose = (value) => {
    handleDialog(false);
  };
  const handleOpen = () => {
    setDialogOpen(true);
  };
  return (
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
      <MUIDataTable
        className="transanctions-table"
        response="scrollFullHeight"
        title="Payment Webpage Customer Breakup"
        // title={
        //   <Button
        //     variant="contained"
        //     size="medium"
        //     color="primary"
        //     onClick={() => handleDialog(true)}
        //   >
        //     + New Customer
        //   </Button>
        // }
        data={data}
        columns={columns}
        options={options}
        components={{ icons: { DownloadIcon: SaveAlt } }}
      />
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Customer Inputs</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {renderTableData()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

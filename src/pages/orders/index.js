import React, { useEffect, useState, useCallback } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert, Autocomplete, createFilterOptions } from "@material-ui/lab";
import _ from "lodash";

import {
  SaveAlt,
  PanTool,
  FlightTakeoff,
  OutdoorGrill,
  CheckCircle,
  Cancel,
  MenuBook,
  LibraryBooks,
  AddAlert,
  DepartureBoard,
} from "@material-ui/icons";
import moment from "moment";
import { Button, AppBar, Tab, Tabs } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

import CloseIcon from "@material-ui/icons/Close";

import Neworders from "./neworders";
import Pending from "./pending";
import Transit from "./transit";
import Closed from "./closed";
import Cancelled from "./cancelled";
import Allorders from "./allorders";

export default function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const history = useHistory();
  const [orderslist, setorderslist] = useState([]);
  const [searchid, setsearchid] = useState(null);
  const [iTemplate, setiTemplate] = useState("");

  const filter = createFilterOptions();

  const [debouncedState, setDebouncedState] = useState("");

  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  const top100Films = [];

  /* Tab concept starts here */

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          setiTemplate(res.data.data[0].iTemplate)
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    let redirectid = localStorage.getItem("redirectid");

    if (redirectid) {
      console.log(
        "working redirection ----------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " +
          redirectid
      );
      setActiveTab(parseInt(redirectid));
      localStorage.removeItem("redirectid");
    }
  }, []);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const orderlistfind = async (newValue) => {
    // shopCategories.map((option) => {
    //   if (option.CategoryName == newValue) {
    //     setiProductcategory(option.iProductcategory);
    //   }
    // });
    // formik.setFieldValue("catogoryName", newValue);
    // https://shopapi.mylapay.com/mylapay/orders/search?orderId=mpy61
    // await axios
    // .get("/mylapay/orders/search", {
    //   params: {
    //     orderId: newValue,
    //   },
    // })
    // .then((response) => {
    //   // setData(response.data.data);
    //   console.log("Order list data : " + response.data.message)
    //   // setLoading(false);
    //   // setorderslist(response.data.message)
    // })
    // .catch((error) => console.log(error));
  };

  const handleConvenienceFee = (event) => {
    console.log("Order list data : " + event);
    setsearchid(event);

    setActiveTab(5);

    //https://shopapi.mylapay.com/mylapay/orders/get/100?fromDate=2021-11-01&toDate=2021-11-30&paymentStatus=all

    // axios
    // .get("/mylapay/orders/get/" + event)
    // .then((response) => {
    //   // setData(response.data.data);
    //   console.log("Order list data : " + response.data.message)
    //   // setLoading(false);
    //   // setorderslist(response.data.message)
    // })
    // .catch((error) => console.log(error));

    //max 2 percentage
    // if (event.target.value <= 2 && event.target.value >= 0) {
    //   debounce(event.target.value);

    //   formik.setFieldValue("convenience_fee", event.target.value);
    // } else {
    //   formik.setFieldValue("convenience_fee", "");
    // }

    //https://shopapi.mylapay.com/mylapay/orders/get/100?fromDate=2021-11-01&toDate=2021-11-30&paymentStatus=all

    // await axios
    // .post("mylapay/orders/get/", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // })
    // .then((res) => {

    // })
    // .catch((error) => {
    //   toast.error("Something went wrong, please try again");
    //   console.log(error);
    // });
  };

  const debounce = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedState(_searchVal);
      // send the server request here
    }, 1000),
    []
  );

  const UserManual_click = () => {
    // history.push({
    //   pathname: "/order-user-manual",
    // });
    console.log("--");
    window.open(`/order-user-manual`);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Neworders />;
      case 1:
        return <Pending />;
      case 2:
        return <Transit />;
      case 3:
        return <Closed />;
      case 4:
        return <Cancelled />;
      case 5:
        return <Allorders orderId={searchid} />;

      default:
        return <Neworders />;
    }
  };

  /* Tab concept ends here */

  return (
    <Box
      style={{
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderBottom: "0px",
        borderRadius: "4px",
      }}
      m={2}
    >
      <AppBar position="static" className="searchtab">
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab className="tabwidthorders" icon={<AddAlert />} label="New" />
          <Tab
            className="tabwidthorders"
            icon={<DepartureBoard />}
            label="Accepted"
          />

          {iTemplate==3?
            <Tab
              className="tabwidthorders"
              icon={<OutdoorGrill />}
              label="Cooking"
            />
          :
            <Tab
              className="tabwidthorders"
              icon={<FlightTakeoff />}
              label="Transit"
            />
          }
          
          <Tab
            className="tabwidthorders"
            icon={<CheckCircle />}
            label="Closed"
          />
          <Tab className="tabwidthorders" icon={<Cancel />} label="Cancelled" />
          <Tab className="tabwidthorders" icon={<LibraryBooks />} label="All" />

          {/* <Button style={{ color: "white" }}></Button> */}
          {/* <Button style={{ color: "white", width: "200px", minWidth:"200px" }}> */}

          {/* <TextField
              label="Search order"
              size="small"
              variant="outlined"
            /> */}
          {/* <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            /> */}
          <Box
            mt={1}
            style={{ color: "white", width: "200px", minWidth: "200px" }}
          >
            <Autocomplete
              style={{ flexGrow: 1 }}
              // options={top100Films}
              options={top100Films.map((option) => option.label)}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              freeSolo
              onChange={(event, newValue) => {
                handleConvenienceFee(newValue);
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;

                if (inputValue !== "") {
                  // console.log("Order list data : " + inputValue)
                  orderlistfind(inputValue);
                }

                // // Suggest the creation of a new value
                // const isExisting = options.some((option) => inputValue === option.title);
                // if (inputValue !== '' && !isExisting) {
                //   filtered.push({
                //     inputValue,
                //     title: `Add "${inputValue}"`,
                //   });
                // }

                return filtered;
              }}
              // onChange={(e) => {
              //   handleConvenienceFee(e);
              // }}
              name="product_name"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Orders"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Box>

          {/* </Button> */}
          {/* <Button> */}
          {/* <a
              href={"/order-user-manual"}
              style={{ color: "white" }}
              target="_blank"
            >
              Order User Manual
            </a> */}
          <Box mt={2} ml={12}>
            <Tooltip title="User Manual">
              <IconButton
                onClick={() => {
                  UserManual_click();
                }}
                style={{ color: "white" }}
              >
                <MenuBook />
              </IconButton>
            </Tooltip>
          </Box>
          {/* </Button> */}
        </Tabs>
        {/* <Box>order user manual</Box> */}
      </AppBar>
      {getTabContent()}
    </Box>
  );
}

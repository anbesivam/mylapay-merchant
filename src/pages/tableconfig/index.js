import React, { useEffect, useState, useCallback } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";
import { Alert, Autocomplete, createFilterOptions } from "@material-ui/lab";
import _ from "lodash";

import { CropFree, Today, Add } from "@material-ui/icons";
import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import AddNewTable from "./AddNewTable";

export default function TableConfig() {

  const userData = useSelector((state) => state.auth.userData);
  const history = useHistory();
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [data, setData] = useState([]);
  const [shopUrl, setshopUrl] = useState("");
  const [iShop, setiShop] = useState("");
  const [showNewPrdDialog, setShowNewPrdDialog] = useState(false);

  const createFileFromUrl = async (fileUrl, fileName) => {
    let blob = await fetch(fileUrl).then((r) =>
      r.blob().then((blobFile) => new File([blobFile], fileName))
    );
    return blob;
  };

  useEffect(() => {
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          // setData(res.data.data);
          setiShop(res.data.data[0].id);

          axios
          .get(`/mylapay/restaurant/get/dining-tables?iShop=${res.data.data[0].id}`)
          .then((res) => {
            setData(res.data.data);
            // setiShop(res.data.data[0].id);
          })
          .catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getShopList();
    
  }, [userData]);

  const options = {
    filter: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    search: false,
    selectableRows: "none",
    pagination: false,
    download: false,
    rowsPerPageOptions: [],
  };
  const columns = [
    
    {
      name: "dining_name",
      label: "Table Name",
      options: {
        sort: true,
      },
    },
    {
      name: "iDining",
      label: "IDining",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "UpdateTime",
      label: "Created Time",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return moment(new Date(value)).format("DD MMM YYYY, h:mm A");
        },
      },
    },
    {
      name: "iDining",
      label: "View Menu",
      options: {
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              component={Link}
              to={`/tableview?iDining=${value}`}
              style={{ color: "#fff" }}
              endIcon={<CropFree />}
            >
              View
            </Button>
          );
        },
      },
    },
   
  ];
 

  return (
    <>

      <Box m={2}>
        {/* <a href={"/user-manual"} target="_blank">
          <span
            style={{
              marginTop: "20px",
              marginRight: "15px",
              fontWeight: "500",
              float: "right",
            }}
          >
            User Manual
          </span>
        </a> */}

      <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          style={{
            marginTop: "15px",
            marginRight: "15px",
            fontWeight: "500",
            float: "right",
          }}
          onClick={() => {
            setShowNewPrdDialog(true);
          }}
        >
          Add new Table
        </Button>

      </Box>

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
          data={data}
          disabled="true"
          title="Table Configuration"
          columns={columns}
          options={options}
        />
      
    </Box>

    {showNewPrdDialog && iShop!=null? (
      <AddNewTable
        setShowNewPrdDialog={setShowNewPrdDialog}
        // getProductList={getProductList}
        // editId={editId}
        // setEditId={setEditId}
        createFileFromUrl={createFileFromUrl}
        shopid={iShop}
        // filterFlag={filterFlag}
        // stepChange={stepChange}
      />
    ) : null}

    
    </>
   
  );
}

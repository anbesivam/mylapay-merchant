import {
  Grid,
  Tooltip,
  Avatar,
} from "@material-ui/core";
import {
  Help,
  SaveAlt,
} from "@material-ui/icons";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, } from "react-redux";
import { useLocation, useHistory } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import queryString from "query-string";

export default function ViewTable() {

  const { search } = useLocation();
  const { iDining } = queryString.parse(search);

  const [selectedproductArray, setselectedProductArray] = useState([]);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const shopDetails = useSelector((state) => state.paymentPage.shopDetails);
  
  const { REACT_APP_SHOP_URL } = process.env;
  const { REACT_APP_SHOPAPI_URL } = process.env;


  const getProductList = async () => {
    await axios
      // .get(`mylapay/restaurant/get/dining-tables?iShop=${shopid}`)
      .get(`mylapay/restaurant/get/dining-table/by-idining-map?iDiningMap=${iDining}`)
      .then(async (res) => {
        if (res.data.status) {

          setselectedProductArray(res.data.data)
         
        } else {
          toast.error("Something went wrong while fetching products");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong while fetching products");
      });
  };

  const viewproduct = (value) => {
    window.open(
      `${REACT_APP_SHOP_URL}/${shopDetails["shop_url"]}/${shopDetails["Template_Name"]}/${value["rowData"][2]}/${value["rowData"][6]}`,
      "_blank"
    );
  };

 

  const IconWithTooltip = (value) => (
    <Tooltip title="select GST percentage applicable for this product/services. You can select zero percentage if GST is not applicable.">
      <Help style={{ fontSize: "16px" }} />
    </Tooltip>
  );

  const columns = [
    {
      name: "product_image",
      label: "Products",
      options: {
        sort: false,
        // customBodyRender: (value, tableMeta, updateValue) => (
        //   <div style={{ lineHeight: "0" }}>
        //     <img
        //       className={styles.prdImg}
        //       src={URL.createObjectURL(value)}
        //       alt="Image"
        //       width="75"
        //       height="75"
        //     />
        //   </div>
        // ),
        customBodyRender: (value, tableMeta, updateValue) => {
          // console.log("Value product image : " + URL.createObjectURL(value));
          if (URL.createObjectURL(value) != null) {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src={URL.createObjectURL(value)}
              ></Avatar>
            );
          } else {
            return (
              <Avatar
                style={{ height: "70px", width: "70px" }}
                variant="rounded"
                onClick={() => {
                  viewproduct(tableMeta);
                }}
                src="/images/no-image-icon-23494.png"
              ></Avatar>
            );
          }
        },
      },
    },
    {
      name: "product_name",
      label: "Product Name",
      options: {
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => (
          <a
            className="mp-link"
            href="javascript:void(0)"
            rel="noreferrer"
            onClick={() => {
              viewproduct(tableMeta);
            }}
          >
            {value}
          </a>
        ),
      },
    },
    {
      name: "iProductcategory",
      label: "ProductID",
      options: {
        sort: true,
        display: false,
      },
    },
    {
      name: "categoryName",
      label: "Category",
      options: {
        sort: true,
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        sort: true,
      },
    },
    {
      name: "stock",
      label: "Quantity",
      options: {
        sort: true,
      },
    }
  ];

  // MUI-Datatable Options
  const options = {
    filter: false,
    download: false,
    viewColumns: false,
    print: false,
    elevation: 0,
    selectableRows: "multiple",
    tableBodyMaxHeight: "calc(100vh - 220px)",
    // textLabels: {
    //   toolbar: {
    //     downloadCsv: "Export to excel",
    //   },
    // },
  };


  useEffect(() => {
    getProductList();
    
  }, [userDetails]);

  return (
      <Grid container spacing={2}>
        <Grid item xs={12}>

        {selectedproductArray && (
          <MUIDataTable
            response="scrollFullHeight"
            // title={<TableHeader />}
            data={selectedproductArray}
            columns={columns}
            options={options}
            components={{ icons: { DownloadIcon: SaveAlt } }}
          />
        )}

        </Grid>
      </Grid>
  );
}

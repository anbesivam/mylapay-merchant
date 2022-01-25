import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Toolbar,
  Divider,
} from "@material-ui/core";
import {
  Assessment,
  Dashboard as DashboardIcon,
  Description,
  DoubleArrow,
  Money,
  AccountBalance,
  Deck,
  Receipt,
  Queue,
  AllInbox,
  AccountBalanceWallet,
  ExpandLess,
  ExpandMore, 
  Settings,
  ShoppingBasket,
  SupervisorAccount,
  DeveloperBoard,
} from "@material-ui/icons";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";

export default function Sidebar() {
  const isSidebarOpen = useSelector((state) => state.dashboard.isSidebarOpen);
  const userData = useSelector((state) => state.auth.userData);
  const [open, setOpen] = React.useState(false);
  const [shopUrl, setshopUrl] = useState("");
  const [iShop, setiShop] = useState("");
  const [iTemplate, setiTemplate] = useState("");
  const [paymentiShop, setPaymentiShop] = useState("");
  const history = useHistory();

  const handleClick = () => {
    setOpen(!open);
    history.push(`/`);
  };

  const handleproductClick = () => {
  
    localStorage.setItem("addprodcut", 1);
    history.push(`/payment-pages/edit?editItem=${shopUrl}&shopId=${iShop}`);
  };

  const handlepaymentClick = () => {
  
    localStorage.setItem("addpaymentpage", 1);
    history.push(`/payment-web-page/edit?editItem=${paymentiShop}`);
  };


  useEffect(() => {
    const getShopList = async () => {
      await axios
        .get("/mylapay/transaction/shop/list")
        .then((res) => {
          setiShop(res.data.data[0].id);
          setshopUrl(res.data.data[0].url_name);
          setiTemplate(res.data.data[0].iTemplate)
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getDatapayment = async () => {
      await axios
        .get("/mylapay/shop/payment_page")
        .then(async (res) => {
          setPaymentiShop(res.data.data[0].shopID);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    
      // const getData = async () => {
      //   await axios
      //     .get(
      //       `mylapay/shop/shop_details?iShop=${paymentiShop}&pageType=2&onlineStoreId=${iShop}`
      //     )
      //     .then(async (res) => {
      //       if (res.data.status === 1) {
      //         if (res.data.data.length === 0) return;

      //       }
      //   })
      //   .catch((err) => console.log(err));
      // };
        

    getShopList();
    getDatapayment();
    // getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Drawer anchor="left" open={isSidebarOpen} variant="persistent">
      <Toolbar />
      <List>
        <ListItem to="/dashboard-v2" component={Link} button>
          <ListItemIcon className="purple-text">
            <DashboardIcon color="inherit" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </ListItem>
        {/* <ListItem to="/transactions" component={Link} button>
          <ListItemIcon className="green-text">
            <DoubleArrow color="inherit" />
          </ListItemIcon>
          <ListItemText>Transactions</ListItemText>
        </ListItem> */}

        <ListItem button sx={{ pl: 4 }} to="/transactions" component={Link}>
          <ListItemIcon className="green-text">
            <Receipt />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>

        <ListItem button sx={{ pl: 4 }} to="/settlements" component={Link}>
          <ListItemIcon className="blue-text">
            <AccountBalanceWallet />
          </ListItemIcon>
          <ListItemText primary="Settlements" />
        </ListItem>

        <ListItem
          button
          sx={{ pl: 4 }}
          to="/reconciliation"
          component={Link}
        >
          <ListItemIcon className="red-text">
            <AccountBalance />
          </ListItemIcon>
          <ListItemText primary="Reconciliation " />
        </ListItem>

        {/* <ListItem button onClick={handleClick}>
          <ListItemIcon style={{color:"#f7a511"}}>
            <span color="inherit" style={{fontSize:"30px", fontWeight:"bold"}}>₹</span>
          </ListItemIcon>
          <ListItemText primary="Payments" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" style={{ paddingLeft: "30px" }}>
            <ListItem button sx={{ pl: 4 }} to="/transactions" component={Link}>
              <ListItemIcon className="purple-text">
                <Receipt />
              </ListItemIcon>
              <ListItemText primary="Transactions" />
            </ListItem>
          </List>
          <List component="div" style={{ paddingLeft: "30px" }}>
            <ListItem button sx={{ pl: 4 }} to="/settlements" component={Link}>
              <ListItemIcon className="blue-text">
                <AccountBalanceWallet />
              </ListItemIcon>
              <ListItemText primary="Settlements" />
            </ListItem>
          </List>
          <List component="div" style={{ paddingLeft: "30px" }}>
            <ListItem
              button
              sx={{ pl: 4 }}
              to="/reconciliation"
              component={Link}
            >
              <ListItemIcon className="red-text">
                <AccountBalance />
              </ListItemIcon>
              <ListItemText primary="Reconciliation " />
            </ListItem>
          </List>
        </Collapse> */}

        {/* <ListItem button>
          <ListItemIcon className="red-text">
            <Money color="inherit" />
          </ListItemIcon>
          <ListItemText>Pay-outs</ListItemText>
        </ListItem> */}


        {/* <ListItem to="/" component={Link} button>
          <ListItemIcon className="blue-text">
            <Description color="inherit" />
          </ListItemIcon>
          <ListItemText>Manage your Business</ListItemText>
        </ListItem> */}



        <ListItem button onClick={handleClick}>
          <ListItemIcon className="blue-text">
              <Description color="inherit" />
          </ListItemIcon>
          <ListItemText primary="Manage your Business" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" style={{ paddingLeft: "30px", paddingTop: "0px", paddingBottom: "0px" }}>
            {/* <ListItem button sx={{ pl: 4 }} to="/transactions" component={Link}>
              <ListItemIcon className="purple-text">
                <Receipt />
              </ListItemIcon>
              <ListItemText primary="Add Products" />
            </ListItem> */}

              {iShop!="" && iShop!=null?

              <ListItem button sx={{ pl: 4 }}
                onClick={handleproductClick}
              >
                <ListItemIcon className="orange-text">
                  <Queue />
                </ListItemIcon>
                <ListItemText primary="Add Products" />
              </ListItem>

              :
              null}

          </List>

          <List component="div" style={{ paddingLeft: "30px", paddingTop: "0px", paddingBottom: "0px"  }}>
            {paymentiShop!="" && paymentiShop!=null && iTemplate!=1 && iTemplate!=3?

              <ListItem button sx={{ pl: 4 }}
                onClick={handlepaymentClick}
              >
                <ListItemIcon className="grey-text">
                  <Queue />
                </ListItemIcon>
                <ListItemText primary="Add Payment page" />
              </ListItem>

              :
              null}
          </List>
          
        </Collapse>

          {iTemplate==3?

            <ListItem to="/table-config" component={Link} button>
              <ListItemIcon className="brown-text">
                <Deck color="inherit" />
              </ListItemIcon>
              <ListItemText>Table Configuration</ListItemText>
            </ListItem>

          :
          null}
        
        <ListItem to="/orders" component={Link} button>
          <ListItemIcon className="green-text">
            <ShoppingBasket color="inherit" />
          </ListItemIcon>
          <ListItemText>Orders</ListItemText>
        </ListItem>

        {/* {iShop!="" && iShop!=null?

        <ListItem button sx={{ pl: 4 }}
          onClick={handleproductClick}
        >
          <ListItemIcon className="orange-text">
            <Queue />
          </ListItemIcon>
          <ListItemText primary="Add Products" />
        </ListItem>
        
        :
        null}

        {iShop!="" && iShop!=null?

          <ListItem button sx={{ pl: 4 }}
            onClick={handlepaymentClick}
          >
            <ListItemIcon className="orange-text">
              <Queue />
            </ListItemIcon>
            <ListItemText primary="Add Payment page" />
          </ListItem>

        :
        null} */}
        

        {/* <Divider /> */}
        {/* <ListItem button>
          <ListItemIcon className="orange-text">
            <LaptopChromebook color="inherit" />
          </ListItemIcon>
          <ListItemText>Website</ListItemText>
        </ListItem>
        <ListItem button>
          <ListItemIcon className="purple-text">
            <Autorenew color="inherit" />
          </ListItemIcon>
          <ListItemText>Subscriptions</ListItemText>
        </ListItem> */}
        <ListItem to="/your-customers" component={Link} button>
          <ListItemIcon className="grey-text">
            <SupervisorAccount color="inherit" />
          </ListItemIcon>
          <ListItemText>Your Customers</ListItemText>
        </ListItem>
        <ListItem to="/invoice" component={Link} button>
          <ListItemIcon className="blue-text">
            <Assessment color="inherit" />
          </ListItemIcon>
          <ListItemText>Invoice</ListItemText>
        </ListItem>
        {/* <Divider /> */}
        {/* <ListItem button>
          <ListItemIcon className="green-text">
            <Settings color="inherit" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </ListItem> */}
        <ListItem to="/profit-calculator" component={Link} button>
          <ListItemIcon className="blue-text">
            <DeveloperBoard color="inherit" />
          </ListItemIcon>
          <ListItemText>Profitability Calculator</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
}

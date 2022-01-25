import { AppBar, Tab, Tabs } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Sale from "./SaleDetailView";
import Refunds from "./RefundDetailView";
import OrderDetailView from "./OrderDetailView";

export default function Dashboard({ orderId }) {
  const [activeTab, setActiveTab] = useState(2);

  console.log("Break up page order id -------->>>>>> : " + orderId);

  

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if(orderId!=undefined)
    {
      setActiveTab(2);
    }
  }, []);

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Sale />;
      case 1:
        return <Refunds />;
      case 2:
        return <OrderDetailView />;
      default:
        return <Sale />;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab label="SALE" />
          <Tab label="REFUNDS" />
          <Tab label="ORDER DETAILS" />
        </Tabs>
      </AppBar>
      {getTabContent()}
    </>
  );
}

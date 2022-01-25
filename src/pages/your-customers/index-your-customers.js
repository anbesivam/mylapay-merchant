import { AppBar, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import OnlineStoreCustomers  from "./onlineStoreCustomers";
import PaymentWebpageCustomers from "./paymentWebpageCustomers";
import QuickpayCustomers from "./quickpayCustomers";

// Test
export default function IndexYourCustomers() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <OnlineStoreCustomers />;
      case 1:
        return <PaymentWebpageCustomers />;
      case 2:
        return <QuickpayCustomers />;

      default:
        return <OnlineStoreCustomers />;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab label="Online Store" />
          <Tab label="Payment Webpage" />
          <Tab label="Quickpay" />
        </Tabs>
      </AppBar>
      {getTabContent()}
    </>
  );
}

import { AppBar, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import Transanctions from "./transanctions";
import Chargeback from "./transanctions/Chargeback";
import Refunds from "./transanctions/Refunds";
import Settled from "./transanctions/Settled";

// Test
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Transanctions />;
      case 1:
        return <Refunds />;
      case 2:
        return <Settled />;
      case 3:
        return <Chargeback />;

      default:
        return <Transanctions />;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChange}>
          <Tab label="Transanctions" />
          <Tab label="Refunds" />
          <Tab label="Settled" />
          <Tab label="Chargeback" />
        </Tabs>
      </AppBar>
      {getTabContent()}
    </>
  );
}

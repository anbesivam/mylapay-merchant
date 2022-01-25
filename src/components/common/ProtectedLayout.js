import React from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ProtectedLayout({ children }) {
  const isSidebarOpen = useSelector((state) => state.dashboard.isSidebarOpen);

  return (
    <>
      <Header />
      <Sidebar />
      <div className={`page-content ${isSidebarOpen ? "sidebar_open" : ""}`}>
        {children}
      </div>
      <Footer />
    </>
  );
}

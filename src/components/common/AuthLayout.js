import React from "react";
// import Header from "./Header";

export default function AuthLayout({ children }) {
  return (
    <>
      {/* <Header /> */}
      <div className="page-content">{children}</div>
    </>
  );
}

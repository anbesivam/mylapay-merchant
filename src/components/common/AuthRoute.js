import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthLayout from "./AuthLayout";

export default function AuthRoute({ component: Component, ...rest }) {
  const isAuthenticated = Boolean(localStorage.getItem("userData"));

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          if (props.location.pathname === "/user/kyc-form") {
            return <Component {...props} />;
          }
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        } else {
          if (props.location.pathname === "/user/kyc-form") {
            return (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            );
          }
          return (
            <AuthLayout>
              <Component {...props} />
            </AuthLayout>
          );
        }
      }}
    />
  );
}

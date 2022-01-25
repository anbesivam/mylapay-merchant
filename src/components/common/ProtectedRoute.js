import React from "react";
import { Route, Redirect } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const isAuthenticated = Boolean(localStorage.getItem("userData"));
  const localUser = JSON.parse(localStorage.getItem("userData"));

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          // const isApproved = Boolean(localUser.is_approved);
          // const isApproved = true;

          switch (localUser.is_approved) {
            case 0:
              return (
                <Redirect
                  to={{
                    pathname: "/approval",
                    state: { from: props.location },
                  }}
                />
              );
            // break;
            case 1:
              return (
                <ProtectedLayout>
                  <Component {...props} />
                </ProtectedLayout>
              );
            // break;
            case 2:
              return (
                <Redirect
                  to={{
                    pathname: "/rejected-docs",
                    state: { from: props.location },
                  }}
                />
              );
            // break;

            default:
              break;
          }

          // if (isApproved) {
          //   return (
          //     <ProtectedLayout>
          //       <Component {...props} />
          //     </ProtectedLayout>
          //   );
          // } else {
          //   return (
          //     <Redirect
          //       to={{ pathname: "/approval", state: { from: props.location } }}
          //     />
          //   );
          // }
        } else {
          return (
            <Redirect
              to={{ pathname: "/user/login", state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
}

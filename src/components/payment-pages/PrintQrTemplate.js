import { CircularProgress } from "@material-ui/core";
import React from "react";

const { REACT_APP_SHOPAPI_URL } = process.env;
class PrintQrTemplate extends React.Component {
  render() {
    return (
      <table
        style={{
          width: "450px",
          height: "634px",
          overflow: "hidden",
          border: "20px solid var(--mp-dark-blue)",
          margin: "auto",
          background: "#fff",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                border: "none",
                width: "60%",
                padding: "10px 10px 0px 30px",
              }}
            >
              <img src="/logo.svg" alt="Mylapay Logo" width="160" height="40" />
              <div>All UPI payment accepted</div>
            </td>
            <td
              style={{
                border: "none",
                textAlign: "right",
                padding: "10px 30px 0px 10px",
              }}
            >
              {this.props.pageData.shop_logo ? (
                <img
                  src={
                    REACT_APP_SHOPAPI_URL +
                    "/uploads" +
                    this.props.pageData.shop_logo
                  }
                  alt="Shop Logo"
                  height="85"
                  width="85"
                  style={{ borderRadius: "4px" }}
                />
              ) : (
                <div
                  style={{
                    width: "85px",
                    height: "85px",
                    borderRadius: "4px",
                    textAlign: "center",
                    background: "var(--mp-light-bg)",
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {this.props.pageData.payee_name}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                border: "none",
                textAlign: "center",
              }}
            >
              {this.props.qrImageUrl ? (
                <img
                  src={this.props.qrImageUrl}
                  alt="QR Code"
                  width="369"
                  height="369"
                  style={{ width: "369px", height: "369px" }}
                />
              ) : (
                <CircularProgress />
              )}
            </td>
          </tr>
          {/* <tr>
            <td
              colSpan="2"
              style={{
                padding: "0px 30px 20px",
                textAlign: "center",
                border: "none",
              }}
            >
              Scan QR code to pay with any UPI app
            </td>
          </tr> */}
          <tr>
            <td
              style={{
                border: "none",
              }}
              colSpan="2"
            >
              <table style={{ width: "340px", margin: "auto" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <img
                        src="/images/tez.svg"
                        alt="Google Pay / Tez"
                        height="30"
                      />
                    </td>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <img
                        src="/images/phonepe.svg"
                        alt="Phonepe"
                        height="20"
                      />
                    </td>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <img
                        src="/images/amazonpay.png"
                        alt="Amazon Pay"
                        height="25"
                      />
                    </td>
                    <td
                      style={{
                        width: "22%",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <img src="/images/paytm.svg" alt="Paytm" height="20" />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", border: "none" }}
                    >
                      <img
                        src="/images/bhim-upi.svg"
                        alt="Bhim UPI"
                        height="50"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default PrintQrTemplate;

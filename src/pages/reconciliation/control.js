import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Chip,
} from "@material-ui/core";
import axios from "axios";
import MyBadge from "../../components/common/MyBadge";
import { useSelector } from "react-redux";
import { DatePicker } from "@material-ui/pickers";
import { Today, SaveAlt } from "@material-ui/icons";
import moment from "moment";

export default function Control() {
  const [data, setData] = useState([]);
  const [dataPGSettled, setDataPGSettled] = useState([]);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (userData === null) return;

    const getData = async () => {
      await axios
        .get("/mylapay/reconciliation/control/payu", {})
        .then((response) => {
          setData(response.data.data[0]);
          setDataPGSettled(response.data.data[1]);
          console.log(response.data.data);
        })
        .catch((error) => console.log(error));
    };

    getData();
  }, [userData]);

  const renderDataNewOrders = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "New") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>New</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const renderDataAcceptOrders = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "Accepted") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>Accepted</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const renderDataInTransitOrders = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "inTransist") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>In-Transit</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const splitYetTobeAddedAndReleased = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "Split yet to be added & Released") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>Split yet to be added & Released</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const refundToBeInitiated = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "Refund to be initiated") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>Refund to be initiated</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const splitPaymentAddedAndReleased = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "Split Payment added & Released") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>Split Payment added & Released</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const refundInitiated = () => {
    if (data) {
      let days03 = <td>0</td>;
      let days35 = <td>0</td>;
      let days510 = <td>0</td>;
      let days1030 = <td>0</td>;
      let days30 = <td>0</td>;
      for (let i = 0; i < data.length; i++) {
        if (data[i].remarks === "Refund Initiated") {
          if (data[i].Days === "0-3") {
            days03 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "3-5") {
            days35 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "5-10") {
            days510 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "10-30") {
            days1030 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          } else if (data[i].Days === "30") {
            days30 = <td>{data[i].CNT ? data[i].CNT : 0}</td>;
          }
        }
      }

      return (
        <tr>
          <td>Refund Initiated</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const renderDataDiffInPGCommission = () => {
    if (dataPGSettled) {
      let days03 = "";
      let days35 = "";
      let days510 = "";
      let days1030 = "";
      let days30 = "";
      for (let i = 0; i < dataPGSettled.length; i++) {
        if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Settlement" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "0-3"
        ) {
          days03 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Settlement" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "3-5"
        ) {
          days35 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Settlement" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "5-10"
        ) {
          days510 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Settlement" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "10-30"
        ) {
          days1030 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Settlement" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "30"
        ) {
          days30 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        }
      }

      return (
        <tr>
          <td>Difference in PG commision</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  const renderDataDiffInSettlement = () => {
    if (dataPGSettled) {
      // <td>Difference in PG commision</td>
      // <td>Difference in Settlement</td>
      let days03 = "";
      let days35 = "";
      let days510 = "";
      let days1030 = "";
      let days30 = "";
      for (let i = 0; i < dataPGSettled.length; i++) {
        if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Commission" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "0-3"
        ) {
          days03 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Commission" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "3-5"
        ) {
          days35 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Commission" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "5-10"
        ) {
          days510 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Commission" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "10-30"
        ) {
          days1030 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        } else if (
          (dataPGSettled[i].remarks === "Difference_In_PG_Commission" ||
            dataPGSettled[i].remarks === null) &&
          dataPGSettled[i].Days === "30"
        ) {
          days30 = (
            <td>
              {dataPGSettled[i].DiffAmount ? dataPGSettled[i].DiffAmount : 0}
            </td>
          );
        }
      }

      return (
        <tr>
          <td>Difference in Settlement</td>
          {days03}
          {days35}
          {days510}
          {days1030}
          {days30}
        </tr>
      );
    }
  };

  return (
    <>
      <Box
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "0px",
          borderRadius: "4px",
          backgroundColor: "white",
          padding: "0px 20px 20px 20px",
        }}
        m={2}
      >
        <div style={{ marginTop: "40px" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgb(175 175 175)",
              height: "37px",
              paddingLeft: "6px",
              paddingTop: "10px",
              paddingRight: "6px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <div style={{ width: "70%" }}>Exceptions Control</div>
            <div style={{ width: "30%" }}>AGEING</div>
          </div>
          <table id="order_product_details" style={{ borderBottom: "none" }}>
            <tr>
              <th>Order Status</th>
              <th>1 - 3 Days</th>
              <th>3 - 5 Days</th>
              <th>5 - 10 Days</th>
              <th>10 - 30 Days</th>
              <th> > 30 Days</th>
            </tr>
            <tr>
              <td style={{ fontSize: "13px", fontWeight: "bold" }}>
                Open Orders
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {renderDataNewOrders()}
            {renderDataAcceptOrders()}
            {renderDataInTransitOrders()}

            <tr style={{ height: "35px" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td style={{ fontSize: "13px", fontWeight: "bold" }}>
                Completed Orders - Settlement Pending
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {splitYetTobeAddedAndReleased()}
            {refundToBeInitiated()}
            {splitPaymentAddedAndReleased()}
            {refundInitiated()}

            <tr style={{ height: "35px" }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td style={{ fontSize: "13px", fontWeight: "bold" }}>
                Completed Orders - Settled
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            {renderDataDiffInPGCommission()}
            {renderDataDiffInSettlement()}
          </table>
        </div>
      </Box>
    </>
  );
}

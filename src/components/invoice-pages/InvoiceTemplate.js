import { CircularProgress } from "@material-ui/core";
import React from "react";
import moment from "moment";

const { REACT_APP_SHOPAPI_URL } = process.env;

const ref = React.createRef();

function convertNumberToWords(amount) {
  var words = new Array();
  words[0] = "";
  words[1] = "One";
  words[2] = "Two";
  words[3] = "Three";
  words[4] = "Four";
  words[5] = "Five";
  words[6] = "Six";
  words[7] = "Seven";
  words[8] = "Eight";
  words[9] = "Nine";
  words[10] = "Ten";
  words[11] = "Eleven";
  words[12] = "Twelve";
  words[13] = "Thirteen";
  words[14] = "Fourteen";
  words[15] = "Fifteen";
  words[16] = "Sixteen";
  words[17] = "Seventeen";
  words[18] = "Eighteen";
  words[19] = "Nineteen";
  words[20] = "Twenty";
  words[30] = "Thirty";
  words[40] = "Forty";
  words[50] = "Fifty";
  words[60] = "Sixty";
  words[70] = "Seventy";
  words[80] = "Eighty";
  words[90] = "Ninety";
  amount = amount.toString();
  var atemp = amount.split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  if (n_length <= 9) {
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    let value = "";
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += words[value] + " ";
      }
      if (
        (i == 1 && value != 0) ||
        (i == 0 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Crores ";
      }
      if (
        (i == 3 && value != 0) ||
        (i == 2 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Lakhs ";
      }
      if (
        (i == 5 && value != 0) ||
        (i == 4 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += "Thousand ";
      }
      if (i == 6 && value != 0 && n_array[i + 1] != 0 && n_array[i + 2] != 0) {
        words_string += "Hundred and ";
      } else if (i == 6 && value != 0) {
        words_string += "Hundred ";
      }
    }
    words_string = words_string.split("  ").join(" ");
  }
  return words_string;
}
class InvoiceTemplate extends React.Component {
  constructor(props) {
    super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
    let delivery_charge;
    let shipingMode = props.shipingMode;
    let GSTOnDeliveryCharges = 0;
    // if (shipingMode === "Prepaid") {
    //   shipingMode = "Shiprocket";
    // } else if (shipingMode === "DUNZO_CREDIT") {
    //   shipingMode = "Dunzo";
    // } else if (shipingMode === "Door Delivery") {
    //   shipingMode = "Door Delivery";
    // }
    //console.log(shipingMode);
    if (Array.isArray(props.deliveryCharges)) {
      // Door Delivery charges. Already defined by Merchant
      // if (props.pageData.totalAmount <= 500) {
      //   delivery_charge = props.deliveryCharges[0].Delivery_Charge;
      // } else if (
      //   props.pageData.totalAmount <= 1000 &&
      //   this.props.pageData.totalAmount > 500
      // ) {
      //   delivery_charge = props.deliveryCharges[1].Delivery_Charge;
      // } else if (
      //   props.pageData.totalAmount <= 5000 &&
      //   this.props.pageData.totalAmount > 1000
      // ) {
      //   delivery_charge = props.deliveryCharges[2].Delivery_Charge;
      // } else if (props.pageData.totalAmount > 5000) {
      //   delivery_charge = props.deliveryCharges[3].Delivery_Charge;
      // }
      delivery_charge = props.deliveryCharges[0].Delivery_Charge;
    }
    let delivery_charge_without_Gst = Math.ceil((delivery_charge / 118) * 100);

    GSTOnDeliveryCharges = delivery_charge - delivery_charge_without_Gst;
    delivery_charge = delivery_charge_without_Gst;

    //console.log(delivery_charge);
    let partnerPlatformFees =
      (2 / 100) * (props.pageData.totalAmount + props.taxes + delivery_charge);
    //console.log(partnerPlatformFees);
    let subTotal = 0;
    let subTotalWithoutGST = 0;
    let productGST = 0;
    for (let i = 0; i < props.pageData.productDetails.length; i++) {
      subTotal += props.pageData.productDetails[i].itemTotal_amount;

      //console.log("subTotal");
      //console.log(subTotal);
      subTotalWithoutGST +=
        props.pageData.productDetails[i].quantity *
        (props.pageData.productDetails[i].price -
          props.pageData.productDetails[i].totalGst_Amount);
      productGST +=
        props.pageData.productDetails[i].quantity *
        props.pageData.productDetails[i].Gst_Amount;
    }
    //console.log("merchantConvieniencePercent");
    //console.log(props.merchantConvieniencePercent);
    //console.log(props.deliveryCharges[0].Delivery_Charge, "------", subTotal);
    let step1 =
      (subTotal + props.deliveryCharges[0].Delivery_Charge) *
      (props.merchantConvieniencePercent / 100);
    //console.log(step1);
    let step2 = step1 * (2 / 100);
    let package_convenience_fee_without_GST = step1 + step2;
    let step3 = (step1 + step2) * (18 / 100);
    let GSTOnpackage_convenience_fee = step3;
    let package_convenience_fee = step1 + step2 + step3;
    //console.log(package_convenience_fee);
    this.state = {
      //state is by default an object
      products: props.pageData.productDetails,
      deliveryCharges: props.deliveryCharges,
      taxes: props.taxes,
      delivery_charge: delivery_charge,
      shipingMode: shipingMode,
      GSTOnDeliveryCharges: GSTOnDeliveryCharges,
      userDetails: JSON.parse(localStorage.getItem("userDetails")),
      shopAddress: props.shopAddress,
      subTotalWithoutGST: subTotalWithoutGST,
      productGST: productGST,
      subTotal: subTotal,
      package_convenience_fee_without_GST: package_convenience_fee_without_GST,
      GSTOnpackage_convenience_fee: GSTOnpackage_convenience_fee,
      package_convenience_fee: package_convenience_fee,
    };
  }

  renderTableData() {
    return this.state.products.map((product, index) => {
      const {
        iItems,
        Item_Id,
        item,
        price,
        Gst_Amount,
        Gst_Percentage,
        quantity,
        itemTotal_amount,
      } = product; //destructuring
      return (
        <tr key={iItems}>
          <td>{index + 1}</td>
          <td>{Item_Id}</td>
          <td>
            {item} <small>with GST {Gst_Percentage}%</small>
          </td>
          <td>{quantity}</td>
          <td>{price - (Gst_Amount * quantity).toFixed(2)}</td>
          <td>{(Gst_Amount * quantity).toFixed(2)}</td>
          <td>
            {(
              quantity * (price - Gst_Amount * quantity) +
              quantity * Gst_Amount
            ).toFixed(2)}
          </td>
          {/*<td>{itemTotal_amount}</td> */}
        </tr>
      );
    });
  }

  render() {
    return (
      <>
        <div className="payment_invoice" ref={this.props.refCustom}>
          <div className="invoice_outer_div">
            <div className="invoice_inner_div">
              {this.props.pageData.shop_logo ? (
                <div className="invoice_inner_left">
                  <img
                    src={
                      REACT_APP_SHOPAPI_URL +
                      "/uploads" +
                      this.props.pageData.shop_logo
                    }
                    alt="Shop Logo"
                    height="100"
                    width="100"
                  />
                </div>
              ) : null}

              <div className="invoice_inner_right">
                <span>{this.props.pageData.shop_name}</span>
                <span>
                  GSTN: 12345678910, PAN:{" "}
                  {this.state.userDetails.Authorized_PAN}
                </span>
                <span>
                  Shop No: {this.state.shopAddress.Building_No},
                  {this.state.shopAddress.Street_Name}
                </span>
                <span>
                  {this.state.shopAddress.City} -{" "}
                  {this.state.shopAddress.Pincode}
                </span>
                <span>Phone: {this.state.userDetails.contact_no}</span>
                <span>Email: {this.state.userDetails.contact_email}</span>
              </div>
            </div>
          </div>

          <div className="invoice_title">INVOICE</div>

          <div className="detail_grid">
            <div className="customer_info">
              <strong>To:</strong>
              <br />
              Customer Name: {this.props.pageData.customerName}
              <br />
              {this.props.customerAddress.address}
              <br />
              {this.props.customerAddress.city}
              <br />
              Phone: {this.props.pageData.phone}
              <br />
              Email: {this.props.pageData.email}
            </div>

            <div className="order_info">
              <strong>Order Id:</strong> {this.props.pageData.orderId}
              <br />
              <strong>Order Date:</strong>{" "}
              {moment(this.props.pageData.Order_Time).format("ddd MMM Do YYYY")}
              <br />
              <strong>Invoice number:</strong> {this.props.pageData.orderId}
              <br />
              <strong>Invoice Date:</strong>{" "}
              {moment().format("ddd MMM Do YYYY")}
              <br />
              <strong>Mode of Shipping:</strong> {this.state.shipingMode}
            </div>
          </div>

          <div className="table_wrap">
            <table className="invoice_table">
              <thead>
                <tr>
                  <th>SL NO</th>
                  <th>Item ID</th>
                  <th>Description</th>
                  <th>QTY</th>
                  <th>Unit Price</th>
                  <th>GST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}</tbody>
              <tfoot>
                <tr>
                  <td className="left amt_words" colspan="2">
                    Bill total amount (in words)
                    <strong>
                      INR{" "}
                      {convertNumberToWords(
                        this.state.subTotal +
                          this.props.taxes +
                          (this.state.delivery_charge +
                            this.state.GSTOnDeliveryCharges) +
                          this.state.package_convenience_fee
                      )}{" "}
                      only
                    </strong>
                  </td>
                  <td></td>
                  <td className="subtotal" colspan="1">
                    Sub Total
                  </td>
                  <td colspan="1">
                    {this.state.subTotalWithoutGST.toFixed(2)}
                  </td>
                  <td colspan="1">{this.state.productGST.toFixed(2)}</td>
                  <td colspan="1">{this.state.subTotal.toFixed(2)}</td>
                </tr>
                {/* <tr>
                  <td className="left amt_words" colspan="2">
                    INR{" "}
                    {convertNumberToWords(
                      this.state.subTotal +
                        this.props.taxes +
                        (this.state.delivery_charge +
                          this.state.GSTOnDeliveryCharges) +
                        this.state.package_convenience_fee
                    )}{" "}
                    only
                  </td>
                </tr> */}

                <tr className="delivery_row">
                  <td className="left" rowSpan="3" colspan="2">
                    <div className="inv_branding">
                      <img
                        className="invoice_logo"
                        src="/logo.png"
                        alt="Mylapay Logo"
                        width="100"
                        height="20"
                      />
                      <div>Marketplace and Payments powered by Mylapay</div>
                      <a href="https://www.mylapay.com">www.mylapay.com</a>
                    </div>
                  </td>
                  <td></td>
                  <td className="small" colspan="1">
                    Delivery Charges
                  </td>

                  <td colspan="1">{this.state.delivery_charge.toFixed(2)}</td>
                  <td colspan="1">
                    {this.state.GSTOnDeliveryCharges.toFixed(2)}
                  </td>
                  <td colspan="1">
                    {(
                      this.state.delivery_charge +
                      this.state.GSTOnDeliveryCharges
                    ).toFixed(2)}
                  </td>
                </tr>
                <tr className="package_row">
                  <td></td>
                  <td className="small" colspan="1">
                    Package & <br /> Convenience fee
                  </td>

                  <td colspan="1">
                    {this.state.package_convenience_fee_without_GST.toFixed(2)}
                  </td>
                  <td colspan="1">
                    {this.state.GSTOnpackage_convenience_fee.toFixed(2)}
                  </td>
                  <td colspan="1">
                    {this.state.package_convenience_fee.toFixed(2)}
                  </td>
                </tr>
                <tr className="total_row">
                  <td></td>
                  <td className="small" colspan="1">
                    BILL TOTAL(INR)
                  </td>

                  <td colspan="1"></td>
                  <td colspan="1"></td>
                  <td colspan="1">
                    <strong>
                      {(
                        this.state.subTotal +
                        this.props.taxes +
                        (this.state.delivery_charge +
                          this.state.GSTOnDeliveryCharges) +
                        this.state.package_convenience_fee
                      ).toFixed(2)}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <style jsx>
          {`
            .payment_invoice {
              background: #fff;
              width: 790px;
            }
            .invoice_inner_div {
              display: inline-flex;
              grid-template-columns: 150px 1fr;
              gap: 30px;
            }
            .invoice_inner_left {
              margin: auto;
            }
            .invoice_inner_left img {
              object-fit: contain;
              height: 100px;
              width: 110px;
            }
            .invoice_inner_right {
              padding: 10px 0;
              font-size: 12px;
            }
            .invoice_inner_right span:first-child {
              font-weight: 600;
              font-size: 15px;
            }
            .invoice_title {
              font-weight: bold;
              text-align: center;
              padding: 5px;
              font-size: 14px;
            }
            .detail_grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              padding-left: 50px;
              padding-top: 20px;
              padding-bottom: 20px;
              gap: 60px;
            }
            .table_wrap {
              //padding: 0 30px;
            }
            .invoice_table {
              width: 100%;
              border: 1px solid #000;
              font-size: 12px;
            }
            th {
              padding: 0.5em 0;
              font-weight: bold;
              font-size: 0.9em;
              border-bottom: 1px solid;
            }
            td small {
              font-size: 0.7em;
            }
            td {
              border: 0;
              text-align: center;
            }
            tbody tr td {
              padding: 10px 0;
              border: 0;
            }
            tbody tr:first-child td {
              padding-top: 20px;
            }
            tbody tr:last-child td {
              padding-bottom: 20px;
              border-bottom: 1px solid;
            }
            .invoice_logo {
              object-fit: contain;
              height: 20px;
              width: auto;
            }
            .left {
              text-align: left;
            }
            tfoot tr:first-child td {
              padding: 10px 0;
              border-bottom: 1px solid;
            }
            tfoot td.left.amt_words {
              padding-left: 30px;
              font-size: 0.75em;
            }
            .amt_words strong {
              display: block;
              font-weight: bold;
              font-size: 1rem;
            }
            .inv_branding {
              padding: 10px 0 10px 30px;
              font-size: 0.8em;
              font-style: italic;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
            }

            .inv_branding > div {
              margin-top: 5px;
            }
            .inv_branding a {
              color: inherit;
              text-decoration: none;
            }
            tfoot td.small {
              font-size: 0.9em;
            }
            .delivery_row td {
              padding: 10px 0;
            }
            .delivery_row td.left {
              border-right: 1px solid;
            }
            .package_row td {
              padding-bottom: 10px;
            }
            .total_row td {
              padding: 10px 0;
              border-top: 1px solid;
            }
            .total_row td.small {
              font-weight: 500;
            }
            @media print {
              body {
                background: #fff;
              }
            }
            .customer_info {
              font-size: 12px;
            }
            .order_info {
              font-size: 12px;
            }
          `}
        </style>
      </>
    );
  }
}

export default InvoiceTemplate;

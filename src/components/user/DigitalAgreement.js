import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useState, useRef } from "react";
import { Container } from "@material-ui/core";
import { jsPDF } from "jspdf";
import ReactToPrint from "react-to-print";
import domtoimage from "dom-to-image";

export default function DigitalAgreement({
  showDigitalAgreement,
  setShowDigitalAgreement,
  pageData,
  handleDigital,
}) {
  const [merchantAgree, setMerchantAgree] = useState(false);
  const [digitalAgree, setDigitalAgree] = useState(true);
  const componentRef = useRef();

  const addFooters = async (doc) => {
    const pageCount = doc.internal.getNumberOfPages();

    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Adding Header
      await domtoimage
        .toPng(document.getElementById("pdf-header"), { quality: 1.0 })
        .then(function (dataUrl) {
          doc.addImage(dataUrl, "png", 0, 0, 790, 178);
        })
        .catch(function (error) {
          alert("Error while adding header!");
        });

      // Adding Footer
      await domtoimage
        .toPng(document.getElementById("pdf-footer"), { quality: 1.0 })
        .then(function (dataUrl) {
          doc.addImage(dataUrl, "png", 0, 937, 790, 140, "", "NONE");
        })
        .catch(function (error) {
          alert("Error while adding footer!");
        });
    }
    // window.open(doc.output("bloburl"), "_blank");
    doc.save(`${pageData.userDetails.business_name}.pdf`);
  };

  const pdfDownload = (e) => {
    e.preventDefault();
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [790, 1135],
    });
    doc.html(document.getElementById("pdf-view"), {
      margin: [218, 0, 180, 0],
      callback: () => {
        addFooters(doc);
      },
    });
  };

  return (
    <>
      <Dialog
        open={showDigitalAgreement}
        onClose={() => setShowDigitalAgreement(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        {digitalAgree ? (
          <DialogTitle>
            <div>{`Nodal Registration Authorization`} </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ReactToPrint
                trigger={() => (
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    style={{ color: "#fff" }}
                  >
                    Print out
                  </Button>
                )}
                content={() => componentRef.current}
              />
              <Button
                color="secondary"
                variant="contained"
                disableElevation
                style={{ color: "#fff", marginLeft: "1em" }}
                onClick={pdfDownload}
              >
                Download pdf
              </Button>
            </div>
          </DialogTitle>
        ) : (
          <DialogTitle>SERVICE AGREEEMENT</DialogTitle>
        )}

        <DialogContent dividers>
          <DialogContentText>
            <Container>
              <table
                ref={componentRef}
                className={`${
                  digitalAgree
                    ? "template-wrap showDigital"
                    : "template-wrap hideDigital"
                }`}
                cellspacing="0"
                cellpadding="0"
              >
                <thead>
                  <tr>
                    <td>
                      <div id="pdf-header" className="header">
                        <div className="header-text">
                          <div className="brand">{`${pageData.userDetails.business_name}`}</div>
                          <div className="icon-wrap">
                            <div className="phone-grid">
                              <div className="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-telephone-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                                  />
                                </svg>
                              </div>
                              <div className="icon-text">
                                <div>
                                  Phone: {`${pageData.userDetails.contact_no}`}
                                </div>
                              </div>
                            </div>
                            <div className="email-grid">
                              <div className="icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  class="bi bi-envelope-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" />
                                </svg>
                              </div>
                              <div className="icon-text">
                                <div>{`${pageData.userDetails.contact_email}`}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div id="pdf-view" className="template-body">
                        <p>
                          <b>To,</b>
                        </p>
                        <p>
                          <p className="payu_address">
                            PayU Payments Private Limited,
                          </p>
                          <p className="payu_address">
                            4th Floor, Pearl Tower,
                          </p>
                          <p className="payu_address">
                            Plot Number -51, Sector 32,
                          </p>
                          <p className="payu_address">
                            Gurgaon – 122001 Haryana
                          </p>
                        </p>

                        <p>Dear Sir,</p>

                        <p>
                          <b>
                            Subject: Authorization for Nodal Bank Registration
                          </b>
                        </p>
                        <p>
                          <b>{pageData.beneficiaryName}</b>, a sole
                          proprietorship/partnership/company (hereinafter
                          referred to as “Sub-Merchant”), having its registered
                          office at{" "}
                          <b>
                            {`${pageData.userDetails.Door_Number}, ${pageData.userDetails.Street_Name}, ${pageData.userDetails.Landmark}, ${pageData.userDetails.City} - ${pageData.userDetails.pincode}`}{" "}
                          </b>{" "}
                          entered into an agreement with <span>Payu</span>{" "}
                          (hereinafter referred to a “Master Merchant”) on{" "}
                          {new Date().toString()} in order to sell Products on
                          Mastervfc Merchant s Website{" "}
                          <b>https://www.mylapay.com</b> (“Website”) and collect
                          payments for purchase of the Products by Customers
                          online.
                        </p>
                        <p>
                          The Sub-Merchant has been given to understand that
                          Master Merchant has entered into a service agreement
                          with PayU (“Agreement”) for using the aggregate
                          Internet Payment Gateway Solutions offered by PayU
                          Payments Private Limited (“PayU”) in order to
                          facilitate the Customers to make payment of Customer
                          Charge and facilitate the Sub-Merchants to collect
                          Payments for purchase of products through its Website.
                        </p>
                        <p>
                          The Sub-Merchant understands and accepts that the
                          Payments made by its Customers will be settled through
                          PayU’s Nodal Account. The Sub-Merchant understands
                          that PayU is required to register Sub-Merchant with
                          PayU at PayUMoney.com and its Nodal Bank in order to
                          settle the Payments. Sub-Merchant consent and
                          authorize PayU to register it with PayUMoney.com and
                          its Nodal Bank and to settle the Payments to
                          Sub-Merchant designated bank account, the details of
                          which are provided below:
                        </p>
                        <p>
                          Name of Bank: <b>{pageData.bankName.Bank_Name}</b>
                          <br />
                          Name of Legal Entity on Bank Account:{" "}
                          <b>{pageData.beneficiaryName}</b>
                          <br />
                          Bank Account Number: <b>{pageData.accountNumber}</b>
                          <br />
                          IFSC Code: <b>{pageData.ifscCode}</b>
                        </p>
                        <p>
                          Sub-Merchant agrees to provide all assistance to PayU
                          in order to complete the PayU and Nodal Bank
                          registration process and provide PayU with the
                          following details and documents:
                        </p>
                        <ol>
                          <li>attested copy of Pan Card of Legal Entity</li>
                          <li>cancelled cheque</li>
                          <li>
                            Such other information as may be requested by PayU
                            from time to time
                          </li>
                        </ol>
                        <p>
                          The Sub-Merchant agrees to comply with and be bound by
                          the Agreement, the sub-merchant terms and conditions
                          on PayUMoney.com and all obligations thereunder with
                          respect to the Sub-Merchants and indemnify PayU and
                          the Acquiring Banks with respect to any breach of the
                          Sub-merchant’s obligations under the Agreement. The
                          Sub-Merchant understands and agrees that PayU will be
                          settling and distributing the Payments collected from
                          the Customers to the Sub-Merchant in the manner
                          instructed by the Master Merchant. Notwithstanding
                          anything stated in this letter, the Sub-Merchant
                          acknowledges that PayU shall not be liable in any
                          manner whatsoever to the Sub-Merchant, its Customers
                          or any third party with respect to the manner in which
                          the Payments are settled and distributed and all
                          disputes and claim shall be settled between the Master
                          Merchant and the Sub-Merchant, without making PayU a
                          party to any such dispute claim, proceeding, etc.
                        </p>
                        <p>
                          The Sub-Merchant represent, warrant and undertakes
                          that:
                        </p>
                        <ol type="a">
                          <li>
                            it is duly organized and validly existing under the
                            laws of the India;
                          </li>
                          <li>
                            the execution and the delivery of this letter and
                            the authorization and consent provided herein does
                            not breach the Sub-Merchant&lsquo;s organizational
                            documents or any law, provisions of any contract or
                            order of court applicable to the Sub-Merchant; and
                          </li>
                          <li>
                            has obtained the requisite approvals, licenses,
                            registration, etc in accordance to the laws, rules,
                            regulations in force in India, in order to sell the
                            Products.
                          </li>
                          <li>
                            The person executing this Agreement is duly
                            authorized to execute the Agreement for and on
                            behalf of the respective Party and shall have the
                            authority to bind the respective Party accordingly.
                          </li>
                        </ol>
                        <p>
                          For the Purpose of this letter, the following words
                          and expressions shall have the following meanings:
                        </p>
                        <p>
                          "Products" shall mean goods and/or services offered
                          for sale by the Sub-Merchant on the Master Merchant’s
                          Website.
                        </p>
                        <p>
                          “Customer” means persons who will purchase Products,
                          offered by the Sub-Merchant on the Master Merchant’s
                          Website and through the Internet Payment Gateway using
                          a Valid Card or net banking account or any other
                          acceptable modes of payment mechanism, provided by
                          PayU.
                        </p>
                        <p>
                          “Nodal Account" shall mean the nodal bank account held
                          by PayU with any of the bank for the purpose of
                          facilitating online payments with respect to RBI
                          notification dated 24th Nov 2009.
                        </p>
                        <p>
                          “Sub-Merchant” shall mean distributors and franchisees
                          who a have entered into a contract with the Master
                          Merchant in order to sell the Products to Customers
                          through the Master Merchant on the Website.
                        </p>
                        <p>
                          “Payments” shall mean Customer Charge minus the
                          Transaction Discount Rate.
                        </p>
                        <p>
                          For <b>{pageData.userDetails.business_name}</b>
                        </p>
                        <div>
                          <h3 className="signature_valid">Signature Valid</h3>
                          <p className="digital_signed_by">
                            Digitally signed by
                          </p>
                          <p className="signature_person">
                            {pageData.beneficiaryName}
                          </p>
                          <p className="signature_date">
                            {new Date().toString()}
                          </p>
                          <img
                            className="site-logo"
                            src="/checked.png"
                            alt="Mylapay Logo"
                            width="290px"
                            height="70px"
                            style={{
                              maxWidth: "500px",
                              maxHeight: "100%",
                              position: "relative",
                              top: "-85px",
                              left: "96px",
                              width: "54px",
                              height: "auto",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td>
                      <div id="pdf-footer" className="template-footer">
                        <div className="footer-text">
                          <div>
                            <b>
                              Contact Person: {pageData.userDetails.Username}
                            </b>
                          </div>
                          <div>
                            <b>
                              Address:{" "}
                              {`${pageData.userDetails.Door_Number}, ${pageData.userDetails.Street_Name}, ${pageData.userDetails.City}, ${pageData.userDetails.StateName} - ${pageData.userDetails.pincode}`}
                            </b>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div
                className={`${merchantAgree ? "showMerchant" : "hideMerchant"}`}
              >
                <p>
                  This agreement has been made and entered in to at Chennai the
                  Date which is effective on the Boarding Approval (effective
                  date) by and between
                </p>
                <p>
                  <strong>MERCHANT</strong> (hereinafter referred to as{" "}
                  <strong>&ldquo;Merchant&rdquo;</strong>, which expression
                  shall, unless be repugnant to the context thereof, include its
                  successor in interest and permitted assigns):
                </p>
                <p>
                  <strong>AND</strong>
                </p>
                <p>
                  <strong>
                    Mindeed Technologies and Services Private Limited
                  </strong>
                  , a company incorporated under the Companies Act, 2013 having
                  its registered office at No 288-289 (old No 188-189) Ground
                  Floor, Aarthi Chambers, Annasalai, Chennai &ndash; 600006,
                  India (hereinafter referred to as{" "}
                  <strong>&ldquo;Mylapay&rdquo; </strong>which expression shall,
                  unless be repugnant to the context thereof, include its
                  successor in interest and permitted assigns):
                </p>
                <p>
                  <strong>Mylapay</strong> and the <strong>Merchant</strong>{" "}
                  hereinafter collectively referred to as{" "}
                  <strong>&ldquo;Parties&rdquo; </strong>
                  and individually as <strong>&ldquo;Party&rdquo;.</strong>
                </p>
                <p>
                  <strong>WHEREAS,</strong>
                </p>

                <p>
                  A. Mylapay is a Merchant Market Place and payment services
                  provider and enables online shop creation a platform for
                  merchants to sell and acceptance of payments through various
                  means.
                </p>
                <p>
                  B. The Merchant is desirous of availing Mylapay services in
                  order to sell his products or services online and accept
                  payments of customer charge through the internet from
                  customers for products or services purchased by them on the
                  merchant site and receives aggregate final payment of
                  Settlement amounts in Merchant bank Account.
                </p>
                <p>
                  C .Mylapay has agreed to provide the Mylapay services and
                  Merchant has agreed to obtain the same on terms and conditions
                  hereinafter contained in this agreement.
                </p>

                <p>For the purpose of this Agreement:</p>

                <p>
                  <strong>a. &ldquo;Acquiring Banks&rdquo;&nbsp;</strong>
                  shall mean various banks, financial institutions, Card
                  Associations, payment system providers who are defined and
                  licensed under the&nbsp;Payment and Settlement Systems Act,
                  2007.
                </p>
                <p>
                  b. &ldquo;<strong>Acquiring Bank Services</strong>
                  &rdquo; shall mean the payment gateway system and services
                  provided by the Acquiring Banks such as to (i) route internet
                  based Valid Card transactions; (ii) offer various facilities
                  through the internet, including Net Banking facilities; (iii)
                  provide Authentication and Authorization from Card
                  Associations or other third party clearing houses; and (iv)
                  provide settlement facilities in respect of payment
                  instructions initiated by the customers.
                </p>
                <p>
                  c. &ldquo;"<strong>Authentication</strong>" shall mean the
                  process by which the Customer&rsquo;s identification is
                  authenticated by the Acquiring Banks.
                </p>
                <p>
                  d. &ldquo;"<strong>Authorization</strong>" shall mean the
                  process by which the Issuing Institution and/or the relevant
                  Card Association electronically or otherwise convey the
                  approval of the charge (i.e. if the Customer has a Valid Card
                  and/or the required credit limit/ debit limit to pay the
                  Customer Charge requested) on a Transaction being undertaken
                  by a Customer on your Website.
                </p>
                <p>
                  e. &ldquo;<strong>Business Days</strong>&rdquo; shall mean any
                  day on which Acquiring Banks are open for business in India,
                  other than Saturday, Sunday and any days declared by us and/or
                  Acquiring Bank as a Holidays
                </p>
                <p>
                  f. "<strong>Card Association(s)</strong>" shall mean any of
                  Visa, MasterCard, Visa Electron, Maestro, Diners, American
                  Express or any other card association as may be specified by
                  us from time to time.
                </p>
                <p>
                  g. &ldquo;<strong>Card Association Rules</strong>&rdquo; shall
                  mean the written rules, regulations, releases, guidelines,
                  processes, interpretations and other requirements (whether
                  contractual or otherwise) imposed or adopted by any Card
                  Association.
                </p>
                <p>
                  h. &ldquo;<strong>Chargeback</strong>&rdquo; shall mean
                  reversal of the value of the Customer Charge with respect to
                  any Transaction, inter alia, on account of (i) alleged forgery
                  of the card number&nbsp;&nbsp;/ bank account or other details
                  (ii) any charge/debit made on a card that has been listed as a
                  hot listed card or otherwise listed on the Card association
                  warning bulletins (iii) duplicate processing of the
                  transaction; or (iv)&nbsp; for other reasons as per applicable
                  rules and guidelines issued by RBI, Card Associations,
                  Acquiring Banks and Issuing Institutions. In addition, any
                  debit to Mylapay bank account on account of transactions by
                  merchants customer shall be recovered.&nbsp;&nbsp;&nbsp;
                </p>
                <p>
                  i. &ldquo;<strong>Completion of Transaction</strong>
                  &rdquo; shall mean in all aspects product or services
                  delivered to the end customer and acknowledged by the
                  customer. If required exhibited by Proof of Delviery.
                </p>
                <p>
                  j. &ldquo;<strong>Confidential Information</strong>
                  &rdquo; shall mean any and all written, oral or other tangible
                  or intangible form of information, discoveries, ideas,
                  concepts, know-how (whether patentable or copyrightable or
                  not), research, development, designs, drawings, blueprints,
                  diagrams, models, samples, flow charts, data, computer
                  programs, disks, diskettes, tapes, algorithms, software
                  programs, marketing plans or techniques, technical, financial,
                  or business information&rdquo; trade secrets which includes
                  but is not restricted to any portion or scientific or
                  technical or proprietary information, design, process,
                  procedure, formula or improvement which is not generally
                  available to the public as delivered by either Party
                  (&ldquo;Disclosing Party&rdquo; to the other Party
                  (&ldquo;Receiving Party&rdquo;) within the framework of this
                  Agreement or resulting there from. Provided that confidential
                  information disclosed orally or those produced by electronic
                  media or through any other intangible means shall be deemed
                  confidential if it is identified as being confidential if it
                  is reduced in writing within (30) thirty days of the date of
                  disclosure. Such writing shall specify the date, time, place,
                  persons involved and the substance of the confidential
                  information so disclosed.
                </p>
                <p>
                  k. "<strong>Customer</strong>" shall mean an individual or
                  legal entity, who/which purchases Products or Services,
                  offered by you on the Website and is directed to the Internet
                  Payment Gateway using a Valid Card or Net Banking account or
                  any other acceptable modes of Payment Mechanism, provided by
                  us.
                </p>
                <p>
                  l. &ldquo;<strong>Customer Bank Account</strong>&rdquo; shall
                  mean a bank account or credit/ prepaid/ cash card account of
                  the Customer with Issuing Institution.
                </p>
                <p>
                  m. &ldquo;<strong>Customer Wallet</strong>&rdquo; shall mean a
                  digital prepaid instrument authorized under the Payment and
                  Settlement Systems Act, 2007 and held by the Customer with the
                  Issuing Institution.
                </p>
                <p>
                  n. &ldquo;<strong>Customer Charge</strong>&rdquo; shall mean
                  the sale price of the Products / Services purchased by the
                  Customer plus the shipping charge (if any) and all other
                  taxes, duties, costs, charges and expenses in respect of the
                  Products/payment that are to be paid by the Customer.
                </p>
                <p>
                  o. &ldquo;<strong>Delivery</strong>&rdquo; shall mean (i) in
                  respect of a good, delivery of the good by a courier /parcel
                  service appointed by the you or your vendors, to the Customer
                  within Delivery Due Date at the address specified by the
                  Customer in this behalf; or (ii) in respect of a service,
                  delivery or performance of provisions of service within the
                  Delivery Due Date.
                </p>
                <p>
                  p. &ldquo;<strong>Delivery Due Date</strong>&rdquo; shall mean
                  the date/period displayed on the Website or otherwise notify
                  to the Customer on or before which you shall deliver the
                  Products to the Customer(s).
                </p>
                <p>
                  q. &ldquo;<strong>EMI</strong>&rdquo; shall mean equated
                  monthly instalment payment plan schemes of various Issuing
                  Institutions which Mylapay offers you.
                </p>
                <p>
                  r. "<strong>Issuing Institution</strong>" shall mean a bank or
                  financial institution or other legal entity, with which the
                  Customer has a Customer Wallet, a Net&nbsp; Banking account
                  and/or which has issued the Valid Card to the Customers
                  (explanation: except for debit card or credit card
                  Transactions, the Issuing Institution of the Customer and the
                  respective Acquiring Bank will be the same).
                </p>
                <p>
                  s. &ldquo;<strong>IVR System</strong>&rdquo; shall mean
                  interactive voice response&nbsp;technology that allows the
                  Customer to interact with the your Mylapay hosted IVR platform
                  through a telephone by way of telecommunication signal tone
                  inputs on the keypad and raise support related issues.
                </p>
                <p>
                  t. "<strong>Merchant Bank Account</strong>" shall mean the
                  bank account maintained and nominated by you for settlement of
                  your Settlement Amount.
                </p>
                <p>
                  u. &ldquo;<strong>Merchant Site</strong>&rdquo; shall mean
                  Website hosted by Mylapay on your behalf as detailed in the
                  Merchant Service Form.
                </p>
                <p>
                  v. &ldquo;<strong>Mobile Application</strong>&rdquo; shall
                  mean a software application that runs on smart phones, tablet
                  computers and other mobile devices, the contents of which are
                  controlled, operated and owned and established by you, for the
                  purposes of enabling the Customers to view Products and carry
                  out Transactions for purchase of Products, offered on the
                  Mobile Application.&nbsp;
                </p>
                <p>
                  w. &ldquo;<strong>Mobile SDK</strong>&rdquo; shall mean
                  proprietary mobile software development kit, a custom mobile
                  software application and packaged Application Programming
                  Interface codes (APIs) developed by Mylapay.
                </p>
                <p>
                  x. &ldquo;<strong>Net Banking Account</strong>&rdquo; shall
                  mean the facility and internet account provided by the Issuing
                  Institution to Customers holding a bank account or digital
                  wallet account with the Issuing Institutions specified by
                  Mylapay from time to time. Provided that the bank account is
                  not listed in current warning or restricted bank account
                  bulletins or notices.
                </p>
                <p>
                  y. &ldquo;<strong>Nodal Account</strong>&rdquo; shall mean an
                  operative account held by Mylapay with any of the banks for
                  the purpose of pooling the monies collected from Customers on
                  your behalf and facilitating the transfer of these funds in
                  final settlement to you (after deducting TSF), pursuant to RBI
                  notification DPSS.CO.PD.No.1102/ 02.14.08/2009-10, dated
                  24/11/2009 or any other RBI notifications/guidelines amended
                  from time to time.
                </p>
                <p>
                  z. &ldquo;<strong>Nodal Bank</strong>&rdquo; shall mean the
                  bank(s) designated by Mylapay for the purpose of pooling the
                  funds collected from Customers on your behalf and facilitating
                  the transfer of these funds in final settlement to you (after
                  deducting TSF), pursuant to RBI notification
                  DPSS.CO.PD.No.1102/ 02.14.08/2009-10, dated 24/11/2009 or any
                  other RBI notifications/guidelines amended from time to time.
                </p>
                <p>
                  aa. &ldquo;<strong>One Click Checkout</strong>&rdquo; shall
                  mean the facility provided to the Customers to save its Valid
                  Card details on the Mylapay server to&nbsp;purchase the
                  Products from the Merchant Site with a&nbsp;single
                  click.&nbsp;
                </p>
                <p>
                  bb. &ldquo;<strong>Outstanding Amount</strong>&rdquo; shall
                  mean the amount payable by you to Mylapay, Acquiring Banks
                  and/or Customers for any losses, costs, damages, penalties,
                  Chargebacks, refund overdraft or credit problems suffered or
                  incurred by the Customers, Mylapay and/or Acquiring Banks; any
                  fees and other payments owed to Mylapay by you; and any claims
                  or proceedings filed against Mylapay and/or Acquiring Banks by
                  the Customers or any third Party.
                </p>
                <p>
                  cc. &ldquo;<strong>Payment Mechanism</strong>&rdquo; shall
                  mean the mechanism of making payment by utilizing the internet
                  facilities of various Acquiring Banks, Card Associations, card
                  payment systems and through such other modes and mechanisms of
                  payment and delivery as may be notified by Mylapay from time
                  to time.
                </p>
                <p>
                  dd. &ldquo;<strong>Mylapay Account</strong>&rdquo; shall mean
                  the merchant account maintained with Mylapay in order to
                  provide the Mylapay Services to you.
                </p>
                <p>
                  ee. &ldquo;<strong>Mylapay Services</strong>&rdquo; shall have
                  the meaning ascribed to it in Recital A provided through
                  Mylapay Products.
                </p>
                <p>
                  ff. &ldquo;<strong>Mylapay Product</strong>&rdquo; shall mean
                  the Mylapay Enterprise and/or Mylapay product opted for by
                  you, by means of which Mylapay provides you Mylapay Services.
                </p>
                <p>
                  gg. &ldquo;<strong>Mylapay Site</strong>&rdquo; shall mean the
                  websites provided by Mindeed Technologies and Services Private
                  Limited (i.e secure. Mylapay depending upon the Mylapay
                  Product opted for by you) by means of which Mylapay provides
                  aggregative Internet Payment Gateway services/ Mylapay
                  Services to you and the Customers.
                </p>
                <p>
                  hh. "<strong>Products</strong>" shall mean goods and/or
                  services offered for sale by you on the Merchant Site.
                </p>
                <p>
                  ii. &ldquo;<strong>Proof of Delivery</strong>&rdquo; shall
                  mean sufficient legitimate records evidencing Delivery of the
                  Product to the Customer (i.e. Courier Company&rsquo;s delivery
                  confirmation and delivery confirmation by the Customer).
                </p>
                <p>
                  jj. "<strong>RBI</strong>" shall mean the Reserve Bank of
                  India.
                </p>
                <p>
                  kk. &ldquo;<strong>Reserve</strong>&rdquo; shall mean the
                  interest free, refundable funds provided and replenished by
                  you to Mylapay from time to time.
                </p>
                <p>
                  ll. &ldquo;<strong>Settlement Amount</strong>&rdquo; shall
                  mean Customer Charge minus the TSF and any other charges/fees
                  payable by you to Mylapay under this Agreement.
                </p>
                <p>
                  mm. &ldquo;<strong>Transaction</strong>" shall mean every
                  payment request/order placed by the Customer on the Merchant
                  Site for purchasing Products from you.
                </p>
                <p>
                  nn. &ldquo;<strong>Transaction Service Fee</strong>
                  &rdquo; or &ldquo;<strong>TSF</strong>&rdquo; shall mean total
                  commission earned by Mylapay exclusive of all taxes, per
                  transaction for the services provided hereunder. TSF
                  constitutes of Merchant Discount Rate (MDR) &amp; Convenience
                  Fee.
                </p>
                <p>
                  oo. &ldquo;<strong>Upgraded Mobile Application</strong>
                  &rdquo; shall mean the Merchant&rsquo;s Mobile Application
                  integrated with the Mobile SDK.
                </p>
                <p>
                  pp. "<strong>Valid Card</strong>" shall mean any unexpired
                  credit card or debit card which is issued by an Issuing
                  Institution designated to issue a Visa, MasterCard, Visa
                  Electron or a Maestro or cash card, pre-paid card or other
                  card as may be specified by Mylapay from time to time.
                  Provided that the card is not listed in current warning or
                  restricted card bulletins or notices and bears the signature
                  of the person in whose name the card is issued.
                </p>
                <p>&nbsp;</p>
                <ol>
                  <li>
                    <strong>INTRODUCTION</strong>
                  </li>
                </ol>
                <p>
                  In this Merchant Service Agreement ("&nbsp;
                  <strong>Agreement</strong>&nbsp;"), "Merchant", "you" and
                  "your" refer to each customer ("&nbsp;
                  <strong>Merchant</strong>&nbsp;") and its designated agents,
                  including your administrative contact, and "Mylapay", "we",
                  "us" and "our" refer collectively to Mylapay. This Agreement
                  explains our obligations to you, and your obligations to us in
                  relation to the service(s) you purchase. By purchasing the
                  service(s) you agree to establish an account with us for such
                  services. When you use your account or permit someone else to
                  use your account to purchase or otherwise acquire access to
                  additional Mylapay service(s) or to modify or cancel your
                  service(s) (even if we were not notified of such
                  authorisation), this Agreement as amended covers any such
                  service or actions. Additionally, you agree that the
                  administrative contact for any services provided to you is
                  your agent with full authority to act on your behalf with
                  respect to such services, as permitted by the Services and
                  related documentation, including (but not limited to) the
                  authority to terminate, transfer (where transfer is permitted
                  by the Agreement), or modify such services, or purchase
                  additional services. Any acceptance of your application(s) or
                  requests for our services and the performance of our services
                  will be deemed to occur at our offices in Bangalore.
                </p>
                <ol start="2">
                  <li>
                    <strong>VARIOUS SERVICES</strong>
                  </li>
                </ol>
                <p>
                  Sections 1 through 12 apply to any and all Services that you
                  purchase under the Agreement. The terms and conditions set
                  forth in the attached schedules to the Agreement apply only to
                  customers who have purchased the Mylapay services referenced
                  in those schedules. Such schedules are incorporated into this
                  Agreement by this reference. In the event of any inconsistency
                  between the terms of Sections 1 through 12 and the terms of
                  the schedules, the terms of the schedules shall control with
                  regard to the applicable Mylapay service. If you purchase
                  separate Mylapay services that are sold together as a
                  "bundled" package, as opposed to your purchasing such services
                  separately, termination of any part of the services may result
                  in termination of all Mylapay services provided as part of the
                  bundled package unless arrangements are made to pay for the
                  services separately. Please see Section 10 of this Agreement
                  for termination terms.&nbsp;
                </p>
                <ol start="3">
                  <li>
                    <strong>MEMBERSHIP&nbsp;</strong>
                  </li>
                </ol>
                <p>
                  You must register with us in order to open a Mylapay Account
                  and use Mylapay Services. We allow both individuals and Legal
                  Entities to register with Mylapay. Without any legal
                  obligation to do so, we require certain information from you,
                  as laid out in the registration form, to permit the use of
                  Mylapay Services. You must provide accurate and complete
                  information. In addition, you must keep the information that
                  you provide up-to-date at all times. For business Users, you
                  are only permitted to apply and enrol, if you represent a
                  legitimate business and have the authority to enter into this
                  Agreement on behalf of the business. You represent and warrant
                  that you are duly authorized by the business entity to accept
                  this Agreement and have the authority to bind such business
                  entity. You further represent and warrant that the business
                  entity has all the requisite consents, approvals,
                  certificates, agreements, registrations and licences in
                  accordance with the laws, regulations, rules and guidelines in
                  force in India from time to time.&nbsp;
                </p>
                <p>
                  You must provide accurate and complete information in response
                  to our questions. You must complete this and other processes
                  to access any funds that you accept through the Services. We
                  reserve the right to suspend or terminate your Mylapay Account
                  in event that you provide inaccurate, untrue, or incomplete
                  information, or fail to comply with the account registration
                  requirements.
                </p>
                <ol start="4">
                  <li>
                    <strong>
                      ELIGIBILITY REQUIREMENT FOR OPENING A MYLAPAY ACCOUNT
                    </strong>
                  </li>
                </ol>
                <p>
                  By creating/opening a Mylapay Account, you represent and
                  confirm that you are:
                </p>
                <ol>
                  <li>18 (eighteen) years of age or older;</li>
                  <li>
                    an Indian citizen, a legal resident of India or a business
                    entity, authorized to conduct business in India;
                  </li>
                  <li>
                    not 'incompetent to contract' within the meaning of the
                    Indian Contract Act, 1972; and
                  </li>
                  <li>
                    Entering into and performing this Agreement, as per
                    applicable law.&nbsp;
                    <br /> You further represent and confirm that you are not a
                    person debarred from using the Mylapay website and/or
                    receiving the Mylapay Services under the laws of India or
                    other applicable laws.
                  </li>
                </ol>
                <p>
                  Mylapay Services and your Mylapay Account can only be used in
                  India. You acknowledge that Mylapay Services may be subject to
                  export restrictions imposed by the laws, rules, regulations,
                  and guidelines in force in India.
                </p>
                <ol start="5">
                  <li>
                    <strong>USER NAME AND PASSWORD</strong>
                  </li>
                </ol>
                <p>
                  You must choose your email ID as User name that clearly
                  identifies belongs to you or your business. If a Transaction
                  dispute results from your failure to use a reasonably
                  descriptive user name, you agree to indemnify Mylapay for any
                  costs stemming from such dispute.
                </p>
                <p>
                  As part of the Mylapay registration process, you will create a
                  password for your Mylapay Account. You are responsible for
                  maintaining the confidentiality of the password and the
                  Mylapay Account, and are fully responsible for all activities
                  that occur under the Mylapay Account, including, without
                  limitation, all actions by sub-users registered under the
                  Mylapay Account. You agree to (a) immediately notify Mylapay
                  of any unauthorized use of your password or the Mylapay
                  Account or any other breach of security, and (b) ensure that
                  you exit from your Mylapay Account at the end of each session.
                  Mylapay cannot and will not be liable for any loss, damage or
                  other liability arising from your failure to comply with this
                  Clause or from any unauthorized access to or use of the
                  Mylapay Account. In the event of any dispute between two or
                  more parties as to ownership of a particular Mylapay Account,
                  you agree that Mylapay will be the sole arbiter of such
                  dispute, at its sole discretion and that Mylapay&rsquo;s
                  decision (which may include termination or suspension of any
                  account subject to dispute) will be final and binding on all
                  parties.
                </p>
                <ol start="6">
                  <li>
                    <strong>
                      APPROVAL AND REGISTRATION TO AVAIL MYLAPAY SERIVCES
                    </strong>
                  </li>
                </ol>
                <p>
                  At the time of registration you are required to disclose the
                  exact business category/business sub-category for which you
                  will be using the Mylapay Services and only avail the Mylapay
                  Services through your designated Merchant Site or site
                  developed by Mylapay which you are using. You understand and
                  acknowledge that in order to use the Mylapay Services for any
                  other purpose, you shall notify Mylapay in writing of such
                  change and such change will be subject to approval by Mylapay.
                  At any cost on the website created by Mylapay Merchant will
                  not allow any other payment gateway integration apart from
                  Mylapay services.
                </p>
                <p>
                  In order to avail the Mylapay Services and Acquiring Bank
                  Services, you must be approved by and registered with Mylapay,
                  the Acquiring Banks and Nodal Bank. Any undertaking with
                  respect to the Mylapay Services under this Agreement shall be
                  subject to Mylapay&rsquo;s, the Acquiring Banks&rsquo; and
                  Nodal Bank&rsquo;s approval and completion of the registration
                  process. By accepting the terms of this Agreement, you agree
                  to provide Mylapay with all such documents as required by
                  Mylapay to register you with Mylapay, the Acquiring Banks and
                  Nodal Bank. You authorize Mylapay to request for supplemental
                  documentation at any time (before or after your Mylapay
                  Account has been activated), in order to verify your identity,
                  the accuracy of the information provided, legitimacy of your
                  business, and/or your Customers, including a Customer report
                  that contains your name and address, etc. If we cannot verify
                  that this information is accurate and complete, we may deny
                  your use of the Services, or close your Mylapay Account at any
                  time.
                </p>
                <p>
                  You further understand and acknowledge that Mylapay, the
                  Acquiring Banks and Nodal Bank have the right to withdraw
                  their approval/consent at any time prior to or after
                  commencement of the Mylapay Services.
                </p>
                <ol start="7">
                  <li>
                    <strong>OUR RELATIONSHIP WITH YOU</strong>
                  </li>
                </ol>
                <p>
                  Mylapay facilitates the merchants to create a platform to sell
                  their products online by developing a tool through which
                  merchant can showcase and sell their product or services or a
                  charitable institution can accept donations. The website will
                  be developed and hosted by Mylapay.com. Merchants can create
                  their product page or services page and publish the same to
                  customers, who in turn can add the products to cart and
                  finally checkout for payment, using Valid Cards, Net Banking
                  and various other acceptable modes of Payment Mechanism
                  provided by Mylapay.
                </p>
                <p>
                  Mylapay a software application (&ldquo;Software
                  Application&rdquo;) and established a Mylapay Site. Mylapay
                  will act as an intermediary or a merchant market platform, by
                  creating a link between the Merchant Site and the respective
                  Acquiring Banks by means of the Software Application and
                  Mylapay Site, for enabling the Customers to make payment of
                  Customer Charge on the Merchant Site for the Transactions
                  carried, using Acquiring Bank&rsquo;s Services
                  (&ldquo;Internet Payment Gateway"). In order to serve in this
                  role, we have entered into agreements with various Acquiring
                  Banks, Nodal Bank, Financial Institutions, Card Associations
                  and other software providers who are in the business of
                  providing information technology services, including but not
                  limited to, internet based electronic commerce, internet
                  payment gateway and electronic software distribution services,
                  to enable use of internet payment gateways developed by them,
                  to (i) route internet based Valid Card Transactions; (ii)
                  offer various facilities through the internet, including net
                  banking facilities; (iii) provide Authorization from Card
                  Associations or other third party clearing houses; and (iv)
                  provide settlement facilities in respect of payment
                  instructions initiated by the Buyers.
                </p>
                <p>
                  These Transactions are between you and your Customers and we
                  are only acting as an intermediary. We are not (i) a payment
                  System Provider as defined under the Payment and Settlement
                  Systems Act, 2007, (ii) a banking company as defined under the
                  Banking Regulation Act, 1949 or (iii) a non-banking financial
                  company as defined by the Reserve Bank of India Act, 1938. We
                  are purely a merchant market player who gives benefit of
                  payment acceptance through our platform and supported by
                  relevant backend platforms by other service providers.
                </p>
                <p>
                  The relationship between Mylapay and you is on
                  principal-to-principal basis. Nothing contained herein shall
                  be deemed to create any association, partnership, joint
                  venture or relationship of principal and agent or master and
                  servant, or employer and employee between us hereto or any
                  affiliates or subsidiaries thereof or to provide either Party
                  with the right, power or authority, whether express or implied
                  to create any such duty or obligation on behalf of the other
                  Party.
                </p>
                <p>
                  Mylapay has no connection or interest of whatsoever nature in
                  your business or the Products offered/ marketed on the
                  Merchant Site. Mylapay is very strict on products or services
                  that is sold in the platform which are to be purely government
                  acknowledged. Any anti social or non government approved
                  product or services cannot be carried out in
                  merchant.mylapay.com website and we have all the rights to
                  review and audit now and then on this and deboard such
                  merchants. Mylapay shall provide Mylapay Services to you, as
                  an independent entity and under the terms and conditions of
                  this Agreement.&nbsp; Mylapay has no relationship with the
                  Customers with respect to transactions done with merchant, and
                  all actions under this Agreement which may affect the
                  Customers are instructed by you. You alone shall be
                  responsible to the Customers and neither Mylapay nor the
                  Acquiring Bank or anybody connected to Mylapay or Acquiring
                  Bank shall have any responsibility or liability towards the
                  Customers and you shall keep Mylapay and Acquiring Bank fully
                  indemnified for all times to come&nbsp; in this respect.&nbsp;
                </p>
                <p>
                  Mylapay is neither concerned nor required to monitor in any
                  manner the use of the payment modes by the Customers for
                  procuring / availing the Products. The Customers should be
                  required to use the payment modes at their sole option and
                  risks. You shall be required to notify this responsibility to
                  all its Customers under the instructions provided by Mylapay.
                </p>
                <ol start="8">
                  <li>
                    <strong>MERCHANT OBLIGATIONS.</strong>
                  </li>
                </ol>
                <p>
                  General Service Requirements. Merchant shall be solely
                  responsible for:
                </p>
                <ol>
                  <li>
                    Establishing, hosting and maintenance of its Web site(s) if
                    they have their own website or they will use Mylapay
                    provided website, and its connection to the Internet (the
                    "&nbsp;Merchant Web Site(s)&nbsp;"), fulfilling all orders
                    for products and services sold by Merchant to its users on
                    the Merchant Web Site(s) or otherwise, including without
                    limitation transmitting Merchant's registration information
                    and Transaction data to Mylapay servers or via the Mylapay
                    Manager Web Site and ensuring that any data stored or
                    transmitted by Merchant in conjunction with the Services and
                    for enrolment for the Services is accurate, complete and in
                    the form as requested by Mylapay, is securely collected and
                    is not corrupted due to Merchant's systems. Merchant is also
                    responsible for reviewing the Transactions in its account on
                    a regular basis and notifying Mylapay promptly of suspected
                    unauthorised activity through its account;
                  </li>
                  <li>
                    Establishing and maintaining a commercial banking
                    relationship with one or more Financial Institutions. The
                    terms of such relationship shall be determined solely by
                    Merchant and the Financial Institution;
                  </li>
                  <li>
                    Keeping its login name and password confidential. Merchant
                    shall notify Mylapay immediately upon learning of any
                    unauthorised use of its user name or password. Merchant
                    shall be solely responsible for (i) updating its passwords
                    for access to the Services periodically, and (ii) creating
                    passwords that are reasonably "strong" under the
                    circumstances, both in accordance with Mylapay's
                    requirements. A "strong" password is at least eight
                    characters long, does not contain all or part of the users
                    account name, and contains at least three of the four
                    following categories of characters: uppercase characters,
                    lowercase characters, base 8 digits, and symbols found on
                    the keyboard (such as !, @, #). Strong passwords should be
                    generated in such a way that knowledge of one does not lead
                    to knowledge of another.
                  </li>
                  <li>
                    Maintaining commercially reasonable business practices in
                    conjunction with use of the Services, collecting, storing
                    and transmitting its customer data in a secure manner and
                    protecting the privacy of its customer data. Merchant shall
                    comply with Mylapay's requests for reasonable action on
                    Merchant's part, to the extent necessary, to maintain
                    security and integrity of the Services;
                  </li>
                  <li>
                    Updating to the most current Software version and security
                    updates and patches necessary to properly operate the
                    Services and keeping all Merchant enrolment and payment
                    information current and updated on the Manager Web Site; and
                  </li>
                  <li>
                    Merchant agrees, and hereby represents and warrants that
                    Merchant shall (A) use the Services in accordance with the
                    applicable user guides and other documentation; and (B) not
                    use or permit others to use information obtained through the
                    use of the Services for any purpose other than in
                    conjunction with the Services and in a manner described in
                    the documentation for the Services
                  </li>
                  <li>
                    Merchant agrees, that if they take the website built and
                    provided by Mylapay is used by them, they would take atmost
                    care in the product and images uploaded on the website. Any
                    Anti-government or Anti-social activity cannot be provided
                    as Product or services under Mylapay website. Any such thing
                    will be sole responsibility of merchant and Mylapay or its
                    Directors and employees will not be responsible for any
                    issues that may arise and Merchant takes sole responsibility
                    and liability if any arises.
                  </li>
                  <li>
                    Merchant agrees that he is not in the businesses as
                    mentioned in Annexure &ndash; A, which is barred from doing
                    online businesses.
                  </li>
                </ol>
                <ol start="9">
                  <li>
                    <strong>PROPRIETARY RIGHTS.</strong>
                  </li>
                </ol>
                <p>
                  Except as otherwise set forth herein, all right, title and
                  interest in and to all, (i) registered and unregistered
                  trademarks, service marks and logos; (ii) patents, patent
                  applications, and patentable ideas, inventions, and/or
                  improvements; (iii) trade secrets, proprietary information,
                  and know-how; (iv) all divisions, continuations, reissues,
                  renewals, and extensions thereof now existing or hereafter
                  filed, issued, or acquired; (v) registered and unregistered
                  copyrights including, without limitation, any forms, images,
                  audiovisual displays, text, software and (vi) all other
                  intellectual property, proprietary rights or other rights
                  related to intangible property which are used, developed,
                  comprising, embodied in, or practiced in connection with any
                  of the Services identified herein ("Mylapay Intellectual
                  Property Rights") are owned by Mylapay or its licensors, and
                  you agree to make no claim of interest in or ownership of any
                  such Mylapay Intellectual Property Rights. You acknowledge
                  that no title to the Mylapay Intellectual Property Rights is
                  transferred to you, and that you do not obtain any rights,
                  express or implied, in the Mylapay or its licensors' service,
                  other than the rights expressly granted in this Agreement. To
                  the extent that you create any Derivative Work (any work that
                  is based upon one or more pre-existing versions of a work
                  provided to you, such as an enhancement or modification,
                  revision, translation, abridgement, condensation, expansion,
                  collection, compilation or any other form in which such
                  pre-existing works may be recast, transformed or adapted) such
                  Derivative Work shall be owned by Mylapay and all existing and
                  future copyright and other right, title and interest in and to
                  each such Derivative Work, are assigned to, and shall
                  automatically vest in, Mylapay. Mylapay shall have no
                  obligation to grant you any right in any such Derivative Work.
                  Except to the extent permitted by applicable law, Merchant
                  shall not disassemble, decompile, decrypt, extract, reverse
                  engineer, prepare a derivative work based upon, distribute, or
                  time share the Services or any components thereof, or
                  otherwise apply any procedure or process to the Services or
                  components thereof in order to ascertain, derive, and/or
                  appropriate for any reason or purpose, the source code or
                  source listings or any algorithm, data, process, procedure or
                  other information contained therein. Merchant shall not rent,
                  sell, resell, lease, sublicense, loan or otherwise transfer
                  the Services or components thereof.
                </p>
                <ol start="10">
                  <li>
                    <strong>MYLAPAY'S OBLIGATIONS.</strong>
                  </li>
                </ol>
                <p>
                  <strong>
                    Services
                    <br />{" "}
                  </strong>
                  Subject to the terms in this Agreement, Mylapay agrees to (i)
                  provide to Merchant the Services for which Merchant enrols and
                  pays the applicable fees, including without limitation the
                  transmission of Transaction information to Financial
                  Processors, and (ii) provide Merchant with access to
                  standardised reports regarding Merchant's Transactions
                  processed using the Services and certain reporting tools to
                  assist Merchant in accounting activities. Mylapay hereby
                  grants to Merchant the right to access and use the Services in
                  accordance with the Agreement. Mylapay is not bound by nor
                  should Merchant rely on any representation by (i) any agent,
                  representative or employee of any third party that Merchant
                  may use to apply for our services; or in (ii) information not
                  posted on our Web site of a general informational nature.
                </p>
                <p>
                  <strong>
                    Modification of Terms
                    <br />{" "}
                  </strong>
                  Except as otherwise provided in this Agreement, Merchant
                  agrees that Mylapay may: (1) revise the terms and conditions
                  of this Agreement, including without limitation modifying the
                  service fees or payment terms; and/or (2) change part of the
                  Services provided under this Agreement at any time. Any such
                  revision or change will be binding and effective either, at
                  Mylapay's sole discretion, 30 days after posting of the
                  revised Agreement or change to the Services on the Mylapay
                  Manager Web Site, or upon electronic or written notification
                  to you. You agree to periodically review the Manager Web Site,
                  including the current version of this Agreement available on
                  the Manager Web Site, to be aware of any such revisions. If
                  you do not agree with any revision to the Agreement, you may
                  terminate this Agreement at any time by providing us with
                  notice as set forth in this Agreement. Notice of your
                  termination will be effective on receipt and processing by us.
                  Any fees paid by you if you terminate your Agreement with us
                  are non refundable, except as otherwise expressly stated
                  herein, but you will not incur any additional fees. By
                  continuing to use Mylapay services after any revision to this
                  Agreement or change in Services, you agree to abide by and be
                  bound by any such revisions or changes. We are not bound by
                  nor should you rely on any representation by (i) any agent,
                  representative or employee of any third party that you may use
                  to apply for our Services; or in (ii) information not posted
                  on our Web site of a general informational nature. No
                  employee, contractor, agent or representative of Mylapay is
                  authorised to alter or amend the terms and conditions of this
                  Agreement.
                </p>
                <p>
                  <strong>Secure Transactions</strong>
                </p>
                <p>
                  Mylapay has implemented and will maintain security systems for
                  the transmission of Merchant's Transactions, consisting of
                  encryption and "firewall" technologies that are understood in
                  the industry to provide adequate security for the transmission
                  of such information over the Internet. Mylapay does not
                  guarantee the security of the Services or Transaction data,
                  and Mylapay will not be responsible in the event of any
                  infiltration of its security systems, provided that Mylapay
                  has used commercially reasonable efforts to prevent any such
                  infiltration. Merchant further acknowledges and agrees that
                  Merchant, and not Mylapay, is responsible for the security of
                  Transaction data or information or any other information
                  stored on Merchant's servers, and that Mylapay is not
                  responsible for any other party's servers (other than
                  subcontractors of Mylapay solely to the extent Mylapay is
                  liable for its own actions hereunder).
                </p>
                <p>
                  <strong>Merchant Support</strong>
                </p>
                <p>
                  Mylapay shall provide the support services to Merchants
                  through an IVR system, specific to the support package
                  selected by Merchant during enrolment. Mylapay's then-current,
                  standard technical support descriptions for these Services
                  shall be posted at the URL: www.mylapay.com
                </p>
                <p>&nbsp;</p>
                <p>
                  <strong>PRIVACY</strong>
                </p>
                <p>
                  <strong>The Mylapay Privacy Statement. </strong>Our privacy
                  statement for the Services is located on our Web site at{" "}
                  <a href="http://www.mylapay.com">www.mylapay.com</a> and is
                  incorporated herein by reference, as it is applicable to the
                  Services. The privacy statement sets forth your and our rights
                  and responsibilities with regard to your personal information.
                  You agree that we, in our sole discretion, may modify our
                  privacy statement. We will post such revised statement on our
                  Web site. You agree to monitor our Web site periodically to
                  review such revisions. By using our services after
                  modifications to the privacy statement, you have agreed to
                  these modifications. You acknowledge that if you do not agree
                  to any such modification, you may terminate this Agreement.
                </p>
                <p>
                  <strong>Use of the Data.</strong> Merchant acknowledges and
                  agrees that in the course of providing the Services, Mylapay
                  will capture certain transaction and user information
                  (collectively, the "&nbsp;Data&nbsp;"). Merchant agrees to
                  provide to Mylapay, and Mylapay shall capture, only the Data
                  that is required by the Software and is necessary for Mylapay
                  to provide the Services. Mylapay agrees to use Data in its
                  personally identifiable form only as necessary to complete the
                  requested transaction. Mylapay shall not disclose Data to
                  third parties or use the Data, except that Mylapay shall have
                  the rights (i) to use the Data as necessary to perform the
                  Services contemplated in this Agreement (including
                  distributing the Data to third parties providing services
                  requested by Merchant); (ii) to maintain the Data as long as
                  necessary or as required by law and used internally for record
                  keeping, internal reporting, and support purposes; (iii) to
                  compile and disclose Data in the aggregate where individual
                  merchant Data is not identifiable, including without
                  limitation, calculating merchant averages by region or
                  industry; and (iv) to provide the Data as required by law or
                  court order, or to defend Mylapay's rights in a legal dispute.
                  You represent and warrant that you have provided notice to,
                  and obtained consent from, any third party individuals whose
                  personal data you supply to us as part of our services with
                  regard to: (i) the purposes for which such third party's
                  personal data has been collected, (ii) the intended recipients
                  or categories of recipients of the third party's personal
                  data, (iii) which parts of the third party's data are
                  obligatory and which parts, if any, are voluntary; and (iv)
                  how the third party can access and, if necessary, rectify the
                  data you hold about them. You further agree to provide such
                  notice and obtain such consent with regard to any third party
                  personal data you supply to us in the future. We are not
                  responsible for any consequences resulting from your failure
                  to provide notice or receive consent from such individuals or
                  for your providing outdated, incomplete or inaccurate
                  information.
                </p>
                <p>
                  <strong>FEES AND PAYMENT TERMS</strong>
                </p>
                <p>
                  As consideration for the services you purchased, you agree to
                  pay Mylapay the applicable service(s) fees set forth on our
                  Web site, or as otherwise provided by Mylapay concurrently
                  with this Agreement, at the time of your selection, or, if
                  applicable, upon receipt of your invoice from Mylapay. All
                  fees are due immediately and are non-refundable, except as
                  otherwise expressly noted herein or in one or more attached
                  Schedules. Unless otherwise specified herein or on our Web
                  site, the Services are for a one-year initial term and
                  renewable thereafter for successive one-year periods. Any
                  renewal of your Services with us is subject to our
                  then-current terms and conditions, including, but not limited
                  to, successful completion of any applicable authentication
                  procedure, and payment of all applicable service fees at the
                  time of renewal. Additional payment terms may apply to the
                  Mylapay services you purchase, as set forth in the applicable
                  Schedules to this Agreement. You are solely responsible for
                  the credit card or Direct Debit ("&nbsp;DDR&nbsp;") account
                  information you provide to Mylapay and must promptly inform
                  Mylapay of any changes thereto (e.g., change of expiration
                  date or account number). Changes should be communicated to
                  Mylapay by entering the updated information through the
                  Mylapay tools or contacting Mylapay customer support. All
                  payments shall be made in Indian Rupees. All fees are
                  non-refundable unless otherwise explicitly stated in this
                  Agreement. If we do issue a refund, it will only be via the
                  same payment method used by you to pay for the Services. For
                  additional services or add-on services, Merchant shall either
                  prepay Mylapay's then-current annual prepaid fees, if
                  available, or pay the then-current monthly fees for such
                  services, in accordance with Sections mentioned herein below.
                  If Merchant uses Mylapay add-on services that are subject to
                  additional standard fees that are not prepaid at enrolment,
                  then Mylapay shall either immediately charge Merchant's credit
                  card or debit Merchant's DDR account, as applicable, for
                  Mylapay's then-current fees for such services or invoice
                  Merchant for such additional standard fees, and Merchant shall
                  pay such invoice immediately. You agree to pay all value
                  added, sales and other taxes (other than taxes based on
                  Mylapay's income) related to Mylapay services or payments made
                  by you hereunder. All payments due to Mylapay shall be made
                  without any deduction or withholding on account of any tax,
                  duty, charge or penalty except as required by law in which
                  case the sum payable by a party in respect of which such
                  deduction or withholding is to be made shall be increased to
                  the extent necessary to ensure that, after making such
                  deduction or withholding, e Mylapay receives and retains (free
                  from any liability in respect thereof) a net sum equal to the
                  sum it would have received but for such deduction or
                  withholding being required. Set up fees, if any, will become
                  payable on the applicable effective date for the applicable
                  Mylapay services. All sums due and payable that remain unpaid
                  after any applicable cure period herein will accrue interest
                  as a late charge of 1.5% per month or the maximum amount
                  allowed by law, whichever is less. Merchant hereby authorises
                  Mylapay to charge Merchant's credit card provided to Mylapay
                  or debit Merchant's DDR account for the fees due for the
                  Services, and Merchant shall provide to Mylapay proper debit
                  authorisation for purposes of allowing Mylapay to debit the
                  applicable Merchant account to collect fees due under this
                  Agreement. All fees owed by Merchant to third parties (for
                  example, Financial Institutions, Financial Processors and
                  merchant account providers), are Merchant's sole
                  responsibility and are not covered by this Agreement. The
                  purchase order annexed hereto as <strong>Annexure I</strong>{" "}
                  shall form part of the agreement.
                </p>
                <p>
                  <strong>For Prepaid Agreements:</strong>
                </p>
                <p>
                  Merchant agrees to pay to Mylapay the applicable fees in
                  advance for the applicable Services enrolled for and used by
                  Merchant (the "&nbsp;Prepaid Service Fee&nbsp;") for one
                  month, or twelve (12) months or twenty-four (24) months if
                  Merchant prepays for such period. Merchant shall pay a
                  separate Prepaid Service Fee for each Mylapay Services account
                  for which Merchant registers. Merchant agrees that Mylapay
                  shall have no obligation to provide the Services until it has
                  received Merchant's Prepaid Service Fee. Unless either party
                  terminates the Agreement early in accordance with the terms
                  herein or unless otherwise notified by Mylapay electronically
                  or via the Mylapay Manager Web Site, then for each renewal
                  term of this Agreement following the initial prepaid term,
                  Merchant hereby authorises Mylapay to charge Merchant's credit
                  card or DDR account that Mylapay has on file for Merchant or
                  invoice Merchant, as applicable, for the renewal period. In
                  the event Merchant desires to request another payment method,
                  Merchant shall contact Customer Support no less than thirty
                  (30) days prior to the end of the applicable prepaid term.
                  Mylapay reserves the right at the end of each prepaid term to
                  change its fees upon written or electronic notice to Merchant.
                  If Mylapay is unable to collect the Prepaid Service Fee from
                  Merchant for each renewal period, then Mylapay shall have the
                  right to terminate this Agreement in accordance with the terms
                  herein.
                </p>
                <p>
                  <strong>For Non-Prepaid Agreements</strong>.
                </p>
                <p>
                  &nbsp;Merchant agrees to pay to Mylapay the applicable fees
                  for each separate Mylapay account for the Services used by
                  Merchant, as described in these registration pages or as
                  otherwise provided in writing by Mylapay concurrent herewith.
                  There will not be any pro-ration of fees paid or invoiced
                  unless otherwise agreed in writing by Mylapay. Merchant agrees
                  to pay all value added, sales and other taxes (other than
                  taxes based on Mylapay's income) related to the Services or
                  payments made by Merchant to Mylapay. Mylapay may, at its
                  option, either invoice or debit Merchant's credit card or DDR
                  account, as applicable for the fees due Mylapay. Initial set
                  up fees will become payable on the Effective Date. Monthly
                  fees will be invoiced or debited at the end of the calendar
                  month in which the Services are performed. Merchant agrees to
                  pay all such invoices immediately or as otherwise indicated on
                  the applicable invoice. Merchant agrees, at the request of
                  Mylapay, to provide Mylapay with an authorised credit card
                  name, number and date of expiration or an DDR account number.
                </p>
                <p>
                  <strong>Monthly Excess Transaction Fee.</strong>
                </p>
                <p>
                  Notwithstanding Sections 6.1 and 6.2, in the event Merchant
                  exceeds the Transaction limit permitted for the applicable
                  Services as described in the registration pages ("Excess
                  Transaction") in any month, Merchant shall be charged a
                  monthly transaction fee ("Monthly Excess Transaction Fee") to
                  be determined by multiplying each Excess Transaction processed
                  in that month by the corresponding Service's transaction fee
                  listed in the registration pages. The Monthly Excess
                  Transaction Fee shall be invoiced or debited in accordance
                  with the terms for Monthly fees in Section 6.2 "Payment
                  Terms."
                </p>
                <p>
                  <strong>WARRANTY; DISCLAIMER</strong>
                </p>
                <p>
                  Mylapay represents and warrants that (a) it has all requisite
                  corporate or other power to enter into this Agreement and to
                  carry out the terms of this Agreement; (b) all corporate
                  action on the part of Mylapay, its officers, board of
                  directors and stockholders necessary for the performance of
                  its obligations under this Agreement has been taken.
                </p>
                <p>
                  EXCEPT AS EXPRESSLY SET FORTH ABOVE AND TO THE EXTENT
                  PERMITTED BY APPLICABLE LAW, MYLAPAY AND ITS LICENSORS, AS
                  APPLICABLE, MAKE NO WARRANTY OF ANY KIND, EXPRESS, IMPLIED OR
                  STATUTORY, REGARDING THE SERVICES OR SOFTWARE,
                </p>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, ALL SUCH CONDITIONS
                  AND WARRANTIES, INCLUDING WITHOUT LIMITATION THE IMPLIED
                  WARRANTIES OF MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE
                  AND NON-INFRINGEMENT ARE HEREBY EXPRESSLY DISCLAIMED BY
                  MYLAPAY AND ITS LICENSORS, EXCEPT ANY IMPLIED CONDITION OR
                  WARRANTY THE EXCLUSION OF WHICH WOULD CONTRAVENE ANY STATUTE
                  (INCLUDING THE TRADE PRACTICES ACT 1974 (CTH) OR CAUSE ANY
                  PART OF THIS CLAUSE TO BE VOID ("&nbsp;NON-EXCLUDABLE
                  CONDITION&nbsp;").
                </p>
                <p>
                  MYLAPAY'S LIABILITY TO MERCHANT FOR BREACH OF ANY
                  NON-EXCLUDABLE CONDITION IS LIMITED, AT MYLAPAY'S OPTION, TO
                  REFUNDING THE PRICE OF THE GOODS OR SERVICES IN RESPECT OF
                  WHICH THE BREACH OCCURRED OR TO PROVIDING, REPLACING OR
                  REPAIRING THOSE GOODS OR PROVIDING THOSE SERVICES AGAIN
                  (EXCEPT FOR GOODS OR SERVICES OF A KIND ORDINARILY ACQUIRED
                  FOR PERSONAL, DOMESTIC OR HOUSEHOLD USE OR CONSUMPTION, IN
                  RESPECT OF WHICH MYLAPAY'S LIABILITY IS NOT LIMITED UNDER THIS
                  AGREEMENT).
                </p>
                <p>
                  MERCHANT ACKNOWLEDGES THAT NEITHER MYLAPAY NOR ITS LICENSORS
                  HAVE REPRESENTED OR WARRANTED THAT THE SERVICES WILL BE
                  UNINTERRUPTED, ERROR FREE OR WITHOUT DELAY OR WITHOUT
                  COMPROMISE OF THE SECURITY SYSTEMS RELATED TO THE SERVICES NOR
                  THAT ALL ERRORS WILL BE CORRECTED.
                </p>
                <p>
                  Merchant represents and warrants that it shall comply with all
                  applicable privacy, consumer and other laws and regulations
                  with respect to its (i) provision, use and disclosure of the
                  Data; (ii) dealings with the users providing the Data; and
                  (iii) use of the Services. Additionally, Merchant represents
                  and warrants that (a) it has all requisite corporate or other
                  power to enter into this Agreement and to carry out the terms
                  of this Agreement; (b) all corporate action on the part of
                  Merchant, its officers, board of directors and stockholders
                  necessary for the performance of its obligations under this
                  Agreement has been taken; (c) this Agreement constitutes its
                  valid and legally binding obligation, enforceable against it
                  in accordance with the terms hereof; (d) if Merchant is a
                  corporation, then it is a corporation in good standing in its
                  jurisdiction of incorporation; (e) it has read and understands
                  the entire Agreement and desires to be bound thereby, and it
                  has been represented by counsel of its own choosing; and (f)
                  it represents and warrants that, except as expressly set forth
                  herein, no representations of any kind or character have been
                  made to induce it to execute and enter into this Agreement.
                </p>
                <p>
                  <strong>INDEMNIFICATION.&nbsp;</strong>
                </p>
                <p>
                  Either party will defend, indemnify, save and hold harmless
                  the other party and the officers, directors, agents,
                  Affiliates, distributors, franchisees and employees of the
                  other party from any and all third party claims, demands,
                  liabilities, costs or expenses, including reasonable
                  attorneys' fees, resulting from the indemnifying party's
                  material breach of any duty, representation or warranty of
                  this Agreement. A party's right to indemnification under the
                  Agreement ("indemnified party") is conditioned upon the
                  following: prompt written notice to the party obligated to
                  provide indemnification ("indemnifying party") of any claim,
                  action or demand for which indemnity is sought; control of the
                  investigation, preparation, defense and settlement thereof by
                  the indemnifying party; and such reasonable cooperation by the
                  indemnified part, at the indemnifying party's request and
                  expense, in the defense of the claim. The indemnified party
                  shall have the right to participate in the defense of a claim
                  by the indemnifying party with counsel of the indemnified
                  party's choice at the indemnified party's expense. The
                  indemnifying party shall not, without the prior written
                  consent of the indemnified party, settle, compromise or
                  consent to the entry of any judgment that makes any admissions
                  in the indemnified party's name or imposes any liability upon
                  the indemnified party.
                </p>
                <p>
                  <strong>LIMITATIONS ON LIABILITY</strong>
                </p>
                <p>
                  Merchant acknowledges that Mylapay is not a financial or
                  credit reporting institution. Mylapay is responsible only for
                  providing data transmission to effect or direct certain
                  payment authorisations for Merchant and is not responsible for
                  the results of any credit inquiry, the operation of web sites
                  of ISPs or Financial Institutions or the availability or
                  performance of the Internet, or for any damages or costs
                  Merchant suffers or incurs as a result of any instructions
                  given, actions taken or omissions made by Merchant, Merchant's
                  financial processor(s), Merchant's Financial Institution or
                  any ISP. IN NO EVENT WILL MYLAPAY'S LIABILITY (INCLUDING
                  LIABILITY FOR NEGLIGENCE) ARISING OUT OF THIS AGREEMENT EXCEED
                  THE FEES PAID TO MYLAPAY BY MERCHANT HEREUNDER DURING THE
                  TWELVE (2) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT WHICH
                  GAVE RISE TO THE CLAIM FOR DAMAGES. IN NO EVENT WILL MYLAPAY
                  OR ITS LICENSORS HAVE ANY LIABILITY (INCLUDING LIABILITY FOR
                  NEGLIGENCE) TO MERCHANT OR ANY OTHER PARTY FOR ANY LOST
                  OPPORTUNITY OR PROFITS, COSTS OF PROCUREMENT OF SUBSTITUTE
                  GOODS OR SERVICES, OR FOR ANY INDIRECT, INCIDENTAL,
                  CONSEQUENTIAL, PUNITIVE OR SPECIAL DAMAGES ARISING OUT OF THIS
                  AGREEMENT, UNDER ANY CAUSE OF ACTION OR THEORY OF LIABILITY
                  (INCLUDING NEGLIGENCE), AND WHETHER OR NOT MYLAPAY HAS BEEN
                  ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. THESE LIMITATIONS
                  WILL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF
                  ANY LIMITED REMEDY. Notwithstanding the above, the limitations
                  set forth above shall be enforceable to the maximum extent
                  allowed by applicable law.
                </p>
                <p>
                  Merchant is Liable for the defective transactions, charge
                  back, disputes from anyother source which results due to
                  product updated for sale or service in Mylapay website by
                  merchant which will be recovered from merchant with no limit.
                </p>
                <p>
                  <strong>TERM AND TERMINATION</strong>
                </p>
                <p>
                  <strong>Term Renewal. </strong>This Agreement will commence on
                  the later of (i) the date Merchant accepts the terms of this
                  Agreement (the "Effective Date"), or (ii) the date that
                  Merchant's Payflow account is activated for live Transactions,
                  if different; and will continue for a period of one (1) year
                  (or two (2) years if Merchant prepays for two years), unless
                  terminated earlier or suspended according to the provisions of
                  this Agreement. This Agreement will thereafter automatically
                  renew for successive twelve (12) month terms (or twenty-four
                  (24) month terms if Merchant prepays for twenty-four months),
                  unless either party gives the other party written or
                  electronic notice, in accordance with the terms herein, of its
                  intention not to renew the Agreement, at least thirty (30)
                  days prior to the end of the then-current term or renewal term
                  if termination is by Mylapay. Any renewal of your Services is
                  subject to our then-current terms and conditions, successful
                  completion of any applicable authentication procedure, if any,
                  and payment of all applicable service fees at the time of
                  renewal. Additional payment terms may apply to the Mylapay
                  Services you purchase, as set forth herein and in the
                  applicable Schedules to this Agreement.
                </p>
                <p>
                  <strong>Suspension and Termination.</strong> Either party
                  hereto may, at its option, and without notice, terminate this
                  Agreement, effective immediately, should the other party
                  hereto (i) admit in writing its inability to pay its debts
                  generally as they become due; (ii) make a general assignment
                  for the benefit of creditors; (iii) institute proceedings to
                  be adjudicated a voluntary bankrupt, or consent to the filing
                  of a petition of bankruptcy against it; (iv) be adjudicated by
                  a court of competent jurisdiction as being bankrupt or
                  insolvent; (v) seek reorganisation under any bankruptcy act,
                  or consent to the filing of a petition seeking such
                  reorganisation; or (vi) have a decree entered against it by a
                  court of competent jurisdiction appointing a receiver
                  liquidate, trustee, or assignee in bankruptcy or in insolvency
                  covering all or substantially all of such Party's property or
                  providing for the liquidation of such party's property or
                  business affairs.
                </p>
                <p>
                  <strong>By Merchant.</strong> Merchant may terminate this
                  Agreement upon prior written notice to Mylapay by notifying
                  Mylapay's customer support electronically or in writing and
                  following the instructions for cancellation either (i) prior
                  to the end of the initial annual period or any annual renewal
                  period; or (ii) for convenience. Subject to the above, Mylapay
                  shall use commercially reasonable efforts to cancel the
                  Services within seven (30) business days following such
                  written notice from Merchant. Merchant shall be responsible
                  for the payment of all fees due and payable through the
                  effective date of termination. Termination requests for
                  non-Mylapay, third party services may not be made through
                  Mylapay. Merchant must instead contact such third parties
                  directly to cancel such services.
                </p>
                <p>
                  By Mylapay. Notwithstanding Section 10.1, Mylapay may suspend
                  Merchant's access to the Services or terminate this Agreement
                  as follows:
                </p>
                <p>
                  Following ten (10) days prior electronic or written notice
                  (such as an overdue invoice) if (a) Merchant breaches the
                  Agreement, (b) perpetrates fraud, (c) causes or fails to fix a
                  security breach relating to the Services, (d) fails to comply
                  with Mylapay's best practices requirements for security
                  management or to respond to an inquiry from Mylapay,
                  concerning the accuracy or completeness of the information
                  Merchant is required to provide pursuant to this Agreement,
                  (e) if Mylapay reasonably suspects fraudulent activity on
                  Merchant's payment services account, (if such breach is not
                  cured within such 10-day period), (f) in the event that
                  certain third party licenses or access to third party
                  components of the Services are terminated, or (g) non payment
                  of invoice; or
                </p>
                <p>
                  Immediately, without prior notice, if Mylapay reasonably
                  believes Merchant's breach compromises the security of the
                  Services in any material fashion, if fraudulent Transactions
                  are being run on your account, or Merchant's financial
                  processor or Financial Institution with which Merchant has a
                  merchant account requires such termination or suspension.
                </p>
                <p>
                  <strong>EFFECT OF TERMINATION.</strong>
                </p>
                <p>
                  Mylapay will cease providing the Services and cease charging
                  your credit card, if applicable, for any monthly, annual or
                  bi-annual Service fees as of the expiration of the annual,
                  bi-annual or monthly billing cycle in which the termination is
                  effective. If termination of this Agreement is due to your
                  default hereunder, you shall bear all costs of such
                  termination, including any reasonable costs Mylapay incurs in
                  closing your account. You agree to pay any and all costs
                  incurred by Mylapay in enforcing your compliance with this
                  Section. Upon termination, your rights to use the Services,
                  and any other rights granted hereunder, shall immediately
                  cease, and you shall destroy any copy of the materials
                  licensed to you hereunder and referenced herein. Each party
                  will be released from all obligations and liabilities to the
                  other occurring or arising after the date of such termination,
                  except that any termination of this Agreement will not relieve
                  Mylapay or Merchant from any liability arising prior to the
                  termination of this Agreement. To the extent permitted by
                  applicable law, you agree that upon termination for any
                  reason, we may delete all information relating to your use of
                  the Service. Notwithstanding the foregoing, the provisions of
                  Sections 5, 7-12, Merchant's obligations to pay all fees due
                  through the effective date of termination and terms in the
                  Schedules relating to indemnity, warranties or terms which by
                  their nature are required to survive contract termination will
                  survive any termination of this Agreement.
                </p>
                <p>
                  <strong>Bundled Services.</strong> In addition to the terms
                  set forth above, if you purchase Services which are sold
                  together as part of a "bundled" package of services, any
                  termination relating to such bundle will terminate all Mylapay
                  services included in such bundle. In such cases we may, in our
                  sole discretion and subject to your agreeing to be bound by
                  the applicable agreement(s) and to pay the applicable fees,
                  allow you to convert certain services included in the bundled
                  services to stand alone services. Notwithstanding the above,
                  termination of the Services will terminate any add-on
                  services.
                </p>
                <p>
                  <strong>Reinstatement of Services.</strong> If Services are
                  suspended or terminated by Mylapay due to lack of payment by
                  Merchant, reinstatement of Services shall be subject to
                  Merchant paying Mylapay (i) new set-up fees, at Mylapay's
                  then-current rates; and (ii) as applicable, all past due
                  annual or monthly fees and Transaction fees.
                </p>
                <p>
                  <strong>CONFIDENTIALITY</strong>
                </p>
                <p>
                  <strong>Confidential Information.</strong> "Confidential
                  Information" means any confidential, trade secret or
                  proprietary information (which may be business, financial or
                  technical information) disclosed by one party to the other
                  under this Agreement that is marked confidential or if
                  disclosed orally designated as confidential at the time of
                  disclosure or that should be reasonably understood to be
                  confidential. All source code and the terms of this Agreement
                  will be considered Confidential Information.
                </p>
                <p>
                  <strong>Confidentiality Obligations.</strong> Each party (i)
                  shall not disclose to any third party or use any Confidential
                  Information disclosed to it by the other except as expressly
                  permitted in this Agreement and for purposes of performing
                  this Agreement, and (ii) shall take reasonable measures to
                  maintain the confidentiality of all Confidential Information
                  of the other party in its possession or control, which shall
                  in no event be less than the measures it uses to maintain the
                  confidentiality of its own proprietary information or
                  Confidential Information of similar importance. Each party
                  further agrees to use the other party's Confidential
                  Information only for the purpose of its performance under this
                  Agreement. In addition, the receiving party shall not reverse
                  engineer, disassemble or decompile any prototypes, software or
                  other intangible objects which embody Confidential Information
                  and which are provided to the receiving party hereunder.
                </p>
                <p>
                  <strong>Limitation of Confidentiality.</strong> The
                  Obligations set forth in Section 11.2 ("Confidentiality
                  Obligations") above do not apply to information that (i) is in
                  or enters the public domain without breach of this Agreement,
                  (ii) the receiving party lawfully receives from a third party
                  without restriction on disclosure and without breach of a
                  nondisclosure obligation, (iii) the receiving party knew prior
                  to receiving such information from the disclosing party or
                  develops independently without access or reference to the
                  Confidential Information, (iv) is disclosed with the written
                  approval of the disclosing party, or (v) is disclosed five (5)
                  years from the effective date of termination or expiration of
                  this Agreement.
                </p>
                <p>
                  <strong>Exceptions to Confidentiality.</strong>{" "}
                  Notwithstanding the Confidentiality Obligations set forth in
                  Section 11.2 above, each party may disclose Confidential
                  Information of the other party (i) to the extent required by a
                  court of competent jurisdiction or other governmental
                  authority or otherwise as required by law but only after
                  alerting the other party of such disclosure requirement and,
                  prior to any such disclosure, allowing (where practicable to
                  do so) the other party a reasonable period of time within
                  which to seek a protective order against the proposed
                  disclosure, or (ii) on a "need-to-know" basis under an
                  obligation of confidentiality substantially similar in all
                  material respects to those confidentiality obligations in this
                  Section 10 to its legal counsel, accountants, contractors,
                  consultants, banks and other financing sources.
                </p>
                <p>
                  <strong>MISCELLANEOUS TERMS</strong>
                </p>
                <p>
                  <strong>FORCE MAJEURE</strong>. Neither party shall be deemed
                  in default hereunder, nor shall it hold the other party
                  responsible for, any cessation, interruption or delay in the
                  performance of its obligations hereunder, except for
                  Merchant's payment obligations hereunder, due to earthquake,
                  flood, fire, storm, natural disaster, act of God, war,
                  terrorism, armed conflict, labour strike, lockout, or boycott,
                  provided that the party relying upon this Section shall give
                  the other party written notice thereof promptly and, in any
                  event, within five (5) days of discovery thereof, and (ii)
                  shall take all steps reasonably necessary under the
                  circumstances to mitigate the effects of the force majeure
                  event upon which such notice is based; provided, however, that
                  in the event a force majeure event described in this Section
                  extends for a period in excess of thirty (30) days in the
                  aggregate, either party may immediately terminate the
                  Agreement.
                </p>
                <p>
                  <strong>ENTIRE AGREEMENT.</strong> The terms in this Agreement
                  constitute the entire agreement between Mylapay and Merchant
                  regarding its subject matter and its terms supersede any prior
                  or simultaneous agreement, terms, negotiations, whether
                  written or oral, or whether established by custom, practice,
                  policy or precedent, between the parties hereto. Except as
                  otherwise provided for herein, any waiver, modification, or
                  amendment of any provision of this Agreement will be effective
                  only if in writing and signed by the parties herein. Merchant
                  acknowledges and agrees that in the event a purchase order
                  ("PO") contains additional terms, provisions or language
                  ("&nbsp;PO Terms&nbsp;"), those PO Terms shall be null and
                  void and the terms of the Agreement shall prevail.
                </p>
                <p>
                  <strong>SEVERABILITY</strong>. In the event that any provision
                  of this Agreement is unenforceable or invalid such
                  unenforceability or invalidity will not render this Agreement
                  unenforceable or invalid as a whole, and in such event, such
                  provision will be changed and interpreted so as to best
                  accomplish the objectives of such unenforceable or invalid
                  provision within the limits of applicable law or applicable
                  court decisions.
                </p>
                <p>
                  <strong>NO</strong> <strong>ASSIGNMENT</strong>. Merchant may
                  not assign this Agreement without the prior written consent of
                  Mylapay.
                </p>
                <p>
                  <strong>GOVERNING LAW AND JURISDICTION</strong>. This
                  Agreement will be governed by and construed in accordance with
                  the laws of the country without reference to its conflicts of
                  laws principles. Each party consents to the exclusive venue
                  and jurisdiction of the court in India for any dispute arising
                  out of or related to this Agreement. The parties acknowledge
                  and agree that this Agreement is made and performed in India.
                  The parties hereby waive any right to jury trial with respect
                  to any action brought in connection with this Agreement.
                </p>
                <p>
                  <strong>EXPORT</strong> <strong>RESTRICTIONS</strong>.
                  Merchant acknowledges and agrees that it shall not import,
                  export, or re-export directly or indirectly, any commodity,
                  including Merchant's products incorporating or using any
                  Mylapay products in violation of the laws and regulations of
                  any applicable jurisdiction.
                </p>
                <p>
                  <strong>NOTICE</strong>. Except as otherwise expressly stated
                  in this Agreement, all notices to Mylapay shall be in writing
                  and delivered, via courier or certified or registered mail, to
                  Mindeed Technologies and Services Pvt. Ltd, Attention:
                  Director, Mylapay Payments - or any other address provided by
                  Mylapay. All notices to you shall be delivered to your mailing
                  address or e-mail address as provided by you in your account
                  information, as updated by you pursuant to this Agreement.
                  Unless you choose to opt-out of receiving marketing notices,
                  you authorise Mylapay to notify you as our customer, via
                  commercial e-mails, telephone calls and other means of
                  communication, of information that we deem is of potential
                  interest to you, including without limitation communications
                  describing upgrades, new products and services or other
                  information pertaining to the Services or other Mylapay
                  offerings relating to Internet security or to enhancing your
                  identity on the Internet. Notwithstanding the above, Merchant
                  shall not have the right to opt-out of service or support
                  notices relating to the Services, including without
                  limitation, notices of service modifications, security,
                  performance issues or technical difficulties.
                </p>
                <p>
                  <strong>HEADINGS</strong>: The section headings appearing in
                  the Agreement are inserted only as a matter of convenience and
                  in no way define, limit, construe or describe the scope or
                  extent of such section or in any way affect such section.
                </p>
                <p>
                  <strong>INDEPENDENT CONTRACTORS.</strong> Neither party nor
                  their employees, consultants, contractors or agents are
                  agents, employees or joint ventures of the other party, and
                  they do not have any authority to bind the other party by
                  contract or otherwise to any obligation. Each party shall
                  ensure that the foregoing persons shall not represent to the
                  contrary, either expressly, implicitly, by appearance or
                  otherwise.
                </p>
                <p>
                  <strong>NON-DISPARAGEMENT</strong>: During the term of the
                  Agreement, neither party will disparage the other party or the
                  other party's trademarks, web sites, products or services, or
                  display any such items in a derogatory or negative manner on
                  any web site or in any public forum or press release. Unless
                  otherwise stated herein, neither party shall issue a press
                  release or otherwise advertise, make a public statement or
                  disclose to any third party information pertaining to the
                  relationship arising under this Agreement, the existence or
                  terms of the Agreement, the underlying transactions between
                  Mylapay and Merchant, or referring to the other party in
                  relation to the Agreement without the other party's prior
                  written approval.
                </p>
                <p>
                  <strong>COSTS</strong>. Except as expressly stated in the
                  Agreement, each party shall be solely responsible for the
                  costs and expenses of performing its obligations hereunder.
                </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>Annexure A</p>
                <p>
                  Banned list of Products and Services referred to in this
                  Agreement is as mentioned herein below:-
                </p>
                <ol>
                  <li>
                    Adult goods and services which includes pornography and
                    other sexually suggestive materials (including literature,
                    imagery and other media); escort or prostitution services;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="2">
                  <li>
                    Alcohol which includes Alcohol or alcoholic beverages such
                    as beer, liquor, wine, or champagne;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="3">
                  <li>Body parts which includes organs or other body parts;</li>
                </ol>
                <p>&nbsp;</p>
                <ol start="4">
                  <li>
                    Bulk marketing tools which includes email lists, software,
                    or other products enabling unsolicited email messages
                    (spam);
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="5">
                  <li>
                    Cable descramblers and black boxes which includes devices
                    intended to obtain cable and satellite signals for free;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="6">
                  <li>
                    Child pornography which includes pornographic materials
                    involving minors;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="7">
                  <li>
                    Copyright unlocking devices which includes Mod chips or
                    other devices designed to circumvent copyright protection;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="8">
                  <li>
                    Copyrighted media which includes unauthorized copies of
                    books, music, movies, and other licensed or protected
                    materials; Copyright infringing merchandise;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="9">
                  <li>
                    Copyrighted software which includes unauthorized copies of
                    software, video games and other licensed or protected
                    materials, including OEM or bundled software
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="10">
                  <li>
                    Products labeled as "tester," "not for retail sale," or "not
                    intended for resale";
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="11">
                  <li>
                    Counterfeit and unauthorized goods which includes replicas
                    or imitations of designer goods; items without a celebrity
                    endorsement that would normally require such an association;
                    fake autographs, counterfeit stamps, and other potentially
                    unauthorized goods;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="12">
                  <li>
                    Products that have been altered to change the product's
                    performance, safety specifications, or indications of use;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="13">
                  <li>
                    Drugs and drug paraphernalia which includes hallucinogenic
                    substances, illegal drugs and drug accessories, including
                    herbal drugs like salvia and magic mushrooms;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="14">
                  <li>
                    Drug test circumvention aids which includes drug cleansing
                    shakes, urine test additives, and related items;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="15">
                  <li>
                    Endangered species which includes plants, animals or other
                    organisms (including product derivatives) in danger of
                    extinction;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="16">
                  <li>
                    Government IDs or documents which includes fake IDs,
                    passports, diplomas, and noble titles;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="17">
                  <li>
                    Hacking and cracking materials which includes manuals,
                    how-to guides, information, or equipment enabling illegal
                    access to software, servers, websites, or other protected
                    property;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="18">
                  <li>
                    Illegal goods which includes materials, products, or
                    information promoting illegal goods or enabling illegal
                    acts;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="19">
                  <li>
                    Miracle cures which includes unsubstantiated cures, remedies
                    or other items marketed as quick health fixes;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="20">
                  <li>
                    Offensive goods which includes literature, products or other
                    materials that: a) Defame or slander any person or groups of
                    people based on race, ethnicity, national origin, religion,
                    sex, or other factors b) Encourage or incite violent acts c)
                    Promote intolerance or hatred;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="21">
                  <li>
                    Offensive goods, crime which includes crime scene photos or
                    items, such as personal belongings, associated with
                    criminals;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="22">
                  <li>
                    Pyrotechnic devices (apart from the ones mentioned in the
                    Restricted category), hazardous materials and radioactive
                    materials and substances;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="23">
                  <li>
                    Tobacco and cigarettes which includes e-cigarettes, cigars,
                    chewing tobacco, and related products;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="24">
                  <li>
                    Traffic devices which includes radar detectors/jammers,
                    license plate covers, traffic signal changers, and related
                    products;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="25">
                  <li>
                    Weapons which includes firearms, ammunition, knives, brass
                    knuckles, gun parts, and other armaments;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="26">
                  <li>
                    Matrix sites or sites using matrix scheme
                    approach/Ponzi/Pyramid schemes;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="27">
                  <li>Work-at-home information;</li>
                </ol>
                <p>&nbsp;</p>
                <ol start="28">
                  <li>
                    Any product or service which is not in compliance with all
                    applicable laws and regulations whether federal, state,
                    local or international including the laws of India;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="29">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in BPO services;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="30">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in surgical products
                    on B2C model;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="31">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in immigration
                    services (only consultancy is doable);
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="32">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in loose diamonds;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="33">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in guaranteed
                    employment services;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="34">
                  <li>
                    Religious products which are making false claims or hurting
                    someone's religious feelings;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="35">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in adoption agencies;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="36">
                  <li>Master Merchant/ Sub-Merchant who deal in pawnshop;</li>
                </ol>
                <p>&nbsp;</p>
                <ol start="37">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in esoteric pages,
                    psychic consultations;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="38">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in telemarketing
                    (Calling list, selling by phone for example travel service,
                    overall sales);
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="39">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in credit
                    Counselling/Credit Repair Services;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="40">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in get rich
                    businesses;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="41">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in bankruptcy
                    services;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="42">
                  <li>
                    Master Merchant/ Sub-Merchant who deal in websites depicting
                    violence and extreme sexual violence;
                  </li>
                </ol>
                <p>&nbsp;</p>
                <ol start="43">
                  <li>Bestiality</li>
                </ol>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <div>
                  <h3 className="signature_valid">Signature Valid</h3>
                  <p className="digital_signed_by">Digitally signed by</p>
                  <p className="signature_person">{pageData.beneficiaryName}</p>
                  <p className="signature_date">{new Date().toString()}</p>
                  <img
                    className="site-logo"
                    src="/checked.png"
                    alt="Mylapay Logo"
                    width="290px"
                    height="70px"
                    style={{
                      maxWidth: "500px",
                      maxHeight: "100%",
                      position: "relative",
                      top: "-85px",
                      left: "96px",
                      width: "54px",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
            </Container>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: "#248de7",
              color: "white",
            }}
            onClick={() => {
              setMerchantAgree(true);
              setDigitalAgree(false);
            }}
            color="primary"
          >
            Merchant Agreement
          </Button>
          <Button
            style={{
              backgroundColor: "#248de7",
              color: "white",
            }}
            onClick={() => {
              setDigitalAgree(true);
              setMerchantAgree(false);
            }}
            color="primary"
          >
            Nodal Registration authorization
          </Button>
          <Button
            style={{
              backgroundColor: "rgb(239 4 102)",
              color: "white",
            }}
            onClick={() => handleDigital(false, "agree")}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>
        {`
          .template-wrap {
            background: #fff;
            margin: 1em auto;
            width: 790px;
            color: #000;
          }
          @media only screen {
            .template-wrap {
              box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
                rgba(17, 17, 26, 0.1) 0px 16px 56px,
                rgba(17, 17, 26, 0.1) 0px 24px 80px;
            }
          }
          .header {
            padding: 40px;
            display: flex;
            border-bottom: 2px solid var(--mp-light-blue);
            margin-bottom: 40px;
          }
          .header-text {
            display: flex;
            flex-direction: column;
            margin-left: auto;
          }
          .brand {
            text-transform: uppercase;
            font-weight: 800;
            font-size: 1.5em;
            margin-bottom: 0.5em;
            color: var(--mp-dark-blue);
          }
          .icon-wrap {
            margin-left: auto;
          }
          .phone-grid,
          .email-grid {
            display: flex;
            align-items: center;
            margin-bottom: 0.5em;
          }
          .email-grid {
            margin-bottom: 0;
          }
          .icon {
            width: 1.5em;
            height: 1.5em;
            background: var(--mp-light-blue);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1em;
            border-radius: 4px;
          }
          .icon svg {
            height: 0.9em;
            width: 0.9em;
          }
          .icon-text {
            color: var(--mp-dark-blue);
            font-weight: 600;
          }
          .header-bar {
            display: flex;
            width: 100%;
            align-self: flex-end;
            margin-left: 3em;
          }
          .header-bar-grey {
            background: #e9e5e9;
            height: 10px;
            width: 70%;
            display: block;
            clip-path: polygon(0 0, calc(100% - 10px) 0%, 100% 100%, 0% 100%);
          }
          .header-bar-blue {
            background: #057dc2;
            height: 10px;
            width: 30%;
            display: block;
            position: relative;
            clip-path: polygon(0 0, 100% 0%, 100% 100%, 10px 100%);
          }
          .header-bar-blue::before {
            content: "";
            display: block;
            position: absolute;
            height: 10px;
            width: 38%;
            background: #0767b4;
            left: 0px;
            top: 0px;
            clip-path: polygon(0 0, calc(100% - 10px) 0%, 100% 100%, 0% 100%);
          }
          .header-bar-blue::after {
            content: "";
            display: block;
            position: absolute;
            height: 10px;
            width: 35%;
            background: #00a1df;
            right: 0px;
            top: 0px;
            clip-path: polygon(0 0, 100% 0%, 100% 100%, 10px 100%);
          }
          .template-body {
            padding: 0 40px;
          }
          .template-body p {
            text-align: justify;
          }
          .template-footer {
            padding: 40px;
            margin-top: 40px;
          }
          .template-footer {
            padding: 40px;
            text-align: center;
            color: var(--mp-dark-blue);
            font-weight: 600;
            border-top: 2px solid var(--mp-light-blue);
          }
          .footer-text {
            font-size: 0.8em;
            max-width: 500px;
            margin: auto;
            line-height: 1.5;
          }
          tbody tr td {
            border-top: 0;
          }
          .payu_address {
            margin-top: -7px;
          }
        `}
      </style>
    </>
  );
}

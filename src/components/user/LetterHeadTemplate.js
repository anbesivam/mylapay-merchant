import { Container } from "@material-ui/core";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { jsPDF } from "jspdf";
import domtoimage from "dom-to-image";

export default function LetterHeadTemplate() {
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
    doc.save("Agreement.pdf");
  };

  const pdfDownload = (e) => {
    e.preventDefault();
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [790, 1117],
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
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <button onClick={pdfDownload}>Download as pdf</button>

      <Container>
        <div ref={componentRef} className="template-wrap">
          <table cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <td>
                  <div id="pdf-header" className="header">
                    <div className="header-text">
                      <div className="brand">ORWIN MARKETING</div>
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
                            <div>Phone: 9876543210</div>
                          </div>
                        </div>
                        <div className="email-grid">
                          <div className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-globe2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                            </svg>
                          </div>
                          <div className="icon-text">
                            <div>hello@jsn-smith.com</div>
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
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Eaque quibusdam minus, corporis sit amet deserunt eveniet
                      maxime nulla assumenda soluta magni, expedita quaerat
                      ipsam maiores culpa dolore, nobis placeat cupiditate?
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sit nemo quaerat quam quos magnam esse voluptatum atque, a
                      modi illum ea, hic corporis molestiae, culpa suscipit
                      maxime aspernatur vero corrupti. Lorem ipsum dolor sit
                      amet consectetur, adipisicing elit. Sit nemo quaerat quam
                      quos magnam esse voluptatum atque, a modi illum ea, hic
                      corporis molestiae, culpa suscipit maxime aspernatur vero
                      corrupti.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td>
                  <div id="pdf-footer" className="template-footer">
                    <div className="footer-text">
                      <div>Contact Person: Arunachalam</div>
                      <div>
                        Address: 33/6 Vallalar Nagar 4th street, 120ft Road,
                        Shanthi Roadways Building, Karaikudi, TamilNadu-630001
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Container>

      <style jsx>
        {`
          .template-wrap {
            background: #fff;
            margin: 1em auto;
            width: 790px;
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
        `}
      </style>
    </>
  );
}

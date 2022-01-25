import { Link } from "react-router-dom";
import React from "react";
import { ArrowRight, ExpandLess } from "@material-ui/icons";
import ArrowForward from "@material-ui/icons/ArrowForward";

export default function FooterSupport() {
  return (
    <>
      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-wrap">
            <div className="sp-left">
              <div className="sp-subtitle">Support</div>
              <h2>We're here for you.</h2>
              <p>
                Reach us at <strong>1800 572 9101</strong> to get our dedicated
                support care Write to
                <strong>
                  <a href="mailto:customersupport@mylapay.com">
                    {" "}
                    customersupport@mylapay.com
                  </a>
                </strong>
              </p>
            </div>
            <div className="sp-right">
              <a href="#">
                Back to top{" "}
                <ExpandLess size="1.5em" style={{ marginLeft: "0.5em" }} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          .sp-section {
            background: rgba(213, 222, 226, 0.3);
            padding: 3em 0;
            position: relative;
            overflow: hidden;
          }
          .sp-section::after {
            content: "";
            display: block;
            position: absolute;
            left: 0;
            bottom: -20vh;
            width: 8vh;
            height: 29vh;
            background-image: url("/images/dots.svg");
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
          }
          .sp-wrap {
            max-width: 750px;
            margin: auto;
            display: grid;
            grid-template-columns: 3fr 2fr;
            align-items: center;
            justify-content: space-between;
          }
          .sp-subtitle {
            color: #b8b8b8;
          }
          .sp-left h2 {
            font-size: 2em;
            margin: 0;
            margin-top: 0.25em;
          }
          .sp-right {
            text-align: right;
          }
          .sp-right a {
            display: inline-flex;
            align-items: center;
            color: var(--mp-light-blue);
            box-sizing: border-box;
            border-radius: 99px;
            border: 2px solid;
            padding: 0.5em 1.5em;
          }

          @media (max-width: 991px) {
            .sp-left h2 {
              font-size: 1.7em;
            }
            .sp-left p {
              font-size: 0.9em;
            }
          }

          @media (max-width: 767px) {
            .sp-subtitle {
              font-size: 0.9em;
            }
            .sp-left h2 {
              font-size: 1.5em;
            }
            .sp-left p {
              font-size: 0.8em;
              margin-top: 0.5em;
            }
            .sp-right a {
              font-size: 0.8em;
            }
          }

          @media (max-width: 767px) {
            .sp-right {
              display: none;
            }
            .sp-wrap {
              display: block;
            }
            .sp-section::after {
              left: unset;
              right: 0;
            }
          }
        `}
      </style>
    </>
  );
}

import { Link } from "react-router-dom";
import React from "react";

export default function FooterLinks() {
  const { REACT_APP_WEBSITE_URL } = process.env;
  return (
    <>
      <footer>
        <div className="container">
          <div className="links-grid">
            <div className="col">
              <h3>Products</h3>
              <a
                target="_blank"
                href={`${REACT_APP_WEBSITE_URL}products/intellengine`}
              >
                Intellengine
              </a>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}products`}>
                Merchant Marketplace
              </a>
              <a
                target="_blank"
                href={`${REACT_APP_WEBSITE_URL}#paymentSources`}
              >
                Payment Gateway
              </a>
            </div>
            <div className="col">
              <h3>Company</h3>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}about-us`}>
                About Us
              </a>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}careers`}>
                Careers
              </a>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}contact-us`}>
                Contact Us
              </a>
              <a
                target="_blank"
                href={`${REACT_APP_WEBSITE_URL}terms-conditions`}
              >
                Terms & Conditions
              </a>
              <a
                target="_blank"
                href={`${REACT_APP_WEBSITE_URL}privacy-policy`}
              >
                Privacy Policy
              </a>
            </div>
            <div className="col">
              <h3>Resources</h3>
              <Link to="#">Customer Support</Link>
              <Link to="#">Developers</Link>
              <Link to="#">Partners</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        footer {
          padding: 5em 0;
          position: relative;
          background-color: #fff;
        }
        footer::after {
          content: "";
          display: block;
          position: absolute;
          right: 0;
          bottom: -12vh;
          width: 8vh;
          height: 29vh;
          background-image: url("/images/dots-right.svg");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          z-index: 1;
        }
        .links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5em;
          align-items: start;
          max-width: 750px;
          margin: auto;
          text-align: left;
        }
        .col {
          display: grid;
          gap: 1em;
        }
        h3 {
          color: var(--mp-light-blue);
          margin: 0;
          padding-bottom: 0.5em;
          border-bottom: 5px solid #d5dee2;
          font-size: 1.5em;
        }
        a {
          color: #797979;
          text-decoration: none;
        }

        @media (max-width: 991px) {
          .links-grid {
            gap: 3em;
          }
          h3 {
            font-size: 1.2em;
          }
          a {
            font-size: 0.9em;
          }
          .col {
            gap: 0.8em;
          }
        }

        @media (max-width: 767px) {
          footer::after {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .links-grid {
            gap: 2em;
          }
          footer {
            padding: 3em 0;
          }
        }
      `}</style>
    </>
  );
}

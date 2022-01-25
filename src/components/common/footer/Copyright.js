import { Link } from "react-router-dom";
import React from "react";

export default function Copyright() {
  const { REACT_APP_WEBSITE_URL } = process.env;
  return (
    <>
      <section className="cp-section">
        <div className="cp-container container">
          <img src="/logo.svg" alt="Mylapay Logo" height="30" width="200" />
          <ul className="cp-navlinks">
            <li>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}/products`}>
                Products
              </a>
            </li>
            <li>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}/features`}>
                Features
              </a>
            </li>
            <li>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}/about-us`}>
                About Us
              </a>
            </li>
            <li>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}/careers`}>
                Careers
              </a>
            </li>
            <li>
              <a target="_blank" href={`${REACT_APP_WEBSITE_URL}/contact-us`}>
                Contact Us
              </a>
            </li>
          </ul>
          <ul className="cp-social">
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/mylapay"
              >
                <img src="/images/social-twitter.svg" alt="Social links" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://instagram.com/mylapay"
              >
                <img src="/images/social-instagram.svg" alt="Social links" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://facebook.com/mylapay"
              >
                <img src="/images/social-facebook.svg" alt="Social links" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      <style>
        {`
          .cp-section {
            padding: 1em 0;
            background-color: #fff;
          }
          .cp-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .cp-navlinks,
          .cp-social {
            list-style: none;
            display: flex;
            align-items: center;
          }
          .cp-navlinks li {
            margin-right: 2em;
          }
          .cp-navlinks li:last-child {
            margin-right: 0;
          }
          .cp-social li {
            margin-left: 1em;
          }
          .cp-social img {
            height: 2em;
            width: 2em;
          }

          @media (max-width: 991px) {
            .cp-section {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}

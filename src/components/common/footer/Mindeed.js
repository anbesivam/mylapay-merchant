import React from "react";

export default function Mindeed() {
  return (
    <>
      <section>
        <div className="container">
          <div className="mindeed-grid">
            <img
              className="mindeed-img"
              src="/images/mindeed-logo.jpeg"
              alt="Mindeed Logo"
              height="80"
              width="255"
            />
            <div className="divider"></div>
            <p>
              Mindeed Technologies and Services Pvt Ltd is incorporated with a focus to bring in cutting-edge technology to empower payment processing and to help SMEs to equip digitally through our easy-to-use ecommerce technology platform to grow their business.
            </p>
          </div>
        </div>
      </section>

      <style>
        {`
          section {
            padding: 4em 0;
            background: rgba(213, 222, 226, 0.3);
          }
          .mindeed-grid {
            display: grid;
            grid-template-columns: 1fr auto 2fr;
            gap: 3em;
            align-items: center;
            max-width: 750px;
            margin: auto;
          }
          .mindeed-img {
            height: 80px;
            width: auto;
            object-fit: contain;
          }
          .divider {
            height: 100%;
            width: 3px;
            background: #d5dee2;
          }

          @media (max-width: 991px) {
            .grid {
              gap: 2em;
            }
            .mindeed-img {
              height: 60px;
            }
            p {
              font-size: 0.8em;
            }
          }
          @media (max-width: 767px) {
            section {
              padding: 2em 0;
            }
            .mindeed-grid {
              gap: 1em;
              grid-template-columns: auto auto auto;
            }
            .mindeed-img {
              height: 30px;
            }
            p {
              font-size: 0.6em;
            }
          }
        `}
      </style>
    </>
  );
}

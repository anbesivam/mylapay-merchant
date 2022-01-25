import React, { useState } from "react";
import styles from "./css/StepOne.module.css";

export default function StepOne() {
  const [activeStep, setActiveStep] = useState(1);
  const linksTitle = [
    "Shop URL",
    "Themes",
    "Header Content",
    "Banner Images",
    "About Us",
    "Why choose your shop",
    "Contact us",
    "FAQ Content",
  ];

  return (
    <>
      <div className={styles.accWrap}>
        <div className={styles.accLinksWrap}>
          {linksTitle.map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i + 1)}
              className={`${styles.accLink} ${
                i === activeStep - 1 ? styles.active : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className={styles.accContentWrap}>
          <div
            className={`${styles.accContent} ${
              activeStep === 1 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Add website URL to your shop. You can choose to add your own URL
              domain or use Mylapay’s virtual URL domain for free!
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 2 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Select your online store web template appropriate to your business
              category from the theme section and choose pre-defined themes
              suitable for you. the banner images and category section images
              can be maintained as is or you can upload your own images if you
              wish.
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 3 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Upload you shop logo image, fill shop name and choose the color
              you wish to have for your web site
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 4 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Select banner images suitable for your business from Mylapay
              gallery or you can upload your own banner images as you wish.
              Mylapay allow you to have up to 5 banner images as a slider view
              in your website.
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 5 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Tell your customer about your shop. Mylapay provides a predefined
              content which can be edited as you wish!
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 6 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Narrate a short story on why customer love your shop, products and
              services to attract your customers. Mylapay provides a predefined
              content which can be edited as you wish.
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 7 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Your shop address, email id and phone number is auto updated from
              your profile information which you can edit.
            </div>
          </div>
          <div
            className={`${styles.accContent} ${
              activeStep === 8 ? styles.accActive : ""
            }`}
          >
            <div className={styles.accToolTip}>
              Add question and answer statement which you feel that your
              customers would frequently ask for better understanding of your
              shop, product and services
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

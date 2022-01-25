import React,{ useState } from "react";
import TermsOfService from "../../components/signup/TermsOfService";
import PrivacyPolicy from "../../components/signup/PrivacyPolicy";
import MerchantAgreement from "../../components/merchant-agreement-pricing/MerchantAgreement";
import Pricing from "../../components/merchant-agreement-pricing/Pricing";

export default function Footer() {
	
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  
   			
  return (
  	<>
  		{/*<footer>Copyright 2021 Mylapay</footer> */}
  		<p className="tos-label">
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowAgreement(true);
                          }}
                        >
                          Merchant Agreement
                        </a>{" "}
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPricing(true);
                          }}
                        >
                          Pricing
                        </a>{" "}
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTerms(true);
                          }}
                        >
                          Terms of service
                        </a>
                        
                        <a
                          target="_blank"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPrivacy(true);
                          }}
                        >
                          Privacy policies
                        </a>
                      </p>
  		<TermsOfService showTerms={showTerms} setShowTerms={setShowTerms} />
	    <PrivacyPolicy
	       showPrivacy={showPrivacy}
	       setShowPrivacy={setShowPrivacy}
	    />
	    <MerchantAgreement showAgreement={showAgreement} setShowAgreement={setShowAgreement} />
	    <Pricing
	       showPricing={showPricing}
	       setShowPricing={setShowPricing}
	    />

	     <style>
        {`
          .tos-label {
          	padding-right: 20px;
          	padding-bottom: 10px;
          	text-align: right;
            font-size: 0.8em;
            padding-top: 0.1em;
            color: #909090;
          }
          .tos-label a {
            color: #333;
            border-bottom: 1px solid;
            text-decoration: none;
            font-weight: 500;
            margin-right: 10px;
          }
          .tos-field {
            max-width: 100%;
            margin-top: -1em;
          }

          @media (max-width: 1366px) {
            .container {
              max-width: 1070px;
            }
            .dots::before {
              height: 120px;
              width: 40px;
              top: 9px;
            }
          }
        `}
      </style>

  	</>	
  	);
}

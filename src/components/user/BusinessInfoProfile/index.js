import React, { useEffect, useState } from "react";
import Individual from "./Individual";
import Proprietoryship from "./Proprietoryship";
import Partnership from "./Partnership";
import PublicPvt from "./PublicPvt";
import TrustSociety from "./TrustSociety";
import axios from "axios";

export default function BusinessInfo() {
  const [activeForm, setActiveForm] = useState("individual");
  const { REACT_APP_API_URL } = process.env;

  const formContent = () => {
    switch (activeForm) {
      case "Individuals - HUF":
        return <Individual />;
      case "Individuals / Professionals":
        return <Individual />;
      case "Proprietoryship":
        return <Proprietoryship />;
      case "Partnership":
        return <Partnership />;
      case "LLPs":
        return <Partnership />;
      case "Public Ltd Companies":
        return <PublicPvt />;
      case "Private Ltd Companies":
        return <PublicPvt />;
      case "Trust or Society":
        return <TrustSociety />;

      default:
    }
  };

  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${REACT_APP_API_URL}/mylapay/registration/user_docs`)
        .then((response) => {
          if (response.data.success === 1) {
            if (response.data.business_type == null) return;
            if (!isMounted) return;
            setActiveForm(response.data.business_type);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{formContent()}</>;
}

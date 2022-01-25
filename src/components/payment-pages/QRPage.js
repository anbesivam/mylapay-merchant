import {
  Grid,
  Box,
  Button
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import axios from "axios";
import React, { useState,useEffect,useRef } from "react";
import { Link } from "react-router-dom";

import ReactToPrint from 'react-to-print';


export default function QRPage({ shopID, stepChange }) {

  const [QRData, setQRData] = useState("");

  const componentRef = useRef();


  useEffect(() => {
    const getUserData = async () => {
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        console.log(userDetails);
        //setPrefillData(response.data.data[0]);
        await axios
        .post("/mylapay/qrcode/generate",{
          payee_VPA: userDetails.merVirtualAdd,
          payee_name: userDetails.business_name, // merchant business name
          payee_mcc_code: userDetails.iMCC,
          MerchantTxnID: "wkN3zqyC9cPzP7beeb5UF2",
          TxnAmountDecimalFormat: "10.00",
          TxnMinimumAmountDecimalFormat: "10.00",
          TxnNote: "Test Transaction Note for Shop"
        })
        .then((qrResponse) => {
          console.log(qrResponse);
          setQRData(qrResponse.data.data);
        })
        .catch((error) => {
          console.log(error);
        });


        // await axios
        // .get("/mylapay/registration/user_details")
        // .then(async (response) => {
        //   if (response.data.success === 1) {
        //     let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        //     console.log(userDetails);
        //     //setPrefillData(response.data.data[0]);
        //     await axios
        //     .post("/mylapay/qrcode/generate",{
        //       payee_VPA: userDetails.merVirtualAdd,
        //       payee_name: userDetails.business_name, // merchant business name
        //       payee_mcc_code: userDetails.iMCC,
        //       MerchantTxnID: "wkN3zqyC9cPzP7beeb5UF2",
        //       TxnAmountDecimalFormat: "10.00",
        //       TxnMinimumAmountDecimalFormat: "10.00",
        //       TxnNote: "Test Transaction Note for Shop"
        //     })
        //     .then((qrResponse) => {
        //       console.log(qrResponse);
        //       setQRData(qrResponse.data.data);
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });

        //   }
        // })
        // .catch((error) => {
        //   console.log(error);
        // });
    };

    getUserData();

  }, []);

  return (
    <>  
        
        <Grid container justify="flex-end">
              <ReactToPrint
                trigger={
                  () => 
                    <Box mt={2} display="flex" justifyContent="space-between" displayPrint="none">
                      <Button
                        variant="contained"
                        color="primary"
                      >
                        Print QR
                      </Button>

                  </Box>

                }
                content={() => componentRef.current}
              />
        </Grid>
        <Box ref={componentRef} mt={2} width="100%" display="block" textAlign="center" displayPrint="block">
              <img src={QRData} width="50%" height="auto" alt="QR Code" />
        </Box>  
        <Box mt={2} display="flex" justifyContent="space-between" displayPrint="none">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBack />}
            component={Link}
            to={"/"}
          >
            Back
          </Button>
        </Box>
    </>
  );
}

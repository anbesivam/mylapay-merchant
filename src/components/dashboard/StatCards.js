import React from "react";
import {
  TimelineRounded,
  CancelRounded,
  ErrorRounded,
  MoreHorizRounded,
} from "@material-ui/icons";
import styles from "./css/StatCards.module.css";
//import DoDisturbIcon from "@mui/icons-material/DoDisturb";
export default function StatCards({ stateCardData }) {
  //console.log("----stateCardData----", stateCardData);
  return (
    <>
      {stateCardData && (
        <div className={styles.stat_cards_wrapper}>
          <div className={`${styles.stat_card} ${styles.gradient_blue}`}>
            <div className={styles.icon_sec}>
              <div className={styles.material_icons}>
                <TimelineRounded />
                {/* <img src={`/images/sales1.png`} alt="Logo" /> */}
              </div>
              <p>Sale</p>
            </div>
            <div className={styles.stat_sec}>
              <h5>{stateCardData.saleBox[0].Salecnt}</h5>
              <p>{"₹" + stateCardData.saleBox[0].Saleamt}</p>
            </div>
          </div>
          <div className={`${styles.stat_card} ${styles.gradient_pink}`}>
            <div className={styles.icon_sec}>
              <div className={styles.material_icons}>
                <MoreHorizRounded />
                {/* <img
                  src={`/images/pending1.png`}
                  alt="Logo"
                  height="40px"
                  width="auto"
                /> */}
              </div>
              <p>Pending</p>
            </div>
            <div className={styles.stat_sec}>
              <h5>{stateCardData.pending[0].Pendingcnt}</h5>
              <p>{"₹" + stateCardData.pending[0].pendingamt}</p>
            </div>
          </div>
          <div className={`${styles.stat_card} ${styles.gradient_orange}`}>
            <div className={styles.icon_sec}>
              <div className={styles.material_icons}>
                {/* <Timeline /> */}
                <CancelRounded />
                {/* <img src={`/images/cancelled-white.png`} alt="Logo" /> */}
              </div>
              <p>Cancelled</p>
            </div>
            <div className={styles.stat_sec}>
              <h5>{stateCardData.cancelled[0].cancelcnt}</h5>
              <p>{"₹" + stateCardData.cancelled[0].cancelamt}</p>
            </div>
          </div>
          <div className={`${styles.stat_card} ${styles.gradient_green}`}>
            <div className={styles.icon_sec}>
              <div className={styles.material_icons}>
                <ErrorRounded />
                {/* <img src={`/images/failed1.png`} alt="Logo" /> */}
              </div>
              <p>Failed</p>
            </div>
            <div className={styles.stat_sec}>
              <h5>0</h5>
              <p>₹0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

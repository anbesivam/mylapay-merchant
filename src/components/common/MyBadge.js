import React from "react";

export default function MyBadge({ badgeText }) {
  let tcolor = "#0288d1";
  let bg = "#e1f5fe";

  switch (badgeText) {
    case "Track":
      tcolor = "#0288d1";
      bg = "#e1f5fe";

      break;
    case "Captured":
      tcolor = "#4caf50";
      bg = "#e8f5e9";

      break;
    case "Settled":
      tcolor = "#ffffff";
      bg = "rgb(62, 195, 18)";

      break;  
    case "Settlement in progress":
      tcolor = "white";
      bg = "rgb(235 155 35)";

      break; 
    case "order to be closed":
      tcolor = "white";
      bg = "rgb(30 191 183)";

    break;
    case "Refunded":
      tcolor = "white";
      bg = "rgb(62, 195, 18)";

      break;

    case "Refund in progress":
      tcolor = "white";
      bg = "rgb(235, 155, 35)";

      break; 
    case "orange":
      tcolor = "#ff9800";
      bg = "#fff3e0";

      break;
    case "Failed":
      tcolor = "#ff5252";
      bg = "#ffebea";

      break;
    case "Authorized":
      tcolor = "#333";
      bg = "#e0e0e0";

      break;
    case "F":
      tcolor = "#ff5252";
      bg = "#ffebea";

      break;
    case "S":
      tcolor = "#4caf50";
      bg = "#e8f5e9";

      break;
    case "Failure":
      tcolor = "#ff5252";
      bg = "#ffebea";

      break;
    case "Success":
      tcolor = "#4caf50";
      bg = "#e8f5e9";

      break;
    default:
      tcolor = "#0288d1";
      bg = "#e1f5fe";

      break;
  }

  return (
    <>
      {
        badgeText === "Settled" || badgeText === "order to be closed" || badgeText === "Settlement in progress"  || badgeText === "Refunded" || badgeText === "Refund in progress"? (
          <div
            style={{
              padding: ".5em 1em",
              lineHeight: 1,
              fontSize: "0.9em",
              display: "inline-flex",
              alignItems: "center",
              boxSizing: "border-box",
              color: tcolor,
              backgroundColor: bg,
            }}
          >
            {badgeText}
          </div>
        ): (
          <div
            style={{
              padding: ".5em 1em",
              lineHeight: 1,
              fontSize: "0.9em",
              borderRadius: "99px",
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid",
              boxSizing: "border-box",
              color: tcolor,
              backgroundColor: bg,
            }}
          >
            {badgeText}
          </div>    
        )
      }
      
    </>  
  );
}

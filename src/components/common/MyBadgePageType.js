import React from "react";

export default function MyBadgePageType({ badgeText }) {
  let tcolor = "#0288d1";
  let bg = "#e1f5fe";

  switch (badgeText) {
    case "Online Store":
      tcolor = "#0288d1";
      bg = "#e1f5fe";

      break;

    case "Payment Webpage":
      tcolor = "rgb(255, 255, 255)";
      bg = "rgb(62, 195, 18)";

      break;  

    case "Quick Pay":
      tcolor = "rgb(255, 255, 255)";
      bg = "rgb(62, 195, 18)";

      break;  

    case "Success":
      tcolor = "rgb(255, 255, 255)";
      bg = "rgb(62, 195, 18)";

      break;       

    case "Failure":
      tcolor = "rgb(255, 255, 255)";
      bg = "red";

      break;         

    default:
      tcolor = "#0288d1";
      bg = "#e1f5fe";

      break;
  }

  return (
    <div
      style={{
        backgroundColor: bg,
        color: tcolor,
        borderRadius: "0px",
        fontSize: "13px",
        padding: "5px",
        textAlign: "center"
      }}
    >
      {badgeText}
    </div>
  );
}

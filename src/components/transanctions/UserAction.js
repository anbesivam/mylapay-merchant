import { Button } from "@material-ui/core";
import React from "react";

export default function UserAction(props) {
  return (
    <div>
      {props.value.includes("Refund") && (
        <Button
          style={{
            color: "#fff",
          }}
          size="small"
          color="secondary"
          variant="contained"
          disableElevation
        >
          Refund
        </Button>
      )}
      {props.value.includes("Capture") && (
        <Button
          style={{
            borderColor: "#357a38",
            backgroundColor: "#357a38",
            color: "#fff",
          }}
          size="small"
          variant="contained"
          disableElevation
        >
          Capture
        </Button>
      )}
      {props.value.includes("Void") && (
        <Button
          style={{
            marginLeft: "0.75em",
            borderColor: "#f44336",
            backgroundColor: "#f44336",
            color: "#fff",
          }}
          size="small"
          variant="contained"
          disableElevation
        >
          Void
        </Button>
      )}
    </div>
  );
}

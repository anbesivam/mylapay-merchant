import { Box } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import React from "react";

export default function QtyBox({ max, qty, handleQty, product }) {
  return (
    <>
      <Box
        style={{
          display: "inline-flex",
          flexWrap: "nowrap",
          alignItems: "center",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <button
          style={{
            background: "#fff",
            border: "none",
            cursor: "pointer",
            padding: "0.5em .75em",
            borderRight: "1px solid rgba(0,0,0,0.15)",
          }}
          type="button"
          onClick={() => {
            if (qty > 1) handleQty(qty - 1, product);
          }}
        >
          <Remove style={{ fontSize: "18px" }} />
        </button>
        <input
          style={{
            border: "none",
            background: "#fff",
            height: "100%",
            maxHeight: "auto",
            textAlign: "center",
            minWidth: "2.5em",
            pointerEvents: "none",
          }}
          value={qty}
          readOnly
          className="qty-box"
          type="number"
          step="1"
          min="0"
          max={max}
        />
        <button
          style={{
            background: "#fff",
            border: "none",
            cursor: "pointer",
            padding: "0.5em .75em",
            borderLeft: "1px solid rgba(0,0,0,0.15)",
          }}
          type="button"
          onClick={() => {
            if (qty < max) handleQty(qty + 1, product);
          }}
        >
          <Add style={{ fontSize: "18px" }} />
        </button>
      </Box>
    </>
  );
}

import { Box, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import React from "react";

export default function ProductCard({ product, shoplink }) {
  const { REACT_APP_SHOPAPI_URL } = process.env;

  return (
    <Link
      target="_blank"
      to={`/shop/${shoplink}/${product.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Box
        style={{
          borderRadius: "0.5em",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <Box className="product-card-img">
          <img
            src={`${REACT_APP_SHOPAPI_URL}/uploads${product.product_image}`}
            alt={product.product_name}
          />
        </Box>
        <Box p={2}>
          <Typography style={{ color: "#9e9e9e" }} variant="body2">
            {product.catogoryName}
          </Typography>
          <Typography gutterBottom variant="h5">
            {product.product_name}
          </Typography>
          <Typography style={{ fontWeight: "normal" }} variant="h6">
            ₹{product.price}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

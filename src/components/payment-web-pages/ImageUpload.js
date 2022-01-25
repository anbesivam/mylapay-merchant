import { Box, Typography } from "@material-ui/core";
import { Image } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function ImageUpload(props) {
  const [fileString, setFileString] = useState(props.value);
  const handleChange = (e) => {
    if (e.target.files.length === 0) return;

    let file = e.currentTarget.files[0];

    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setFileString(reader.result);
        props.setLogo(file);
        document.querySelector(
          "#shop_logo_image_label"
        ).style.backgroundImage = `url(${reader.result})`;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (props.value === null || props.value === "") return;
    // const reader = new FileReader();

    // console.log("reader null check : " + reader)

    // reader.addEventListener(
    //   "load",
    //   function () {
    //     setFileString(reader.result);
    //     document.getElementById(
    //       "shop_logo_image_label"
    //     ).style.backgroundImage = `url(${reader.result})`;
    //   },
    //   false
    // );
    // if (props.value) {
    //   reader.readAsDataURL(props.value);
    // }
  }, [props.value]);

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/svg, image/gif"
        name="shop_logo_image"
        id="shop_logo_image"
        className="fileupload"
        onChange={handleChange}
      />
      <label
        htmlFor="shop_logo_image"
        id="shop_logo_image_label"
        variant="outlined"
        style={{
          width: "145px",
          height: "145px",
          border: "1px solid ",
          borderColor: props.error ? "#f44336" : "rgba(0, 0, 0, 0.23)",
          borderRadius: "4px",
          padding: "14px",
          textAlign: "center",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {fileString == null ? (
          <>
            <Image style={{ fontSize: "32px", color: "#757575" }} />
            <Box
              style={{
                fontSize: "16px",
                color: props.error ? "#f44336" : "#757575",
              }}
            >
              Shop Logo
            </Box>
          </>
        ) : (
          <Typography
            variant="body2"
            style={{
              position: "absolute",
              left: "6px",
              top: "-0.8em",
              background: "#fff",
              display: "inline-flex",
              padding: "0 5px",
              fontSize: "12px",
              color: "#757575",
            }}
          >
            Shop Logo
          </Typography>
        )}
      </label>
      {props.helperText && (
        <p
          className={`MuiFormHelperText-root MuiFormHelperText-contained ${
            props.error ? "Mui-error" : ""
          }`}
          id={`${props.name}-helper-text`}
        >
          {props.helperText}
        </p>
      )}
    </>
  );
}

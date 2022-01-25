import { Typography } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function BannerFileUpload(props) {
  const [inputLabel, setInputLabel] = useState("Choose a file");

  const handleChange = (e) => {

    console.log("Image changing")
    if (e.target.files.length === 0) return;
    props.setfile(e, props.name);

    e.target.value = ''

  };

  useEffect(() => {
    let el = document.querySelectorAll(".fileupload-label");
    el.forEach((item) => {
      let labSpan = item.querySelector("span");
      labSpan.style.width = item.offsetWidth - 60 + "px";
    });
  });

  // useEffect(() => {
  //   if (props.value == null) {
  //     setInputLabel("Choose a file");
  //   } else {
  //     setInputLabel(props.value.name);
  //   }
  // }, [props.value]);

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/svg, image/gif"
        name={props.name}
        id={props.id}
        onclick={null}
        className="fileupload"
        // onChange={handleChange}
        // onClick={handleChange}
        onChange={(e) => {
          handleChange(e);
          // uploader(e);
        }}
      />
      <label
        className={`fileupload-label ${props.error ? "error" : ""}`}
        htmlFor={props.name}
        style={{ overflow: "visible" }}
      >
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
          Banner Image Upload
        </Typography>
        <span>{inputLabel}</span>
        <AttachFile className="fileupload-label-icon" />
      </label>
      {props.helperText && (
        <p
          className={`MuiFormHelperText-root MuiFormHelperText-contained ${
            props.error ? "Mui-error" : ""
          }`}
        >
          {props.helperText}
        </p>
      )}
    </>
  );
}

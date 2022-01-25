import { Typography } from "@material-ui/core";
import { AttachFile } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function CategoryFileUpload(props) {
  const [inputLabel, setInputLabel] = useState("Choose a file");

  const handleChange = (e) => {

    console.log("Props Name : " + props.name)
    if (e.target.files.length === 0) return;

    props.setfile(e, props.name);
    
  };

  useEffect(() => {
    let el = document.querySelectorAll(".fileupload-label");
    el.forEach((item) => {
      let labSpan = item.querySelector("span");
      labSpan.style.width = item.offsetWidth - 60 + "px";
    });
  });

  useEffect(() => {
    if (props.value == null) {
      setInputLabel("Choose a file");
    } else {
      setInputLabel(props.value.name);
    }
  }, [props.value]);

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        name={props.name}
        id={props.id}
        className="fileupload"
        onChange={handleChange}
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
          Category Image
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

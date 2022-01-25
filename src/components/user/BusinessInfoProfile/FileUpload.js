import { AttachFile } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function FileUpload(props) {
  const [inputLabel, setInputLabel] = useState("Choose a file");

  const handleChange = (e) => {
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
    if (props.value == null) return;
    setInputLabel(props.value.name);
  }, [props.value]);

  return (
    <>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/gif, application/pdf"
        name={props.name}
        id={props.id}
        className="fileupload"
        onChange={handleChange}
      />
      <label
        className={`fileupload-label ${props.error ? "error" : ""}`}
        htmlFor={props.name}
      >
        <span>{inputLabel}</span>
        <AttachFile className="fileupload-label-icon" />
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

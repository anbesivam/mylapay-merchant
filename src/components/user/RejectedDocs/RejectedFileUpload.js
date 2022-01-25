import { OpenInNew } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function RejectedFileUpload(props) {
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
        name={props.name}
        id={props.id}
        className="fileupload"
        onChange={handleChange}
      />
      <span
        className={`rejected-fileupload-wrap ${props.error ? "error" : ""}`}
      >
        <label className="rejected-fileupload-label" htmlFor={props.name}>
          <span>{inputLabel}</span>
        </label>
        <a
          href={props.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="fileupload-label-icon"
          style={{ color: "#555" }}
        >
          <OpenInNew />
        </a>
      </span>
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

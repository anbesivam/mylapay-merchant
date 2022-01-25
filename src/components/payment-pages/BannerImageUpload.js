import { Box,Grid, Typography, FormGroup, IconButton } from "@material-ui/core";

import { Image, Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

export default function BannerImageUpload(props) {
  const [fileString, setFileString] = useState(props.value);

  const [imagevalue, setImagesvalue] = useState([]);


  const fileToDataUri = (image) => {
    return new Promise((res) => {
      const reader = new FileReader();
      const {type, name, size} = image;
      reader.addEventListener('load', () => {
          res({
              base64: reader.result,
              name: name,
              type,
              size: size,
          })
      });
      reader.readAsDataURL(image);
    })
  }

  const fileSelectedHandler = async (e) => {


    if (e.target.files && e.target.files.length > 0) {
        const newImagesPromises = []
        for (let i = 0; i < e.target.files.length; i++) {
            newImagesPromises.push(fileToDataUri(e.target.files[i]))
        }
        const newImages = await Promise.all(newImagesPromises)
        setImagesvalue([...imagevalue, ...newImages])

        props.setBannerimage(e.target.files);
    }
    e.target.value = "";
  }


  function deleteFile(e) {
    const s = imagevalue.filter((item, index) => index !== e);
    setImagesvalue(s);
    console.log(s);
  }

  const handleChangeimage = (e) => {

    console.log("Uploaded files not working : ")
  }

  const handleChange = (e) => {
    if (e.target.files.length === 0) return;

    console.log("Uploaded files : " + JSON.stringify(e.currentTarget.files))

    let file = e.currentTarget.files;

    setImagesvalue(e.currentTarget.files)

    for(var i=0; i<=file.length; i++)
    {
      const reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          // convert image file to base64 string
          setFileString(reader.result);
          props.setBannerimage(file);
          document.querySelector(
            '#banner_image_label' + i
          ).style.backgroundImage = `url(${reader.result})`;
        },
        false
      );
      if (file[i]) {
        reader.readAsDataURL(file[i]);
      }
    }

    
  };

  const handleSliderImages = (e) => {
    // if (e.target.files) {
    // // setProducts({ ...products, slider_images: [...e.target.files] });
    // props.setSliderimage(e.target.files);
    // }
    console.log("Update slider images");
  };

  useEffect(() => {
    if (props.value == null || props.value === "") return;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        setFileString(reader.result);
        document.querySelector(
          "#banner_image_label"
        ).style.backgroundImage = `url(${reader.result})`;
      },
      false
    );
    if (props.value) {
      reader.readAsDataURL(props.value);
    }
  }, [props.value]);

  return (
    <>

      <form>

        
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/svg, image/gif"
          name="banner_image"
          id="banner_image"
          className="fileupload"
          onChange={fileSelectedHandler}
        />

        <label
          htmlFor="banner_image"
          id="banner_image_label"
          variant="outlined"
          style={{
            width: "120px",
            height: "120px",
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

            <Image style={{ fontSize: "32px", color: "#757575" }} />
            <Box
              style={{
                fontSize: "16px",
                color: props.error ? "#f44336" : "#757575",
              }}
            >
              Upload Banner Image
            </Box>


          </label>


          {/* <div className="form-group preview">

          <Grid container spacing={2}>
            {imagevalue.length > 0 &&
              imagevalue.map((item, index) => {
                return (
                  <div key={index} >

                
                  <Grid item xs={12}>

                    <Box mb={4} mt={2}>

                      <img width="150" height="100" style={{float:"left", border:"1px solid rgba(0, 0, 0, 0.23)", borderRadius:"4px", marginRight:"6px"}} src={item.base64} alt="" />

                    </Box>

                    <Box mb={4} textAlign="center">
                      <IconButton color="primary" onClick={() => deleteFile(index)} component="span">
                        <Cancel />
                      </IconButton>

                    </Box>

                  </Grid>
                  </div>
                );
              })}
              </Grid>
          </div> */}

      </form>


      
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

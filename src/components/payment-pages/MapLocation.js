import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { InfoWindow, withScriptjs, withGoogleMap } from "react-google-maps";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByLatLng,
} from "react-google-places-autocomplete";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MyLocation } from "@material-ui/icons";
import axios from "axios";
import toast from "react-hot-toast";
export default function LocationStep({
  setActiveStep,
  setSelectedAddress,
  center,
  setCenter,
}) {
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("This is an alert");
  const [alertType, setAlertType] = useState("info");
  const [mapAddress, setMapAddress] = useState(null);
  const GOOGLE_MAPS_API_KEY = "AIzaSyBsORy7g4HSEZlIZFNLtY6-VtLaNdS_gjI";
  const [map, setMap] = useState(null);
  // const [center, setCenter] = useState({
  //   lat: 13.058036876104014,
  //   lng: 80.25821622454173,
  // });
  const [libraries] = useState(["places"]);
  const [showMap, setShowMap] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [zoom, setZoom] = useState(16);

  function throwError(msg) {
    setAlert(true);
    setAlertType("error");
    setAlertMsg(msg);
  }

  function getLocation() {
    setAlert(false);
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      throwError("Geolocation is not supported by this browser.");
      setGettingLocation(false);
    }
  }

  function showPosition(position) {
    setShowMap(true);
    setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setZoom(18);
    setGettingLocation(false);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        throwError("Location request denied.");
        // x.innerHTML = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        throwError("Location information is unavailable.");
        // x.innerHTML = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        throwError("The request to get user location timed out.");
        // x.innerHTML = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        throwError("An unknown error occurred.");
        // x.innerHTML = "An unknown error occurred.";
        break;
    }
    setGettingLocation(false);
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (!mapAddress) return;
    console.log("map address is selected...", mapAddress);
    setShowMap(true);

    geocodeByAddress(mapAddress.label)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log("Successfully got latitude and longitude", { lat, lng });
        setShowMap(true);
        setCenter({ lat, lng });
      });
  }, [mapAddress]);

  const containerStyle = {
    width: "552px",
    height: "300px",
  };
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
    map.setZoom(zoom);
  }, []);
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getAddressFromLatLng = async (lat, lng) => {
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then((res) => {
        console.log(res.data.results[0].formatted_address);
        setMapAddress(res.data.results[0].formatted_address);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markerChange = (e) => {
    // console.log(e.latLng.lat());
    // console.log(e.latLng.lng());
    setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    // getAddressFromLatLng(e.latLng.lat(), e.latLng.lng());
    geocodeByLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      .then((results) => {
        setMapAddress({
          label: results[0].formatted_address,
          value: results[0],
        });
        console.log(results);
      })
      .catch((error) => console.error(error));
  };

  const updateGeoCode = async () => {
    if (mapAddress === null) return;
        if (mapAddress.value.formatted_address)
      setSelectedAddress(mapAddress.value.formatted_address);
    else setSelectedAddress(mapAddress.label);

    setActiveStep(2);
    // await axios
    //   .post("/mylapay/shop/update/shop_latlng", {
    //     latitude: center.lat,
    //     longitude: center.lng,
    //   })
    //   .then((response) => {
    //     if (response.data.status === 1) {
    //       toast.success("Location Updated Successfully!");

    //       setActiveStep(2);
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error("Something went wrong");
    //     console.log(error);
    //   });
  };
  return (
    <div style={{ minWidth: "552px" }}>
      {isLoaded ? (
        <GooglePlacesAutocomplete
          selectProps={{
            placeholder: "Search for an area, location name",
            mapAddress,
            onChange: setMapAddress,
            label: "Search for an area",
            styles: {
              input: (provided) => ({
                ...provided,
                color: "#000",
              }),
              option: (provided) => ({
                ...provided,
                fontSize: "0.8em",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#888",
              }),
            },
          }}
          autocompletionRequest={{
            componentRestrictions: {
              country: "in",
            },
          }}
        />
      ) : (
        <></>
      )}

      <Box
        display="flex"
        alignItems="center"
        py={2}
        style={{ cursor: "pointer" }}
        onClick={getLocation}
      >
        <MyLocation color="secondary" style={{ marginRight: "0.5em" }} />
        <Typography variant="body2">Use current location</Typography>
      </Box>

      {/* <pre>{mapAddress && JSON.stringify(mapAddress.label, null, 2)}</pre> */}
      <Collapse style={{ marginBottom: "1em" }} in={alert}>
        <Alert
          onClose={() => {
            setAlert(false);
          }}
          severity={alertType}
        >
          {alertMsg}
        </Alert>
      </Collapse>
      {isLoaded && showMap ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          // onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            keyboardShortcuts: false,
          }}
        >
          <Marker onDragEnd={markerChange} position={center} draggable></Marker>
        </GoogleMap>
      ) : (
        <></>
      )}

      <Box display="flex" py={2} justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={() => {
            updateGeoCode();
          }}
        >
          Next
        </Button>
      </Box>

      <Backdrop
        sx={{ color: "#fff" }}
        style={{
          position: "absolute",
          zIndex: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
        open={gettingLocation}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

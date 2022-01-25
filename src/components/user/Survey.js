import React, { useEffect, useState } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const mobRegex = /^\d{10}$/;

export default function Survey({ showSurvey, setShowSurvey }) {
  const [surveyValue, setSurveyValue] = useState(null);
  const [surveyOptions, setSurveyOptions] = useState(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong.");
  const [surveyMobileError, setSurveyMobileError] = useState(false);
  const [surveyNameError, setSurveyNameError] = useState(false);
  const [surveyName, setSurveyName] = useState("");
  const [surveyMobile, setSurveyMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { REACT_APP_API_URL } = process.env;

  const handleChange = (event) => {
    setSurveyValue(event.target.value);
    setSurveyMobileError(false);
    setSurveyNameError(false);
    // setSurveyMobile("");
    // setSurveyName("");
  };

  const getOptions = async () => {
    await axios
      .get(`${REACT_APP_API_URL}/mylapay/registration/get/survey`)
      .then((response) => {
        if (response.data.status === 1) {
          setSurveyOptions(response.data.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    // Check for Radio button select
    if (surveyValue === null) {
      if (error === true) return;
      setErrorMsg("Please select an option");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }

    // Check for Mobile and Name
    if (surveyValue !== "2" && (!surveyName || !surveyMobile)) {
      if (!surveyName) setSurveyNameError(true);
      if (!surveyMobile) setSurveyMobileError(true);
      return;
    }
    if (surveyValue !== "2" && !mobRegex.test(surveyMobile)) {
      setSurveyMobileError(true);
      return;
    }

    // Submit to api
    await axios
      .post(`${REACT_APP_API_URL}/mylapay/registration/survey`, {
        iRef: parseInt(surveyValue),
        name: surveyName,
        mobile_no: surveyMobile,
      })
      .then((response) => {
        if (response.data.status === 1) {
          history.push("/post-boarding");
        } else {
          setErrorMsg(response.data.data);
          setError(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(true);
          if (error.response.data.message) {
            setErrorMsg(error.response.data.message);
          } else {
            setErrorMsg(error.response.statusText);
          }
        } else {
          setError(true);
          setErrorMsg(error);
        }
      });
    setLoading(false);
  };
  const skip = async () => {
    history.push("/post-boarding");
  }
  return (
    <>
      <Dialog open={showSurvey} TransitionComponent={Transition} keepMounted>
        <DialogTitle>How did you come to know about Mylapay?</DialogTitle>
        <DialogContent>
          {surveyOptions && (
            <RadioGroup
              name="surveyReferral"
              value={surveyValue}
              onChange={handleChange}
            >
              {surveyOptions.map((item) => (
                <React.Fragment key={item.iRef}>
                  <FormControlLabel
                    value={item.iRef.toString()}
                    control={<Radio />}
                    label={item.refName}
                  />
                  {surveyValue === item.iRef.toString() && surveyValue !== "2" && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={surveyName}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setSurveyNameError(true);
                            } else {
                              setSurveyNameError(false);
                            }
                            setSurveyName(e.target.value);
                          }}
                          size="small"
                          fullWidth
                          variant="outlined"
                          label="Name"
                          id="survey_name"
                          error={surveyNameError}
                          helperText={surveyNameError && "Enter a name"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          value={surveyMobile}
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setSurveyMobileError(true);
                            } else {
                              setSurveyMobileError(false);
                            }
                            if (!mobRegex.test(e.target.value)) {
                              setSurveyMobileError(true);
                            }
                            setSurveyMobile(e.target.value);
                          }}
                          size="small"
                          fullWidth
                          variant="outlined"
                          label="Mobile No."
                          id="survey_mobile"
                          error={surveyMobileError}
                          helperText={
                            surveyMobileError && "Enter a valid phone number"
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </RadioGroup>
          )}
          <Collapse in={error}>
            <Box mt={2}>
              <Alert severity="error">{errorMsg}</Alert>
            </Box>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={skip}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : "Skip"}
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            color="primary"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

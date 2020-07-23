import React, { createContext, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Slide from "@material-ui/core/Slide";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
// Alert component with React.forwardRef function for passing ref to slide animation
const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />
));
// Transition component with slide animation
const TransitionRight = (props) => <Slide {...props} direction="left" />;

export const FeedbackContext = createContext({
  triggerAlert: () => {},
  showLoadingScreen: () => {},
});

const FeedbackProvider = ({ children }) => {
  const [alertMsg, setAlertMsg] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const showLoadingScreen = (bool) => setLoading(bool);

  const closeAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
  };

  const triggerAlert = (severity, msg) => {
    setShowAlert(true);
    setAlertSeverity(severity);
    setAlertMsg(msg);
  };

  return (
    <FeedbackContext.Provider value={{ triggerAlert, showLoadingScreen }}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert}
        autoHideDuration={4000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={TransitionRight}
      >
        <Alert onClose={closeAlert} severity={alertSeverity}>
          {alertMsg}
        </Alert>
      </Snackbar>
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackProvider;

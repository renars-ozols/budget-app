import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import logo from "../../assets/logo.png";

const LoadingScreen = () => {
  return (
    <div>
      <LinearProgress />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={logo} alt="Logo" style={{ width: "50%" }} />;
      </div>
    </div>
  );
};

export default LoadingScreen;

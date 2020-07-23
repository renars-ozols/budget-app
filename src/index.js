import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import UserProvider from "./providers/user.provider";
import BudgetProvider from "./providers/budget.provider";
import AlertProvider from "./providers/feedback.provider";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <UserProvider>
    <BudgetProvider>
      <AlertProvider>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </AlertProvider>
    </BudgetProvider>
  </UserProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

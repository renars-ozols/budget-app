import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { UserContext } from "./providers/user.provider";
import HomePage from "./pages/homepage/homepage.component";
import ForgotPassword from "./pages/forgot-password/forgot-password.component";
import SignUp from "./pages/sign-up/sign-up.component";
import Budgets from "./pages/budgets/budgets.component";
import Reports from "./pages/reports/reports.component";
import Profile from "./pages/profile/profile.component";
import { isUserLoggedIn } from "./api";
import LoadingWelcome from "./components/loading-welcome/loading-welcome.component";

const App = () => {
  const { user, currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      setLoading(true);
      const res = await isUserLoggedIn();
      if (res.data) currentUser(res.data);
      setLoading(false);
    };
    checkIfUserIsLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingWelcome />;

  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (user ? <Redirect to="/budgets" /> : <HomePage />)}
      />
      <Route
        exact
        path="/forgot-password"
        component={() =>
          user ? <Redirect to="/budgets" /> : <ForgotPassword />
        }
      />
      <Route
        exact
        path="/signup"
        component={() => (user ? <Redirect to="/budgets" /> : <SignUp />)}
      />
      <Route
        exact
        path="/budgets"
        component={() => (user ? <Budgets /> : <Redirect to="/" />)}
      />
      <Route
        exact
        path="/reports"
        component={() => (user ? <Reports /> : <Redirect to="/" />)}
      />
      <Route
        exact
        path="/profile"
        component={() => (user ? <Profile /> : <Redirect to="/" />)}
      />
    </Switch>
  );
};

export default App;

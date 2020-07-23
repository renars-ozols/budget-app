import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Image from "../../assets/money.jpg";
import Copyright from "../../components/copyright/copyright.componet";

import { UserContext } from "../../providers/user.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { Formik } from "formik";
import * as Yup from "yup";
import { login } from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -11,
    marginLeft: -12,
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { triggerAlert } = useContext(FeedbackContext);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              password: Yup.string().required("Required"),
            })}
            onSubmit={async (values) => {
              setLoading(true);
              const res = await login(values);
              setLoading(false);
              if (res.data) {
                currentUser(res.data.user);
                triggerAlert("success", "successfully logged in");
              } else {
                triggerAlert("error", res.error);
              }
            }}
          >
            {({
              values,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
            }) => (
              <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errors.email && touched.email && errors.email}
                  error={touched.email && errors.email ? true : false}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.password && touched.password && errors.password
                  }
                  error={touched.password && errors.password ? true : false}
                  autoComplete="current-password"
                />
                <div className={classes.btnWrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={30}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
                <Grid container>
                  <Grid item xs>
                    <Link
                      to="/forgot-password"
                      variant="body2"
                      component={RouterLink}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup" variant="body2" component={RouterLink}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Box mt={5}>
                  <Copyright />
                </Box>
              </form>
            )}
          </Formik>
        </div>
      </Grid>
    </Grid>
  );
}

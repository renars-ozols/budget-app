import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Copyright from "../../components/copyright/copyright.componet";

import { UserContext } from "../../providers/user.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { Formik } from "formik";
import * as Yup from "yup";
import { signUp } from "../../api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
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

export default function SignUp() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { triggerAlert } = useContext(FeedbackContext);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password should be atleast 8 characters")
              .required("Required"),
            passwordConfirm: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords doesn't match")
              .required("Required"),
          })}
          onSubmit={async (values) => {
            setLoading(true);
            const res = await signUp(values);
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.name && touched.name && errors.name}
                    error={touched.name && errors.name ? true : false}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
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
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    id="passwordConfirm"
                    value={values.passwordConfirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.passwordConfirm &&
                      touched.passwordConfirm &&
                      errors.passwordConfirm
                    }
                    error={
                      touched.passwordConfirm && errors.passwordConfirm
                        ? true
                        : false
                    }
                    autoComplete="current-password"
                  />
                </Grid>
              </Grid>
              <div className={classes.btnWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={loading}
                >
                  Sign Up
                </Button>
                {loading && (
                  <CircularProgress
                    size={30}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link to="/" variant="body2" component={RouterLink}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

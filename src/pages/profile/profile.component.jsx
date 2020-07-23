import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { UserContext } from "../../providers/user.provider";
import { BudgetContext } from "../../providers/budget.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  updateCurrentUser,
  updateCurrentUserPassword,
  deleteMe,
} from "../../api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
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
    margin: theme.spacing(1.3, 0, 2),
  },
  btnWrapper: {
    position: "relative",
    width: "100%",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -11,
    marginLeft: -12,
  },
  input: {
    display: "none",
  },
  image: {
    borderRadius: 4,
  },
}));
const Profile = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState("");
  const { currentUser, user } = useContext(UserContext);
  const { addBudget, resetDate } = useContext(BudgetContext);
  const { triggerAlert } = useContext(FeedbackContext);
  const [image, setImage] = useState(user.photo);

  const handleFileUpload = (event) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile Settings
          </Typography>
          <Formik
            initialValues={{
              name: user.name,
              email: user.email,
              photo: user.photo,
            }}
            validationSchema={Yup.object({
              name: Yup.string().required("Required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Required"),
              photo: Yup.mixed().required("Required"),
            })}
            onSubmit={async (values) => {
              setLoading(true);
              const form = new FormData();
              for (let [key, value] of Object.entries(values)) {
                form.append(key, value);
              }
              const res = await updateCurrentUser(form);
              if (res.data) {
                setLoading(false);
                currentUser(res.data.user);
                triggerAlert("success", "successfully updated profile");
                return;
              }
              if (res.error) {
                setLoading(false);
                triggerAlert("error", res.error);
                return;
              }
              setLoading(false);
              triggerAlert("error", "Something went wrong!");
            }}
          >
            {({
              values,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              errors,
              setFieldValue,
            }) => (
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit}
                encType="multipart/form-data"
              >
                <Grid container spacing={2} alignItems="center">
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
                  <Grid item xs={6}>
                    <img
                      src={image}
                      alt={values.photo ? values.photo.name : "profile pic"}
                      className={classes.image}
                      height={200}
                      width={200}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <input
                      name="photo"
                      accept="image/*"
                      className={classes.input}
                      id="upload-image"
                      type="file"
                      onChange={(event) => {
                        setFieldValue("photo", event.currentTarget.files[0]);
                        handleFileUpload(event);
                      }}
                    />
                    <label htmlFor="upload-image">
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                      >
                        Upload new photo
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                <div className={classes.btnWrapper}>
                  <Button
                    type="submit"
                    name="profile"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading && target === "profile"}
                    onClick={(e) => setTarget(e.currentTarget.name)}
                  >
                    Change settings
                  </Button>
                  {loading && target === "profile" && (
                    <CircularProgress
                      size={30}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </form>
            )}
          </Formik>
        </div>
        <Divider />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Password Change
          </Typography>
          <Formik
            initialValues={{
              passwordCurrent: "",
              password: "",
              passwordConfirm: "",
            }}
            validationSchema={Yup.object({
              passwordCurrent: Yup.string().required("Required"),
              password: Yup.string()
                .min(8, "Password should be atleast 8 characters")
                .required("Required"),
              passwordConfirm: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords doesn't match")
                .required("Required"),
            })}
            onSubmit={async (values) => {
              setLoading(true);
              const res = await updateCurrentUserPassword(values);
              if (res.data) {
                setLoading(false);
                triggerAlert("success", "successfully updated password");
                return;
              }
              if (res.error) {
                setLoading(false);
                triggerAlert("error", res.error);
                return;
              }
              setLoading(false);
              triggerAlert("error", "Something went wrong!");
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
              <form
                className={classes.form}
                noValidate
                onSubmit={handleSubmit}
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="passwordCurrent"
                      label="Current Password"
                      type="password"
                      id="passwordCurrent"
                      value={values.passwordCurrent}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.passwordCurrent &&
                        touched.passwordCurrent &&
                        errors.passwordCurrent
                      }
                      error={
                        touched.passwordCurrent && errors.passwordCurrent
                          ? true
                          : false
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="passbmhh-123456"
                      variant="outlined"
                      fullWidth
                      name="password"
                      label="New Password"
                      type="password"
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        errors.password && touched.password && errors.password
                      }
                      error={touched.password && errors.password ? true : false}
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
                    />
                  </Grid>
                </Grid>
                <div className={classes.btnWrapper}>
                  <Button
                    type="submit"
                    name="password"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loading && target === "password"}
                    onClick={(e) => setTarget(e.currentTarget.name)}
                  >
                    Change password
                  </Button>
                  {loading && target === "password" && (
                    <CircularProgress
                      size={30}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </form>
            )}
          </Formik>
          <div className={classes.btnWrapper}>
            <Button
              name="deleteMe"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              disabled={loading && target === "deleteMe"}
              onClick={async (e) => {
                setTarget(e.currentTarget.name);
                const res = await deleteMe();
                if (res.error) {
                  triggerAlert("error", res.error);
                } else {
                  currentUser(undefined);
                  addBudget(undefined);
                  resetDate();
                }
              }}
            >
              Delete account
            </Button>
            {loading && target === "deleteMe" && (
              <CircularProgress size={30} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Profile;

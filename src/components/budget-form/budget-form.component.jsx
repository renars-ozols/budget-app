import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import { BudgetContext } from "../../providers/budget.provider";
import { addBudgetItem } from "../../api";
import { FeedbackContext } from "../../providers/feedback.provider";

const useStyles = makeStyles((theme) => ({
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -18,
    marginLeft: -12,
  },
}));

const BudgetForm = () => {
  const classes = useStyles();
  const { date, addBudget } = useContext(BudgetContext);
  const { triggerAlert } = useContext(FeedbackContext);
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{ type: "income", description: "", value: "" }}
      validationSchema={Yup.object({
        type: Yup.string().oneOf(["income", "expenses"]).required("Required"),
        description: Yup.string().required("Required"),
        value: Yup.number()
          .required("Required")
          .test("Decimal 2 spaces", "Invalid value", (val) => {
            const regex = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g;
            return regex.test(val);
          }),
      })}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setFieldValue }) => {
        setLoading(true);
        const formData = { date, ...values };
        const { type } = values;
        const res = await addBudgetItem(formData);
        if (res.data) {
          setLoading(false);
          addBudget(res.data);
          //resetForm({type: type}); couldn't get this to work so alternative is below
          setFieldValue("type", type);
          setFieldValue("description", "", false);
          setFieldValue("value", "", false);
          triggerAlert(
            "success",
            `${type === "income" ? "Income" : "Expense"} created successfully`
          );
          return;
        }
        if (res.error) {
          setLoading(false);
          triggerAlert("error", res.error);
          return;
        }
        setLoading(false);
        triggerAlert(
          "error",
          "Something went wrong! Please contact administration."
        );
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
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <FormControl>
            <InputLabel id="select">Type</InputLabel>
            <Select
              name="type"
              labelId="select"
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expenses">Expense</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            name="description"
            InputLabelProps={{
              shrink: true,
            }}
            error={touched.description && errors.description ? true : false}
            helperText={touched.description ? errors.description : null}
          />
          <TextField
            label="Value"
            type="number"
            name="value"
            value={values.value}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            }}
            error={touched.value && errors.value ? true : false}
            helperText={touched.value ? errors.value : null}
          />
          <div className={classes.btnWrapper}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Save
            </Button>
            {loading && (
              <CircularProgress size={30} className={classes.buttonProgress} />
            )}
          </div>
        </form>
      )}
    </Formik>
  );
};

export default BudgetForm;

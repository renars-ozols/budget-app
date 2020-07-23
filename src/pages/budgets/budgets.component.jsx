import React, { useContext, useEffect, useCallback } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { BudgetContext } from "../../providers/budget.provider";
import { UserContext } from "../../providers/user.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import BudgetForm from "../../components/budget-form/budget-form.component";
import BudgetItemList from "../../components/budget-item-list/budget-item-list.component";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import IncExpChart from "../../components/inc-exp-chart/inc-exp-chart.component";
import { getBudgetByDate } from "../../api";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  paperCalendar: {
    overflow: "hidden",
  },
  fixedHeight: {
    height: 304,
  },
}));

const Budgets = () => {
  const { date, changeDate, addBudget, resetDate } = useContext(BudgetContext);
  const { user } = useContext(UserContext);
  const { triggerAlert, showLoadingScreen } = useContext(FeedbackContext);
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const dateHandler = useCallback(async (date) => {
    showLoadingScreen(true);
    const res = await getBudgetByDate(date);
    if (res.data) {
      changeDate(new Date(date));
      addBudget(res.data);
      showLoadingScreen(false);
      return;
    }
    if (res.error) {
      showLoadingScreen(false);
      triggerAlert("error", res.error);
      return;
    }
    changeDate(new Date(date));
    addBudget(undefined);
    showLoadingScreen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // NOTE --- first effect is being triggered again on logout, triggering extra unnecessary request! Should be fixed!
  useEffect(() => {
    if (user) {
      dateHandler(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateHandler, date]);

  useEffect(() => {
    return () => {
      resetDate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={7}>
          <Paper className={fixedHeightPaper}>
            <IncExpChart />
          </Paper>
        </Grid>
        {/* Calendar */}
        <Grid item xs={12} md={4} lg={5}>
          <Paper className={classes.paperCalendar}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                autoOk
                orientation="landscape"
                variant="static"
                openTo="date"
                value={date}
                onChange={dateHandler}
                disableFuture
              />
            </MuiPickersUtilsProvider>
          </Paper>
        </Grid>
        {/* Budget Form */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <BudgetForm />
          </Paper>
        </Grid>
        {/* Income and Expenses List*/}
        <Grid item xs={12}>
          <BudgetItemList />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Budgets;

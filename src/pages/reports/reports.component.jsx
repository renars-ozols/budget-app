import React, { useState, useEffect, useCallback, useContext } from "react";
import DashboardLayout from "../../components/layouts/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Grid from "@material-ui/core/Grid";
import Title from "../../components/title/title.component";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green, red } from "@material-ui/core/colors";
import { BudgetContext } from "../../providers/budget.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { getYearlyData, getYears } from "../../api";

const defaultData = [
  {
    month: "January",
    income: 0,
    expenses: 0,
  },
  {
    month: "February",
    income: 0,
    expenses: 0,
  },
  {
    month: "March",
    income: 0,
    expenses: 0,
  },
  {
    month: "April",
    income: 0,
    expenses: 0,
  },
  {
    month: "May",
    income: 0,
    expenses: 0,
  },
  {
    month: "June",
    income: 0,
    expenses: 0,
  },
  {
    month: "July",
    income: 0,
    expenses: 0,
  },
  {
    month: "August",
    income: 0,
    expenses: 0,
  },
  {
    month: "September",
    income: 0,
    expenses: 0,
  },
  {
    month: "October",
    income: 0,
    expenses: 0,
  },
  {
    month: "November",
    income: 0,
    expenses: 0,
  },
  {
    month: "December",
    income: 0,
    expenses: 0,
  },
];

const Reports = () => {
  const { date } = useContext(BudgetContext);
  const { triggerAlert, showLoadingScreen } = useContext(FeedbackContext);
  const [year, setYear] = useState(date.split("-")[0]);
  const [data, setData] = useState(defaultData);
  const [yearlyBudget, setYearlyBudget] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const handleGetYears = async () => {
    setLoading(true);
    const res = await getYears();
    if (res.data) {
      setLoading(false);
      setOptions(res.data.map((el) => el.year.toString()));
      return;
    }
    if (res.error) {
      setLoading(false);
      triggerAlert("error", res.error);
      return;
    }
    setLoading(false);
    triggerAlert("error", "Something went wrong!");
  };
  const mergeData = useCallback(async () => {
    showLoadingScreen(true);
    const res = await getYearlyData(year);
    if (res.data && res.data.length > 0) {
      const { budgets } = res.data[0];
      const merged = [];
      defaultData.forEach((el) => {
        const index = budgets.findIndex((el2) => el2.month === el.month);
        if (index === -1) merged.push(el);
        else merged.push(budgets[index]);
      });
      setData(merged);
      setYearlyBudget(res.data[0].yearlyBudget);
      showLoadingScreen(false);
      return;
    }
    if (res.error) {
      showLoadingScreen(false);
      triggerAlert("error", res.error);
      return;
    }
    showLoadingScreen(false);
    // eslint-disable-next-line
  }, [year]);

  useEffect(() => {
    mergeData();
  }, [mergeData]);
  return (
    <DashboardLayout>
      <Grid container justify="center" alignItems="center">
        <Autocomplete
          id="report-year"
          style={{ width: 200 }}
          open={open}
          defaultValue={year}
          onOpen={() => {
            setOpen(true);
            handleGetYears();
          }}
          onClose={() => {
            setOpen(false);
          }}
          onChange={(e, value) => {
            if (value !== null) setYear(value);
          }}
          getOptionSelected={(option, value) => option === value}
          getOptionLabel={(option) => option}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Year"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Title
          align="center"
          variant="h4"
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Budget
        </Title>
        <Title
          align="center"
          style={{ color: yearlyBudget >= 0 ? green[500] : red[500] }}
          variant="h4"
        >
          {yearlyBudget > 0
            ? `+${yearlyBudget.toFixed(2)}€`
            : `${yearlyBudget.toFixed(2)}€`}
        </Title>
      </Grid>
      <BarChart
        width={1000}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill={green[500]} style={{ marginTop: 10 }} />
        <Bar dataKey="expenses" fill={red[500]} />
      </BarChart>
    </DashboardLayout>
  );
};

export default Reports;

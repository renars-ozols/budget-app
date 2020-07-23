import React, { useContext } from "react";
import clsx from "clsx";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Title from "../title/title.component";
import Divider from "@material-ui/core/Divider";
import { BudgetContext } from "../../providers/budget.provider";

const useStyles = makeStyles((theme) => ({
  grid: {
    height: "100%",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  greenBox: {
    width: 10,
    height: 10,
    marginRight: theme.spacing(2),
    background: green[500],
  },
  redBox: {
    background: red[500],
  },
  marginTop: {
    marginTop: theme.spacing(6),
  },
}));

const renderCustomizedLabel = ({ x, y, name, percent }) => {
  return (
    <text
      x={x}
      y={y}
      fill={name === "Income" ? green[500] : red[500]}
      textAnchor={x > y ? "start" : "end"}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Chart = ({ onPieEnter }) => {
  const { budget } = useContext(BudgetContext);
  const classes = useStyles();
  const redBox = clsx(classes.greenBox, classes.redBox);
  const flexWithMargin = clsx(classes.flex, classes.marginTop);
  const COLORS = [green[500], red[500]];
  const data = [
    { name: "Income", value: budget ? budget.totalIncome : 0 },
    { name: "Expenses", value: budget ? budget.totalExpenses : 0 },
  ];

  return (
    <Grid container className={classes.grid}>
      <Grid item xs={7}>
        <ResponsiveContainer>
          <PieChart onMouseEnter={onPieEnter}>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={renderCustomizedLabel}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={5}>
        <Title align="center" variant="h4">
          Budget
        </Title>
        <Divider />
        {budget && (
          <>
            <Title
              align="center"
              style={{ color: budget.budget >= 0 ? green[500] : red[500] }}
              variant="h4"
            >
              {budget.budget > 0
                ? `+${budget.budget.toFixed(2)}€`
                : `${budget.budget.toFixed(2)}€`}
            </Title>
            <div className={flexWithMargin}>
              <div className={classes.greenBox}></div>
              <Title align="center" gutterBottom={false} variant="subtitle2">
                Total income
              </Title>
              <Title
                align="center"
                gutterBottom={false}
                variant="subtitle2"
                style={{ color: green[500], marginLeft: "24px" }}
              >
                {budget.totalIncome > 0
                  ? `+${budget.totalIncome.toFixed(2)}€`
                  : 0}
              </Title>
            </div>
            <div className={classes.flex}>
              <div className={redBox}></div>
              <Title align="center" gutterBottom={false} variant="subtitle2">
                Total expenses
              </Title>
              <Title
                align="center"
                gutterBottom={false}
                variant="subtitle2"
                style={{ color: red[500], marginLeft: "10px" }}
              >
                {budget.totalExpenses > 0
                  ? `-${budget.totalExpenses.toFixed(2)}€`
                  : 0}
              </Title>
            </div>
          </>
        )}
      </Grid>
    </Grid>
  );
};

const IncExpChart = React.memo(Chart);
export default IncExpChart;

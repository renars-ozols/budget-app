import React, { useContext, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { green, red } from "@material-ui/core/colors";

import { BudgetContext } from "../../providers/budget.provider";
import { FeedbackContext } from "../../providers/feedback.provider";
import { removeBudgetItem } from "../../api";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const BudgetItemList = () => {
  const classes = useStyles();
  const [target, setTarget] = useState("");
  const { budget, addBudget } = useContext(BudgetContext);
  const { triggerAlert } = useContext(FeedbackContext);
  const [loading, setLoading] = useState(false);

  const removeBudgetItemHandler = async (budgetId, data) => {
    setLoading(true);
    setTarget(data.id);
    const res = await removeBudgetItem(budgetId, data);
    if (res.data || res.data === undefined) {
      setLoading(false);
      addBudget(res.data);
      triggerAlert(
        "success",
        `${data.type === "income" ? "Income" : "Expense"} removed successfully`
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
      "Something went wrong! Please contact administration"
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Typography
            component="h2"
            variant="h6"
            style={{ color: green[500] }}
            gutterBottom
          >
            Income
          </Typography>
          <List>
            {budget &&
              budget.income.map((el) => {
                const data = { type: "income", id: el._id };
                return (
                  <div key={el._id}>
                    <Divider />

                    <ListItem>
                      <ListItemText
                        primary={`+ ${el.value.toFixed(2)}€`}
                        style={{
                          marginRight: `40px`,
                          color: green[500],
                        }}
                      />
                      <ListItemText primary={el.description} />
                      <ListItemSecondaryAction>
                        <IconButton
                          name={data.id}
                          edge="end"
                          aria-label="delete"
                          disabled={loading && target === data.id}
                          onClick={() =>
                            removeBudgetItemHandler(budget._id, data)
                          }
                        >
                          {loading && target === data.id ? (
                            <CircularProgress size={30} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                );
              })}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Typography
            component="h2"
            variant="h6"
            style={{ color: red[500] }}
            gutterBottom
          >
            Expenses
          </Typography>
          <List>
            {budget &&
              budget.expenses.map((el) => {
                const data = { type: "expenses", id: el._id };
                return (
                  <div key={el._id}>
                    <Divider />
                    <ListItem>
                      <ListItemText
                        primary={`- ${el.value.toFixed(2)}€`}
                        style={{
                          marginRight: `40px`,
                          color: red[500],
                        }}
                      />
                      <ListItemText primary={el.description} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          disabled={loading && target === data.id}
                          onClick={() =>
                            removeBudgetItemHandler(budget._id, data)
                          }
                        >
                          {loading && target === data.id ? (
                            <CircularProgress size={30} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </div>
                );
              })}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default BudgetItemList;

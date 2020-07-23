import React, { createContext, useState } from "react";

import { format } from "date-fns";

export const BudgetContext = createContext({
  budget: undefined,
  date: undefined,
  addBudget: () => {},
  changeDate: () => {},
  resetDate: () => {},
});

const BudgetProvider = ({ children }) => {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [budget, setBudget] = useState(undefined);

  const addBudget = (budget) => setBudget(budget);
  const changeDate = (date) => setDate(format(date, "yyyy-MM-dd"));
  const resetDate = () => setDate(format(new Date(), "yyyy-MM-dd"));
  return (
    <BudgetContext.Provider
      value={{ date, changeDate, resetDate, budget, addBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;

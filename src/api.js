import axios from "axios";

axios.defaults.baseURL = "/api/v1/";

const resolve = async (promise) => {
  const resolved = {
    data: null,
    error: null,
  };

  try {
    const data = await promise;
    resolved.data = data.data.data;
  } catch (e) {
    resolved.error = e.response.data.message;
  }
  return resolved;
};

// **** AUTHENTICATION **** //

export const login = async (values) => {
  return await resolve(axios.post("users/login", values));
};

export const signUp = async (values) => {
  return await resolve(axios.post("users/signup", values));
};

export const logout = async () => {
  return await resolve(axios.get("users/logout"));
};

// **** BUDGET **** //

export const getBudgetByDate = async (date) => {
  return await resolve(axios.get(`budgets/${date}`));
};

export const addBudgetItem = async (data) => {
  return await resolve(axios.put(`budgets`, data));
};

export const removeBudgetItem = async (budgetId, data) => {
  return await resolve(axios.patch(`budgets/${budgetId}`, data));
};

export const getYears = async () => {
  return await resolve(axios.get("budgets/get-years"));
};

export const getYearlyData = async (year) => {
  return await resolve(axios.get(`budgets/get-yearly-data/${year}`));
};

// **** USER **** //

export const updateCurrentUser = async (values) => {
  return await resolve(axios.patch("users/updateMe", values));
};

export const updateCurrentUserPassword = async (values) => {
  return await resolve(axios.patch("users/updateMyPassword", values));
};

export const isUserLoggedIn = async () => {
  return await resolve(axios.get("users/is-logged-in"));
};

export const forgotPassword = async (email) => {
  return await resolve(axios.post("users/forgotPassword", email));
};

export const deleteMe = async () => {
  return await resolve(axios.delete("users/deleteMe"));
};

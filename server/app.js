const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const budgetRouter = require("./routes/budgetRoutes");

const app = express();

app.enable("trust proxy");
// GLOBAL MIDDLEWARES
app.use(cors());
app.options("*", cors());
// Static files
app.use(express.static(path.join(__dirname, "../build")));
app.use(express.static(path.join(__dirname, "../public")));
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Compression
app.use(compression());

// API routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/budgets", budgetRouter);
app.all("/api*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// React app
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
app.use(globalErrorHandler);

module.exports = app;

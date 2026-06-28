import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

// Run after express-validator chains to collect and throw validation errors
// in the same ApiError shape used everywhere else in the app.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  throw new ApiError(422, "Validation failed", formatted);
};

export default validate;

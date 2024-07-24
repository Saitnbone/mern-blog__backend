// Импорты
// Imports
import { validationResult } from "express-validator";

// Мидлвар для проверки на наличие ошибок
// Middleware for checking for errors
export default (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

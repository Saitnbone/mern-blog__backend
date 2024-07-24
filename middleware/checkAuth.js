// Импорты
// Imports
import jwt from "jsonwebtoken";

// Мидлвар для получения информации о пользователе
// Middleware to get user information
export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded._id;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    res.status(403).json({
      message: "Нет доступа",
    });
  }
};

// Импорты
import { body } from "express-validator";

//  Настройка для валидации формы авторизации
export const regValidation = [
  body("email", "Поле должно содержать адрес почты").isEmail(),
  body("password", "Пароль должен быть не менее 5 символов").isLength({
    min: 5,
  }),
  body("fullName", "Длина не менее двух символов").isLength({ min: 2 }),
  body("avatarUrl", "Некорректная ссылка").optional().isURL(),
];

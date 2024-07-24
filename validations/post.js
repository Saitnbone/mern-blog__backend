// Импорты
// Imports
import { body } from "express-validator";

// Настройка для валидации поста
// Settings for post validation
export const postValidation = [
  body("title", "Укажите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Укажите теги для статьи").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];

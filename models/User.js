// Импорты
import mongoose from "mongoose";

// Схема пользователя
const UserSchema = new mongoose.Schema(
  {
    // Настройка для имени пользователя
    fullName: {
      type: String,
      required: true,
    },
    // Настройка для почты пользователя
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Настройка для пароля пользователя
    passwordHash: {
      type: String,
      required: true,
    },
    // Настройки для аватара пользователя
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

// Экспорт схемы пользователя
export default mongoose.model("User", UserSchema);

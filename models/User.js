// Импорты
// Imports 
import mongoose from "mongoose";

// Схема пользователя
// User schema
const UserSchema = new mongoose.Schema(
  {
    // Настройка для имени пользователя
    // Setting for username
    fullName: {
      type: String,
      required: true,
    },

    // Настройка для почты пользователя
    // Settings for user mail
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Настройка для пароля пользователя
    // Setting for user password
    passwordHash: {
      type: String,
      required: true,
    },

    // Настройки для аватара пользователя
    // User avatar settings
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);

// Экспорт схемы пользователя
// Export user schema
export default mongoose.model("User", UserSchema);

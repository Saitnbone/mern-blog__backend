// Импорты
// Imports
import mongoose from "mongoose";

// Схема пользователя
// User schema
const PostSchema = new mongoose.Schema(
  {
    // Настройка для заголовка поста
    // Post title setting
    title: {
      type: String,
      required: true,
    },

    // Настройка для текста поста
    // Settings for post text
    text: {
      type: String,
      required: true,
    },

    // Настройка для тегов поста
    // Setting for post tags
    tags: {
      type: Array,
      default: [],
    },

    // Настройка для указания количества просмотров
    // Setting to specify the number of views
    viewsCount: {
      type: Number,
      default: 0,
    },

    // Настройка для автора поста
    // Settings for the post author
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Настройки для изображения поста
    // Post image settings
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

// Экспорт схемы пользователя
// Export user schema
export default mongoose.model("Post", PostSchema);

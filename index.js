// Импорты пакетов для проекта
// Importing packages for a project
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Импорт компонентов
// Import components
import { regValidation } from "./validations/registration.js";
import { postValidation } from "./validations/post.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import checkAuth from "./middleware/checkAuth.js";

dotenv.config();

const mongoDB = process.env.MONGODB_URI;

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log("Connect DB");
  })
  .catch((error) => {
    console.log("DB error", error);
  });

// Создание приложения express.js
// Create an express.js application
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Авторизация пользователей
// User authorization
app.post("/auth/login", UserController.loginUser);

// Регистрация новых пользователей
// Register new users
app.post("/auth/registration", regValidation, UserController.registrationUser);

// Запрос на получение информации о себе
// Request for information about yourself
app.get("/auth/me", checkAuth, UserController.getUser);

// Запрос на получение всех постов
app.get("/posts", PostController.getAllPosts);

// Запрос на получение одного поста
app.get("/posts/:id", PostController.getOnePost);

// запрос на создание поста
app.post("/posts", checkAuth, postValidation, PostController.createPost);

// Запрос на удаление поста
app.delete("/posts/:id", checkAuth, PostController.deletePost);

// Запрос на редактирование поста
app.patch('/posts/:id', checkAuth, PostController.changePost)

// Слушатель порта
// Port listener
app.listen(4444, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server status OK");
  }
});

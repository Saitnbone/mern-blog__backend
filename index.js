// Импорты пакетов для проекта
// Importing packages for a project
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer, { diskStorage } from "multer";

// Импорт компонентов
// Import components
import { regValidation } from "./validations/registration.js";
import { postValidation } from "./validations/post.js";
import { UserController, PostController } from "./controllers/index.js";
import checkAuth from "./middleware/checkAuth.js";
import handleErrors from "./middleware/handleErrors.js";

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

// Настройки для multer
// Settings for multer
const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    cd(null, "uploads");
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Авторизация пользователей
// User authorization
app.post("/auth/login", checkAuth, handleErrors, UserController.loginUser);

// Регистрация новых пользователей
// Register new users
app.post(
  "/auth/registration",
  checkAuth,
  handleErrors,
  UserController.registrationUser
);

// Запрос на получение информации о себе
// Request for information about yourself
app.get("/auth/me", checkAuth, UserController.getUser);

// Запрос на размещение картинок
// Request to post pictures
app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Запрос на получение всех постов
// Request to get all posts
app.get("/posts", PostController.getAllPosts);

// Запрос на получение одного поста
// Request to receive one post
app.get("/posts/:id", PostController.getOnePost);

// Запрос на создание поста
// Request to create a post
app.post("/posts", checkAuth, postValidation, PostController.createPost);

// Запрос на удаление поста
// Request to delete a post
app.delete("/posts/:id", checkAuth, handleErrors, PostController.deletePost);

// Запрос на редактирование поста
// Request to edit post
app.patch("/posts/:id", checkAuth, handleErrors, PostController.changePost);

// Слушатель порта
// Port listener
app.listen(4444, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server status OK");
  }
});

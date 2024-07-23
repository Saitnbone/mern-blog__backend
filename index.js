// Импорты для проекта
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

// Импорт компонентов
import { regValidation } from "./validations/registration.js";
import User from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";

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

// Создание приложения express
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Авторизация пользователей
app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "Wrong login or password",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Wrong login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    return res.json({ user, token });
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: "Failed to authorization",
    });
  }
});

// Регистрация новых пользователей
app.post("/auth/registration", regValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, avatarUrl } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Шифрование пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Подготовка документа пользователя
    const doc = new User({
      email,
      fullName,
      avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    // Токен шифрования
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to register",
    });
  }
});

// Запрос на получение информации о себе
app.get("/auth/me", checkAuth, (req, res) => {
  try {
    return res.json({
      message: "true",
    });
  } catch (error) {
    console.log(error);
  }
});

// Слушатель порта
app.listen(4444, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server status OK");
  }
});

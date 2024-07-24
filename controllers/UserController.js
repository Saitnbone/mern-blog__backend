// Импорты
// Imports
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

// Контроллер для регистрации пользователя
// Controller for user registration
export const registrationUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, avatarUrl } = req.body;

    // Проверка на наличие email в базе данных
    // Checking for email presence in the database
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Шифрование пароля
    // Password encryption
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Подготовка документа пользователя
    // Preparing a user document
    const doc = new User({
      email,
      fullName,
      avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    // Токен шифрования
    // Encryption token
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
};

// Контроллер для логирования пользователя
// Controller for user logging
export const loginUser = async (req, res) => {
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
};

// Контроллер для получения информации о пользователе
// Controller for getting user information
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({});
  }
};

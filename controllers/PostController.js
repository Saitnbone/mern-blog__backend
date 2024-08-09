// Импорты
// Imports
import Post from "../models/Post.js";

// Контроллер для создания поста
// Controller for creating a post
export const createPost = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
    });
    console.log(error);
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Error getting tags",
    });
    console.log(error);
  }
};

// Контроллер для получения всех постов
// Controller to get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Posts not found",
    });
  }
};

// Контроллер для получения одного поста
// Controller for receiving one post
export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    );

    if (!doc) {
      return res.status(404).json({
        message: "Updeted post not found",
      });
    }
    return res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Post not found",
    });
  }
};

// Контроллер для изменения поста
// Controller for changing position
export const changePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    };
    const result = await Post.updateOne({ _id: postId }, { $set: updateData });
    if (!result) {
      return res.status(404).json({
        message: "Post not found or data not modified",
      });
    }
    return res.status(200).json({
      message: "Post updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Контроллер для удаления поста
// Controller for deleting a post
export const deletePost = async (req, res) => {
  try {
    const postId = await req.params.id;

    const doc = await Post.findByIdAndDelete(postId);

    if (!doc) {
      return res.status(404).json({
        message: "Post to be deleted was not found",
      });
    }
    return res.status(200).json({
      message: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete the post",
    });
  }
};

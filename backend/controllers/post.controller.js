import Post from "../models/post.model.js";
import User from "../models/user.model.js";
// import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.type === "client") {
      return res
        .status(401)
        .json({ message: "Clients are not allowed to create post" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // creates the new post
    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    // saves the new post to db
    await newPost.save();

    // returns the new post
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

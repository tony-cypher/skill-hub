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

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const workedFor = async (req, res) => {
  try {
    const clientId = req.params.id;
    const userId = req.user._id;

    const client = await User.findById(clientId);
    const user = await User.findById(userId);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (user.type === "client") {
      return res
        .status(401)
        .json({ message: "Only Artisans can work for a client." });
    }

    if (userId.toString() === clientId) {
      return res.status(401).json({ error: "You can't work for yourself" });
    }

    const hasWorkedFor = user.workedFor.includes(clientId);

    if (hasWorkedFor) {
      return res
        .status(409)
        .json({ message: "This client already a customer" });
    } else {
      user.workedFor.push(clientId);
      await user.save();

      // sends notification to client to like or comment on post

      // save notification

      const updatedWorkedFor = user.workedFor;
      res.status(200).json(updatedWorkedFor);
    }
  } catch (error) {
    console.log("Error in workedFor controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // gets the post owner
    const postUser = await User.findById(post.user);

    // checks if req.user is a customer
    const isUserACustomer = postUser.workedFor.includes(userId);

    if (!isUserACustomer) {
      return res.status(401).json({ message: "Only customers can like post" });
    }

    // checks if the req.user id is in the post.likes array
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // removes the req.user's id from the post.likes array if it exists
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

      // removes the post id from user's liked posts array
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter((id) => {
        id.toString() !== userId.toString();
      });
      res.status(200).json(updatedLikes);
    } else {
      // adds the req.user's id in the post.likes array if not exists
      post.likes.push(userId);

      // adds post's id to the user's liked post array
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      // saves the post
      await post.save();

      // creates a new like notification

      // saves the notification

      // returns a success message
      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in LikeUnlikePost controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

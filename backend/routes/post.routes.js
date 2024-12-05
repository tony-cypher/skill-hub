import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  workedFor,
  likeUnlikePost,
  commentOnPost,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts); // get all posts
router.get("/user/:username", protectRoute, getUserPosts); // get artisan's posts
router.post("/create", protectRoute, createPost); // create post (artisans only)
router.post("/update/:id", protectRoute, updatePost);
router.post("/worked/:id", protectRoute, workedFor); // gets artisans customers
router.post("/like/:id", protectRoute, likeUnlikePost); // like and unlike post
router.post("/comment/:id", protectRoute, commentOnPost); // comment on post (satisfied clients)
router.delete("/delete/:id", protectRoute, deletePost); // delete post

export default router;

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
  getCategory,
  getCategoryPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts); // get all posts
router.get("/category", protectRoute, getCategory);
router.get("/user/:username", protectRoute, getUserPosts); // get artisan's posts
router.get("/category/:category", protectRoute, getCategoryPosts);
router.post("/create", protectRoute, createPost); // create post (artisans only)
router.post("/update/:id", protectRoute, updatePost);
router.post("/worked/:id", protectRoute, workedFor); // gets artisans customers
router.post("/like/:id", protectRoute, likeUnlikePost); // like and unlike post
router.post("/comment/:id", protectRoute, commentOnPost); // comment on post (satisfied clients)
router.delete("/delete/:id", protectRoute, deletePost); // delete post

export default router;

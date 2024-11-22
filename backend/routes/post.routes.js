import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  workedFor,
  likeUnlikePost,
  commentOnPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
// router.get("/likedposts/:id", protectRoute, getLikedPosts);
// router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/worked/:id", protectRoute, workedFor);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
// router.delete("/delete/:id", protectRoute, deletePost);

export default router;

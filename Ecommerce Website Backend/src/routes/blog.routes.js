import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostByAuthor,
  getPostByCategory,
  getPostById,
  getPostByTag,
  getRecentPost,
  getRelatedPosts,
  publishPost,
  searchPost,
  unpublishPost,
  updatePost,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/getallposts").get(getAllPosts);
router.route("/getpostbyid").get(getPostById);
router.route("/createpost").post(upload.single("image"), createPost);
router.route("/updatepost").post(updatePost);
router.route("/deletepost").delete(deletePost);
router.route("/getpostbycategory").get(getPostByCategory);
router.route("/getpostbytag").get(getPostByTag);
router.route("/getpostbyauthor").get(getPostByAuthor);
router.route("/searchpost").get(searchPost);
router.route("/getrecentpost").get(getRecentPost);
router.route("/getrelatedposts").get(getRelatedPosts);
router.route("/publishpost").post(publishPost);
router.route("/unpublishpost").post(unpublishPost);

export default router;

import { Router } from "express";
import { createRating, deleteRating, getAllRatings, getAverageRating, getHighestRatedProducts, getLowestRatedProducts, getMostRatedProducts, getRatingById, getRecentRatings, getUserRatings, updateRating } from "../controllers/ratings.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/getallratings").get(getAllRatings);
router.route("/getratingbyid").get(getRatingById);
router.route("/createrating").post(upload.single("reviewImages"), createRating);
router.route("/updaterating").post(updateRating);
router.route("/deleterating").delete(deleteRating);
router.route("/getaveragerating").get(getAverageRating);
router.route("/getuserratings").get(getUserRatings);
router.route("/getrecentratings").get(getRecentRatings);
router.route("/getmostratedproducts").get(getMostRatedProducts);
router.route("/gethighestratedproduct").get(getHighestRatedProducts);
router.route("/getlowestratedproduct").get(getLowestRatedProducts);

export default router
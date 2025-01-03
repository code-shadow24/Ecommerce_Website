import { Router } from "express";
import { addToWishlist, getWishlistCount, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = new Router();

router.route("/addtowishlist").post(addToWishlist);
router.route("/removefromwishlist").post(removeFromWishlist);
router.route("/getwishlistcount").get(getWishlistCount);

export default router;
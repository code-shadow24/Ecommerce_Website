import { Router } from "express";
import {
  addToCart,
  applyCoupon,
  calculateCartSubTotal,
  calculateCartTotal,
  clearCart,
  getCart,
  getTaxAmount,
  removeFromCart,
  removeOneItem,
  updateOneItem,
} from "../controllers/cart.controller.js";

const router = new Router();

router.route("/getcart").get(getCart);
router.route("/addtocart").post(addToCart);
router.route("/removefromcart").post(removeFromCart);
router.route("/clearcart").post(clearCart);
router.route("/updateoneItem").post(updateOneItem);
router.route("/removeoneitem").post(removeOneItem);
router.route("/calculatecarttotal").post(calculateCartTotal);
router.route("/calculatecartsubtotal").post(calculateCartSubTotal);
router.route("/applycoupon").post(applyCoupon);
router.route("/gettaxamount").get(getTaxAmount);

export default router;

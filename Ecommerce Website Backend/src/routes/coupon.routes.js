import { Router } from "express";
import { createCoupon, deleteCoupon, getAllCoupons, getCouponById, getExpiredCoupons, getValidCoupons, updateCoupon } from "../controllers/coupon.controller.js";

const router = new Router();

router.route("/getallcoupons").get(getAllCoupons);
router.route("/getcouponbyid").get(getCouponById)
router.route("/createnewcoupon").post(createCoupon)
router.route("/updatecoupon").post(updateCoupon)
router.route("/deletecoupon").delete(deleteCoupon)
router.route("/getvalidcoupon").get(getValidCoupons);
router.route("/getexpiredcoupon").get(getExpiredCoupons);
router.route("/getactivecoupon").get(getActiveCoupons);

export default router;
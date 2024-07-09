import { Router } from "express";
import { deleteSellerAccount, getAllSellers, getCurrentSeller, getSellerById, getSellerDetail, getSellerOrders, getSellerProducts, loginSeller, logOut, refreshSellerAccessToken, registerSeller, updateAvatar, updateDetails } from "../controllers/seller.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { updateAddress } from "../controllers/address.controller.js";

const router = new Router();

router.route("/register").post(upload.single("avatar"), registerSeller);
router.route("/login").post(loginSeller);
router.route("/updateaddress").post(updateAddress);
router.route("/logout").post(logOut);
router.route("/getcurrentseller").get(getCurrentSeller);
router.route("/updatedetails").post(updateDetails);
router.route("/updateavatar").post(upload.single("avatar"), updateAvatar);
router.route("/getsellerdetail").get(getSellerDetail);
router.route("/refreshselleraccesstoken").post(refreshSellerAccessToken);
router.route("/deleteselleraccount").delete(deleteSellerAccount);
router.route("/getallsellers").get(getAllSellers);
router.route("/getsellerbyid").get(getSellerById);
router.route("/getsellerproducts").get(getSellerProducts);
router.route("/getsellerorders").get(getSellerOrders);

export default router;

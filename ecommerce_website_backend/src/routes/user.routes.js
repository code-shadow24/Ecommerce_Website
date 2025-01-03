import { Router } from "express";
import { registerUser, loginUser, logOut, getCurrentUser, updateDetails, changeAvatar, getUserDetails, deleteUser, refreshAccessToken, getUserById, getAllUsers, resetUserPassword, getUserOrders, getUserAddress, getUserWishlist, getUserReviews } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logOut);
router.route("/getcurrentuser").get(getCurrentUser);
router.route("/updatedetails").post(updateDetails);
router.route('/changeavatar').post(upload.single("avatar"), changeAvatar);
router.route("/getuserdetails").get(getUserDetails);
router.route("/deleteuser").delete(deleteUser);
router.route("/refreshaccesstoken").post(refreshAccessToken);
router.route("/getuserbyid").get(getUserById);
router.route("/getallusers").get(getAllUsers);
router.route("/resetuserpassword").post(resetUserPassword);
router.route("/getuserorders").get(getUserOrders);
router.route("/getuseraddress").get(getUserAddress);
router.route("/getuserwishlist").get(getUserWishlist);
router.route("/getuserreviews").get(getUserReviews);

export default router;

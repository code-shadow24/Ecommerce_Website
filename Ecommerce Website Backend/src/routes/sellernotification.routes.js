import { Router } from "express";
import { getAllSellerNotification, getUnreadSellerNotification, markAllSellerNotificationAsRead, markSellerNotificationAsRead, sendSellerEmailNotification } from "../controllers/sellernotification.controller.js";

const router = new Router();

router.route("getallsellernotification").get(getAllSellerNotification);
router.route("/getunreadsellernotification").get(getUnreadSellerNotification);
router.route("/marksellernotificationasread").post(markSellerNotificationAsRead);
router.route("/markallsellernotificationasread").post(markAllSellerNotificationAsRead);
router.route("/sendselleremailnotification").post(sendSellerEmailNotification);

export default router
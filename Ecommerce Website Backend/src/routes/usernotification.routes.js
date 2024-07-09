import { Router } from "express";
import { deleteNotification, disableNotifications, enableNotifications, getAllNotifications, getUnreadNotifications, markAllNotificationsAsRead, markNotificationsAsRead, sendEmailNotification } from "../controllers/usernotification.controller.js";

const router = new Router();

router.route("/getallnotifications").get(getAllNotifications);
router.route("/getunreadnotifications").get(getUnreadNotifications);
router.route("/marknotificationasread").post(markNotificationsAsRead);
router.route("/markallnotificationasread").post(markAllNotificationsAsRead);
router.route("/deletenotification").delete(deleteNotification);
router.route("/sendemailnotification").post(sendEmailNotification);
router.route("/enablenotifications").post(enableNotifications);
router.route("/disablenotification").post(disableNotifications)

export default router;
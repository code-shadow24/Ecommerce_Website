import { Router } from "express";
import {
  clearLogs,
  createAdminActivityLog,
  createSellerActivityLog,
  createUserActivityLog,
  deleteLog,
  getActiveLogs,
  getAllAdminLogs,
  getAllLogs,
  getAllSellerLogs,
  getAllUserLogs,
  getLogByAdminId,
  getLogBySellerId,
  getLogByUserId,
  getLogsByAction,
  getLogsByTimeStamps,
  updateAdminLog,
  updateSellerLog,
  updateUserLog,
} from "../controllers/activitylog.controller.js";

const router = new Router();

router.route("/getalllogs").get(getAllLogs);
router.route("/getalluserlogs").get(getAllUserLogs);
router.route("/getallsellerlogs").get(getAllSellerLogs);
router.route("/getalladminlogs").get(getAllAdminLogs);
router.route("/getlogbyuserid").get(getLogByUserId);
router.route("/getlogbysellerid").get(getLogBySellerId);
router.route("/getlogbyadminid").get(getLogByAdminId);
router.route("/createuseractivitylog").post(createUserActivityLog);
router.route("/createselleractivitylog").post(createSellerActivityLog);
router.route("/createadminactivitylog").post(createAdminActivityLog);
router.route("/updateuserlog").post(updateUserLog);
router.route("/updatesellerlog").post(updateSellerLog);
router.route("/updateadminlog").post(updateAdminLog);
router.route("/deletelog").delete(deleteLog);
router.route("/getlogsbyaction").get(getLogsByAction);
router.route("/getlogsbytimestamps").get(getLogsByTimeStamps);
router.route("/clearlogs").delete(clearLogs);
router.route("getactivelogs").get(getActiveLogs);

export default router;

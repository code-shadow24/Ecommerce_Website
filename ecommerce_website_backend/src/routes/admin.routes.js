import { Router } from "express";
import {
  changeRole,
  createAdmin,
  deleteAdmin,
  enableAdmin,
  generateReports,
  getAdminActivity,
  getAdminById,
  getAllAdmins,
  loginAdmin,
  logoutAdmin,
  resetPassword,
  suspendAdmin,
  updateAdmin,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/getalladmin").get(getAllAdmins);
router.route("/getadminbyid").get(getAdminById);
router.route("/createadmin").post(upload.single("profilePicture"), createAdmin);
router.route("/updateadmin").post(updateAdmin);
router.route("/deleteadmin").delete(deleteAdmin);
router.route("/loginadmin").post(loginAdmin);
router.route("/logoutadmin").post(logoutAdmin);
router.route("/resetpassword").post(resetPassword);
router.route("/changerole").post(changeRole);
router.route("/getadminactivity").get(getAdminActivity);
router.route("/suspendadmin").post(suspendAdmin);
router.route("/enableAdmin").post(enableAdmin);
router.route("/generatereports").post(generateReports);

export default router;

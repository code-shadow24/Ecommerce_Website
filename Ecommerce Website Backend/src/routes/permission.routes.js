import { Router } from "express";
import { ActivatePermission, DeactivatePermission, createPermission, deletePermission, getAllPermissions, getPermissionbyId, makePermissionGlobal, makePermissionLocal, updatePermission } from "../controllers/permission.controller.js";

const router = new Router();

router.route("/getallpermissions").get(getAllPermissions);
router.route("/getpermissionbyid").get(getPermissionbyId);
router.route("/createpermission").post(createPermission);
router.route("/updatepermission").post(updatePermission);
router.route("/deletepermission").delete(deletePermission);
router.route("/makepermissionglobal").post(makePermissionGlobal);
router.route("/makepermissionlocal").post(makePermissionLocal);
router.route("/activatepermission").post(ActivatePermission);
router.route("/deactivatepermission").post(DeactivatePermission);

export default router;
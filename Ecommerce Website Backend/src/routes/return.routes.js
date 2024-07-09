import { Router } from "express";
import { cancelProductReturn, createProductReturn, getAllProductReturns, getProductReturnByUser, updateProductReturnStatus } from "../controllers/return.controller.js";

const router = new Router();

router.route("/getallproductreturn").get(getAllProductReturns);
router.route("/createproductreturn").post(createProductReturn);
router.route("/updateproductreturnstatus").post(updateProductReturnStatus);
router.route("/cancelproductreturn").post(cancelProductReturn);
router.route("/getproductreturnbyuser").get(getProductReturnByUser);

export default router;
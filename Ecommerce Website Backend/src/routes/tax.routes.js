import { Router } from "express";
import { createTax, deletetax, getAllTaxes, getTaxById, getTaxRatesByRegion, updateTax } from "../controllers/tax.controller.js";

const router = new Router();

router.route("/getalltaxes").get(getAllTaxes);
router.route("/gettacbyid").get(getTaxById);
router.route("/createtax").post(createTax);
router.route("/updatetax").post(updateTax);
router.route("/deletetax").delete(deletetax);
router.route("/gettaxbyregion").get(getTaxRatesByRegion);

export default router;
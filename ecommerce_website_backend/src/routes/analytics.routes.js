import { Router } from "express";
import {
  getCustomerActivity,
  getInventoryAnalysis,
  getMarketingCampaignPerformance,
  getSalesByCategory,
  getSalesByDate,
  getSalesByProduct,
  getSalesByRegion,
  getSalesOverview,
  getTopSellingProducts,
} from "../controllers/analytics.controller.js";

const router = new Router();

router.route("/getsalesoverview").get(getSalesOverview);
router.route("/getsalesbydate").get(getSalesByDate);
router.route("/getsalesbyproduct").get(getSalesByProduct);
router.route("/getsalesbycategory").get(getSalesByCategory);
router.route("/getsalesbyregion").get(getSalesByRegion);
router.route("/getcustomeractivity").get(getCustomerActivity);
router.route("/gettopsellingproducts").get(getTopSellingProducts);
router.route("/getinventoryanalysis").get(getInventoryAnalysis);
router
  .route("/getmarketingcampaignperformance")
  .get(getMarketingCampaignPerformance);

export default router;

import { Router } from "express";
import {
  createInventoryItem,
  deleteInventoryItem,
  getAllInventoryItems,
  getExpiredItems,
  getInventoryItemById,
  getLowStockItems,
  getOutOfStockItems,
  updateInventoryItem,
} from "../controllers/inventory.controller.js";

const router = new Router();

router.route("/getallinventoryitems").get(getAllInventoryItems);
router.route("/getinventoryitembyid").get(getInventoryItemById);
router.route("/createinventoryitem").post(createInventoryItem);
router.route("/updateinventoryitem").post(updateInventoryItem);
router.route("/deleteinventoryitem").delete(deleteInventoryItem);
router.route("/getlowstockitems").get(getLowStockItems);
router.route("/getoutofstockitems").get(getOutOfStockItems);
router.route("/getexpireditems").get(getExpiredItems);

export default router;

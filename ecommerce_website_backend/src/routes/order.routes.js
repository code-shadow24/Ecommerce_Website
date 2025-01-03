import { Router } from "express";
import { cancelOrder, createOrder, deleteOrder, generateOrderInvoice, getAllOrders, getOrderByDateRange, getOrderById, getOrderByStatus, getOrderByUser, getOrderDetails, reorder, updateOrder } from "../controllers/order.controller.js";

const router = new Router()

router.route("getallorders").get(getAllOrders);
router.route("/getorderbyid").get(getOrderById);
router.route("/createorder").post(createOrder);
router.route("/updateorder").post(updateOrder);
router.route("/deleteorder").delete(deleteOrder);
router.route("/cancelorder").post(cancelOrder);
router.route("/getorderbyuser").get(getOrderByUser);
router.route("/getorderbystatus").get(getOrderByStatus);
router.route("/getorderbydaterange").get(getOrderByDateRange);
router.route("/generateorderinvoice").post(generateOrderInvoice);
router.route("/reorder").post(reorder);
router.route("/getorderdetails").get(getOrderDetails);

export default router
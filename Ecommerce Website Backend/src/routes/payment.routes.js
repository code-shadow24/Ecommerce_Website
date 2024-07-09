import {Router} from "express";
import { getPaymentDetails, paymentCancelled, paymentSuccess, processPaymentThroughPayPal, refundFullPayment, refundPartialPayment } from "../controllers/payment.controller.js";

const router = new Router();

router.route("/processpayment").post(processPaymentThroughPayPal);
router.route("/paymentSuccess").post(paymentSuccess);
router.route("/paymentcancelled").post(paymentCancelled);
router.route("/refundpartialpayment").post(refundPartialPayment);
router.route("/refundfullpayment").post(refundFullPayment);
router.route("/getpaymentdetail").post(getPaymentDetails);

export default router
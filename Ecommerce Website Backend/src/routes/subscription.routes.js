import { Router } from "express";
import { createSubscription, getActiveSubscriptionForUser, getAllSubscriptions, getSubscriptionById, updateSubscription } from "../controllers/subscription.controller.js";

const router = new Router();

router.route("/getallsubscriptions").get(getAllSubscriptions);
router.route("/getsubscriptionbyid").get(getSubscriptionById);
router.route("/createsubscription").post(createSubscription);
router.route("/updatesubscription").post(updateSubscription);
router.route("/getactivesubscriptionforuser").get(getActiveSubscriptionForUser)

export default router;
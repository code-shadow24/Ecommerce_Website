import { Router } from "express";
import { cancelShipment, createReturnShipment, createShipment, retrieveShippingLabel, trackShipment, validateShippingAddress } from "../controllers/shipment.controller.js";

const router = new Router();

router.route("/createshipment").post(createShipment);
router.route("/cancelshipment").post(cancelShipment);
router.route("/trackshipment").get(trackShipment);
router.route("/retrieveshippinglabel").get(retrieveShippingLabel);
router.route("/valiateshippingaddress").post(validateShippingAddress);
router.route("/createreturnshipment").post(createReturnShipment);

export default router;
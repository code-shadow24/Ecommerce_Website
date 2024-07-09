import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddressByCity,
  getAddressByCountry,
  getAddressById,
  getAddressByPostalCode,
  getAllAddresses,
  updateAddress,
} from "../controllers/address.controller.js";

const router = new Router();

router.route("/getalladdress").get(getAllAddresses);
router.route("/getaddressbyid").get(getAddressById);
router.route("/createaddress").get(createAddress);
router.route("/updateaddress").get(updateAddress);
router.route("/deleteaddress").delete(deleteAddress);
router.route("/getaddressbycountry").get(getAddressByCountry);
router.route("/getaddressbypostalcode").get(getAddressByPostalCode);
router.route("/getaddressbycity").get(getAddressByCity);

export default router;

import { Router } from "express";
import { registerSeller } from "../controllers/seller.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/register").post(upload.single("avatar"), registerSeller);

export default router;

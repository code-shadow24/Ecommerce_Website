import { Router } from "express";
import { createProduct, createProductVariants, deleteProduct, deleteProductVariants, getAllProducts, getNewArrivalProducts, getProductByCategory, getProductById, getProductReviews, getProductVariants, getRelatedProducts, searchProducts, updateProduct, updateProductImage, updateProductVariants, updateVariantImage } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();


router.route("/getallproducts").get(getAllProducts);
router.route("/getproductbyid").get(getProductById);
router.route("/createproduct").post(upload.fields("productImage"), createProduct);
router.route("/updateProduct").post(updateProduct);
router.route("/deleteproduct").delete(deleteProduct);
router.route("/getproductbycategory").get(getProductByCategory);
router.route("/searchproduct").get(searchProducts);
router.route("/getnewarrivalproducts").get(getNewArrivalProducts);
router.route("/getproductreviews").get(getProductReviews);
router.route("/updateproductimage").post(upload.fields("productImage"), updateProductImage);
router.route("/getrelatedproducts").get(getRelatedProducts);
router.route("/getproductvariants").get(getProductVariants);
router.route("/createproductvariant").post(upload.fields("productImage"), createProductVariants);
router.route("/updateproductvariant").post(updateProductVariants);
router.route("/updatevariantimage").post(upload.fields("productImage"), updateVariantImage);
router.route("/deleteproductvariant").delete(deleteProductVariants);

export default router
import { Router } from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategories, getPopularSubCategories, getRelatedSubCategories, getSubCategoriesByFilter, getSubCategoriesById, getSubCategoryAttributes, getSubCategoryProducts, updateSubCategory, updateSubCategoryImage } from "../controllers/subcategory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/getallsubcategories").get(getAllSubCategories);
router.route("/getsubcategoriesbyid").get(getSubCategoriesById);
router.route("/createsubcategory").post(upload.single("image"), createSubCategory);
router.route("/updatesubcategory").post(updateSubCategory);
router.route("/deletesubcategory").delete(deleteSubCategory);
router.route("/updatesubcategoryimage").post(upload.single("image"), updateSubCategoryImage);
router.route("/getsubcategoriesbyfilter").get(getSubCategoriesByFilter);
router.route("/getsubcategoryproducts").get(getSubCategoryProducts);
router.route("/getsubcategoryattributes").get(getSubCategoryAttributes);
router.route("/getpopularsubcategories").get(getPopularSubCategories);
router.route("/getrelatedsubcategories").get(getRelatedSubCategories);

export default router
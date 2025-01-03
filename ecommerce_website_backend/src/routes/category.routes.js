import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryAttributes,
  getCategoryById,
  getCategoryFilters,
  getCategoryProducts,
  getFrequentCategory,
  getPopularCategories,
  getRelatedCategory,
  getSubCategories,
  searchCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router.route("/getallcategory").get(getAllCategories);
router.route("/getcategorybyid").get(getCategoryById);
router.route("/createcategory").post(upload.single("image"), createCategory);
router.route("/updatecategory").post(updateCategory);
router.route("/deletecategory").delete(deleteCategory);
router.route("/getsubcategories").get(getSubCategories);
router.route("/getcategoryproducts").get(getCategoryProducts);
router.route("/getcategoryattributes").get(getCategoryAttributes);
router.route("/getcategoryfilters").get(getCategoryFilters);
router.route("/getrelatedcategory").get(getRelatedCategory);
router.route("/getfrequentcategory").get(getFrequentCategory);
router.route("/getpopularcategories").get(getPopularCategories);
router.route("/searchcategories").get(searchCategories);

export default router;

import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllCategories = asyncHandler(async(req, res)=>{

})
const getCategoryById = asyncHandler(async(req, res)=>{

})
const createCategory = asyncHandler(async(req, res)=>{

})
const updateCategory = asyncHandler(async(req, res)=>{

})
const deleteCategory = asyncHandler(async(req, res)=>{

})
const getSubCategories = asyncHandler(async(req, res)=>{

})
const getCategoryProducts = asyncHandler(async(req, res)=>{

})
const getCategoryAttributes = asyncHandler(async(req, res)=>{

})
const getCategoryFilters = asyncHandler(async(req, res)=>{

})
const getCategoryRecommendation = asyncHandler(async(req, res)=>{

})
const getFeaturedCategory = asyncHandler(async(req, res)=>{

})
const getPopularCategories = asyncHandler(async(req, res)=>{

})
const getCategoryHierarchy = asyncHandler(async(req, res)=>{

})
const searchCategories = asyncHandler(async(req, res)=>{

})

export{
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubCategories,
    getCategoryProducts,
    getCategoryAttributes,
    getCategoryFilters,
    getCategoryRecommendation,
    getFeaturedCategory,
    getPopularCategories,
    getCategoryHierarchy,
    searchCategories
}
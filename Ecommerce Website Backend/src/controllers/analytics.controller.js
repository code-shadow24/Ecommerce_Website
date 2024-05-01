import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getSalesOverview = asyncHandler( async(req, res)=>{

})

const getSalesByDate = asyncHandler( async(req, res)=>{

})

const getSalesByProduct = asyncHandler( async(req, res)=>{

})

const getSalesByCategory = asyncHandler( async(req, res)=>{

})

const getSalesByRegion = asyncHandler( async(req, res)=>{

})

const getCustomerActivity = asyncHandler( async(req, res)=>{

})

const getConversionRate = asyncHandler( async(req, res)=>{

})

const getTopSellingProducts = asyncHandler( async(req, res)=>{

})

const getTopCustomers = asyncHandler( async(req, res)=>{

})

const getInventoryAnalysis = asyncHandler( async(req, res)=>{

})

const getMarketingCampaignPerformance = asyncHandler( async(req, res)=>{

})

const generateCustomReport = asyncHandler( async(req, res)=>{

})

export {
    getSalesOverview,
    getSalesByDate,
    getSalesByProduct,
    getSalesByCategory,
    getSalesByRegion,
    getCustomerActivity,
    getConversionRate,
    getTopSellingProducts,
    getTopCustomers,
    getInventoryAnalysis,
    getMarketingCampaignPerformance,
    generateCustomReport
}
import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllInventoryItems = asyncHandler(async(req, res)=>{

})
const getInventoryItemById = asyncHandler(async(req, res)=>{

})
const createInventoryItem = asyncHandler(async(req, res)=>{

})
const updateInventoryItem = asyncHandler(async(req, res)=>{

})
const deleteInventoryItem = asyncHandler(async(req, res)=>{

})
const adjustStockLevel = asyncHandler(async(req, res)=>{

})
const trackInventoryChanges = asyncHandler(async(req, res)=>{

})
const getLowStockItems = asyncHandler(async(req, res)=>{

})
const getOutOfStockItems = asyncHandler(async(req, res)=>{

})
const getExpiredItems = asyncHandler(async(req, res)=>{

})
const getInventoryHistory = asyncHandler(async(req, res)=>{

})
const generateInventoryReports = asyncHandler(async(req, res)=>{

})

export{
    getAllInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStockLevel,
    trackInventoryChanges,
    getLowStockItems,
    getOutOfStockItems,
    getExpiredItems,
    getInventoryHistory,
    generateInventoryReports,
}
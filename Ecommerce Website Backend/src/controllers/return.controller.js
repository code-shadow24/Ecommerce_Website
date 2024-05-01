import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllProductReturns = asyncHandler(async(req, res)=>{

})
const getProductReturnById = asyncHandler(async(req, res)=>{

})
const createProductReturn = asyncHandler(async(req, res)=>{

})
const updateProductReturnStatus = asyncHandler(async(req, res)=>{

})
const processProductReturn = asyncHandler(async(req, res)=>{

})
const cancelProductReturn = asyncHandler(async(req, res)=>{

})
const getProductReturnByUser = asyncHandler(async(req, res)=>{

})
const getProductReturnByOrder = asyncHandler(async(req, res)=>{

})
const filterProductReturnByStatus = asyncHandler(async(req, res)=>{

})
const getProductReturnHistory = asyncHandler(async(req, res)=>{

})
const calculateProductReturnRefund = asyncHandler(async(req, res)=>{

})
const validateProductReturnRequest = asyncHandler(async(req, res)=>{

})
const getReturnReason = asyncHandler(async(req, res)=>{

})
const handleProductReturnExceptions = asyncHandler(async(req, res)=>{

})
const getProductReturnDetail = asyncHandler(async(req, res)=>{

})
const approveProductReturn = asyncHandler(async(req, res)=>{

})
const rejectProductReturn = asyncHandler(async(req, res)=>{

})
const generateProductReturnReport = asyncHandler(async(req, res)=>{

})
const returnProcessingTime = asyncHandler(async(req, res)=>{

})
const partialReturn = asyncHandler(async(req, res)=>{

})
const returnTracking = asyncHandler(async(req, res)=>{

})

export{
    getAllProductReturns,
    getProductReturnById,
    createProductReturn,
    updateProductReturnStatus,
    processProductReturn,
    cancelProductReturn,
    getProductReturnByUser,
    getProductReturnByOrder,
    filterProductReturnByStatus,
    getProductReturnHistory,
    calculateProductReturnRefund,
    validateProductReturnRequest,
    getReturnReason,
    handleProductReturnExceptions,
    getProductReturnDetail,
    approveProductReturn,
    rejectProductReturn,
    generateProductReturnReport,
    returnProcessingTime,
    partialReturn,
    returnTracking
}
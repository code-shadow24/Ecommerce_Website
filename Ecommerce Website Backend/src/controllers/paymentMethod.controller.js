import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllPaymentMethods = asyncHandler(async(req, res)=>{

})
const getPaymentMethodById = asyncHandler(async(req, res)=>{

})
const createPaymentMethod = asyncHandler(async(req, res)=>{

})
const updatePaymentMethod = asyncHandler(async(req, res)=>{

})
const deletePaymentMethod = asyncHandler(async(req, res)=>{

})
const enablePaymentMethod = asyncHandler(async(req, res)=>{

})
const disablePaymentMethod = asyncHandler(async(req, res)=>{

})
const setdefaultPaymentMethod = asyncHandler(async(req, res)=>{

})
const getActivePaymentMethod = asyncHandler(async(req, res)=>{

})
const getPaymentMethodSettings = asyncHandler(async(req, res)=>{

})
const generatePaymentMethodReport = asyncHandler(async(req, res)=>{

})

export{
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    enablePaymentMethod,
    disablePaymentMethod,
    setdefaultPaymentMethod,
    getActivePaymentMethod,
    getPaymentMethodSettings,
    generatePaymentMethodReport
}
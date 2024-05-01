import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const processPayment = asyncHandler(async(req, res)=>{

})
const verifyPayment = asyncHandler(async(req, res)=>{

})
const refundPayment = asyncHandler(async(req, res)=>{

})
const cancelPayment = asyncHandler(async(req, res)=>{

})
const getPaymentDetails = asyncHandler(async(req, res)=>{

})
const getPaymentByUsers = asyncHandler(async(req, res)=>{

})
const getPaymentByOrder = asyncHandler(async(req, res)=>{

})
const getPaymentByStatus = asyncHandler(async(req, res)=>{

})
const getPaymentByDateRange = asyncHandler(async(req, res)=>{

})
const calculateOrderTotal = asyncHandler(async(req, res)=>{

})
const generateInvoice = asyncHandler(async(req, res)=>{

})
const sendPaymentConfirmation = asyncHandler(async(req, res)=>{

})
const handlePaymentFailure = asyncHandler(async(req, res)=>{

})
const trackPaymentStatus = asyncHandler(async(req, res)=>{

})
const getPaymentMethods = asyncHandler(async(req, res)=>{

})
const retrievePaymentDetails = asyncHandler(async(req, res)=>{

})
const generatePaymentReports = asyncHandler(async(req, res)=>{

})
const handleCurrencyConversion = asyncHandler(async(req, res)=>{

})

export{
    processPayment,
    verifyPayment,
    refundPayment,
    cancelPayment,
    getPaymentDetails,
    getPaymentByUsers,
    getPaymentByOrder,
    getPaymentByStatus,
    getPaymentByDateRange,
    calculateOrderTotal,
    generateInvoice,
    sendPaymentConfirmation,
    handlePaymentFailure,
    trackPaymentStatus,
    getPaymentMethods,
    retrievePaymentDetails,
    generatePaymentReports,
    handleCurrencyConversion
}
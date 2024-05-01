import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllOrders = asyncHandler(async(req, res)=>{

})
const getOrderById = asyncHandler(async(req, res)=>{

})
const createOrder = asyncHandler(async(req, res)=>{

})
const updateOrder = asyncHandler(async(req, res)=>{

})
const deleteOrder = asyncHandler(async(req, res)=>{

})
const cancelOrder = asyncHandler(async(req, res)=>{

})
const getOrderByUser = asyncHandler(async(req, res)=>{

})
const getOrderByStatus = asyncHandler(async(req, res)=>{

})
const getOrderByDateRange = asyncHandler(async(req, res)=>{

})
const calculateOrderTotal = asyncHandler(async(req, res)=>{

})
const generateOrderInvoice = asyncHandler(async(req, res)=>{

})
const confirmPayment = asyncHandler(async(req, res)=>{

})
const trackOrderStatus = asyncHandler(async(req, res)=>{

})
const refundOrder = asyncHandler(async(req, res)=>{

})
const getOrderHistory = asyncHandler(async(req, res)=>{

})
const reorder = asyncHandler(async(req, res)=>{

})
const getPendingOrders = asyncHandler(async(req, res)=>{

})
const getCompletedOrders = asyncHandler(async(req, res)=>{

})
const getCancelledOrders = asyncHandler(async(req, res)=>{

})
const getReturnedOrders = asyncHandler(async(req, res)=>{

})
const calculateOrderTaxes = asyncHandler(async(req, res)=>{

})
const scheduleOrderDelivery = asyncHandler(async(req, res)=>{

})
const getOrderDetails = asyncHandler(async(req, res)=>{

})
const exportOrderDetails = asyncHandler(async(req, res)=>{

})
const handleOrderNotifications = asyncHandler(async(req, res)=>{

})

export{
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    cancelOrder,
    getOrderByUser,
    getOrderByStatus,
    getOrderByDateRange,
    calculateOrderTotal,
    generateOrderInvoice,
    confirmPayment,
    trackOrderStatus,
    refundOrder,
    getOrderHistory,
    reorder,
    getPendingOrders,
    getCompletedOrders,
    getCancelledOrders,
    getReturnedOrders,
    calculateOrderTaxes,
    scheduleOrderDelivery,
    getOrderDetails,
    exportOrderDetails,
    handleOrderNotifications
}
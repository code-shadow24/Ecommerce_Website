import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllTickets = asyncHandler(async(req, res)=>{

})
const getTicketById = asyncHandler(async(req, res)=>{

})
const createTicket = asyncHandler(async(req, res)=>{

})
const updateTicket = asyncHandler(async(req, res)=>{

})
const deleteTicket = asyncHandler(async(req, res)=>{

})
const assignTicket = asyncHandler(async(req, res)=>{

})
const closeTicket = asyncHandler(async(req, res)=>{

})
const reopenTicket = asyncHandler(async(req, res)=>{

})
const getTicketHistory = asyncHandler(async(req, res)=>{

})
const getTicketAttachments = asyncHandler(async(req, res)=>{

})
const addTicketComment = asyncHandler(async(req, res)=>{

})
const getTicketByUser = asyncHandler(async(req, res)=>{

})
const getTicketByStatus = asyncHandler(async(req, res)=>{

})
const getTicketsByPriority = asyncHandler(async(req, res)=>{

})
const getTicketByCategory = asyncHandler(async(req, res)=>{

})
const generateTicketReport = asyncHandler(async(req, res)=>{

})
const exportTicketReport = asyncHandler(async(req, res)=>{

})

export{
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    assignTicket,
    closeTicket,
    reopenTicket,
    getTicketHistory,
    getTicketAttachments,
    addTicketComment,
    getTicketByUser,
    getTicketByStatus,
    getTicketsByPriority,
    getTicketByCategory,
    generateTicketReport,
    exportTicketReport
}
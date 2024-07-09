import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CrmTicket } from "../models/crmticket.model.js";
import { getNextSequenceValue } from "../utils/getNextSequenceValue.js";
import Parser from 'json2csv';
import fs from 'fs';
import path from 'path';


const getAllTickets = asyncHandler(async(req, res)=>{
    const tickets = await CrmTicket.find();

    if(tickets.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No tickets found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All tickets retrieved successfully", tickets)
    )
})
const getTicketById = asyncHandler(async(req, res)=>{
    const ticketId = req.params || req.query || req.body

    if(!ticketId){
        throw new ApiError(400, "Ticket Id is required")
    }

    const tickets = await CrmTicket.findById(ticketId)

    if(tickets.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Ticket found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Requested Ticket received successfully", tickets)
    )
})
const createTicket = asyncHandler(async(req, res)=>{
    const userId = req.params.user || req.user

    const {subject, description, orderId, category} = req.body

    if(subject?.trim()==""){
        throw new ApiError(400, "Subject is required")
    }

    if(description?.trim()==""){
        throw new ApiError(400, "Description is required")
    }

    if(orderId?.trim()==""){
        throw new ApiError(400, "OrderId is required")
    }

    if(category?.trim()==""){
        throw new ApiError(400, "Category is required")
    }

    const ticketId = await getNextSequenceValue('ticketId')

    const ticket = await CrmTicket.create({
        ticketId: ticketId,
        orderId,
        userId: userId,
        subject,
        description,
        status: 'Open',
        category
    })

    if(!ticket){
        throw new ApiError(500, "Error occured while creating ticket")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Ticket created successfully")
    )
})
const updateTicketReply = asyncHandler(async(req, res)=>{
    const userId = req.user?._id && req.user.role.admin

    const ticketId = req.params

    const {reply} = req.body

    if(reply?.trim()==""){
        throw new ApiError(400, "Write at least one word")
    }

    const replyUpdate = await CrmTicket.findByIdAndUpdate(
        ticketId,
        {
            $set: {
                reply: reply,
                replierId: userId
            }
        },
        {new: true}
    )

    if(!replyUpdate){
        throw new ApiError(400, "Error occured while updating the reply")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Reply Updated Successfully", replyUpdate)
    )
})

const updateTicketStatus = asyncHandler(async(req, res)=>{
    const userId = req.user._id && req.user.role.admin

    const ticketId = req.params

    const {status} = req.body

    if(status!= 'Open' || status!= 'Pending with Seller' || status!='Pending with Customer' || status!='Duplicate' || status!='Close'){
        throw new ApiError(400, "Choose the correct opetion")
    }

    const statusUpdate = await CrmTicket.findByIdAndUpdate(
        ticketId,
        {
            $set:{
                status: status
            }
        },
        {new : true}
    )

    if(!statusUpdate){
        throw new ApiError(500, "Error occured while updating the status")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Status updated successfully", statusUpdate)
    )
})

const deleteTicket = asyncHandler(async(req, res)=>{
    const userId = req.user._id && req.user.role.admin

    const ticketId = req.params

    try {
        await CrmTicket.findByIdAndDelete(ticketId)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Ticket deleted successfully". null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting ticket", error)
    }
})




const getTicketByUser = asyncHandler(async(req, res)=>{

    const userId = req.body || req.query

    if(userId?.trim()==""){
        throw new ApiError(400, "User Id is required")
    }

    const ticketByUser = await CrmTicket.find({ userId: userId})

    if(ticketByUser.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Ticket Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Ticket By User Retrieved Successfully", ticketByUser)
    )

})
const getTicketByStatus = asyncHandler(async(req, res)=>{

    const status = req.query || req.body

    if(status?.trim()==""){
        throw new ApiError(400, "Status is required")
    }

    const ticketByStatus = await CrmTicket.find({status: status})

    if(ticketByStatus.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Ticket Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Ticket by status retrieved successfully", status)
    )
})

const getTicketByCategory = asyncHandler(async(req, res)=>{
    const category = req.query || req.body

    if(category?.trim()==""){
        throw new ApiError(400, "Enter a category")
    }

    const ticketByCategory = await CrmTicket.find({category: category})

    if(ticketByCategory.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No tickets found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Ticket by category retrieved successfully", ticketByCategory)
    )
})

const getTicketByOrderId = asyncHandler(async(req, res)=>{
    const orderId = req.query || req.body

    if(orderId?.trim()==""){
        throw new ApiError(400, "Order Id is required")
    }

    const ticketByOrderId = await CrmTicket.find({orderId : orderId})

    if(ticketByOrderId.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Ticket not found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Ticket by OrderId retrieved successfully", ticketByOrderId)
    )
})

const generateTicketReport = asyncHandler(async(req, res)=>{
    try {
        const { startDate, endDate, status} = req.query

        let query = {};
        if(startDate || endDate){
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$gte = new Date(endDate)
        }

        if(status){
            query.status = status
        }

        const tickets = await CrmTicket.find(query).lean()

        if(tickets.length==0){
            return res
            .status(404)
            .json(
                new ApiResponse(404, "No tickets found as per query")
            )
        }

        const fields = ['TicketId', 'TicketMongoId', 'OrderId', 'UserId', 'Subject', 'Description', 'Category', 'Status', 'CreatedAt', 'UpdatedAt']

        const opts = {fields}

        const parser = new Parser(opts);
        const csv = parser.parse(tickets)

        const filePath = path.join(__dirname, '../reports/ticketReport.csv')
        fs.writeFileSync(filePath, csv)

        return res
        .setHeader('Content-Type', 'text/csv')
        .setHeader('Content-Disposition', 'attachment; filename=ticketReport.csv')
        .status(200)
        .end(csv)

    } catch (error) {
        throw new ApiError(500, "Error occured while generating ticket report", error)
    }
})


export{
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicketReply,
    updateTicketStatus,
    deleteTicket,
    getTicketByUser,
    getTicketByStatus,
    getTicketByCategory,
    getTicketByOrderId,
    generateTicketReport,
}
import { ActivityLog } from "../models/activitylog.model.js";
import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllLogs = asyncHandler( async(req, res)=>{

    const activityLogs = await ActivityLog.find();

    if(!activityLogs){
        throw new ApiError(404, "Activity Log Not Found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Activity Log retrieved successfully", activityLogs)
    )
})

const getAllUserLogs = asyncHandler( async(req, res)=>{
    const allUserLogs = await ActivityLog.find({userType: 'userId'})

    if(!allUserLogs){
        throw new ApiError(500, "Error getting all user logs", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Users Activity Logs retrieved successfully", allUserLogs)
    )
})

const getAllSellerLogs = asyncHandler( async(req, res)=>{
    const allSellerLogs = await ActivityLog.find({userType: 'sellerId'})

    if(!allSellerLogs){
        throw new ApiError(500, "Error retrieving all Seller Logs", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Sellers Activity Logs retrieved successfully", allSellerLogs)
    )
})

const getAllAdminLogs = asyncHandler( async(req, res)=>{
    const allAdminLogs = await ActivityLog.find({userType: 'adminId'})

    if(!allAdminLogs){
        throw new ApiError(500, 'Error retrieving all admin activity logs', error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully retrieved all admin activity logs", allAdminLogs)
    )
})

const getLogByUserId = asyncHandler( async(req, res)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(404 , "User not found", error)
    }

    const userLog = await ActivityLog.findById(userId)

    if(!userLog){
        throw new ApiError(404 , "User Activity Log not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "User Activity Log retrieved", userLog)
    )

})

const getLogBySellerId = asyncHandler( async(req, res)=>{
    const sellerId = req.user?._id

    if(!sellerId){
        throw new ApiError(404, "Seller not found", error)
    }

    const sellerLog = await ActivityLog.findById(sellerId)

    if(!sellerLog) {
        throw new ApiError(404, "Seller Log not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Seller Log retrieved successfully", sellerLog)
    )
})

const getLogByAdminId = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && user.role?.admin

    if(!adminId){
        throw new ApiError(404, "Admin not found", error)
    }

    const adminLog = await ActivityLog.findById(adminId)

    if(!adminLog){
        throw new ApiError(404, "Admin Log not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin Log retrieved successfully", adminLog)
    )
})

const createUserActivityLog = asyncHandler( async(req, res)=>{
    const user = req.user?._id && req.user.role?.user

    if(!user){
        throw new ApiError(404, "User not found")
    }
    const {action, timeStamp, ipAddress, details, isActive} = req.body

    // Validate the required parameters
    if(action?.trim()==''){
        throw new ApiError(400, "Action detail required")
    }

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }
    
    if(!ipAddress){
        throw new ApiError(400, "IP address required")
    }

    if(!isActive){
        isActive = false
    }

    const newUserActivityLog = await ActivityLog.create(
        {
            userId : user,
            action,
            timeStamp,
            ipAddress,
            details: details || "",
            isActive
        }
    )

    if(!newUserActivityLog){
        throw new ApiError(500, "User Activity Log Creation Failed", error)
    }

    const userActivityLog = await ActivityLog.findById(newUserActivityLog._id)

    if(userActivityLog){
        throw new ApiError(500, "User Activity Log Not Found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "User Activity Log Created Successfully", userActivityLog)
    )
})

const createSellerActivityLog = asyncHandler( async(req, res)=>{
    const seller = req.user?._id && req.user.role?.seller

    if(!seller){
        throw new ApiError(404, "Seller not found")
    }

    const {action, timeStamp, ipAddress, details, isActive} = req.body

    //Validate the details
    if(action?.trim()==''){
        throw new ApiError(400, "Action details required")
    }

    if(!timeStamp){
        throw new ApiError(400, "Time stamp required")
    }
    
    if(!ipAddress){
        throw new ApiError(400, "IP address required")
    }

    if(!isActive){
        isActive = false
    }

    const newSellerActivityLog = await ActivityLog.create(
        {
            sellerId : seller,
            action,
            timeStamp,
            ipAddress,
            details: details || "",
            isActive
        }
    )

    if(!newSellerActivityLog){
        throw new ApiError(500, "Seller Activity Log Creation Failed")
    }

    const sellerActivityLog = await ActivityLog.findById(newSellerActivityLog._id)

    if(!sellerActivityLog){
        throw new ApiError(400, "Seller Activity Log Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Seller Activity Log Created Successfully", sellerActivityLog)
    )
})

const createAdminActivityLog = asyncHandler( async(req, res)=>{
    const admin = req.user?._id && req.user.role?.admin

    const { action, timeStamp, ipAddress, details, isActive } = req.body

    if(!admin){
        throw new ApiError(404, "Admin Not Found", error)
    }

    //Validate the details
    if(action?.trim()==''){
        throw new ApiError(400 , "Action details required")
    }

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }

    if(ipAddress){
        throw new ApiError(400, "IpAddress required")
    }

    if(isActive){
        isActive = false
    }

    const newAdminActivityLog = await ActivityLog.create({
        adminId: admin,
        action,
        timeStamp,
        ipAddress,
        detail,
        isActive
    })

    if(!newAdminActivityLog){
        throw new ApiError(400, "Admin Activity Log creation failed")
    }

    const adminActivityLog = await ActivityLog.findById(newAdminActivityLog._id)

    if(!adminActivityLog){
        throw new ApiError(404, "Admin Activity Log not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin Activity Log created successfully", adminActivityLog)
    )
})

const updateUserLog = asyncHandler( async(req, res)=>{
    const user = req.user?._id && req.user.role?.user

    if(!user){
        throw new ApiError(404, "User not found")
    }
    const {action, timeStamp, ipAddress, details, isActive} = req.body

    // Validate the required parameters
    if(action?.trim()==''){
        throw new ApiError(400, "Action detail required")
    }

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }
    
    if(!ipAddress){
        throw new ApiError(400, "IP address required")
    }

    if(!isActive){
        isActive = false
    }
    
    const updateLogUser = await ActivityLog.findByIdAndUpdate(
        req.user?._id && req.user.role?.user,
        {
            userId: user,
            action,
            timeStamp,
            ipAddress,
            details,
            isActive
        },
        {new: true}
    )

    if(!updateLogUser){
        throw new ApiError(500, "User Log Update Failed")
    }

    const userLog = await ActivityLog.findById(updateLogUser._id)

    if(!userLog){
        throw new ApiError(500, "User Log Update Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "User Log Updated Successfully", userLog)
    )
})

const updateSellerLog = asyncHandler( async(req, res)=>{
    const seller = req.user?._id && req.user.role?.seller

    if(!seller){
        throw new ApiError(404, "Seller not found")
    }
    const {action, timeStamp, ipAddress, details, isActive} = req.body

    // Validate the required parameters
    if(action?.trim()==''){
        throw new ApiError(400, "Action detail required")
    }

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }
    
    if(!ipAddress){
        throw new ApiError(400, "IP address required")
    }

    if(!isActive){
        isActive = false
    }
    
    const updateLogSeller = await ActivityLog.findByIdAndUpdate(
        req.user?._id && req.user.role?.seller,
        {
            sellerId: seller,
            action,
            timeStamp,
            ipAddress,
            details,
            isActive
        },
        {new: true}
    )

    if(!updateLogSeller){
        throw new ApiError(500, "Seller Log Update Failed")
    }

    const sellerLog = await ActivityLog.findById(updateLogSeller._id)

    if(!sellerLog){
        throw new ApiError(500, "Seller Log Update Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Seller Log Updated Successfully", sellerLog)
    )
})

const updateAdminLog = asyncHandler( async(req, res)=>{
    const admin = req.user?._id && req.user.role?.admin

    if(!admin){
        throw new ApiError(404, "Admin not found")
    }
    const {action, timeStamp, ipAddress, details, isActive} = req.body

    // Validate the required parameters
    if(action?.trim()==''){
        throw new ApiError(400, "Action detail required")
    }

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }
    
    if(!ipAddress){
        throw new ApiError(400, "IP address required")
    }

    if(!isActive){
        isActive = false
    }
    
    const updateLogAdmin = await ActivityLog.findByIdAndUpdate(
        req.user?._id && req.user.role?.admin,
        {
            userId: user,
            action,
            timeStamp,
            ipAddress,
            details,
            isActive
        },
        {new: true}
    )

    if(!updateLogAdmin){
        throw new ApiError(500, "Admin Log Update Failed")
    }

    const adminLog = await ActivityLog.findById(updateLogAdmin._id)

    if(!adminLog){
        throw new ApiError(500, "Admin Log Update Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin Log Updated Successfully", userLog)
    )
})

const deleteLog = asyncHandler( async(req, res)=>{
    const admin = req.user?._id && req.user.role.admin

    if(!admin){
        throw new ApiError(404, "Admin not found")
    }

    try {
        await ActivityLog.findByIdAndDelete('_id')
    } catch (error) {
        throw new ApiError(500, "Failed to delete the requested log", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Log Deleted successfully", null)
    )

})

const getLogsByAction = asyncHandler( async(req, res)=>{
    const {action} = req.body;

    if(!action) {
        throw new ApiError(400, "Action required")
    }

    const requestedLog = await ActivityLog.find({action: 'action'})

    if(!requestedLog) {
        throw new ApiError(404, "Requested log not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Log based on Action retrieved successfully", requestedLog)
    )
})

const getLogsByTimeStamps = asyncHandler( async(req, res)=>{
    const {timeStamp} = req.body;

    if(!timeStamp){
        throw new ApiError(400, "TimeStamp required")
    }

    const requestedTimeStampLog = await ActivityLog.findOne({timeStamp: timeStamp})

    if(!requestedTimeStampLog){
        throw new ApiError(404, "Requested time stamp log not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Requested time stamp log retrieved successfully", requestedTimeStampLog)
    )
})

const clearLogs = asyncHandler( async(req, res)=>{
    try {
       await ActivityLog.deleteMany({}) 
    } catch (error) {
        throw new ApiError(500, "Error occured while clearing logs", error)
    }
})

const getActiveLogs = asyncHandler( async(req, res)=>{
    const activeLogs = await ActivityLog.find({isActive: 'true'})

    if(!activeLogs){
        throw new ApiError(500, "Error occured while getting active logs", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Active logs retrieved successfully", activeLogs)
    )
})

export {
    getAllLogs,
    getAllUserLogs,
    getAllSellerLogs,
    getAllAdminLogs,
    getLogByUserId,
    getLogBySellerId,
    getLogByAdminId,
    createUserActivityLog,
    createSellerActivityLog,
    createAdminActivityLog,
    updateUserLog,
    updateSellerLog,
    updateAdminLog,
    deleteLog,
    getLogsByAction,
    getLogsByTimeStamps,
    clearLogs,
    getActiveLogs
}
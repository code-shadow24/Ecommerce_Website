import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Admin } from "../models/admin.model.js";
import { fileDelete } from "../utils/fileUpload.js";
import { Blog } from "../models/blog.model.js";
import { Analyticsreport } from "../models/analyticsreport.model.js";
import bcrypt from 'bcrypt';
import { sendAdminPasswordResetEmail } from "../utils/emails/passwordResetVerificationCodeemail.js";
import { ActivityLog } from "../models/activitylog.model.js";

const generateAccessandRefreshToken = async (adminId) => {
    try {
      const admin = await Admin.findById(adminId);
      const accessToken = admin.accessTokenGenerator();
      const refreshToken = admin.refreshTokenGenerator();
      admin.refreshToken = refreshToken;
      await admin.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Error generating access and refresh token");
    }
  };

const getAllAdmins = asyncHandler( async(req, res)=>{
    //Calling the database to find all the admin documents
    const admins = await Admin.find({});

    //if the admins object is empty
    if(!admins){
        throw new ApiError(404, "Admin not found");
    }

    //if the admins object is not empty return the data to the frontend
    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Admins retrieved successfully", admins)
    )
})

const getAdminById = asyncHandler( async(req, res)=>{
    //get the adminId from the frontend
    const {adminId} = req.body

    //check if the adminId is there or not
    if(!adminId){
        throw new ApiError(400, "Admin Id is required")
    }

    //find the document in the database related to the adminId
    const findAdmin = await Admin.find({adminId:adminId})

    //if the findAdmin object is empty
    if(!findAdmin){
        throw new ApiError(500, "Error while getting admin")
    }

    //if the findAdmin object is not empty return the data to the frontend
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin retrieved successfully", findAdmin)
    )
})

const createAdmin = asyncHandler( async(req, res)=>{
    //recieve data from the frontend
    const { adminId, userName, email, password, role, firstName, lastName, phoneNumber, permissionIds } = req.body

    //Validate the data
    //Check if the adminId is provided
    if(!adminId){
        throw new ApiError(400, "AdminId is required")
    }

    //Check if the userName is provided
    if(userName?.trim()==""){
        throw new ApiError(400, "UserName is required")
    }

    //Check if the email is provided
    if(email?.trim()==""){
        throw new ApiError(400, "Email is required")
    }

    //Check if the password is provided
    if(password?.trim()==""){
        throw new ApiError(400, "Password is required")
    }

    //Check if the role is provided
    if(!role){
        throw new ApiError(400, "Role is required")
    }

    //Check if the firstName is provided
    if(firstName?.trim()==""){
        throw new ApiError(400, "FirstName is required")
    }

    //Check if the lastName is provided
    if(lastName?.trim()==""){
        throw new ApiError(400, "Lastname is required")
    }

    //Check if the phoneNumber is provided
    if(!phoneNumber){
        throw new ApiError(400, "Phone number is required")
    }

    //Regex or format for the email Address
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //Check if the email address provided matches the pattern specified in the emailRegex
    if (!emailRegex.test(email)) {
        throw new ApiError(401, "Invalid email address");
    }

    //Regex or format for the password
    const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    //Check if the password provided matches the pattern specified in the password Regex
    if (!password.match(passRegex)) {
        throw new ApiError(
          402,
          "Password must be 8 characters long. Atleast one lowercase letter, one uppercase letter, one number, and one special character is required(@, $, !, %, *, ?, &)"
        );
    }

    //Regex or format for firstName and lastName
    const engRegex1 = /^[a-zA-Z]*$/;
    //Check if firstName matches the criteria
    if(!engRegex1.test(firstName)){
        throw new ApiError(400, "First Name must be in English Language")
    }
    //Check if lastName matches the criteria
    if(!engRegex1.test(lastName)){
        throw new ApiError(400, "Last Name must be in English Language")
    }

    //Regex or format for the phone number
    const numRegex = /^[0-9]*$/;
    //check if the phone number matches the criteria
    if(!numRegex.test(phoneNumber)){
        throw new ApiError(400, "Phone Number must contain only numeric values")
    }

    //Check if email is already in the database
    const existingEmail = await Admin.findOne({email})

    //if email is already in the database
    if(existingEmail){
        throw new ApiError(400, "Email already exists")
    }

    //Check if adminId is already in the database
    const existingAdminId = await Admin.findOne({adminId})

    //if AdminId is already in the database
    if(existingAdminId){
        throw new ApiError(400, "Admin Id already exists")
    }
    //Check if userName is already in the database
    const existingUsername = await Admin.findOne({userName})

    //Check if phoneNumber is already in the database
    const existingPhoneNumber = await Admin.findOne({phoneNumber})

    //check for avatar local path
    const avatarLocalPath = req.file?.path

    //if local path provided upload the avatar to cloudinary
    if(avatarLocalPath){
        const avatar = await fileUpload(avatarLocalPath);
    }

    const admin = await Admin.create({
        adminId,
        userName,
        email,
        password,
        role,
        firstName,
        lastName,
        phoneNumber,
        profilePicture: avatar || "",
        permissions: permissionIds
    })

    if(!admin){
        throw new ApiError(500, "Error creating new admin")
    }

    const newAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    if(!newAdmin){
        throw new ApiError(500, "Error finding the new admin")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin created successfully", newAdmin)
    )
})

const updateAdmin = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }
    //Get all the details from frontend
    const {userName, email, role, firstName, lastName, phoneNumber, permissionIds} = req.body

    //Validate the details
    //Check if the userName is provided
    if(userName?.trim()==""){
        throw new ApiError(400, "UserName is required")
    }

    //Check if the email is provided
    if(email?.trim()==""){
        throw new ApiError(400, "Email is required")
    }

    //Check if the role is provided
    if(!role){
        throw new ApiError(400, "Role is required")
    }

    //Check if the firstName is provided
    if(firstName?.trim()==""){
        throw new ApiError(400, "FirstName is required")
    }

    //Check if the lastName is provided
    if(lastName?.trim()==""){
        throw new ApiError(400, "Lastname is required")
    }

    //Check if the phoneNumber is provided
    if(!phoneNumber){
        throw new ApiError(400, "Phone number is required")
    }

    //Regex or format for the email Address
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //Check if the email address provided matches the pattern specified in the emailRegex
    if (!emailRegex.test(email)) {
        throw new ApiError(401, "Invalid email address");
    }


    //Regex or format for firstName and lastName
    const engRegex1 = /^[a-zA-Z]*$/;
    //Check if firstName matches the criteria
    if(!engRegex1.test(firstName)){
        throw new ApiError(400, "First Name must be in English Language")
    }
    //Check if lastName matches the criteria
    if(!engRegex1.test(lastName)){
        throw new ApiError(400, "Last Name must be in English Language")
    }

    //Regex or format for the phone number
    const numRegex = /^[0-9]*$/;
    //check if the phone number matches the criteria
    if(!numRegex.test(phoneNumber)){
        throw new ApiError(400, "Phone Number must contain only numeric values")
    }

    //update admin details
    const adminUpdate = await Admin.findByIdAndUpdate(
        req.user?._id && req.user.role == 'admin',
        {
            $set: {
                userName,
                email,
                role,
                firstName,
                lastName,
                phoneNumber,
                permissionIds
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    //If the details are not successfully updated
    if(!admin) {
        throw new ApiError(500, "Error occured while updating admin profile", error)
    }

    //If the details are successfully updated return the updated profile to the frontend
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin profile updated successfully", admin)
    )

})

const deleteAdmin = asyncHandler( async(req, res)=>{
    //Get the admin Id
    const adminId = req.body?._id && req.body.role == 'admin'

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }

    if(!admin) {
        throw new ApiError(404, "Admin not found", null)
    }

    try {
        await fileDelete(admin.profilePicture, false)
    } catch (error) {
        throw new ApiError(500, "Error deleting profile picture", error)
    }

    try {
        const dashboardSettings = await Dashboard.find({admin: adminId})
        await Dashboard.deleteMany({dashboardSettings})
    } catch (error) {
        throw new ApiError(500, "Error deleting dashboard settings", error)
    }

    try {
        const blogs = await Blog.find({admin: adminId})
        await Blog.deleteMany({blogs})
    } catch (error) {
        throw new ApiError(500, "Error deleting the blogs", error)
    }

    try {
        const auditLog = await AuditLog.find({admin: adminId})
        await AuditLog.deleteMany({auditLog})
    } catch (error) {
        throw new ApiError(500, "Error deleting the audit logs", error)
    }

    try {
        const analyticReport = await AnalyticsReport.find({admin: adminId})
        await AuditLog.deleteMany(analyticReport)
    } catch (error) {
        throw new ApiError(500, "Error deleting the audit logs", error)
    }

    try {
        await Admin.findByIdAndDelete(adminId)
    } catch (error) {
        throw new ApiError(500, "Error deleting the admin Id", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully deleted the admin Id", null)
    )
})

const loginAdmin = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }
    const {email, password} = req.body

    //Validate
    if(email?.trim()==""){
        throw new ApiError(400, "Email is required")
    }

    if(password?.trim()==""){
        throw new ApiError(400, "Password is required")
    }

    //Regex or format for the email Address
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    //Check if the email address provided matches the pattern specified in the emailRegex
    if (!emailRegex.test(email)) {
        throw new ApiError(401, "Invalid email address");
    }

    const existingAdmin = await Admin.findOne({ email })

    if(!existingEmail) {
        throw new ApiError(401, "Email address not found");
    }

    const passCheck = existingAdmin.passwordCheck(password)

    if(!passCheck) {
        throw new ApiError(401, "Password is incorrect");
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(existingAdmin._id)

    const loggedinAdmin = await Admin.findById(existingAdmin._id).select("-password -refreshToken")

    if(!loggedinAdmin){
        throw new ApiError(500, "Error occurred while logging in admin")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, "Admin logged in successfully", {
            loggedinAdmin,
            accessToken,
            refreshToken
        })
    )

})

const logoutAdmin = asyncHandler( async(req, res)=>{
    const admin = req.body?._id && req.body.role == 'admin'

    await Admin.findByIdAndUpdate(
        admin,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {new: true}
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(
        new ApiResponse(200, "User logged Out Successfully", null)
    )

})

const resetPassword = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.roles.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }

    const {password} = req.body

    const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    //Check if the password provided matches the pattern specified in the password Regex
    if (!password.match(passRegex)) {
        throw new ApiError(
          402,
          "Password must be 8 characters long. Atleast one lowercase letter, one uppercase letter, one number, and one special character is required(@, $, !, %, *, ?, &)"
        );
    }    

    await sendAdminPasswordResetEmail(adminId)

    const hashedPassword = bcrypt.hash(password, 14)

    if(!hashedPassword){
        throw new ApiError(404, "Error Saving new password", error)
    }

    try {
        await Admin.findByIdAndUpdate(adminId, {password: hashedPassword})
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Password Reset Successful", null)
        )
    } catch (error) {
        throw new ApiError(404, "Error Saving new password", error)
    }
    
})

const changeRole = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.roles.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }
    const {role} = req.body

    const updateRole = await Admin.findByIdAndUpdate(adminId,{ role: role})

    if(!updateRole){
        throw new ApiError(500, "Error updating role", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Role Updated Successfully", updateRole)
    )
})

const getAdminActivity = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const adminActivity = await ActivityLog.find({aminId: adminId})

    if(!adminActivity){
        throw new ApiError(404, "Admin Activity not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin Activity successfully retrieved", adminActivity)
    )
})

const suspendAdmin = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive == false){
        throw new ApiError("Admin account is not active")
    }

    try {
        await Admin.findByIdAndUpdate(adminId, {isActive: false})
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Admin account is now suspended", null)
        )
    } catch (error) {
        throw new ApiError(500, "Failed to suspend Admin account", error)
    }


})

const enableAdmin = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const admin = await Admin.findById(adminId)

    if(admin?.isActive==true){
        throw new ApiError(400, "Admin account is already active")
    }

    try {
        const adminAccount = await Admin.findByIdAndUpdate(adminId, {isActive: true}).select("-password -refreshToken")
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Admin account successfully enabled", adminAccount)
        )
    } catch (error) {
        throw new ApiError(500, "Error while enabling admin account", error)
    }
})



const generateReports = asyncHandler( async(req, res)=>{
    const adminId = req.user?._id && req.user.role.adminId

    const{ reportType, metrics, visualizationType, filters, data, generatedAt, expiresAt, isActive, fileUrl} = req.body

    if(!reportType){
        throw new ApiError(400, "Report Type is required")
    }

    if(!metrics){
        throw new ApiError(400, "Metrics is required")
    }

    if(!visualizationType){
        throw new ApiError(400, "Visualization Type is required")
    }

    if(!data){
        throw new ApiError(400, "Data is required")
    }

    if(!generatedAt){
        throw new ApiError(400, "Generated At is required")
    }

    if(!expiresAt){
        throw new ApiError(400, "Expires At is required")
    }

    if(!fileUrl){
        throw new ApiError(400, "File URL is required")
    }

    if(!adminId){
        throw new ApiError(404, "Admin not found", error)
    }

    const report = await AnalyticsReport.create({
        admin: adminId,
        reportType,
        metrics,
        visualizationType,
        filters: filters || [],
        data,
        generatedAt,
        expiresAt,
        isActive: isActive || false,
        fileUrl
    })

    if(!report){
        throw new ApiError(500, "Error generating the report", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Report generated successfully", report)
    )
})



export {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin,
    logoutAdmin,
    resetPassword,
    changeRole,
    getAdminActivity,
    suspendAdmin,
    enableAdmin,
    generateReports,
}
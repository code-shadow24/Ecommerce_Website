import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Admin } from "../models/admin.model.js";

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

    const admin = await Admin.findByIdAndUpdate(
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

    if(!admin) {
        throw new ApiError(500, "Error occured while updating admin profile", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Admin profile updated successfully", admin)
    )

})

const deleteAdmin = asyncHandler( async(req, res)=>{
    
})

const loginAdmin = asyncHandler( async(req, res)=>{

})

const logoutAdmin = asyncHandler( async(req, res)=>{

})

const resetPassword = asyncHandler( async(req, res)=>{

})

const changeRole = asyncHandler( async(req, res)=>{

})

const getAdminActivity = asyncHandler( async(req, res)=>{

})

const suspendAdmin = asyncHandler( async(req, res)=>{

})

const enableAdmin = asyncHandler( async(req, res)=>{

})

const getAdminProfile = asyncHandler( async(req, res)=>{

})

const updateAdminProfile = asyncHandler( async(req, res)=>{

})

const generateReports = asyncHandler( async(req, res)=>{

})

const configureSettings = asyncHandler( async(req, res)=>{

})

const manageUsers = asyncHandler( async(req, res)=>{

})

const manageSellers = asyncHandler( async(req, res)=>{

})

const manageProducts = asyncHandler( async(req, res)=>{

})

const manageOrders = asyncHandler( async(req, res)=>{

})

const manageCategory = asyncHandler( async(req, res)=>{

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
    getAdminProfile,
    updateAdminProfile,
    generateReports,
    configureSettings,
    manageUsers,
    manageSellers,
    manageProducts,
    manageOrders,
    manageCategory
}
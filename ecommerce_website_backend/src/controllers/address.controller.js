import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Address } from "../models/address.model.js";

const getAllAddresses = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "User is either not logged in or not authorized")
    }

    const results = await Address.find(userId)

    if(!results){
        throw new ApiError(404, "User's addresses not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "User's addresses retrieved successfully", results)
    )
})

const getAddressById = asyncHandler(async(req, res)=>{
    const {addressId} = req.body

    if(!addressId){
        throw new ApiError(400, "Atleast One Address Id is required")
    }

    const requestedAddress = await Address.find({_id: addressId})

    if(!requestedAddress){
        throw new ApiError(400, "Address not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address retrieved successfully",requestedAddress)
    )
})

const createAddress = asyncHandler(async(req, res)=>{

    const {mobileNo, AddressLine1, AddressLine2, City, State, Country, Pincode} = req.body

    //Validate
    if(!mobileNo){
        throw new ApiError(400, "Mobile Number Required")
    }

    if(AddressLine1?.trim()==""){
        throw new ApiError(400, "Address Line 1 required")
    }

    if(City?.trim()==""){
        throw new ApiError(400, "City required")
    }

    if(State?.trim()==""){
        throw new ApiError(400, "State required")
    }

    if(Country?.trim()==""){
        throw new ApiError(400, "Country required")
    }

    if(!Pincode){
        throw new ApiError(400, "Pincode required")
    }

    const engRegex1 = /^[a-zA-Z]*$/;
    if(!engRegex1.test(City)){
        throw new ApiError(400, "City should be in English Language")
    }
    if(!engRegex1.test(State)){
        throw new ApiError(400, "State should be in English Language")
    }
    if(!engRegex1.test(Country)){
        throw new ApiError(400, "Country should be in English Language")
    }

    const numRegex = /^[0-9]*$/;
    if(!numRegex.test(mobileNo)){
        throw new ApiError(400, "Mobile Number must contain numeric values only")
    }

    if(!numRegex.test(Pincode)){
        throw new ApiError(400, "Pincode must contain numeric values only")
    }

    const newAddress = await Address.create({
        name: userId.fullName,
        mobileNo,
        AddressLine1,
        AddressLine2 : AddressLine2 || "",
        City,
        State,
        Country,
        Pincode
    })

    if(!newAddress){
        throw new ApiError(500, "Error creating new address")
    }

    const newAddressCheck = await Address.findById(newAddress._id)

    if(!newAddressCheck){
        throw new ApiError(500, "Error retrieving new address")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address created successfully", newAddressCheck)
    )
})

const updateAddress = asyncHandler(async(req, res)=>{
    const {mobileNo, AddressLine1, AddressLine2, City, State, Country, Pincode} = req.body

    //Validate
    if(!mobileNo){
        throw new ApiError(400, "Mobile Number Required")
    }

    if(AddressLine1?.trim()==""){
        throw new ApiError(400, "Address Line 1 required")
    }

    if(City?.trim()==""){
        throw new ApiError(400, "City required")
    }

    if(State?.trim()==""){
        throw new ApiError(400, "State required")
    }

    if(Country?.trim()==""){
        throw new ApiError(400, "Country required")
    }

    if(!Pincode){
        throw new ApiError(400, "Pincode required")
    }

    const engRegex1 = /^[a-zA-Z]*$/;
    if(!engRegex1.test(City)){
        throw new ApiError(400, "City should be in English Language")
    }
    if(!engRegex1.test(State)){
        throw new ApiError(400, "State should be in English Language")
    }
    if(!engRegex1.test(Country)){
        throw new ApiError(400, "Country should be in English Language")
    }

    const numRegex = /^[0-9]*$/;
    if(!numRegex.test(mobileNo)){
        throw new ApiError(400, "Mobile Number must contain numeric values only")
    }

    if(!numRegex.test(Pincode)){
        throw new ApiError(400, "Pincode must contain numeric values only")
    }

    const addressUpdate = await Address.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: userId.fullName,
                mobileNo,
                AddressLine1,
                AddressLine2 : AddressLine2 || "",
                City,
                State,
                Country,
                Pincode
            }
        },
        {new: true}
    )

    if(!addressUpdate){
        throw new ApiError(500, "Error updating address")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address updated successfully", addressUpdate)
    )
})

const deleteAddress = asyncHandler(async(req, res)=>{
    const {addressId} = req.body

    if(!addressId){
        throw new ApiError(400, "Address Id not provided")
    }

    const deleteAddressRequest = await Address.findByIdAndDelete({_id: addressId})

    if(!deleteAddressRequest){
        throw new ApiError(500, "Error occurred while deleting address")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address deleted successfully", null)
    )
})

const getAddressByCountry = asyncHandler(async(req, res)=>{
    const {country} = req.body;

    if(!country){
        throw new ApiError(400, "Country Name is required")
    }

    const addressesByCountry = await Address.find({Country: country})

    if(!addressesByCountry){
        throw new ApiError(500, "Error while fetching address based on country from server")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address on the basis of the country has been retrieved successfully", addressesByCountry)
    )
})

const getAddressByPostalCode = asyncHandler(async(req, res)=>{
    const {pincode} = req.body;

    if(!pincode){
        throw new ApiError(400, "Pincode is required")
    }

    const addressesByPincode = await Address.find({Pincode: pincode})

    if(!addressesByPincode){
        throw new ApiError(500, "Error while fetching address based on pincode from server")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address on the basis of the pincode has been retrieved successfully", addressesByPincode)
    )
})

const getAddressByCity = asyncHandler(async(req, res)=>{
    const {city} = req.body;

    if(!city){
        throw new ApiError(400, "City Name is required")
    }

    const addressesByCity = await Address.find({City: city})

    if(!addressesByCity){
        throw new ApiError(500, "Error while fetching address based on city from server")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Address on the basis of the city has been retrieved successfully", addressesByCity)
    )
})

export {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressByCountry,
    getAddressByPostalCode,
    getAddressByCity
}
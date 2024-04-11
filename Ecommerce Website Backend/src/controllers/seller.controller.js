import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { Seller } from "../models/seller.model.js";
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";

const accessAndRefreshTokenGenerator = async(sellerId)=>{
  try {
    const seller = await Seller.findById(sellerId);
    const accessToken = seller.generateAccessToken();
    const refreshToken = seller.generateRefreshToken();
    seller.refreshToken = refreshToken;
    await seller.save({validateBeforeSave: false});

    return{ accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Unable to generate access token and refresh token")
  }

}

const registerSeller = asyncHandler(async (req, res) => {

  //Get all the details from the frontend
  const {
    firstName,
    lastName,
    email,
    brandName,
    productCategories,
    password,
    shopAddress,
    phoneNumber,
    accounttype,
    accountNumber,
    bankName,
    IFSCCode,
    accountName,
    accountURL,
  } = req.body;

  //Validation Process

  //Check if all the required fields are present or not

  //check if first name is present
  if (firstName?.trim() == "") {
    throw new ApiError(400, "First Name is required");
  }

  //check if last name is present
  if (lastName?.trim() == "") {
    throw new ApiError(400, "Last Name is required");
  }

  //check if email is present
  if (email?.trim() == "") {
    throw new ApiError(400, "Email is required");
  }

  //check if brand name is present
  if (brandName?.trim() == "") {
    throw new ApiError(400, "Brand Name is required");
  }

  //check if password is present
  if (password?.trim() == "") {
    throw new ApiError(400, "Password is required");
  }

  //check if shopAddress is present
  if (shopAddress?.trim() == "") {
    throw new ApiError(400, "ShopAddress is required");
  }

  //check if phoneNumber is present
  if (phoneNumber?.trim() == "") {
    throw new ApiError(400, "PhoneNumber is required");
  }

  //check if accountType is present
  if (accounttype?.trim() == "") {
    throw new ApiError(400, "AccountType is required");
  }

  //check if accountNumber is present
  if (accountNumber?.trim() == "") {
    throw new ApiError(400, "AccountNumber is required");
  }

  //check if bankNumber is present
  if (bankName?.trim() == "") {
    throw new ApiError(400, "BankName is required");
  }

  //check if IFSC Code is present
  if (IFSCCode?.trim() == "") {
    throw new ApiError(400, "IFSCCode is required");
  }

  //check if accountURL is given is accountName is provided
  if (accountName?.trim() != "") {
    if (accountURL?.trim() == "") {
      throw new ApiError(400, "AccountURL is required");
    }
  }

  //Check if the email address is in valid format or not

  //predefined email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //Check if the email entered by the seller matches the format or not
  if (!emailRegex.test(email)) {
    throw new ApiError(401, "Invalid email address");
  }

  //Check if password matches the criteria or not

  //Pre-defined password format(the password must be 8 character long and must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 speacial character from the list(@,$,!,%,*,?,&))
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

  //Check if the password provided by the seller meets the required criteria or not
  if (!password.match(passRegex)) {
    throw new ApiError(
      402,
      "Password must be 8 characters long. Atleast one lowercase letter, one uppercase letter, one number, and one special character is required(@, $, !, %, *, ?, &)"
    );
  }

  //Check if the accounttype entered by the seller is from the provided option or not ("current" or "savings")
  if (accounttype != "Current" && accounttype != "Savings") {
    throw new ApiError(408, "Account type can either be current or savings");
  }

  //Check if any of the unique details entered by the seller already exists in the database

  //email address
  //check if the email address entered by the seller already exists in the database
  const existingEmail = await Seller.findOne({ email });

  //if the email address entered by the seller already exists in the database
  if (existingEmail) {
    throw new ApiError(409, "Email address already exists");
  }

  //phone number
  //check if the phone number entered by the seller already exists in the database
  const existingPhoneNumber = await Seller.findOne({ phoneNumber });

  //if the phone number entered by the seller already exists in the database
  if (existingPhoneNumber) {
    throw new ApiError(409, "Phone number already exists");
  }

  //bank account number
  //check if the bank account number entered by the seller already exists in the database
  const existingBankAccountNumber = await Seller.findOne({ accountNumber });

  //if the bank account number entered by the seller already exists in the database
  if(existingBankAccountNumber){
    throw new ApiError(409, "Bank account number already exists");
  }

  //brandName
  //check if brand name entered by the seller already exists in the database
  const existingBrandName = await Seller.findOne({ brandName });

  //if the brand name entered by the seller already exists in the database
  if(existingBrandName){
    throw new ApiError(409, "Brand name already exists");
  }

  //accountURL
  //check if the account URL entered by the seller already exists in the database
  if(accountURL?.trim() != ""){
    const existingAccountURL = await Seller.findOne({ accountURL });
    if(existingAccountURL){
        throw new ApiError(409, "Social Media Account URL already exists");
    }
  }

  //get avatar local path
  const avatarLocalPath = req.file?.path;

  //upload the avatar on cloudinary server
  const avatar = await fileUpload(avatarLocalPath);

  const seller = await Seller.create({
    fullName : {
        firstName,
        lastName
    },
    email,
    brandName,
    productCategories,
    password,
    shopAddress,
    phoneNumber,
    bankDetails: {
        accounttype: "Current" || "Savings",
        accountNumber,
        bankName,
        IFSCCode
    },
    avatar: avatar?.url || "",
    socialMedia: [
        {
            accountName,
            accountURL
        }
    ]
  })

  const registeredSeller = await Seller.findById(seller._id).select("-password -refreshToken")

  if(!registeredSeller) {
    throw new ApiError(500, "Unable to register the seller successfully. Try again later")
  }

  return res.status(200).json(
    new ApiResponse(200, "Seller registered successfully", registeredSeller)
  )

});

const loginSeller = asyncHandler(async(req, res) => {
  
  //Get info from frontend
  const {email, password} = req.body;

  //Validate
  //check if email field is entered by the seller or not
  if(email?.trim()==""){
    throw new ApiError(400, "Email address is required")
  }

  //If the seller is using email address to login check if the format of the email entered by the seller is correct or not
  if (email) {
    //Predefined email address format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    //Check if the email entered by the user matches the format or not
    if (!emailRegex.test(email)) {
      throw new ApiError(401, "Invalid email address");
    }
  }

  //Check if the email entered by the user matches the email in database
  const existingSeller = await Seller.findOne({email})

  //if the seller does not exist
  if(!existingSeller){
    throw new ApiError(402, "Seller is not registered");
  }

  //Check if the password entered by the seller matches the password in database
  const checkPass = await existingSeller.passwordChecker(password);

  //if password is incorrect
  if(!checkPass){
    throw new ApiError(403, "Password is incorrect");
  }

  //Generate access token and refresh token
  const { accessToken, refreshToken } = await accessAndRefreshTokenGenerator(existingSeller._id);

  //Make a database call to get the refresh token with the seller detail
  const loggedInSeller = await Seller.findById(existingSeller._id).select("-password, -refreshToken")

  //add options to restrict any changes in cookies from frontend, it can be changed only from server
  const options = {
    httpOnly: true,
    secure: true
  }

  //send the response to the seller along with the cookies
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, "Seller logged in successfully", loggedInSeller)
  )

})

const updateAddress = asyncHandler( async (req, res) => {
  //Get the address from the frontend
  const {shopAddress} = req.body;

  //Check if the address field is filled or not
  if(shopAddress?.trim() == '') {
    throw new ApiError(400, "Shop Address is required")
  }

  //address regex
  const addressRegex = /^[a-zA-Z0-9 !@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]*$/

  //Check if the address entered by the seller matches the address regex
  if(!addressRegex.test(shopAddress)){
    throw new ApiError(400, "Shop Address should be entered in English langaue only and can contain number from 0-9 and '-' and '/' symbol" )
  }

  //Find the seller and update the address
  const seller = await Seller.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        shopAddress
      }
    },
    {new: true}
  ).select("-password -refreshToken")

  //If the seller is not found
  if(!seller){
    throw new ApiError(404, "Seller not found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Address updated successfully", seller)
  )

})

const logOut = asyncHandler( async (req, res) => {
  //Get seller's mongo Id
  const sellerId = req.user?._id;

  await Seller.findByIdAndUpdate(
    sellerId,
    {
      $unset : {
        refreshToken: 1
      }
    },
    {new: true}
  )

  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .cookie("accessToken", options)
  .cookie("refreshToken", options)
  .json(
    new ApiResponse(200, "Seller logged out successfully", null)
  )

})

const getCurrentSeller = asyncHandler( async (req, res) => {
  const seller = req.user

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Seller fetched successfully", seller)
  )
})

export {
   registerSeller, 
   loginSeller, 
    updateAddress, 
    logOut, 
    getCurrentSeller 
};

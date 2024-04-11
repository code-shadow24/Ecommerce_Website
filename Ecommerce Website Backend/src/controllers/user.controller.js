import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Address } from "../models/address.model.js";

//Generates access token and refresh token
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken= user.accessTokenGenerator()
    const refreshToken = user.refreshTokenGenerator();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh token")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  //Accept data from the frontend
  const { firstName, lastName, emailAddress, password, mobileNumber } =
    req.body;

  //Check if all the required fields are entered or not
  if (
    [firstName, lastName, emailAddress, password, mobileNumber].some(
      (field) => field?.trim() == ""
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  //Pre-defined email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  //Check if the email entered by the user matches the format or not
  if (!emailRegex.test(emailAddress)) {
    throw new ApiError(401, "Invalid email address");
  }

  //Pre-defined password format(the password must be 8 character long and must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 speacial character from the list(@,$,!,%,*,?,&))
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

  //Check if the password provided by the user meets the required criteria or not
  if (!password.match(passRegex)) {
    throw new ApiError(
      402,
      "Password must be 8 characters long. Atleast one lowercase letter, one uppercase letter, one number, and one special character is required(@, $, !, %, *, ?, &)"
    );
  }

  //check if the email address entered by the user already exist in the database
  const existingEmail = await User.findOne({ emailAddress });
  //console.log(existingEmail)

  //if email address already exists in the database throw an error
  if (existingEmail) {
    throw new ApiError(400, "Email address already exists");
  }

  //check if the phone number entered by the user already exists in the database
  const existingMobileNumber = await User.findOne({ mobileNumber });
  //console.log(existingMobileNumber)

  //if phone number entered by the user already exists in the database throw an error
  if (existingMobileNumber) {
    throw new ApiError(400, "Mobile number already exists");
  }

  //get the localfilepath of the avatar uploaded from the multer
  const avatarLocalPath = req.file?.path;
  console.log(req.files);

  //check if localfilepath exists
  if (!avatarLocalPath) {
    throw new ApiError(
      409,
      "Avatar Local Path not recieved. Error uploading the avatar"
    );
  }

  //upload the avatar on cloudinary server by passing the localfilepath
  const avatar = await fileUpload(avatarLocalPath);

  //check if the avatar successfully uploaded to cloudinary server
  if (!avatar) {
    throw new ApiError(410, "Error uploading the avatar on the cloudinary");
  }

  //Create a new user object and make the entry in the database
  const user = await User.create({
    fullname: {
      firstName,
      lastName,
    },
    emailAddress,
    password,
    mobileNumber,
    avatar: avatar.url,
  });

  //check if the user is successfully created and remove the password and refreshToken from the response
  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //if the user is not created successfully throw an error
  if (!userCreated) {
    throw new ApiError(500, "Error occured while registering the new user");
  }

  //if the user is successfully created send the response back to the frontend
  return res
    .status(200)
    .json(new ApiResponse(200, "User registered successfully", userCreated));
});

const loginUser = asyncHandler(async (req, res) => {

  //Get details from the frontend
  const { emailAddress, password } = req.body;

  //Validate
  //check if the email address /phone number is entered by the user or not
  if (emailAddress?.trim()==""){
    throw new ApiError(409, "Email address or mobile number is required");
  }

  //If the user is using email address to login check if the format of the email entered by the user is correct or not
  if (emailAddress) {
    //Predefined email address format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    //Check if the email entered by the user matches the format or not
    if (!emailRegex.test(emailAddress)) {
      throw new ApiError(401, "Invalid email address");
    }
  }

  //Check if the email entered by the user is present in the database or not
  const existingUser = await User.findOne({emailAddress});

  //if the user is not registered
  if (!existingUser){
    throw new ApiError(410, "User is not registered")
  }

  //check if the user has entered the correct password or not
  const passCheck = await existingUser.passwordCheck(password)

  //if the user has entered the wrong password throw an error
  if(!passCheck){
    throw new ApiError(410, "Password is incorrect")
  }

  //generate the access token or refresh token
  const {accessToken, refreshToken} = await generateAccessandRefreshToken(existingUser._id);

  //Send a database call to get the refresh token in user object and remove password and refreshToken
  const loggedInUser = await User.findById(existingUser._id).select("-password, -refreshToken")

  //add options to restrict any changes in cookies from frontend, it can be changed only from server
  const options = {
    httpOnly: true,
    secure: true
  }


  //send the response and the cookies to the user
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, "User successfully logged in", {loggedInUser, accessToken, refreshToken})
  )

});

const changeAddress = asyncHandler( async (req, res) => {

    //Get the address from the frontend
    const {AddressLine1, AddressLine2, City, State, Country, Pincode} = req.body;

    if(AddressLine1?.trim() == "") {
      throw new ApiError(400, "Address line 1 is required")
    }

    if(City?.trim() == "") {
      throw new ApiError(400, "City is required")
    }

    if(State?.trim() == "") {
      throw new ApiError(400, "State is required");
    }

    if(Country?.trim() == "") {
      throw new ApiError(400, "Country is required");
    }

    if(Pincode?.trim() == "") {
      throw new ApiError(400, "Pincode is required");
    }

    const addressRegex = /^[a-zA-Z0-9 !@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]*$/

    if(!addressRegex.test(AddressLine1)){
      throw new ApiError(400, "Address line 1 should be entered in English langaue only and can contain number from 0-9 and '-' and '/' symbol" )
    }

    if(AddressLine2?.trim()!=""){
      if(!addressRegex.test(AddressLine2)){
        throw new ApiError(400, "Address line 2 should be entered in English langaue only and can contain number from 0-9 and '-' and '/' symbol")
      }
    }

    const addressRegex1 = /^[a-zA-Z]*$/

    if(!addressRegex1.test(City)){
      throw new ApiError(400, "City must be entered in English langaue only")
    }

    if(!addressRegex1.test(State)){
      throw new ApiError(400, "State must be entered in English langaue only")
    }

    if(!addressRegex1.test(Country)){
      throw new ApiError(400, "Country must be entered in English langaue only")
    }

    const pincodeRegex = /^[0-9]*$/

    if(!pincodeRegex.test(Pincode)){
      throw new ApiError(400, "Pincode entered must contain only numeric values")
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set : {
          AddressLine1,
          AddressLine2,
          City,
          State,
          Country,
          Pincode
        },
      },
      {new: true}
    ).select("-password -refreshToken")

    if(!user){
      throw new ApiError(500, "Unable to update the address")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, "Address updated successfully", user)
    )
});

const logOut = asyncHandler( async (req, res) => {
  const userId = req.user?._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {new: true}
  )

  const options ={
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", options)
  .cookie("refreshToken", options)
  .json(
    new ApiResponse(200, "User logged out successfully", null)
  )

})

const getCurrentUser = asyncHandler( async (req, res) => {
  const user = req.user;
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, "User details fetched successfully", user)
  )
})

export { registerUser, loginUser, changeAddress, logOut, getCurrentUser };

import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

export { registerUser };

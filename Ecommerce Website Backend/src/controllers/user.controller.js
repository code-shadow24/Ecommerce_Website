import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { fileDelete, fileUpload } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Address } from "../models/address.model.js";
import { PaymentDetail } from "../models/paymentDetail.model.js";
import { Order } from "../models/order.model.js";
import { Rating } from "../models/ratings.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import { Cart } from "../models/cart.model.js";
import { sendUserPasswordResetEmail } from "../utils/emails/passwordResetVerificationCodeemail.js";

//Generates access token and refresh token
const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.accessTokenGenerator();
    const refreshToken = user.refreshTokenGenerator();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh token");
  }
};

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
  if (emailAddress?.trim() == "") {
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
  const existingUser = await User.findOne({ emailAddress });

  //if the user is not registered
  if (!existingUser) {
    throw new ApiError(410, "User is not registered");
  }

  //check if the user has entered the correct password or not
  const passCheck = await existingUser.passwordCheck(password);

  //if the user has entered the wrong password throw an error
  if (!passCheck) {
    throw new ApiError(410, "Password is incorrect");
  }

  //generate the access token or refresh token
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    existingUser._id
  );

  //Send a database call to get the refresh token in user object and remove password and refreshToken
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password, -refreshToken"
  );

  //add options to restrict any changes in cookies from frontend, it can be changed only from server
  const options = {
    httpOnly: true,
    secure: true,
  };

  //send the response and the cookies to the user
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User successfully logged in", {
        loggedInUser,
        accessToken,
        refreshToken,
      })
    );
});

const logOut = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", null));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

const updateDetails = asyncHandler(async (req, res) => {
  //Get user details from the frontend
  const { firstName, lastName, emailAddress, mobileNumber } = req.body;

  //Check if all the required fields are present
  if (firstName?.trim() == "") {
    throw new ApiError(400, "FirstName is required");
  }

  if (lastName?.trim() == "") {
    throw new ApiError(400, "LastName is required");
  }

  if (emailAddress?.trim() == "") {
    throw new ApiError(400, "EmailAddress is required");
  }

  if (mobileNumber?.trim() == "") {
    throw new ApiError(400, "MobileNumber is required");
  }

  //Check if every detail is in required format or not
  const nameRegex1 = /^[a-zA-Z]*$/;
  if (!nameRegex1.test(firstName)) {
    throw new ApiError(400, "FirstName should be in English Langauge");
  }

  if (!nameRegex1.test(lastName)) {
    throw new ApiError(400, "LastName should be in English Language");
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(emailAddress)) {
    throw new ApiError(401, "Invalid email address");
  }

  const phoneRegex = /^[0-9]*$/;
  if (!phoneRegex.test(mobileNumber)) {
    throw new ApiError(401, "Invalid mobile number");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: {
          firstName,
          lastName,
        },
        emailAddress,
        mobileNumber,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(500, "Unable to update the profile details");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully", user));
});
 
const changeAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const avatarPath = req.file?.path;

  if (!avatarPath) {
    throw new ApiError(404, "Avatar local path not found");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await fileDelete(user.avatar, false);

  const newAvatar = await fileUpload(avatarPath);

  if (!newAvatar.url) {
    throw new ApiError(404, "Avatar not uploaded successfully");
  }

  const existingUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: newAvatar.secure_url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", existingUser));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  //Get user detail from the database
  const user = await User.findById(userId).select("-password -refreshToken");

  //Check if user is present in the database
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //Fetch user's address count and address
  const addressCount = await Address.countDocuments({ name: userId });
  const address = await Address.find({ name: userId });

  //Fetch user's Payment details
  const paymentDetailsCount = await PaymentDetail.countDocuments({
    name: userId,
  });
  const paymentDetailsData = await PaymentDetail.find({ name: userId });

  //Fetch user's Order details
  const orderCount = await Order.countDocuments({ name: userId });
  const orderDetails = await Order.find({ name: userId });

  //Fetch user's product rating information
  const ratingCount = await Rating.countDocuments({ name: userId });
  const ratingDetais = await Rating.find({ name: userId });

  //Fetch user's wishlist information
  const wishlistCount = await Wishlist.countDocuments({ name: userId });
  const wishlistDetails = await Wishlist.find({ name: userId });

  //Fetch user's Cart information
  const cartItemsCount = await Cart.countDocuments({ name: userId });
  const cartItemsDetails = await Cart.find({ name: userId });

  const userDetails = {
    user: user,
    address: {
      count: addressCount,
      data: address,
    },
    paymentDetails: {
      count: paymentDetailsCount,
      data: paymentDetailsData,
    },
    order: {
      count: orderCount,
      data: orderDetails,
    },
    rating: {
      count: ratingCount,
      data: ratingDetais,
    },
    wishlist: {
      count: wishlistCount,
      data: wishlistDetails,
    },
    cart: {
      count: cartItemsCount,
      data: cartItemsDetails,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User details fetched successfully", userDetails)
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json(new ApiResponse(404, "User not found", null));
    }

    //Delete the user avatar from the cloudinary server
    try {
      await fileDelete(existingUser.avatar, false);
    } catch (error) {
      throw new ApiError(500, "Error deleting the user avatar", error);
    }

    //Delete the user address from the database
    try {
      const addresses = await Address.find({ name: userId });

      await Address.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting the user address", error);
    }

    //Delete the user paymentDetails from the database
    try {
      const paymentdetails = await PaymentDetail.find({ name: userId });

      await PaymentDetail.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting the user paymentDetails", error);
    }

    //Delete the user wishlist from the database
    try {
      const wishlist = await Wishlist.find({ name: userId });

      await Wishlist.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting wishlist", error);
    }

    //Delete the user's ratings from the database
    try {
      const ratings = await Rating.find({ name: userId });

      await Rating.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting the user's ratings", error);
    }

    //Delete the user's order details from the database
    try {
      const orders = await Order.find({ name: userId });

      await Order.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting the user's order details", error);
    }

    //Delete the user's cart details
    try {
      const cart = await Cart.find({ name: userId });

      await Cart.deleteMany({ name: userId });
    } catch (error) {
      throw new ApiError(500, "Error deleting the user's cart details", error);
    }

    //Delete the user id
    try {
      await User.findByIdAndDelete(userId);
    } catch (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, "Error deleting user document", error));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully deleted User Id", null));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Error deleting user Id", error));
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const providedRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!providedRefreshToken) {
    throw new ApiError(404, "No refresh token provided");
  }

  try {
    const verifiedToken = jwt.verify(
      providedRefreshToken,
      process.env.REFRESH_SECRET_TOKEN_KEY
    );

    const user = await User.findById(verifiedToken._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (providedRefreshToken !== user?.refreshToken) {
      throw new ApiError(
        403,
        "Refresh token does not match provided refresh token"
      );
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(
        new ApiResponse(200, "Access Token refreshed successfully", {
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(
      401,
      "Failed to refresh access token. Invalid refresh token",
      error
    );
  }
});

const getUserById = asyncHandler(async(req, res)=>{
  const userId = req.body || req.query

  if(!userId){
    throw new ApiError(400, "User Id is required")
  }

  const user = await User.findById(userId)

  if(!user){
    throw new ApiError(500, "Error occured while fetching the error")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "User fetched successfully", user)
  )
})

const getAllUsers = asyncHandler(async(req, res)=>{
  const users = await User.find()

  if(users.length==0){
    return res
    .status(404)
    .json(
      new ApiResponse(404, "No user found")
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Users fetched successfully", users)
  )
})

const resetUserPassword = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const user = await User.findById(userId)

  const {password} = req.body

  const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
  if (!password.match(passRegex)) {
    throw new ApiError(
      402,
      "Password must be 8 characters long. Atleast one lowercase letter, one uppercase letter, one number, and one special character is required(@, $, !, %, *, ?, &)"
    );
  } 

  await sendUserPasswordResetEmail(userId)

  const hashedPassword = bcrypt.hash(password, 14)

  if(!hashedPassword){
    throw new ApiError(404, "Error Saving new password", error)
  }

  try {
    await User.findByIdAndUpdate(userId, {password: hashedPassword})
    return res
    .status(200)
    .json(
      new ApiResponse(200, "Password changed successfully", null)
    )
  } catch (error) {
    throw new ApiError(500, "Error occured while changing the password", error)
  }
})

const getUserOrders = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const userOrders = await User.find({name: userId})

  if(userOrders.length==0){
    return res
    .status(404)
    .json(
      new ApiResponse(404, "No Orders for the user found", null)
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "All User Orders Fetched Successfully", userOrders)
  )
})

const getUserAddress = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const userAddress = await User.find({name:userId})

  if(userAddress.length==0){
    return res
    .status(404)
    .json(
      new ApiResponse(
        404, "No Address found"
      )
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Address for the user fetched successfully", userAddress)
  )

})

const getUserWishlist = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const userWishlist = await Wishlist.find({name: userId})

  if(userWishlist.length==0){
    return res
    .status(404)
    .json(
      new ApiResponse(404, "No Wishlist found", null)
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "User Wishlist Fetched Successfully", userWishlist)
  )
})

const getUserReviews = asyncHandler(async(req, res)=>{
  const userId = req.user?._id

  const userReviews = await Rating.find({user: userId})

  if(userReviews.length==0){
    return res
    .status(404)
    .json(
      new ApiResponse(404, "No User Reviews Found")
    )
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "User Reviews Fetched Successfully", userReviews)
  )
})

export {
  registerUser,
  loginUser,
  logOut,
  getCurrentUser,
  updateDetails,
  changeAvatar,
  getUserDetails,
  refreshAccessToken,
  deleteUser,
  getUserById,
  getAllUsers,
  resetUserPassword,
  getUserOrders,
  getUserAddress,
  getUserWishlist,
  getUserReviews
};

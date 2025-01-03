import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandle";
import { Seller } from "../models/seller.model";

const authentication = asyncHandler(async (req, res, next) => {
  try {
    const validUser =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!validUser) {
      throw new ApiError(400, "User not logged in or Invalid request");
    }

    const token = jwt.verify(validUser, process.env.ACCESS_TOKEN_SECRET_KEY);

    const user = await User.findById(token?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(400, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "Invalid request");
  }
});

const sellerAuthentication = asyncHandler(async (req, res) => {
  try {
    const validSeller =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!validSeller) {
      throw new ApiError(400, "Seller not logged in or invalid request");
    }

    const token = jwt.verify(validSeller, process.env.ACCESS_TOKEN_SECRET_KEY);

    const seller = await Seller.findById(token?._id).select(
      "-password -refreshToken"
    );

    if (!seller) {
      throw new ApiError(400, "Seller not found");
    }

    req.user = seller;
    next();
  } catch (error) {
    throw new ApiError(400, "Invalid Request");
  }
});

export { authentication, sellerAuthentication };

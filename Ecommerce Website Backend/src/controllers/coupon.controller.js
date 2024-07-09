import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Coupon } from "../models/coupon.model.js";

const getAllCoupons = asyncHandler(async(req, res)=>{
    const coupons = await Coupon.find();

    if(!coupons){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Coupons found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Coupons retrieved successfully", coupons)
    )
})
const getCouponById = asyncHandler(async(req, res)=>{
    const couponId = req.params


    const coupon = await Coupon.find(couponId)

    if(!coupon){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Coupon not found", null)
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Coupon successfully retrieved", coupon)
    )
})
const createCoupon = asyncHandler(async(req, res)=>{

    const {couponId, couponCode, discountType, discountAmount, minimumPurchaseAmount, expirationDate, usageLimit} = req.body

    if(couponId?.trim()==""){
        throw new ApiError(400, "CouponId is required")
    }

    if(couponCode?.trim()==""){
        throw new ApiError(400, "CouponCode is required")
    }

    if(discountType?.trim()==""){
        throw new ApiError(400, "DiscountType is required")
    }

    if(minimumPurchaseAmount?.trim==""){
        throw new ApiError(400, "MinPurchaseAmount is required")
    }

    if(expirationDate?.trim()==""){
        throw new ApiError(400, "ExpirationDate is required")
    }

    if(!usageLimit){
        throw new ApiError(400, "UsageLimit is required")
    }

    const newCoupon = await Coupon.create({
        couponId,
        couponCode,
        discountType,
        discountAmount: discountAmount || 0,
        minimumPurchaseAmount,
        expirationDate,
        usageLimit,
        usageCount: 0,
        status: 'active',
    })

    if(!newCoupon){
        throw new ApiError(500, "Error occured while creating new coupon")
    }

    const coupon = await Coupon.findById(newCoupon._id)

    if(!coupon){
        throw new ApiError(404, "Couldn't find coupon")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Coupon created successfully", coupon)
    )
})
const updateCoupon = asyncHandler(async(req, res)=>{
    const couponId = req.params || req.body

    const coupon = await Coupon.findById(couponId)

    if(!coupon){
        throw new ApiError(404, "Coupon not found")
    }

    const {discountAmount, minimumPurchaseAmount, usageLimit} = req.body

    if(!minimumPurchaseAmount){
        throw new ApiError(400, "Minimum purchase amount is required")
    }

    if(!usageLimit){
        throw new ApiError(400, "Usage limit is required")
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
        coupon._id,
        {
            $set: {
                discountAmount: discountAmount || 0,
                minimumPurchaseAmount,
                usageLimit
            }
        },
        {new: true}
    )

    if(!updatedCoupon){
        throw new ApiError(500, "Error occurred while updating coupon")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Coupon updated successfully", updatedCoupon)
    )
    
})

const deleteCoupon = asyncHandler(async(req, res)=>{
    const couponId = req.params

    try {
        await Coupon.findByIdAndDelete(couponId)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Coupon deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting coupon", error)
    }
})

const getValidCoupons = asyncHandler(async(req, res)=>{
    const currentDate = new Date()
    const coupons = await Coupon.find({expirationDate: {$gt: currentDate}, status: {$ne: 'applied'}})

    if(coupons.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No valid coupon found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully retrieved valid coupons", coupons)
    )
})
const getExpiredCoupons = asyncHandler(async(req, res)=>{
    const currentDate = new Date()

    const expiredCoupon = await Coupon.find({expirationDate: {$lt: currentDate}})

    if(expiredCoupon.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No expired coupon found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Expired coupon retrieved successfully", expiredCoupon)
    )
})
const getActiveCoupons = asyncHandler(async(req, res)=>{
    const activeCoupons = await Coupon.find({status: 'active'})

    if(activeCoupons.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No active coupon found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Active Coupons retrieved successfully", activeCoupons)
    )
})



export{
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getValidCoupons,
    getExpiredCoupons,
    getActiveCoupons
}
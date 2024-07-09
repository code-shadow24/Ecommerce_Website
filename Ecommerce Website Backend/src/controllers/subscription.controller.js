import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

const getAllSubscriptions = asyncHandler(async(req, res)=>{
    const allSubscriptions = await Subscription.find()

    if(allSubscriptions.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No subscriptions found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Subscriptions retrieved successfully", allSubscriptions)
    )
})
const getSubscriptionById = asyncHandler(async(req, res)=>{
    const subscriptionId = req.params.subscriptionId || req.body || req.query

    if(!subscriptionId){
        throw new ApiError(400, "Subscription Id is required")
    }

    const subscription = await Subscription.findById(subscriptionId)

    if(!subscription){
        throw new ApiError(500, "Error occured while fetching subscription")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully fetched requested subscription", subscription)
    )
})
const createSubscription = asyncHandler(async(req, res)=>{
    const userId = req.params.userId || req.user?._id

    const user = await User.findById(userId)

    if(!user) {
        throw new ApiError(404, "No User found")
    }

    const {email} = req.body

    if(email?.trim()==""){
        throw new ApiError(400, "Email Id is required")
    }

    const newSubscription = await Subscription.create({
        user: user._id,
        email: email,
        status: "Subscribed"
    })

    if(!newSubscription){
        throw new ApiError(500, "Error occured while creating subscription")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Subscription Created Successfully", newSubscription)
    )
})
const updateSubscription = asyncHandler(async(req, res)=>{
    const subscriptionId = req.params.subscriptionId || req.body || req.query
    const userId = req.user?._id

    const user = await User.findById(userId)

    const subscription = await Subscription.findById(subscriptionId)

    if(!subscription){
        throw new ApiError(404, "Subcription not found")
    }

    if(!user) {
        throw new ApiError(404, "No User found")
    }

    const {email, status} = req.body

    if(email?.trim()==""){
        throw new ApiError(400, "Email Id is required")
    }

    if(status?.trim()==""){
        throw new ApiError(400, "Status is required")
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
        subscription._id,
        {
            $set:{
                email: email,
                status
            }
        },
        {new: true}
    )

    if(!updatedSubscription){
        throw new ApiError(500, "Error Occured While Updating Subscription")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subscription Updated Successfully", updatedSubscription)
    )
})

const getActiveSubscriptionForUser = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const user = await User.findById(userId)

    if(!user) {
        throw new ApiError(404, "No User found")
    }

    const activeSubscription = await Subscription.find({user: user._id, status: "Subscribed"})

    if(activeSubscription.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Active Subscription found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All active subscription for the user fetched successfully", activeSubscription)
    )
})

export{
    getAllSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    getActiveSubscriptionForUser
}
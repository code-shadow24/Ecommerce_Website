import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Rating } from "../models/ratings.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { fileDelete, fileUpload } from "../utils/fileUpload.js";

const getAllRatings = asyncHandler(async(req, res)=>{
    const ratings = await Rating.find()

    if(ratings.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Ratings Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Ratings Fetched Successfully", ratings)
    )
})
const getRatingById = asyncHandler(async(req, res)=>{
    const ratingId = req.params.ratingId || req.body.ratingId || req.query.ratingId

    const rating = await Rating.findById(ratingId)

    if(!rating){
        throw new ApiError(500, "Error occured while getting rating")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Rating Fetched Successfully", rating)
    )
})
const createRating = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404, "UserId not found")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const productId = req.query.productId || req.body.productId || req.params.productId

    const product = await Product.findById(productId)

    if(!product) {
        throw new ApiError(404, "Product not found")
    }

    const {ratingNumber, reviewTitle, reviewText} = req.body

    if(ratingNumber<=0){
        throw new ApiError(400, "Rating number must be greater than zero")
    }

    const ratingImagePath = req.file?.path
    const ratingImageUpload = await fileUpload(ratingImagePath)

    const newRating = await Rating.create({
        product: product._id,
        user: user.fullname,
        ratingNumber,
        reviewTitle,
        reviewText,
        reviewDate: new Date(),
        helpVotes: 0,
        unhelpfulVotes: 0,
        sellerResponse: null,
        reviewImages: ratingImageUpload.url || null,
    })
    
    if(!newRating){
        throw new ApiError(500, "Error occured while creating new rating")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Rating Created Successfully", newRating)
    )
})

const updateRating = asyncHandler(async(req, res)=>{
    const ratingId = req.body.ratingId || req.params.ratingId || req.query.ratingId

    const rating = await Rating.findById(ratingId)

    if(!rating){
        throw new ApiError(404, "Rating not found")
    }

    const {helpVotes, unhelpfulVotes, sellerResponse} = req.body

    const updatedRating = await Rating.findByIdAndUpdate(
        rating._id,
        {
            $set:{
                helpVotes: helpVotes || rating.helpVotes,
                unhelpfulVotes: unhelpfulVotes || rating.unhelpfulVotes,
                sellerResponse: sellerResponse || rating.sellerResponse
            }
        },
        {new: true}
    )

    if(!updatedRating){
        throw new ApiError(500, "Error occured while updating rating")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Rating Updated Successfully", updatedRating)
    )
})
const deleteRating = asyncHandler(async(req, res)=>{
    const ratingId = req.params.ratingId || req.query.ratingId || req.body.ratingId

    const rating = await Rating.findById(ratingId)

    if(!rating){
        throw new ApiError(500, "Error occured while fetching rating")
    }

    try {
        if(rating.reviewImages && rating.reviewImages.length>0){
            await fileDelete(rating.reviewImages, false)
        }
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting review image", error)
    }

    try {
        await Rating.findByIdAndDelete(rating._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Rating Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting the ratings", error)
    }
})
const getAverageRating = asyncHandler(async(req, res)=>{
    const productId = req.params.productId || req.query.productId || req.body.productId

    const avgRating = await Rating.aggregate[
        {
            $match: {product: productId}
        },
        {
            $group: {
                $id: "$productId",
                averageRating: {$avg: "$ratingNumber"}
            }
        }
    ]

    if(avgRating.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No average ratings found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Average rating fetched successfully", avgRating)
    )
})

const getUserRatings = asyncHandler(async(req, res)=>{
    const userId = req.params.userId || req.user?._id || req.body.userId

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const userRating = await Rating.find({user: user._id}).populate('product').populate('ratingNumber').populate('reviewTitle').populate('reviewText').populate('reviewDate').populate('helpVotes').populate('unhelpfulVotes').populate('sellerResponse').populate('reviewImages')

    if(userRating.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No user ratings found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All User Ratings Fetched Successfully", userRating) 
    )
})

const getRecentRatings = asyncHandler(async(req, res)=>{
    const limit = req.query.limit || req.body.limit
    const recentRatings = await Rating.find().sort({createdAt: -1}).limit(limit)

    if(recentRatings.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Recent Ratings Available")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Recent Ratings Fetched Successfully", recentRatings)
    )
})

const getMostRatedProducts = asyncHandler(async(req, res)=>{
    const limit = parseInt(req.query.limit) || 10;

    const mostRatedProducts = await Rating.aggregate([
        {
            $group: {
                _id: "$product",
                count: {$sum: 1}
            },
        },
        {
            $sort: {count: -1}
        },
        {
            $limit: limit
        },
        {
            $lookup:{
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                count: 1,
                productDetails: 1
            }
        }
    ])

    if(mostRatedProducts.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Most Rated Products Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All MostRated Products Fetched Successfully", mostRatedProducts)
    )
})

const getHighestRatedProducts = asyncHandler(async(req, res)=>{
    const limit = parseInt(req.query.limit) || 10;
    const minRatings = parseInt(req.query.minRatings) || 1;

    const highestRatedProduct = await Rating.aggregate([
        {
            $group: {
                _id: "$product",
                averageRating: {$avg: "$ratingNumber"},
                ratingCount: { $sum: 1 }
            }
        },
        {
            $match: {
                ratingCount: { $gte: minRatings }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'products', 
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                averageRating: 1,
                ratingCount: 1,
                productDetails: 1
            }
        }
    ])

    if(highestRatedProduct.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Highest Rated Product Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Highest Rated Products Fetched Successfully", highestRatedProduct)
    )
})
const getLowestRatedProducts = asyncHandler(async(req, res)=>{
    const limit = parseInt(req.query.limit) || 10
    const maxRating = parseInt(req.query.maxRating) || 5

    const lowestRatedProducts = await Rating.aggregate([
        {
            $group: {
                _id: "$product",
                averageRating: {$avg: "$ratingNumber"},
                ratingCount: { $sum: 1 }
            }
        },
        {
            $match: {
                ratingCount: {$lte : maxRating}   
            }
        },
        {
            $sort: {averageRating: 1}
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'products', 
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                averageRating: 1,
                ratingCount: 1,
                productDetails: 1
            }
        }
    ])
})


export{
    getAllRatings,
    getRatingById,
    createRating,
    updateRating,
    deleteRating,
    getAverageRating,
    getUserRatings,
    getRecentRatings,
    getMostRatedProducts,
    getHighestRatedProducts,
    getLowestRatedProducts,
}
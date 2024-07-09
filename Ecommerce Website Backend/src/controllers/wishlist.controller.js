import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";
import { Wishlist } from "../models/wishlist.model.js";


const addToWishlist = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    const productId = req.body || req.params.productId

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(500, "Error occured while getting the product")
    }

    const inventoryDetail = await Inventory.find({productId: productId})

    if(!inventoryDetail){
        throw new ApiError(500, "Error occured while getting the inventory detail")
    }

    const newWishlist = await Wishlist.create({
        productId: product._id,
        productImage: product.productImage,
        productTitle: product.productTitle,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        name: userId,
        productAvailability: inventoryDetail.quantityAvailable
    })

    if(!newWishlist){
        throw new ApiError(500, "Error Occured while creating the wishlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Wishlist Created Successfully", newWishlist)
    )
})
const removeFromWishlist = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    const wishlistId = req.body || req.params.productId

    try {
        await Wishlist.findByIdAndDelete(wishlistId)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Product removed from wishlist", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting from wishlist", error)
    }
})

const getWishlistCount = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const wishlistCount = await Wishlist.countDocuments({name: userId})

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Wishlist count fetched successfully", wishlistCount)
    )
})





export{
    addToWishlist,
    removeFromWishlist,
    getWishlistCount,
}
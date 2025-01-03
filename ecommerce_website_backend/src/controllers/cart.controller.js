import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Coupon } from "../models/coupon.model.js";

const getCart = asyncHandler(async(req, res)=>{
    const userId = req.user._id
    
    const cart = await Cart.find({name: userId}).populate('productId')

    if(!cart){
        throw new ApiError(404, 'Cart not found');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Cart Items Retrieved Successfully", cart) 
    )
})

const addToCart = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const user = await User.findById(userId)

    const {productId, color, size, addedQuantity } = req.body
    
    if(!productId){
        throw new ApiError(400, "Product Id is required")
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(404, "Product not found", error)
    }

    const cartItem = await Cart.findOne({productId, name: userId})

    if(cartItem){
        cartItem.addedQuantity += addedQuantity
        await cartItem.save()
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Item added to the cart successfully", cartItem)
        )
    }
    else{
        const cartItem = await Cart.create({
            productId,
            color: color || "",
            size: size || "",
            addedQuantity,
            name: user.fullname
        })

        if(!cartItem){
            throw new ApiError(500, "Error occured while adding item to cart", error)
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Item added to the cart successfully", cartItem)
        )
    }
})


const removeFromCart = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const { productId } = req.body

    if(!productId){
        throw new ApiError(400, "Product Id is required")
    }

    try {
        await Cart.findByIdAndDelete({ productId, userId})
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Product removed successfully", null)
        )
    } catch (error) {
        throw new ApiError(400, "Error occurred while deleting product", error)
    }
})

const clearCart = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    try {
        const cartItems = await Cart.find({name: userId})
        cartItems.deleteMany()
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Cart cleared successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while clearing Cart", error)
    }
})

const updateOneItem = asyncHandler(async(req, res)=>{
    const userId = req.user?._id
    const {productId} = req.body

    if(!productId){
        throw new ApiError(400, "Product Id is required")
    }

    const cartItem = await Cart.findById(productId)

    cartItem.addedQuantity += 1;
    cartItem.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Item added successfully", cartItem)
    )
})

const removeOneItem = asyncHandler(async(req, res)=>{
    const userId = req.user?._id
    const {productId} = req.body

    if(!productId){
        throw new ApiError(400, "Product Id is required")
    }

    const cartItem = await Cart.findById(productId)

    cartItem.addedQuantity -= 1;
    cartItem.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Item removed successfully", cartItem)
    )
})

const calculateCartTotal = asyncHandler(async(req, res)=>{
    const userId = req.user?._id 

    const cartItems = await Cart.find({name: userId}).populate('productId')

    if (cartItems.length==0){
        return res.status(404).json( new ApiResponse(404, "No Item Found in Cart") );
    }

    let totalprice = 0;
    cartItems.forEach(cartItem =>{
        const product = cartItem.productId;
        totalprice += product.discountedPrice * cartItem.addedQuantity
    } );

    if(totalprice==0){
        return res.status(404).json( new ApiResponse(404, "No Item Found in Cart") );
    }

    totalprice -= cartItems.coupon;
    totalprice += cartItems.tax;
    totalprice += cartItems.deliveryCharge

    return res
    .status(200)
    .json(
        new ApiResponse(200, "The total price is " + totalprice)
    )
})

const calculateCartSubTotal = asyncHandler(async(req, res)=>{
    const userId = req.user?._id 

    const cartItems = await Cart.find({name: userId}).populate('productId')

    if (cartItems.length==0){
        return res.status(404).json( new ApiResponse(404, "No Item Found in Cart") );
    }

    let subtotalprice = 0;
    cartItems.forEach(cartItem =>{
        const product = cartItem.productId;
        subtotalprice += product.discountedPrice * cartItem.addedQuantity
    } );

    if(subtotalprice==0){
        return res.status(404).json( new ApiResponse(404, "No Item Found in Cart") );
    }


    return res
    .status(200)
    .json(
        new ApiResponse(200, "The Subtotal price is " + subtotalprice)
    )
})

const applyCoupon = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const cartItem = await Cart.find({name: userId}).populate('productId')

    const {couponCode} = req.body;

    if(!cartItem){
        return res.status(404).json(new ApiResponse(404, "No Item Found in Cart"));
    }

    let subtotalprice = 0;
    cartItem.forEach(cartItem =>{
        const product = cartItem.productId;
        subtotalprice += product.discountedPrice * cartItem.addedQuantity
    } );

    const coupons = await Coupon.find({couponCode: couponCode})

    if(subtotalprice < coupons.minimumPurchaseAmount) {
        return res.status(400).json(400, "Invalid Coupon Application Request")
    }

    if(coupons.usageLimit == coupons.usageCount){
        return res.status(400).json(new ApiResponse(400, "Coupon Usage Limit reached. Cannot apply the coupon"))
    }

    if(coupons.status =='Expired'){
        throw new ApiError(400, "Coupon already expired")
    }


    const cart = await Cart.findByIdAndUpdate(
        userId,
        {
            $set: {
                coupon: coupons
            }
        },
        {new : true}
    )

    if(!cart){
        throw new ApiError(500, "Error occurred while applying coupon")
    }

    coupons.usageCount += 1
    coupons.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Coupon applied successfully", cart)
    )
})


const getTaxAmount = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const cartItem = await Cart.find({name: userId}).populate('productId')

    if(cartItem.length ==0){
        return res.status(404).json(
            new ApiResponse(404, "No Item Found in Cart")
        )
    }

    let taxAmount = 0;
    cartItem.forEach(cartItem => {
        const product = cartItem.productId;
        taxAmount += product.discountedPrice * product.tax/100 * cartItem.addedQuantity
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Tax calculated successfully", taxAmount)
    )
})


export {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateOneItem,
    removeOneItem,
    calculateCartTotal,
    calculateCartSubTotal,
    applyCoupon,
    getTaxAmount,
}
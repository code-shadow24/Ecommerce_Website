import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Inventory } from "../models/inventory.model.js";

const getAllProductReturns = asyncHandler(async(req, res)=>{
    const returnOrder = await Order.find({status: {$in: ["Return Created", "Return PickedUp", "Return In-Transit", "Returned"]}})

    if(returnOrder.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No return order found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All return orders fetched successfully", returnOrder)
    )
})

const createProductReturn = asyncHandler(async(req, res)=>{
    const { orderId, productId, quantity, returnReason } = req.body

    const order = await Order.findById(orderId)

    if(!order){
        throw new ApiError(404, "No order found")
    }

    const productInOrder = order.orderItem.filter(item => item.productId._id.toString()!=productId)

    if(!productInOrder){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No such product found in order")
        )
    }

    if(quantity > productInOrder.quantity){
        throw new ApiError(400, "Return quantity cannot be greater than ordered quantity")
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(404, "Product not found")
    }

    try {
        productInOrder.quantity -= quantity;
        if (productInOrder.quantity === 0) {
            order.orderItem = order.orderItem.filter(item => item.productId._id.toString() !== productId);
        }
    
        order.returnReason = returnReason;
        order.status = 'Return Created';
        order.orderItem.returnQuantity = quantity;
        await order.save();
        
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Return Created Successfully", order)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while creating the return", error);
    }

})
const updateProductReturnStatus = asyncHandler(async(req, res)=>{
    const {status, orderId, productId} = req.body;

    const order = await Order.findById(orderId);

    if(!order){
        throw new ApiError(404, "Order not found")
    }

    if(status!="Return PickedUp" || status!="Return In-Transit" || status!="Returned"){
        throw new ApiError(400, "Enter valid status")
    }

    const updatedReturnOrder = await Order.findByIdAndUpdate(
        order._id,
        {
            $set: {
                status: status,
            }
        },
        {new: true}
    )

    if(status=="Returned"){
        const productInventory = await Inventory.find({productId: productId})

        if(!productInventory){
            throw new ApiError(404, "Inventory not found")
        }

        try {
            productInventory.quantityAvailable += order.orderItem.returnQuantity
            productInventory.quantitySold -= order.orderItem.returnQuantity
            order.orderItem.returnQuantity = 0;

            await productInventory.save();
            await order.save();

        } catch (error) {
            throw new ApiError(500, "Error occured while updating product inventory", error)
        }
    }

    if(!updatedReturnOrder){
        throw new ApiError(500, "Error occured while updating order")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Order Return Status Updated Successfully", updatedReturnOrder)
    )

})

const cancelProductReturn = asyncHandler(async(req, res)=>{
    const {status, orderId} = req.body;

    const order = await Order.findById(orderId)

    if(!order){
        throw new ApiError(404, "Order Not Found")
    }

    if(status!="Cancelled"){
        throw new ApiError(400, "Enter a valid status")
    }

    try {
        order.orderItem.returnQuantity = 0;
        order.status = "Return Cancelled";
        await order.save()

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Return Cancelled Successfully", order)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while cancelling the return order", error)
    }
})
const getProductReturnByUser = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const orders = await Order.find({
        name: userId,
        status: {$in: ["Return Created", "Return PickedUp", "Return In-Transit","Return Cancelled", "Returned"]}
    }).populate('orderItem.productId', 'name price');

    if(orders.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Return orders found for the user")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Return Orders for the user fetched successfully", orders)
    )

})




export{
    getAllProductReturns,
    createProductReturn,
    updateProductReturnStatus,
    cancelProductReturn,
    getProductReturnByUser
}
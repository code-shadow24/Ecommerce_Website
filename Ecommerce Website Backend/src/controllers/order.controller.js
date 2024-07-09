import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const updateInventory = asyncHandler(async(orderItem)=>{
    for (const item of orderItem) {
        const inventoryItem = await Inventory.findOne({ productId: item.productId });

        if (inventoryItem) {
            inventoryItem.quantityAvailable -= item.quantity;
            inventoryItem.quantitySold += item.quantity;
            await inventoryItem.save();
        }
    }
})

const updateInventoryAfterCancellation = asyncHandler(async(orderItem)=>{
    for (const item of orderItem) {
        const inventoryItem = await Inventory.findOne({ productId: item.productId });

        if (inventoryItem) {
            inventoryItem.quantityAvailable += item.quantity;
            inventoryItem.quantitySold -= item.quantity;
            await inventoryItem.save();
        }
    }
})

const getAllOrders = asyncHandler(async(req, res)=>{
    const orders = await Order.find();
    
    if(orders.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No orders found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All orders retrieved successfully", orders)
    )
})

const getOrderById = asyncHandler(async(req, res)=>{
    const orderId = req.query || req.params || req.body

    if(!orderId){
        throw new ApiError(400, "Valid Order ID is required")
    }

    const order = await Order.find({orderId: orderId})

    if(!order){
        throw new ApiError(404, "No such Order found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Requested order details fetched successfuly", order)
    )
})
const createOrder = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const { orderPrice, address, orderItem, discount, tax } = req.body;

    if(orderPrice?.trim()==""){
        throw new ApiError(400, "Order price cannot be empty")
    }

    if(address?.trim()==""){
        throw new ApiError(400, "Address cannot be empty")
    }

    if(orderItem?.trim()==""){
        throw new ApiError(400, "Order items cannot be empty")
    }

    const newOrder = Order.create({
        orderPrice,
        name: user.fullname,
        address,
        orderItem,
        discount: discount || 0,
        tax: tax || 0,
        status: "Pending"
    })

    if(!newOrder){
        throw new ApiError(500, "Error occurred while creating new order", error)
    }

    await updateInventory(orderItem)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Order created successfully", newOrder)
    )

})
const updateOrder = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const orderId = req.params || req.body

    const { address, status } = req.body;

    if(address?.trim()==""){
        throw new ApiError(400, "Address cannot be empty");
    }

    if(status?.trim()==""){
        throw new ApiError(400, "Status cannot be empty");
    }

    if(status!= "Ready To Ship" || status!="Delivered" || status!="In-Transit" || status!="RTO" || status!="Returned"){
        throw new ApiError(400, "Choode a valid status");
    }
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                address,
                status
            }
        },
        {new: true}
    )

    if(!updatedOrder){
        throw new ApiError(500, "Error occured while updating order", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Order updated successfully", updatedOrder)
    )
})

const deleteOrder = asyncHandler(async(req, res)=>{
    const adminId = req.user?._id || req.user.role.admin

    const orderId = req.params || req.body || req.query

    const order = await Order.findById(orderId)

    if(!order){
        throw new ApiError(404, "Order not found")
    }

    try {
        await Order.deleteOne(order)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Order deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while deleting order", error)
    }
})
const cancelOrder = asyncHandler(async(req, res)=>{
    const userId = req.user?._id

    const orderId = req.params || req.body || req.query

    const cancelOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                status: "Cancelled",
            }
        },
        {new: true}
    )

    if(!cancelOrder){
        throw new ApiError(500, "Error occured while deleting order")
    }

    await updateInventoryAfterCancellation(cancelOrder.orderItem)

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Order cancelled successfully", cancelOrder)
    )
})

const getOrderByUser = asyncHandler(async(req, res)=>{
    const email = req.query 

    const user = await User.find({ emailAddress: email})

    const ordersByUser = await Order.find({name: user._id}).popopulate('orderId').popopulate('name').populate('address').populate('orderItem.productId').populate('discount').populate('tax');

    if(ordersByUser.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No order found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All orders for the requested user fetched successfully", ordersByUser)
    )
})

const getOrderByStatus = asyncHandler(async(req, res)=>{
    const status = req.query

    if(status!="Pending" || status!="Cancelled" || status!="Refunded" || status!="Ready To Ship" || status!="In-Transit" || status!="Delivered" || status!="RTO" || status!="Returned" || status!="Return Created" || status!="Return PickedUp" || status!="Return In-Transit" || status!="Return Cancelled"){
        throw new ApiError(400, "Invalid enquiry. Choose a valid status")
    }

    const orders = await Order.find({status: status}).popopulate('orderId').popopulate('name').populate('address').populate('orderItem.productId').populate('discount').populate('tax');

    if(orders.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Order not found for requested status")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All orders retrieved successfully for requested status", orders)
    )
})
const getOrderByDateRange = asyncHandler(async(req, res)=>{
    const startDate = req.query
    const endDate = req.query

    const ordersByDateRange = await Order.find({createdAt: {$gt: startDate}} && {createDate: {$lt: endDate}})

    if(ordersByDateRange.length==0) {
        return res
        .status(404)
        .json(
            new ApiResponse(
                404, "No orders found between the requested date range"
            )
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Orders created between the requested date range retrieved successfully", ordersByDateRange)
    )
})

const generateOrderInvoice = asyncHandler(async(req, res)=>{
    const orderId = req.params

    const order = await Order.findById(orderId).populate('user').populate('address').populate('discount').populate('tax');

    if(!order){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No order found")
        )
    }

    const populateOrderItems = await Promise.all(order.orderItem.map(async(item)=>{
        const product = await Product.findById(item.productId)

        return{
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            productTitle: product.name,
            productPrice: product.price,
            productImage: product.image
        }
    }))

    const doc = new PDFDocument();

    const invoicesDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir);
    }
    const filePath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Order Invoice', { align: 'center' });

    doc.fontSize(14).text(`Order ID: ${order._id}`);
    doc.text(`Order Date: ${order.createdAt.toDateString()}`);
    doc.text(`Customer: ${order.user.name}`);
    doc.text(`Shipping Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipCode}`);

    doc.moveDown().fontSize(16).text('Order Items', { underline: true });
    doc.moveDown().fontSize(12);
    doc.text('Product', { continued: true });
    doc.text('Quantity', { continued: true, align: 'center' });
    doc.text('Color', { continued: true, align: 'center' });
    doc.text('Size', { continued: true, align: 'center' });
    doc.text('Price', { align: 'right' });

    populateOrderItems.forEach(item => {
        doc.moveDown();
        doc.text(item.productTitle, { continued: true });
        doc.text(item.quantity, { continued: true, align: 'center' });
        doc.text(item.color, { continued: true, align: 'center' });
        doc.text(item.size, { continued: true, align: 'center' });
        doc.text(`$${item.productPrice.toFixed(2)}`, { align: 'right' });
    });

    doc.moveDown().fontSize(14).text('Order Summary', { underline: true });
    doc.moveDown().fontSize(12);
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`Discount: $${order.discount.value.toFixed(2)}`, { align: 'right' });
    doc.text(`Tax: $${order.tax.value.toFixed(2)}`, { align: 'right' });
    doc.text(`Shipping: $${order.shipping.toFixed(2)}`, { align: 'right' });
    doc.text(`Total: $${order.total.toFixed(2)}`, { align: 'right', underline: true });

    doc.end();

    stream.on('finish', () => {
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Order Invoice Generated Successfully", filePath )
        )
    })

})

const reorder = asyncHandler(async(req, res)=>{
    const originalOrderId = req.params

    const originalOrder = await Order.findById(originalOrderId)

    if(!originalOrder){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Original Order not found")
        )
    }

    const placeReOrder = await Order.create({
        orderPrice: originalOrder.orderPrice,
        name: originalOrder.name,
        address: originalOrder.address,
        orderItem: originalOrder.orderItem,
        discount: originalOrder.discount,
        tax: originalOrder.tax,
        status: "Pending"
    })

    if(!placeReOrder){
        throw new ApiError(500, "Error occured while reordering the order")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Reorder placed successfully", placeReOrder)
    )
})


const getOrderDetails = asyncHandler(async(req, res)=>{
    const orderId = req.params

    const order = await Order.findById(orderId).populate('user').populate('address').populate('discount').populate('tax');

    if(!order){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No order found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Order details for requested order Id retrieved successfully", order)
    )
})


export{
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    cancelOrder,
    getOrderByUser,
    getOrderByStatus,
    getOrderByDateRange,
    generateOrderInvoice,
    reorder,
    getOrderDetails,
}
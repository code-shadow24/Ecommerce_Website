import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Inventory } from "../models/inventory.model.js";
import { Product } from "../models/product.model.js";

const getAllInventoryItems = asyncHandler(async(req, res)=>{
    const inventoryItems = await Inventory.find()

    if(inventoryItems.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(200, "No inventory item found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Inventory Item fetched successfully", inventoryItems)
    )
})
const getInventoryItemById = asyncHandler(async(req, res)=>{
    const productId = req.query || req.params

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(404, "Product not found")
    }

    const inventory = await Inventory.findById(product._id)

    if(!inventory){
        throw new ApiError(404, "Inventory details not available. Kindly add them")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Inventory details retrieved successfully", inventory)
    )
})
const createInventoryItem = asyncHandler(async(req, res)=>{
    const productId = req.params || req.query

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(404, "Product not found")
    }

    const {quantityAvailable, quantitySold, quantityReserved, supplierId, supplierSKU, location, reorderPoint, reorderQuantity, restockStatus, expiryDate, lastRestockDate} = req.body

    if(quantityAvailable?.trim()==0){
        throw new ApiError(400, "Quantity Available value is required")
    }

    if(quantityAvailable == 0){
        throw new ApiError(400, "Quantity Available value must be more than zero")
    }

    if(quantitySold?.trim()==0){
        throw new ApiError(400, "Quantity Sold is required")
    }

    if(supplierId?.trim()==0){
        throw new ApiError(400, "Supplier Id is required")
    }

    if(location?.trim()==0){
        throw new ApiError(400, "Location is required")
    }

    if(reorderPoint?.trim()==0){
        throw new ApiError(400, "ReorderPoint is required")
    }

    if(reorderQuantity?.trim()==0){
        throw new ApiError(400, "ReorderQuantity is required")
    }

    if(restockStatus?.trim()==0){
        throw new ApiError(400, "RestockStatus is required")
    }


    if(lastRestockDate?.trim()==0){
        throw new ApiError(400, "LastRestockDate is required")
    }

    const inventory = await Inventory.create({
        productId : product._id,
        productName: product.productTitle,
        stockKeepingUnit: product.stockKeepingUnit,
        barcode: product.barcode,
        quantityAvailable,
        quantitySold,
        quantityReserved: quantityReserved || "",
        price: product.discountedPrice,
        costPrice : product.originalPrice,
        supplierId,
        supplierSKU: supplierSKU || "",
        location,
        reorderPoint,
        reorderQuantity,
        restockStatus,
        expiryDate: expiryDate || "",
        lastRestockDate,
    })

    if(!inventory){
        throw new ApiError(500, "Error occured while creating inventory")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Inventory created successfully", inventory)
    )
})
const updateInventoryItem = asyncHandler(async(req, res)=>{
    const productId = req.params || req.body

    const { quantityAvailable, quantityReserved, supplierId, supplierSKU, location, reorderPoint, reorderQuantity, restockStatus, expiryDate, lastRestockDate} = req.body;

    if(quantityAvailable?.trim()==0){
        throw new ApiError(400, "Quantity Available value is required")
    }

    if(supplierId?.trim()==0){
        throw new ApiError(400, "Supplier Id is required")
    }

    if(location?.trim()==0){
        throw new ApiError(400, "Location is required")
    }

    if(reorderPoint?.trim()==0){
        throw new ApiError(400, "ReorderPoint is required")
    }

    if(reorderQuantity?.trim()==0){
        throw new ApiError(400, "ReorderQuantity is required")
    }

    if(lastRestockDate?.trim()==0){
        throw new ApiError(400, "LastRestockDate is required")
    }

    const inventory = await Inventory.find({productId: productId})

    if(!inventory){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No inventory found")
        )
    }

    const inventoryUpdate = await Inventory.findByIdAndUpdate(
        inventory._id,
        {
            $set: {
                quantityAvailable,
                quantityReserved : quantityReserved || "",
                supplierId,
                supplierSKU : supplierSKU || "",
                location,
                reorderPoint,
                reorderQuantity,
                restockStatus : restockStatus || "",
                expiryDate : expiryDate || "",
                lastRestockDate
            }
        },
        {new: true}
    )

    if(!inventoryUpdate){
        throw new ApiError(500, "Error occured while updating inventory")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Inventory updated successfully", inventoryUpdate)
    )

})

const deleteInventoryItem = asyncHandler(async(req, res)=>{
    const productId = req.params || req.body

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(404, "Product not found")
    }
    
    const inventory = await Inventory.find({productId: product._id})

    try {
        await Inventory.findByIdAndDelete(inventory._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Inventory deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting inventory")
    }
})

const getLowStockItems = asyncHandler(async(req, res)=>{
    const lowInventoryItems = await Inventory.find({quantityAvailable: {$lt: reorderQuantity}})

    if(lowInventoryItems.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Low Inventory Item found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Low Inventory Items retrieved successfully", lowInventoryItems) 
    )
})
const getOutOfStockItems = asyncHandler(async(req, res)=>{
    const outOfStockItems = await Inventory.find({quantityAvailable: 0})

    if(outOfStockItems.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Out of Stock Item found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Out of Stock Item retrieved successfully", outOfStockItems)
    )
})
const getExpiredItems = asyncHandler(async(req, res)=>{
    const currentDate = new Date();

    const expiredItems = await Inventory.find({expiryDate: {$lt: currentDate}})

    if(expiredItems.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Expired Item found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Expired Items retrieved successfully", expiredItems)
    )
})



export{
    getAllInventoryItems,
    getInventoryItemById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getLowStockItems,
    getOutOfStockItems,
    getExpiredItems
}
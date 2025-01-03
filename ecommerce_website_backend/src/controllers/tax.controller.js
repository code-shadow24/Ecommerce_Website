import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Tax } from "../models/tax.model.js";

const getAllTaxes = asyncHandler(async(req, res)=>{
    const allTaxes = await Tax.find()

    if(allTaxes.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Tax found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Tax Details Fetched Successfully", allTaxes)
    )
})
const getTaxById = asyncHandler(async(req, res)=>{
    const taxId = req.params.taxId || req.body || req.query

    if(!taxId){
        throw new ApiError(400, "Tax Id is required")
    }

    const tax = await Tax.findById(taxId)

    if(!tax){
        throw new ApiError(500, "Error occured while getting tax")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Tax by Id Fetched Successfully", tax)
    )
})
const createTax = asyncHandler(async(req, res)=>{
    const {name, rate, country, region, taxType, isDefault} = req.body

    if(!name){
        throw new ApiError(400, "Tax name is required")
    }

    if(!rate){
        throw new ApiError(400, "Tax rate is required")
    }

    if(!country){
        throw new ApiError(400, "Country name is required")
    }

    if(!region){
        throw new ApiError(400, "Region name is required")
    }

    if(!taxType){
        throw new ApiError(400, "Tax type is required")
    }

    if(!isDefault){
        throw new ApiError(400, "Is Default condition is required")
    }

    const newTax = await Tax.create({
        name,
        rate,
        country,
        region,
        taxType,
        isDefault
    })

    if(!newTax){
        throw new ApiError(500, "Error occured while creating tax")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Tax created successfully", newTax)
    )
})
const updateTax = asyncHandler(async(req, res)=>{
    const taxId = req.params.taxId || req.body || req.query

    if(!taxId){
        throw new ApiError(400, "Tax Id is required")
    }

    const {name, rate, country, region, taxType, isDefault} = req.body

    if(!name){
        throw new ApiError(400, "Tax name is required")
    }

    if(!rate){
        throw new ApiError(400, "Tax rate is required")
    }

    if(!country){
        throw new ApiError(400, "Country name is required")
    }

    if(!region){
        throw new ApiError(400, "Region name is required")
    }

    if(!taxType){
        throw new ApiError(400, "Tax type is required")
    }

    if(!isDefault){
        throw new ApiError(400, "Is Default condition is required")
    }

    const updateTax = await Tax.findByIdAndUpdate(
        taxId,
        {
            $set: {
                name,
                rate,
                country,
                region,
                taxType,
                isDefault
            }
        },
        {new: true}
    )

    if(!updateTax){
        throw new ApiError(500, "Error occured while updating tax")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Tax details updated successfully", updateTax)
    )
})

const deletetax = asyncHandler(async(req, res)=>{
    const taxId = req.params.taxId || req.body || req.query

    if(!taxId){
        throw new ApiError(400, "Tax Id is required")
    }

    try {
        await Tax.findByIdAndDelete(taxId)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Tax deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while deleting tax", error)
    }
})
const getTaxRatesByRegion = asyncHandler(async(req, res)=>{
    const region = req.query || req.body

    if(!region){
        throw new ApiError(400, "Region must be specified")
    }

    const taxByRegion = await Tax.find({region: region})

    if(taxByRegion.length ==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Tax Detail for the specified region found") 
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Tax Detail for the specified region fetched successfully", taxByRegion) 
    )
})

export{
    getAllTaxes,
    getTaxById,
    createTax,
    updateTax,
    deletetax,
    getTaxRatesByRegion,
}
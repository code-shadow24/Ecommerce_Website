import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subcategory } from "../models/subcategory.model.js";
import { Category } from "../models/category.model.js";
import { fileDelete, fileUpload } from "../utils/fileUpload.js";
import { Product } from "../models/product.model.js";

const getAllSubCategories = asyncHandler(async(req, res)=>{
    const subcategories = await Subcategory.find()

    if(subcategories.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Subcategory found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Subcategories Retrieved Successfully", subcategories)
    )
})
const getSubCategoriesById = asyncHandler(async(req, res)=>{
    const subcategoryId = req.params.subcategoryId || req.body || req.query

    if(!subcategoryId){
        throw new ApiError(400, "Subcategory is required")
    }

    const subCategory = await Subcategory.findById(subcategoryId)

    if(!subCategory){
        throw new ApiError(500, "Error occured while retrieving subcategory")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subcategory successfully retrieved", subCategory)
    )
})
const createSubCategory = asyncHandler(async(req, res)=>{
    const {subcategoryName, description, slug, metaTitle, metaDescription, metaKeyword, category} = req.body

    if(!subcategoryName || !description){
        throw new ApiError(400, "Subcategory name or description not provided")
    }

    const categoryDetail = await Category.find({ categoryName: {$in: category}})

    const subCategoryImagePath = req.file?.path
    const subCategoryImageUpload = await fileUpload(subCategoryImagePath)

    const subCategory = await Subcategory.create({
        subcategoryName,
        description,
        image: subCategoryImageUpload.url || null,
        slug: slug || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeyword: metaKeyword || null,
        category: categoryDetail.categoryName || category,
    })

    if(!subCategory){
        throw new ApiError(500, "Error occured while creating new subcategory")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Subcategory Created Successfully", subCategory)
    )

})
const updateSubCategory = asyncHandler(async(req, res)=>{
    const subCategoryId = req.params.subCategoryId || req.body || req.query

    const {subcategoryName, description, slug, metaTitle, metaDescription, metaKeyword, category} = req.body

    if(!subcategoryName || !description){
        throw new ApiError(400, "Subcategory name or description not provided")
    }

    const categoryDetail = await Category.find({ categoryName: {$in: category}})

    const updateSubcategory = await Subcategory.findByIdAndUpdate(
        subCategoryId,
        {
            $set: {
                subcategoryName,
                description,
                slug: slug || null,
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                metaKeyword: metaKeyword || null,
                category: categoryDetail.categoryName || category,
            }
        },
        {
            new: true
        }
    )

    if(!updateSubcategory){
        throw new ApiError(500, "Error occurred while updating sub category")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subcategory updated successfully", updateSubcategory)
    )
})
const deleteSubCategory = asyncHandler(async(req, res)=>{
    const subCategoryId = req.params.subCategoryId || req.body || req.query

    const subCategory = await Subcategory.findById(subCategoryId)

    if(!subCategory){
        throw new ApiError(404, "SubCategory not found")
    }

    try {
        if(subCategory.image && subCategory.image.length>0){
            await fileDelete(subCategory.image, false)
        }
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting subCategory image")
    }

    try {
        await Subcategory.findByIdAndDelete(subCategory._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Sub Category deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting Subcategory")
    }
})
const updateSubCategoryImage = asyncHandler(async(req, res)=>{
    const subCategoryId = req.params.subCategoryId || req.body || req.query

    const subCategory = await Subcategory.findById(subCategoryId)

    if(!subCategory){
        throw new ApiError(404, "SubCategory not found")
    }

    try {
        if(subCategory.image && subCategory.image.length>0){
            await fileDelete(subCategory.image, false)
        }
    } catch (error) {
        throw new ApiError(500, "Error occured while deleting subCategory image")
    }

    const subCategoryImagePath = req.file?.path
    const subCategoryImageUpload = await fileUpload(subCategoryImagePath)

    const imageUpdate = await Subcategory.findByIdAndUpdate(
        subCategory._id,
        {
            $set:{
                image: subCategoryImageUpload.url || null
            }
        },
        {new: true}
    )

    if(!imageUpdate){
        throw new ApiError(500, "Error occured while updating subCategory image")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Sub Category Image Updated Successfully", imageUpdate)
    )

})
const getSubCategoriesByFilter = asyncHandler(async(req, res)=>{
    try {
        const {subcategoryName, slug, metaTitle, createdBefore, createdAfter, updatedBefore, updatedAfter} = req.query
        
        let filters ={};

        if(subcategoryName){
            filters.subcategoryName = new RegExp(subcategoryName, 'i');
        }

        if(slug){
            filters.slug = new RegExp(slug, 'i')
        }

        if(metaTitle){
            filters.metaTitle = new RegExp(metaTitle, 'i')
        }

        if (createdBefore || createdAfter) {
            filters.createdAt = {};
            if (createdBefore) {
                filters.createdAt.$lte = new Date(createdBefore);
            }
            if (createdAfter) {
                filters.createdAt.$gte = new Date(createdAfter);
            }
        }

        if (updatedBefore || updatedAfter) {
            filters.updatedAt = {};
            if (updatedBefore) {
                filters.updatedAt.$lte = new Date(updatedBefore);
            }
            if (updatedAfter) {
                filters.updatedAt.$gte = new Date(updatedAfter);
            }
        }

        const subcategories = await Subcategory.find(filters).select('subcategoryName description image slug metaTitle, metaDescription metaKeyword createdAt updatedAt')

        if (subcategories.length==0){
            return res
            .status(404)
            .json(
                new ApiResponse(404, "No Such SubCategory Found")
            )
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, "All Subcategories based on the search parameters retrieved", subcategories)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while retrieving subcategories", error)
    }
})

const getSubCategoryProducts = asyncHandler(async(req, res)=>{
    const {subcategoryName} = req.body

    if(!subcategoryName){
        throw new ApiError(400, "Subcategory Name is required")
    }

    const productBySubcategory = await Product.find({subcategory: subcategoryName})

    if(productBySubcategory.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Product Found in this Subcategory")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Products Under this SubCategory Retrieved Successfully", productBySubcategory)
    )
})
const getSubCategoryAttributes = asyncHandler(async(req, res)=>{
    const subcategoryId = req.params

    if(!subcategoryId){
        throw new ApiError(400, "Subcategory Id is required")
    }

    const subcategory = await Subcategory.findById(subcategoryId).select('subcategoryName description image slug metaTitle metaDescription metaKeyword category')

    if(subcategory.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Subcategory Attribute found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Subcategory Attribute Fetched", subcategory)
    )
})
const getPopularSubCategories = asyncHandler(async(req, res)=>{
    const {limit} = req.query

    const popularSubCategories = await Subcategory.aggregate([
        {$lookup: {from: 'products', localField: '_id', foreignField: 'subcategoryId', as: 'products'}},
        {$addFields: { productCount: { $size: '$products' } }},
        {$sort: { productCount: -1 }},
        { $limit: parseInt(limit, 10) || 5 },
        { $project: { name: 1, description: 1, productCount: 1 } }
    ])

    if(popularSubCategories.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Popular Sub Categories Available")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Popular Sub Categories Retrieved Successfully", popularSubCategories)
    )
})
const getRelatedSubCategories = asyncHandler(async(req, res)=>{
    try {
        const {productId, limit} = req.query

        const recommendations = [];

        const product = await Product.findById(productId).populate('subcategory')

        if(!product){
            return res
            .status(404)
            .json(
                new ApiResponse(404, "No products were found")
            )
        }

        recommendations = await Subcategory.find({_id: {$ne: product.subcategory._id}}).limit(parseInt(limit, 10)|| 5)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "All Related Subcategories fetched successfully", recommendations  )
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while fetching related subcategories", error)
    }
})


export{
    getAllSubCategories,
    getSubCategoriesById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    updateSubCategoryImage,
    getSubCategoriesByFilter,
    getSubCategoryProducts,
    getSubCategoryAttributes,
    getPopularSubCategories,
    getRelatedSubCategories,
}
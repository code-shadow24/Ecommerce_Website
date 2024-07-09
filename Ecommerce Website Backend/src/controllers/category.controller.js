import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import { fileUpload } from "../utils/fileUpload.js";
import { Subcategory } from "../models/subcategory.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const getAllCategories = asyncHandler(async(req, res)=>{
    const categories = await Category.find()

    if(categories.length==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Category found listed", null)
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All categories retrieved successfully", categories)
    )
})
const getCategoryById = asyncHandler(async(req, res)=>{
    const {categoryId} = req.body || req.params

    if(!categoryId){
        throw new ApiError(400, "Category Id is required")
    }

    const categoryById = await Category.findById(categoryId)

    if(!categoryById){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "Category not found", null)
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Category By requested Id retrieved successfully", categoryById)
    )
})
const createCategory = asyncHandler(async(req, res)=>{
    const {categoryName, description, slug, metaTitle, metaDescription, metaKeyword} = req.body

    if(categoryName?.trim()==0){
        throw new ApiError(400, "Category name cannot be empty")
    }

    if(description?.trim()==0){
        throw new ApiError(400, "Description cannot be empty")
    }

    const category = await Category.find({ categoryName: categoryName})

    if(category){
        return res
        .status(400)
        .json(
            new ApiResponse(400, "Category already exists", category)
        )
    }

    const categoryImageLocalPath = req.file?.path
    const categoryImage = await fileUpload(categoryImageLocalPath)

    const newCategory = await Category.create({
        categoryName,
        description,
        slug: slug || "",
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        metaKeyword: metaKeyword || "",
        image: categoryImage.secure_url || ""
    })

    if(!newCategory){
        throw new ApiError(500, "Error occured while creating new category")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Category created successfully", newCategory)
    )
})
const updateCategory = asyncHandler(async(req, res)=>{
    const {categoryName, description, slug, metaTitle, metaDescription, metaKeyword} = req.body

    if(categoryName?.trim()==0){
        throw new ApiError(400, "Category name cannot be empty")
    }

    if(description?.trim()==0){
        throw new ApiError(400, "Description cannot be empty")
    }

    const category = await Category.find({ categoryName: categoryName})

    const updatedCategory = await Category.findByIdAndUpdate(
        category._id,
        {
            categoryName,
            description,
            slug: slug || "",
            metaTitle: metaTitle || "",
            metaDescription: metaDescription || "",
            metaKeyword: metaKeyword || "",
        },
        {new: true}
    )

    if(!updatedCategory){
        throw new ApiError(500, "Error occured while updating category", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Category updated successfully", updatedCategory)
    )

})
const deleteCategory = asyncHandler(async(req, res)=>{

    const {categoryName} = req.body

    if(!categoryName){
        throw new ApiError(400, "Category Name is required")
    }

    const category = await Category.find({ categoryName: categoryName})

    if(!category){
        throw new ApiError(404, "Category not found")
    }

    try {
        await Category.findByIdAndDelete(category._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Category deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while deleting category", error)
    }
})
const getSubCategories = asyncHandler(async(req, res)=>{
    const {categoryName} = req.body

    if(!categoryName){
        throw new ApiError(400, "Category Name is Required")
    }

    const category = await Category.find({categoryName: categoryName})

    const subCategories = await Subcategory.find({category: category._id})

    if(!subCategories){
        throw new ApiError(500, "Error occured while retrieving sub categories", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Sub categories retrieved successfully", subCategories)
    )
})
const getCategoryProducts = asyncHandler(async(req, res)=>{
    const {categoryName} = req.body

    if(!categoryName){
        throw new ApiError(400, "Category name is required")
    }

    const productByCategory = await Product.find({category: categoryName})

    if(!productByCategory){
        throw new ApiError(500, "Error occured while retrieving product by category")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Product by category retrieved successfully", productByCategory)
    )
})
const getCategoryAttributes = asyncHandler(async(req, res)=>{
    const categoryId = req.params

    if(!categoryId){
        throw new ApiError(400, "Category Id is required")
    }

    const categoryAttributes = await Category.findById(categoryId).select('categoryName description image slug metaTitle metaDescription metaKeyword subCategory')

    if(!categoryAttributes){
        return res.status(404).json(
            new ApiResponse(404, "No category found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Category Attributes retrieved successfully", categoryAttributes)
    )
})
const getCategoryFilters = asyncHandler(async(req, res)=>{
    try {
        const {categoryName, slug, metaTitle, createdBefore, createdAfter, updatedBefore, updatedAfter} = req.query

        let filters ={};

        if(categoryName){
            filters.categoryName = new RegExp(categoryName, 'i')
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

        const categories = await Category.find(filters).select('categoryName description image slug metaTitle metaDescription metaKeyword createdAt updatedAt')

        if(categories.length==0){
            return res.status(404).json(
                new ApiResponse(404, "No categories were found")
            )
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Successfully retrieved filtered results", categories)
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while retrieving results", error)
    }
})
const getRelatedCategory = asyncHandler(async(req, res)=>{
    try {
        const {productId, limit} = req.query

        const recommendations = [];

        const product = await Product.findById(productId).populate('category')

        if(!product){
            return res
            .status(404)
            .json(
                new ApiResponse(404, "No products were found")
            )
        }

        recommendations = await Category.find({_id: {$ne: product.category._id}}).limit(parseInt(limit, 10)|| 5)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Successfully retrieved related categories", recommendations)
        )
    } catch (error) {
        throw new ApiError(500, "Error occured while retrieving related categories", error)
    }
})
const getFrequentCategory = asyncHandler(async(req, res)=>{
    try {
        const {limit} = req.query

        const recommendations = [];

        const orders = await Order.aggregate([
            { $unwind: '$productTitle' },
            { $group: { _id: '$productTitle.category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit, 10) || 5 },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $project: { name: '$category.name', description: '$category.description', count: 1 } }
        ]);

        recommendations = orders.map(order => order.category);

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Successfully retrieved related categories", recommendations)
        )

    } catch (error) {
        
    }
})
const getPopularCategories = asyncHandler(async(req, res)=>{
    const {limit} = req.query


    const recommendations = await Category.aggregate([
        { $lookup: { from: 'products', localField: '_id', foreignField: 'categoryId', as: 'products' } },
        { $addFields: { productCount: { $size: '$products' } } },
        { $sort: { productCount: -1 } },
        { $limit: parseInt(limit, 10) || 5 },
        { $project: { name: 1, description: 1, productCount: 1 } }
    ])

    if(recommendations.length ==0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Popular Categories Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Successfully retrieved popular categories", recommendations)
    )
})

const searchCategories = asyncHandler(async(req, res)=>{
    const {categoryName} = req.query || req.body

    if(!categoryName){
       throw new ApiError(400, "Category Name is required") 
    }

    const category = await Category.find({categoryName: categoryName})

    if(!category){
        throw new ApiError(400, "Category not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Requested category retrieved successfully", category)
    )

})

export{
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubCategories,
    getCategoryProducts,
    getCategoryAttributes,
    getCategoryFilters,
    getRelatedCategory,
    getFrequentCategory,
    getPopularCategories,
    searchCategories
}
import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllPosts = asyncHandler(async(req, res)=>{

})

const getPostById = asyncHandler(async(req, res)=>{

})

const createPost = asyncHandler(async(req, res)=>{

})

const updatePost = asyncHandler(async(req, res)=>{

})

const deletePost = asyncHandler(async(req, res)=>{

})

const getPostByCategory = asyncHandler(async(req, res)=>{

})

const getPostByTag = asyncHandler(async(req, res)=>{

})

const getPostByAuthor = asyncHandler(async(req, res)=>{

})

const searchPost = asyncHandler(async(req, res)=>{

})

const getRecentPost = asyncHandler(async(req, res)=>{

})

const getFeaturedPost = asyncHandler(async(req, res)=>{

})

const getPopularPost = asyncHandler(async(req, res)=>{

})

const getRelatedPosts = asyncHandler(async(req, res)=>{

})

const publishPost = asyncHandler(async(req, res)=>{

})

const unpublishPost = asyncHandler(async(req, res)=>{

})

export {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostByCategory,
    getPostByTag,
    getPostByAuthor,
    searchPost,
    getRecentPost,
    getFeaturedPost,
    getPopularPost,
    getRelatedPosts,
    publishPost,
    unpublishPost
}
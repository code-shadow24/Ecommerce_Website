import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Blog } from "../models/blog.model.js";
import { Admin } from "../models/admin.model.js";
import { fileUpload } from "../utils/fileUpload.js";

const getAllPosts = asyncHandler(async(req, res)=>{
    const blogs = await Blog.find()

    if(!blogs){
        throw new ApiError(404, "Blog not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Blogs retrived successfully", blogs)
    )
})

const getPostById = asyncHandler(async(req, res)=>{
    const { _id } = req.params

    const blog = await Blog.findbyId(_id)

    if(!blog){
        throw new ApiError(404, "Requested blog not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Requested blog retrieved successfully", blog)
    )
})

const createPost = asyncHandler(async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin
    
    const admin = await Admin.findbyId(adminId)
    const {title, content, category, tags, isPublished, isActive} = req.body

    if(title?.trim()==""){
        throw new ApiError(400, "Title is required")
    }

    if(content?.trim()==""){
        throw new ApiError(400, "Content is required")
    }
    
    if(tags?.trim()==""){
        throw new ApiError(400, "Add at least one tag")
    }

    if(!category){
        throw new ApiError(400, "Add at least one category")
    }
    
    const imagePath = req.file?.path
    const image = await fileUpload(imagePath)
    

    const newBlog = await Blog.create({
        title,
        author: admin.firstName,
        content,
        category,
        tags,
        image: image.secure_url || "",
        publishedAt: new Date(),
        isPublished: isPublished || false,
        isActive: isActive || false,
    })

    if(!newBlog){
        throw new ApiError(500, "Error occurred while creating a new blog", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Blog created successfully", newBlog)
    )
})

const updatePost = asyncHandler(async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin

    const admin = await Admin.findbyId(adminId)
    const {_id, title, content, category, tags, isPublished, isActive} = req.body

    if(title?.trim()==""){
        throw new ApiError(400, "Title is required")
    }

    if(content?.trim()==""){
        throw new ApiError(400, "Content is required")
    }
    
    if(tags?.trim()==""){
        throw new ApiError(400, "Add at least one tag")
    }

    if(!category){
        throw new ApiError(400, "Add at least one category")
    }

    const updateBlog = await Blog.findByIdAndUpdate(
        _id,
        {
            title,
            author: admin.firstName,
            content,
            category,
            tags,
            publishedAt: new Date(),
            isPublished: isPublished || false,
            isActive: isActive || false,
        },
        {new: true}
    )

    if(!updateBlog){
        throw new ApiError(500, "Error occurred while updating blog", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog updated successfully", updateBlog)
    )
})

const deletePost = asyncHandler(async(req, res)=>{
    const adminId = req.user?._id && req.user.role.admin
 
    const { _id} = req.body

    if(!_id){
        throw new ApiError(400, "Id is required")
    }

    const blog = await Blog.findById(_id);

    if(!blog){
        throw new ApiError(404, "Requested blog not found")
    }

    try {
        await fileDelete(blog.image, false);
    } catch (error) {
        throw new ApiError(500, "Error deleting the user avatar", error);
    }

    try {
        await Blog.findByIdAndDelete(blog._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Blog deleted successfully", null)
        )
    } catch (error) {
        throw new ApiError(500, "Error deleting the blog", error);
    }
})

const getPostByCategory = asyncHandler(async(req, res)=>{
    const {category} = req.body;

    if(!category){
        throw new ApiError(400, "At least one category is required")
    }

    const blogByCategory = await Blog.find({ category: category})

    if(!blogByCategory){
        throw new ApiError(404, "Blog of requested category not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog of requested category successfully retrieved", blogByCategory)
    )
})

const getPostByTag = asyncHandler(async(req, res)=>{
    const {tag} = req.body;

    if(!tag){
        throw new ApiError(400, "Select at least one tag");
    }

    const blogByTag = await Blog.find({tag: tag})

    if(!blogByTag){
        throw new ApiError(404, "Blog of requested tag not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog of requested tag retrieved successfully", blogByTag)
    )
})

const getPostByAuthor = asyncHandler(async(req, res)=>{
    const {author} = req.body;

    if(!author){
        throw new ApiError(400, "Author name required")
    }

    const blogByAuthor = await Blog.find({author: author})

    if(!blogByAuthor){
        throw new ApiError(404, "Blog of requested author not found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog of requested author retrieved successfully", blogByAuthor)
    )
})

const searchPost = asyncHandler(async(req, res)=>{
    const query = req.query.query

    if(!query){
        throw new ApiError(404, "No query found")
    }

    const matchingPosts = await Blog.find({
        $or: [
            {title: {$regex: query, $options: 'i'}},
            {content: {$regex: query, $options: 'i'}}
        ]
    })

    if(!matchingPosts){
        throw new ApiError(404, "No matching posts found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All matching blog posts retrieved successfully", matchingPosts)
    )
})

const getRecentPost = asyncHandler(async(req, res)=>{
    try {
        const recentPosts = await Blog.find().sort({createdAt: -1}).limit(20)
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Recent posts retrieved successfully", recentPosts)
        )
    } catch (error) {
        throw new ApiError(500, "Error fetching recent posts", error)
    }
})

const getRelatedPosts = asyncHandler(async(req, res)=>{
    const postId = req.params._id

    const originalPost = await Blog.findById(postId)

    if(!originalPost){
        throw new ApiError(404, "Error fetching the original post", error)
    }

    const tags = originalPost.tag;

    if(tags.length==0){
        throw new ApiError(404, "Error fetching the tags", error)
    }

    const relatedPosts = await Blog.find({tag: {$in: tags}, _id: {$ne: postId}}).limit(10)

    if(relatedPosts.length == 0){
        throw new ApiError(404, "No related posts found", error)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Related posts retrieved successfully", relatedPosts)
    )
})

const publishPost = asyncHandler(async(req, res)=>{
    const postId = req.params._id

    if(!postId){
        throw new ApiError(400, "Id is required")
    }

    const post = await Blog.findById(postId)

    if(post.isPublished == true) {
        throw new ApiError("The post has already been published")
    }

    const publishedPost = await Blog.findByIdAndUpdate(
        post._id,
        {
            $set: {
                isPublished: true,
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog post published successfully", publishedPost)
    )
})

const unpublishPost = asyncHandler(async(req, res)=>{
    const postId = req.params._id

    const post = await Blog.findById(postId)

    if(post.isPublished == false) {
        throw new ApiError(400, "The post has already unpublished")
    }

    await Blog.findByIdAndUpdate(
        post._id,
        {
            $set: {
                isPublished: false
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Blog post unpublished successfully", null)
    )
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
    getRelatedPosts,
    publishPost,
    unpublishPost
}
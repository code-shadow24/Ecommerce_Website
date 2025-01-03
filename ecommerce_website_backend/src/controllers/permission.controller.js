import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Permission } from "../models/permission.model.js";

const getAllPermissions = asyncHandler(async(req, res)=>{
    const permissions = await Permission.find()

    if(permissions.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No permissions available")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All permissions fetched successfully", permissions)
    )
})
const getPermissionbyId = asyncHandler(async(req, res)=>{
    const permissionId = req.params.permissionId || req.body

    const permissions = await Permission.findById(permissionId)

    if(!permissions){
        throw new ApiError(500, "Error occured while fetching permissions")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission fetched successfully", permissions)
    )
})
const createPermission = asyncHandler(async(req, res)=>{
    const {permissionId, name, description, isGlobal, isActive} = req.body;

    if(permissionId?.trim()==""){
        throw new ApiError(400, "Permission Id is required")
    }

    if(name?.trim()==""){
        throw new ApiError(400, "Name is required")
    }

    if(description?.trim()==""){
        throw new ApiError(400, "Description is required")
    }

    const existingPermission = await Permission.findOne({permissionId:permissionId})

    if(existingPermission){
        throw new ApiError(400, "Permission already exists")
    }

    const newPermission = await Permission.create({
        permissionId,
        name,
        description,
        isGlobal : isGlobal || false,
        isActive: isActive || false
    })

    if(!newPermission){
        throw new ApiError(500, "Error occured while creating new permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "New Permission Created Successfully", newPermission)
    )
})

const updatePermission = asyncHandler(async(req, res)=>{
    const permissionId = req.params.permissionId
    const { name, description } = req.body;

    if(name?.trim()==""){
        throw new ApiError(400, "Name is required")
    }

    if(description?.trim()==""){
        throw new ApiError(400, "Description is required")
    }

    const updatePermission = await Permission.findByIdAndUpdate(
        permissionId,
        {
            $set:{
                name,
                description
            }
        },
        {new: true}
    )

    if(!updatePermission){
        throw new ApiError(500, "Error occurred while updating permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission updated successfully", updatePermission)
    )
})

const deletePermission = asyncHandler(async(req, res)=>{
    const permissionId = req.query.permissionId

    try {
        await Permission.findByIdAndDelete(permissionId)

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Permission deleted successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Error occurred while deleting permission",error)
    }
})

const makePermissionGlobal = asyncHandler(async(req, res)=>{
    const permissionId = req.query.permissionId

    const permission = await Permission.findById(permissionId)

    if(permission.isGlobal == true){
        return res
        .status(400)
        .json(
            new ApiResponse(400, "Permission is already set to global", permission)
        )
    }

    const globalPermission = await Permission.findByIdAndUpdate(
        permissionId,
        {
            $set:{
                isGlobal: true,
            }
        },
        {new: true}
    )

    if(!globalPermission){
        throw new ApiError(500, "Error occured while setting global permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission successfully set to global", globalPermission)
    )
})

const makePermissionLocal = asyncHandler(async(req, res)=>{
    const permissionId = req.params.permissionId

    const permission = await Permission.findById(permissionId)
    
    if(permission.isGlobal==false){
        return res
        .status(400)
        .json(
            new ApiResponse(400, "Permission is already set to local", permission)
        )
    }

    const localPermission = await Permission.findByIdAndUpdate(
        permissionId,
        {
            $set:{
                isGlobal: false,
            }
        },
        {new:true}
    )

    if(!localPermission){
        throw new ApiError(500, "Error occured while setting local permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission successfully set to local", localPermission)
    )
})

const ActivatePermission = asyncHandler(async(req, res)=>{
    const permissionId = req.params.permissionId

    const permission = await Permission.findById(permissionId)

    if(permission.isActive==true){
        return res
        .status(400)
        .json(
            new ApiResponse(400, "Permission is already active", permission)
        )
    }

    const activatePermission = await Permission.findByIdAndUpdate(
        permissionId,
        {
            $set:{
                isActive: true,
            }
        },
        {new:true}
    )

    if(!activatePermission){
        throw new ApiError(500, "Error occured while activating the permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission activated successfully", activatePermission)
    )
})

const DeactivatePermission = asyncHandler(async(req, res)=>{
    const permissionId = req.params.permissionId

    const permission = await Permission.findById(permissionId)

    if(permission.isActive==false){
        return res
        .status(400)
        .json(
            new ApiResponse(400, "Permission is already deactivated")
        )
    }

    const deactivatePermission = await Permission.findByIdAndUpdate(
        permissionId,
        {
            $set:{
                isActive: false
            }
        },
        {new: true}
    )

    if(!deactivatePermission){
        throw new ApiError(500, "Error occured while deactivating permission")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Permission deactivated successfully", deactivatePermission) 
    )
})

export{
    getAllPermissions,
    getPermissionbyId,
    createPermission,
    updatePermission,
    deletePermission,
    makePermissionGlobal,
    makePermissionLocal,
    ActivatePermission,
    DeactivatePermission
}
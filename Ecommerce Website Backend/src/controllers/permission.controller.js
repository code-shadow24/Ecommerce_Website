import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllPermissions = asyncHandler(async(req, res)=>{

})
const getPermissionbyId = asyncHandler(async(req, res)=>{

})
const createPermission = asyncHandler(async(req, res)=>{

})
const updatePermission = asyncHandler(async(req, res)=>{

})
const deletePermission = asyncHandler(async(req, res)=>{

})
const assignPermissionToRole = asyncHandler(async(req, res)=>{

})
const removePermissionFromRole = asyncHandler(async(req, res)=>{

})
const getPermissionByRole = asyncHandler(async(req, res)=>{

})
const getRolesByPermission = asyncHandler(async(req, res)=>{

})
const checkPermission = asyncHandler(async(req, res)=>{

})
const validatePermission = asyncHandler(async(req, res)=>{

})
const getRolePermission = asyncHandler(async(req, res)=>{

})
const getRoleUsers = asyncHandler(async(req, res)=>{

})
const getUserRoles = asyncHandler(async(req, res)=>{

})
const createRole = asyncHandler(async(req, res)=>{

})
const updateRole = asyncHandler(async(req, res)=>{

})
const deleteRole = asyncHandler(async(req, res)=>{

})
const assignRoleToUser = asyncHandler(async(req, res)=>{

})
const removeRolefromUser = asyncHandler(async(req, res)=>{

})
const getUsersByRole = asyncHandler(async(req, res)=>{

})

export{
    getAllPermissions,
    getPermissionByRole,
    createPermission,
    updatePermission,
    deletePermission,
    assignPermissionToRole,
    removePermissionFromRole,
    getPermissionByRole,
    getRolesByPermission,
    checkPermission,
    validatePermission,
    getRolePermission,
    getRoleUsers,
    getUserRoles,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRolefromUser,
    getUsersByRole
}
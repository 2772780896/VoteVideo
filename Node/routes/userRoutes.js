// routes/userRoutes.js - 用户相关路由（除了登录注册）

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入用户控制器
const userController = require('../controllers/userController')

// --- 用户搜索 ---
// GET /api/user?q=关键词&page=1&element=16
router.get('/user', userController.searchUser)

// --- 用户详情 ---
// GET /api/user/:uid
// 注意：这个路由必须放在 /user 之后，否则 /user 会被匹配为 /user/:uid
router.get('/user/:uid', userController.getUserDetail)

// --- 获取当前用户 Profile ---
// GET /api/user/profile
router.get('/user/profile', userController.getProfile)

// --- 获取 Profile 子数据 ---
// GET /api/user/profile/:profileType/:dataType?sort=..&page=..&element=..
router.get('/user/profile/:profileType/:dataType', userController.getProfileSubdata)

// 导出路由
module.exports = router

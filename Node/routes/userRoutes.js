// routes/userRoutes.js - 用户相关路由（除了登录注册）

const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

// --- 用户搜索 ---
// GET /api/user?q=关键词&page=1&element=16
router.get('/', userController.searchUser)

// --- 获取当前用户 Profile ---
// GET /api/user/profile
router.get('/profile', userController.getProfile)

// --- 获取 Profile 子数据 ---
// GET /api/user/profile/:profileType/:dataType?sort=..&page=..&element=..
router.get('/profile/:profileType/:dataType', userController.getProfileSubdata)

// --- 用户详情 ---
// GET /api/user/:uid
// 注意：这个路由必须放在最后，否则会匹配到其他路由
router.get('/:uid', userController.getUserDetail)

// 导出路由
module.exports = router

// routes/postRoutes.js - 动态相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入动态控制器
const postController = require('../controllers/postController')

// --- 动态列表 ---
// GET /api/post?sort=-date&page=1&element=16
router.get('/post', postController.getPostList)

// --- 动态详情 ---
// GET /api/post/:pid
// 注意：这个路由必须放在 /post 之后，否则 /post 会被匹配为 /post/:pid
router.get('/post/:pid', postController.getPostDetail)

// 导出路由
module.exports = router

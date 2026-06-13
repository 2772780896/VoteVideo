// routes/postRoutes.js - 动态相关路由

const express = require('express')
const router = express.Router()

const postController = require('../controllers/postController')

// --- 动态列表 ---
// GET /api/post?sort=-date&page=1&element=16
router.get('/', postController.getPostList)

// --- 动态详情 ---
// GET /api/post/:pid
// 注意：这个路由必须放在 / 之后，否则 / 会被匹配为 /:pid
router.get('/:pid', postController.getPostDetail)

// 导出路由
module.exports = router

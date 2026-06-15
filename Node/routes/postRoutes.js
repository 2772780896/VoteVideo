// routes/postRoutes.js - 动态相关路由

const express = require('express')
const router = express.Router()

const postController = require('../controllers/postController')
const { optionalAuth } = require('../middleware/authMiddleware')

// 可选认证：解码 JWT（如果存在），使已登录用户获得交互状态
router.use(optionalAuth)

// --- 动态列表 ---
// GET /api/post?sort=-date&page=1&element=16
router.get('/', postController.getPostList)

// --- 相关动态推荐 ---
// GET /api/post/related?pid=xxx&sort=-date&page=1&element=5
// 注意：这个路由必须放在 /:pid 之前，否则 /related 会被匹配为 /:pid
router.get('/related', postController.getRelatedPosts)

// --- 动态详情 ---
// GET /api/post/:pid
router.get('/:pid', postController.getPostDetail)

// 导出路由
module.exports = router

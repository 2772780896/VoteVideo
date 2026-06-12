// routes/commentRoutes.js - 评论相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入评论控制器
const commentController = require('../controllers/commentController')

// --- 评论列表 ---
// GET /api/comment?sort=1&page=1&element=16&vid=123
router.get('/comment', commentController.getCommentList)

// 导出路由
module.exports = router

// routes/commentRoutes.js - 评论相关路由

const express = require('express')
const router = express.Router()

const commentController = require('../controllers/commentController')

// --- 评论列表 ---
// GET /api/comment?sort=1&page=1&element=16&vid=123
router.get('/', commentController.getCommentList)

// --- 评论详情 ---
// GET /api/comment/:cid
router.get('/:cid', commentController.getCommentDetail)

// 导出路由
module.exports = router

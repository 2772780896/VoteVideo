// routes/tagRoutes.js - 标签相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入标签控制器
const tagController = require('../controllers/tagController')

// --- 标签列表 ---
// GET /api/tag?sort=-likeCount&page=1&element=16
router.get('/tag', tagController.getTagList)

// --- 标签详情 ---
// GET /api/tag/:tid
// 注意：这个路由必须放在 /tag 之后，否则 /tag 会被匹配为 /tag/:tid
router.get('/tag/:tid', tagController.getTagDetail)

// 导出路由
module.exports = router

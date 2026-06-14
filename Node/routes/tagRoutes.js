// routes/tagRoutes.js - 标签相关路由

const express = require('express')
const router = express.Router()

const tagController = require('../controllers/tagController')
const { optionalAuth } = require('../middleware/authMiddleware')

// 可选认证：解码 JWT（如果存在）
router.use(optionalAuth)

// --- 标签列表 ---
// GET /api/tag?sort=-likeCount&page=1&element=16
router.get('/', tagController.getTagList)

// --- 热门标签 ---
// GET /api/tag/hot?limit=10
router.get('/hot', tagController.getHotTags)

// --- 标签详情 ---
// GET /api/tag/:tid
// 注意：这个路由必须放在 /hot 之后，否则 /hot 会被匹配为 /:tid
router.get('/:tid', tagController.getTagDetail)

// 导出路由
module.exports = router

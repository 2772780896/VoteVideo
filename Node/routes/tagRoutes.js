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

// --- 相关标签推荐 ---
// GET /api/tag/related?tid=xxx&sort=-likeCount&page=1&element=5
// 注意：这个路由必须放在 /:tid 之前，否则 /related 会被匹配为 /:tid
router.get('/related', tagController.getRelatedTags)

// --- 标签详情 ---
// GET /api/tag/:tid
// 注意：这个路由必须放在 /related 之后，否则 /related 会被匹配为 /:tid
router.get('/:tid', tagController.getTagDetail)

// 导出路由
module.exports = router

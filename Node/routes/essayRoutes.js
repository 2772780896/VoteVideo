// routes/essayRoutes.js - 文章相关路由

const express = require('express')
const router = express.Router()

const essayController = require('../controllers/essayController')
const { optionalAuth } = require('../middleware/authMiddleware')

// 可选认证：解码 JWT（如果存在），使已登录用户获得交互状态
router.use(optionalAuth)

// --- 文章列表 ---
// GET /api/essay?sort=-date&page=1&element=16
router.get('/', essayController.getEssayList)

// --- 相关文章推荐 ---
// GET /api/essay/related?eid=xxx&sort=-date&page=1&element=5
// 注意：这个路由必须放在 /:eid 之前，否则 /related 会被匹配为 /:eid
router.get('/related', essayController.getRelatedEssays)

// --- 文章详情 ---
// GET /api/essay/:eid
router.get('/:eid', essayController.getEssayDetail)

// 导出路由
module.exports = router

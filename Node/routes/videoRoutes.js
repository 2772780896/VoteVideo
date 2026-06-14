// routes/videoRoutes.js - 视频相关路由

const express = require('express')
const router = express.Router()

const videoController = require('../controllers/videoController')
const { optionalAuth } = require('../middleware/authMiddleware')

// 可选认证：解码 JWT（如果存在），使已登录用户获得交互状态
router.use(optionalAuth)

// --- 视频列表（默认） ---
// GET /api/video?page=1&element=16&sort=-date&q=搜索词
router.get('/', videoController.getVideoList)

// --- 视频列表（首页推荐） ---
// GET /api/video/main?page=1&element=16
router.get('/main', videoController.getVideoList)

// --- 相关视频推荐 ---
// GET /api/video/related?vid=123&sort=-date&page=1&element=5
router.get('/related', videoController.getRelatedVideos)

// --- 视频详情 ---
// GET /api/video/:vid
// 注意：这个路由必须放在 /main 和 /related 之后，否则它们会被匹配为 /:vid
router.get('/:vid', videoController.getVideoDetail)

// 导出路由
module.exports = router

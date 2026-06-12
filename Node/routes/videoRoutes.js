// routes/videoRoutes.js - 视频相关路由

// 引入 Express Router
// Router 是 Express 的迷你应用，用于将路由模块化
const express = require('express')
const router = express.Router()

// 引入视频控制器
const videoController = require('../controllers/videoController')

// --- 轮播图 ---
// GET /api/picture/carousel?number=5
// 注意：虽然 API 路径是 /api/picture/carousel，但功能是获取视频封面作为轮播图
// 所以路由注册在视频模块中
router.get('/picture/carousel', videoController.getCarousel)

// --- 视频列表（首页推荐） ---
// GET /api/video/main?page=1&element=16
router.get('/video/main', videoController.getVideoList)

// --- 视频详情 ---
// GET /api/video/:vid
// :vid 是路由参数（动态参数）
// 注意：这个路由必须放在 /video/main 之后，否则 /video/main 会被匹配为 /video/:vid
router.get('/video/:vid', videoController.getVideoDetail)

// --- 相关视频推荐 ---
// GET /api/video/related?vid=123&sort=-date&page=1&element=5
router.get('/video/related', videoController.getRelatedVideos)

// 导出路由
module.exports = router

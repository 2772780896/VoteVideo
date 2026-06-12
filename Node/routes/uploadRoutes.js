// routes/uploadRoutes.js - 上传相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入上传控制器
const uploadController = require('../controllers/uploadController')

// 引入 Token 验证中间件
const { needToken } = require('../middleware/authMiddleware')

// --- 路由定义 ---

// 上传视频
// POST /api/upload/video
// Header: Authorization: Bearer <token>
// 请求体：{ title, description, cover, videoUrl }
// 响应：{ code: 201, data: { vid } } 或 { code: 401, message: 'Token 无效' }
router.post('/video', needToken, uploadController.uploadVideo)

// 上传文章
// POST /api/upload/essay
// Header: Authorization: Bearer <token>
// 请求体：{ title, description }
// 响应：{ code: 201, data: { eid } } 或 { code: 401, message: 'Token 无效' }
router.post('/essay', needToken, uploadController.uploadEssay)

// 上传动态
// POST /api/upload/post
// Header: Authorization: Bearer <token>
// 请求体：{ text, images }
// 响应：{ code: 201, data: { pid } } 或 { code: 401, message: 'Token 无效' }
router.post('/post', needToken, uploadController.uploadPost)

// 导出路由
module.exports = router

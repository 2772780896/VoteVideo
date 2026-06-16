// routes/uploadRoutes.js - 上传相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入上传控制器
const uploadController = require('../controllers/uploadController')

// 引入 Token 验证中间件
const { needToken } = require('../middleware/authMiddleware')

// 新增：引入 multer 文件上传中间件
// videoUpload 处理视频+封面两个字段（multipart fields）
// postUpload 处理多图数组（multipart array）
const { videoUpload, postUpload } = require('../middleware/uploadMiddleware')

// --- 路由定义 ---

// 上传视频
// POST /api/upload/video
// Header: Authorization: Bearer <token>
// 请求体（multipart/form-data）：video(File) + cover(File,可选) + title(string) + description(string)
// 响应：{ code: 201, data: { vid } } 或 { code: 401, message: 'Token 无效' }
router.post('/video', needToken, videoUpload, uploadController.uploadVideo)

// 上传文章
// POST /api/upload/essay
// Header: Authorization: Bearer <token>
// 请求体：{ title, description }
// 响应：{ code: 201, data: { eid } } 或 { code: 401, message: 'Token 无效' }
router.post('/essay', needToken, uploadController.uploadEssay)

// 上传动态
// POST /api/upload/post
// Header: Authorization: Bearer <token>
// 请求体（multipart/form-data）：text(string) + images(File[], 最多9张)
// 响应：{ code: 201, data: { pid } } 或 { code: 401, message: 'Token 无效' }
router.post('/post', needToken, postUpload, uploadController.uploadPost)

// 导出路由
module.exports = router

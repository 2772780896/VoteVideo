// routes/uploadRoutes.js - 上传相关路由

// 引入 Express Router
const express = require('express')
const router = express.Router()

// 引入上传控制器
const uploadController = require('../controllers/uploadController')

// --- 上传视频 ---
// POST /api/upload/video
router.post('/upload/video', uploadController.uploadVideo)

// --- 上传文章 ---
// POST /api/upload/essay
router.post('/upload/essay', uploadController.uploadEssay)

// --- 上传动态 ---
// POST /api/upload/post
router.post('/upload/post', uploadController.uploadPost)

// 导出路由
module.exports = router

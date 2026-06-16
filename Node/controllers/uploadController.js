// controllers/uploadController.js - 上传相关控制器

// 引入上传服务
const uploadService = require('../services/uploadService')
// 引入统一响应工具
const { sendSuccess, sendError } = require('../utils/response')

// --- 上传视频 ---
// POST /api/upload/video
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ title, description, cover, videoUrl }
// 响应：{ code: 201, data: { vid } } 或错误响应
const uploadVideo = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user
    // 从请求体获取数据
    const { title, description, cover, videoUrl } = req.body

    const result = await uploadService.uploadVideo(uid, { title, description, cover, videoUrl })
    return sendSuccess(res, result, '上传成功', 201)
  } catch (error) {
    return sendError(res, error, '上传视频错误')
  }
}

// --- 上传文章 ---
// POST /api/upload/essay
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ title, description }
// 响应：{ code: 201, data: { eid } } 或错误响应
const uploadEssay = async (req, res) => {
  try {
    const { uid } = req.user
    const { title, description } = req.body

    const result = await uploadService.uploadEssay(uid, { title, description })
    return sendSuccess(res, result, '发布成功', 201)
  } catch (error) {
    return sendError(res, error, '发布文章错误')
  }
}

// --- 上传动态 ---
// POST /api/upload/post
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ text, images } (images 为 base64 数组)
// 响应：{ code: 201, data: { pid } } 或错误响应
const uploadPost = async (req, res) => {
  try {
    const { uid } = req.user
    const { text, images } = req.body

    const result = await uploadService.uploadPost(uid, { text, images })
    return sendSuccess(res, result, '发布成功', 201)
  } catch (error) {
    return sendError(res, error, '发布动态错误')
  }
}

// 导出控制器函数
module.exports = {
  uploadVideo,
  uploadEssay,
  uploadPost
}

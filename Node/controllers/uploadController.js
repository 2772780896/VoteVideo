// controllers/uploadController.js - 上传相关控制器

// 引入上传服务
const uploadService = require('../services/uploadService')
// 引入统一响应工具
const { sendSuccess, sendError } = require('../utils/response')

// --- 辅助函数：把 multer 落盘后的文件对象转成可访问的相对 URL ---
// multer file 对象包含 { fieldname, originalname, filename, destination, path, size, mimetype }
// 其中 file.destination = 'uploads/video'、file.filename = '1718500000000-837291645.mp4'
// 拼接后返回 '/uploads/video/1718500000000-837291645.mp4'
// 前端拿到后拼接上 baseURL 即可访问：http://localhost:3000/uploads/video/xxx.mp4
const toUrl = (file) => {
  if (!file) return null
  // 把 destination 的反斜杠（Windows）统一替换为正斜杠，保证 URL 可用
  const dir = file.destination.replace(/\\/g, '/')
  return `/${dir}/${file.filename}`
}

// --- 上传视频 ---
// POST /api/upload/video
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体（multipart/form-data）：
//   video  — File（视频文件，由 multer 的 videoUpload 中间件存盘）
//   cover  — File（封面图片，可选，由 multer 的 videoUpload 中间件存盘）
//   title  — string（视频标题）
//   description — string（视频描述）
// 响应：{ code: 201, data: { vid } } 或错误响应
const uploadVideo = async (req, res) => {
  try {
    const { uid } = req.user
    const { title, description } = req.body

    // 从 req.files 取 multer 落盘后的文件对象
    // videoUpload 使用 multer.fields()，所以 req.files 是 { video: [file], cover: [file] } 的对象结构
    const videoFile = req.files?.video?.[0]  // 视频文件（必选）
    const coverFile = req.files?.cover?.[0]  // 封面文件（可选）

    // 把文件路径转成可访问的 URL
    const videoUrl = toUrl(videoFile)
    const coverUrl = toUrl(coverFile)

    if (!videoUrl) {
      return sendError(res, new Error('未上传视频文件'), '缺少视频文件')
    }

    // 调用 service 层写入数据库（参数名已对齐：coverUrl、videoUrl）
    const result = await uploadService.uploadVideo(uid, { title, description, coverUrl, videoUrl })
    return sendSuccess(res, result, '上传成功', 201)
  } catch (error) {
    return sendError(res, error, '上传视频错误')
  }
}

// --- 上传文章 ---
// POST /api/upload/essay
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ title, description }（纯文本，无文件上传）
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
// 请求体（multipart/form-data）：
//   text   — string（动态文本内容）
//   images — File[]（图片数组，最多 9 张，由 multer 的 postUpload 中间件存盘）
// 响应：{ code: 201, data: { pid } } 或错误响应
const uploadPost = async (req, res) => {
  try {
    const { uid } = req.user
    const { text } = req.body

    // postUpload 使用 multer.array('images', 9)，所以 req.files 是普通数组 [file0, file1, ...]
    // 把每个文件对象转成可访问的 URL
    const imageUrls = req.files?.map(toUrl) || []

    const result = await uploadService.uploadPost(uid, { text, imageUrls })
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

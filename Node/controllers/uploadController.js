// controllers/uploadController.js - 上传相关控制器

// 引入上传服务
const uploadService = require('../services/uploadService')

// --- 上传视频 ---
// POST /api/upload/video
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ title, description, cover, videoUrl }
// 响应：{ code: 201, data: { vid } } 或错误响应
const uploadVideo = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    // req.user 包含：{ uid, username, iat, exp }
    const { uid } = req.user

    // 从请求体获取数据
    const { title, description, cover, videoUrl } = req.body

    // 调用服务层
    const result = await uploadService.uploadVideo(uid, { title, description, cover, videoUrl })

    // 返回成功响应
    // HTTP 状态码：201 Created（创建成功）
    return res.status(201).json({
      code: 201,
      message: '上传成功',
      data: result
    })

  } catch (error) {
    // 参数校验错误
    if (error.message === '标题和视频URL不能为空') {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('上传视频错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 上传文章 ---
// POST /api/upload/essay
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ title, description }
// 响应：{ code: 201, data: { eid } } 或错误响应
const uploadEssay = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 从请求体获取数据
    const { title, description } = req.body

    // 调用服务层
    const result = await uploadService.uploadEssay(uid, { title, description })

    // 返回成功响应
    return res.status(201).json({
      code: 201,
      message: '发布成功',
      data: result
    })

  } catch (error) {
    // 参数校验错误
    if (error.message === '标题和内容不能为空') {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('发布文章错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 上传动态 ---
// POST /api/upload/post
// Header: Authorization: Bearer <token> (由 needToken 中间件验证)
// 请求体：{ text, images } (images 为 base64 数组)
// 响应：{ code: 201, data: { pid } } 或错误响应
const uploadPost = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    const { uid } = req.user

    // 从请求体获取数据
    const { text, images } = req.body

    // 调用服务层
    const result = await uploadService.uploadPost(uid, { text, images })

    // 返回成功响应
    return res.status(201).json({
      code: 201,
      message: '发布成功',
      data: result
    })

  } catch (error) {
    // 参数校验错误
    if (error.message === '内容和图片至少有一个') {
      return res.status(400).json({
        code: 400,
        message: error.message,
        data: null
      })
    }

    // 其他错误
    console.error('发布动态错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// 导出控制器函数
module.exports = {
  uploadVideo,
  uploadEssay,
  uploadPost
}

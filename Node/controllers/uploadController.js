// controllers/uploadController.js - 上传相关控制器

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 引入 multer（用于文件上传）
// multer 是 Express 的中间件，用于处理 multipart/form-data（文件上传）
// 使用前需要先安装：npm install multer
// const multer = require('multer')

// 引入 path 和 fs（用于文件操作）
// const path = require('path')
// const fs = require('fs')

// --- 上传视频 ---
// POST /api/upload/video
// 请求体：{ title, description, cover, videoUrl }
// 需要 needToken: true
const uploadVideo = async (req, res) => {
  try {
    // 验证 Token
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    const token = authHeader.split(' ')[1]
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET)

    // 从请求体获取数据
    const { title, description, cover, videoUrl } = req.body

    // 参数校验
    if (!title || !videoUrl) {
      return res.status(400).json({
        code: 400,
        message: '标题和视频URL不能为空',
        data: null
      })
    }

    // Prisma Client 用法：
    //   prisma.video.create({ data: {...} })
    const newVideo = await prisma.video.create({
      data: {
        title: title,
        coverUrl: cover || null,
        videoUrl: videoUrl,
        duration: null,  // 需要后续处理视频获取时长
        viewCount: 0,
        messageCount: 0,
        likeCount: 0,
        favouriteCount: 0,
        uploader_uid: decoded.uid
      }
    })

    return res.status(201).json({
      code: 201,
      message: '上传成功',
      data: {
        vid: newVideo.vid
      }
    })

  } catch (error) {
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
// 请求体：{ title, description }
const uploadEssay = async (req, res) => {
  try {
    // 验证 Token
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    const token = authHeader.split(' ')[1]
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET)

    // 从请求体获取数据
    const { title, description } = req.body

    // 参数校验
    if (!title || !description) {
      return res.status(400).json({
        code: 400,
        message: '标题和内容不能为空',
        data: null
      })
    }

    // Prisma Client 用法：
    //   prisma.essay.create({ data: {...} })
    const newEssay = await prisma.essay.create({
      data: {
        title: title,
        text: description,
        viewCount: 0,
        commentCount: 0,
        likeCount: 0,
        favouriteCount: 0,
        uploader_uid: decoded.uid
      }
    })

    return res.status(201).json({
      code: 201,
      message: '发布成功',
      data: {
        eid: newEssay.eid
      }
    })

  } catch (error) {
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
// 请求体：{ text, images } (images 为 base64 数组)
const uploadPost = async (req, res) => {
  try {
    // 验证 Token
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({
        code: 401,
        message: '请先登录',
        data: null
      })
    }

    const token = authHeader.split(' ')[1]
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET)

    // 从请求体获取数据
    const { text, images } = req.body

    // 参数校验（text 和 images 至少有一个）
    if (!text && !images) {
      return res.status(400).json({
        code: 400,
        message: '内容和图片至少有一个',
        data: null
      })
    }

    // 处理图片（base64 数组转换为 JSON 字符串）
    // JSON.stringify() 用法：
    //   - 将 JavaScript 对象转换为 JSON 字符串
    //   - 用于存储到数据库（SQLite 不支持数组类型）
    const pictureList = images ? JSON.stringify(images) : null

    // Prisma Client 用法：
    //   prisma.post.create({ data: {...} })
    const newPost = await prisma.post.create({
      data: {
        text: text || null,
        pictureList: pictureList,
        videoList: null,  // 暂不处理视频
        viewCount: 0,
        commentCount: 0,
        likeCount: 0,
        uploader_uid: decoded.uid
      }
    })

    return res.status(201).json({
      code: 201,
      message: '发布成功',
      data: {
        pid: newPost.pid
      }
    })

  } catch (error) {
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

// services/uploadService.js - 上传相关服务

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 上传视频 ---
// 参数：uid (用户ID), data ({ title, description, coverUrl, videoUrl })
// 返回：{ vid } (视频ID)
// 用途：创建视频记录到数据库（coverUrl/videoUrl 由 controller 从 multer 落盘文件中转换而来）
async function uploadVideo(uid, { title, description, coverUrl, videoUrl }) {
  // 参数校验（带 statusCode 供 sendError 识别为业务错误）
  if (!title || !videoUrl) {
    const err = new Error('标题和视频URL不能为空')
    err.statusCode = 400
    throw err
  }

  // Prisma Client 用法：
  //   prisma.video.create({ data: {...} })
  //   - create: 插入新记录
  //   - 返回插入的对象（包含自增 ID）
  const newVideo = await prisma.video.create({
    data: {
      title: title,
      coverUrl: coverUrl || null,  // 封面 URL（由 controller 从 multer 文件路径转换而来），可选
      videoUrl: videoUrl,
      duration: null,  // 需要后续处理视频获取时长
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
      favouriteCount: 0,
      uploader_uid: uid  // 上传者ID
    }
  })

  // 返回视频ID
  return {
    vid: newVideo.vid
  }
}

// --- 上传文章 ---
// 参数：uid (用户ID), data ({ title, description })
// 返回：{ eid } (文章ID)
// 用途：创建文章记录到数据库
async function uploadEssay(uid, { title, description }) {
  // 参数校验
  if (!title || !description) {
    const err = new Error('标题和内容不能为空')
    err.statusCode = 400
    throw err
  }

  // Prisma Client 用法：
  //   prisma.essay.create({ data: {...} })
  const newEssay = await prisma.essay.create({
    data: {
      title: title,
      text: description,  // 文章内容存储在 text 字段
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
      favouriteCount: 0,
      uploader_uid: uid  // 上传者ID
    }
  })

  // 返回文章ID
  return {
    eid: newEssay.eid
  }
}

// --- 上传动态 ---
// 参数：uid (用户ID), data ({ text, imageUrls })
// 返回：{ pid } (动态ID)
// 用途：创建动态记录到数据库（imageUrls 由 controller 从 multer 落盘文件中转换而来）
async function uploadPost(uid, { text, imageUrls }) {
  // 参数校验（text 和 imageUrls 至少有一个）
  if (!text && (!imageUrls || imageUrls.length === 0)) {
    const err = new Error('内容和图片至少有一个')
    err.statusCode = 400
    throw err
  }

  // 处理图片 URL 数组 → 序列化为 JSON 字符串存入 SQLite
  // SQLite 不支持原生数组类型，所以用 JSON.stringify 转成字符串存储
  // imageUrls 例：['/uploads/post/xxx.jpg', '/uploads/post/yyy.png']
  const pictureList = imageUrls && imageUrls.length > 0 ? JSON.stringify(imageUrls) : null

  // Prisma Client 用法：
  //   prisma.post.create({ data: {...} })
  const newPost = await prisma.post.create({
    data: {
      text: text || null,  // 如果没有文字，设置为 null
      pictureList: pictureList,  // 图片列表（JSON 字符串）
      videoList: null,  // 暂不处理视频
      viewCount: 0,
      commentCount: 0,
      likeCount: 0,
      uploader_uid: uid  // 上传者ID
    }
  })

  // 返回动态ID
  return {
    pid: newPost.pid
  }
}

// 导出服务函数
module.exports = {
  uploadVideo,
  uploadEssay,
  uploadPost
}

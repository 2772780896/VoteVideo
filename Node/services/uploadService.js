// services/uploadService.js - 上传相关服务

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 上传视频 ---
// 参数：uid (用户ID), data ({ title, description, cover, videoUrl })
// 返回：{ vid } (视频ID)
// 用途：创建视频记录到数据库
async function uploadVideo(uid, { title, description, cover, videoUrl }) {
  // 参数校验
  if (!title || !videoUrl) {
    throw new Error('标题和视频URL不能为空')
  }

  // Prisma Client 用法：
  //   prisma.video.create({ data: {...} })
  //   - create: 插入新记录
  //   - 返回插入的对象（包含自增 ID）
  const newVideo = await prisma.video.create({
    data: {
      title: title,
      coverUrl: cover || null,  // 如果没有封面，设置为 null
      videoUrl: videoUrl,
      duration: null,  // 需要后续处理视频获取时长
      viewCount: 0,
      messageCount: 0,
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
    throw new Error('标题和内容不能为空')
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
// 参数：uid (用户ID), data ({ text, images })
// 返回：{ pid } (动态ID)
// 用途：创建动态记录到数据库
async function uploadPost(uid, { text, images }) {
  // 参数校验（text 和 images 至少有一个）
  if (!text && !images) {
    throw new Error('内容和图片至少有一个')
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

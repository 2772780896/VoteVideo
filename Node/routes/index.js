// routes/index.js - 统一导出所有路由模块

// 引入所有路由模块
const authRoutes = require('./authRoutes')
const videoRoutes = require('./videoRoutes')
const pictureRoutes = require('./pictureRoutes')
const commentRoutes = require('./commentRoutes')
const essayRoutes = require('./essayRoutes')
const postRoutes = require('./postRoutes')
const tagRoutes = require('./tagRoutes')
const userRoutes = require('./userRoutes')
const uploadRoutes = require('./uploadRoutes')
const interactRoutes = require('./interactRoutes')
const messageRoutes = require('./messageRoutes')

// 导出路由配置数组（按注册顺序）
// 注意：中间件的执行顺序与数组顺序一致
module.exports = [
  // 认证相关路由（登录/注册）
  // 前端 API 路径：/api/login, /api/register
  { path: '/api', router: authRoutes },

  // 用户相关路由
  // 前端 API 路径：/api/user/profile, /api/user/:uid, /api/user/profile/:profileType/:dataType
  { path: '/api/user', router: userRoutes },

  // 内容相关路由
  // 前端 API 路径：/api/video/:id, /api/video, /api/video/main, /api/video/related
  { path: '/api/video', router: videoRoutes },
  // 前端 API 路径：/api/picture/carousel
  { path: '/api/picture', router: pictureRoutes },
  // 前端 API 路径：/api/essay/:id, /api/essay
  { path: '/api/essay', router: essayRoutes },
  // 前端 API 路径：/api/post/:id, /api/post
  { path: '/api/post', router: postRoutes },
  // 前端 API 路径：/api/comment/:id, /api/comment
  { path: '/api/comment', router: commentRoutes },
  // 前端 API 路径：/api/tag/:id, /api/tag
  { path: '/api/tag', router: tagRoutes },

  // 交互相关路由
  // 前端 API 路径：/api/:mediaType/:mediaId/like, /api/:mediaType/:mediaId/favourite 等
  { path: '/api', router: interactRoutes },

  // 消息相关路由
  // 前端 API 路径：/api/user/message/send
  { path: '/api/user/message', router: messageRoutes },

  // 上传相关路由
  // 前端 API 路径：/api/upload/:type
  { path: '/api/upload', router: uploadRoutes },
]

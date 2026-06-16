// middleware/uploadMiddleware.js - 文件上传中间件（multer 配置）
//
// 职责：
//   拦截 multipart/form-data 请求，把文件写入磁盘，把文件信息注入 req.files
//   供 uploadController 读取落盘后的本地 URL，存入数据库
//
// 存储结构：
//   uploads/
//   ├── video/   ← 视频文件（mp4/webm/mov）
//   └── post/    ← 动态图片（jpg/png/gif/webp）
//
// 使用方式：
//   router.post('/video', needToken, videoUpload, controller.uploadVideo)
//   router.post('/post',  needToken, postUpload,  controller.uploadPost)

const multer = require('multer')
const path = require('path')
const fs = require('fs')  // 新增：用于启动时创建上传目录

// --- 公共存储引擎 ---
//
// diskStorage 是 multer 的磁盘存储模式（对比 memoryStorage 存内存）
// 每次上传文件，multer 依次执行：
//   1. destination → 决定文件写到哪个目录（目录在模块加载时由底部 fs.mkdirSync 预创建）
//   2. filename   → 决定文件在磁盘上的名字（防重名）
const storage = multer.diskStorage({

  // destination：根据表单字段名分目录存放
  //   req.file.fieldname = 'video'  → 存 uploads/video/
  //   req.file.fieldname = 'cover'  → 存 uploads/cover/（保留独立目录，便于清理）
  //   req.file.fieldname = 'images' → 存 uploads/post/
  destination: (req, file, cb) => {
    const fieldDir = {
      video:  'uploads/video',
      cover:  'uploads/cover',
      images: 'uploads/post'
    }
    // 未匹配的字段兜底到 uploads/，防止报错
    const dir = fieldDir[file.fieldname] || 'uploads'
    cb(null, dir)
  },

  // filename：时间戳 + 随机数 + 原始扩展名
  //   例：1718500000000-837291645.mp4
  //   Date.now()          → 毫秒级时间戳，保证时间有序
  //   Math.round(Math.random() * 1e9) → 0~10亿随机数，同一毫秒也不重名
  //   path.extname()      → 保留原始扩展名（.mp4 / .jpg 等）
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// --- 视频上传中间件 ---
//
// multer.fields()：同时处理多个不同字段名的文件
//   [{ name: 'video', maxCount: 1 }, { name: 'cover', maxCount: 1 }]
//   表示：接收 1 个字段名 video 的文件 + 1 个字段名 cover 的文件
//
// 处理完成后，controller 通过 req.files 取到：
//   req.files.video[0]  → { filename, path, mimetype, size, ... }
//   req.files.cover[0]  → { filename, path, mimetype, size, ... }（可选，封面可能没有）
//
// fileFilter：文件类型白名单
//   mimetype 由浏览器根据文件扩展名推断，不是100%可靠，但对学习项目足够
//   不合法的文件 → cb(new Error(...), false) → multer 抛出错误，不进 controller
//
// limits.fileSize：单文件体积上限（字节）
//   100 * 1024 * 1024 = 100MB
const videoUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)   // 第二参 true = 接受此文件
    } else {
      cb(new Error('仅支持 mp4/webm/mov 格式的视频文件'), false)
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

// --- 动态图片上传中间件 ---
//
// multer.array('images', 9)：接收字段名为 images 的文件数组，最多 9 个
// 处理完成后，controller 通过 req.files 取到：
//   req.files = [file0, file1, ..., file8]   ← 普通数组，不是对象
//
// limits.fileSize：单张图片上限 5MB（5 * 1024 * 1024）
const postUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('仅支持 jpg/png/gif/webp 格式的图片'), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).array('images', 9)

// --- 启动时自动创建上传目录 ---
// 防止首次上传时因目录不存在而报错
// recursive: true 表示父目录不存在也会一并创建，已存在则静默跳过
const uploadDirs = ['uploads/video', 'uploads/cover', 'uploads/post']
uploadDirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true })
})
console.log('✅ 上传目录已就绪:', uploadDirs.join(', '))

module.exports = { videoUpload, postUpload }

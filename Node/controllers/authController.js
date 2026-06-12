// controllers/authController.js - 认证相关控制器

// 加载环境变量（获取 JWT_SECRET）
require('dotenv').config()

// 引入 Prisma Client（用于数据库操作）
// Prisma Client 是根据 schema.prisma 自动生成的
// 提供了 findUnique, create, update, delete 等方法
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 引入 bcrypt（用于密码加密和验证）
// bcrypt 是单向哈希函数，不可逆，适合存储密码
const bcrypt = require('bcrypt')

// 引入 jsonwebtoken（用于生成和验证 Token）
// JWT (JSON Web Token) 是无状态的认证方案
const jwt = require('jsonwebtoken')

// 从环境变量读取 JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET

// --- 注册接口 ---
const register = async (req, res) => {
  try {
    // 从请求体获取用户名和密码
    // req.body 需要通过 express.json() 中间件解析（已在 app.js 配置）
    const { username, password } = req.body

    // 参数校验
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
        data: null
      })
    }

    // 1. 查询用户名是否已存在
    // Prisma Client 用法：
    //   prisma.模型名.findUnique({ where: { 字段名: 值 } })
    //   - findUnique: 查询唯一记录（根据 unique 或 @id 字段）
    //   - 返回对象或 null
    const existingUser = await prisma.user.findUnique({
      where: { username: username }
    })

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
        data: null
      })
    }

    // 2. 加密密码
    // bcrypt.hash(密码, 盐轮数) 用法：
    //   - 密码：明文密码
    //   - 盐轮数：推荐 10-12（越大越安全，但越慢）
    //   - 返回加密后的密码（包含盐，格式：$2b$10$...）
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. 插入用户到数据库
    // Prisma Client 用法：
    //   prisma.模型名.create({ data: { 字段名: 值 } })
    //   - create: 插入新记录
    //   - 返回插入的对象（包含自增 ID）
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        // profilePictureUrl, info 等字段使用默认值（schema.prisma 中定义）
      }
    })

    // 4. 生成 Token
    // jwt.sign(载荷, 密钥, 选项) 用法：
    //   - 载荷：要加密的数据（通常是用户 ID）
    //   - 密钥：JWT_SECRET（在 .env 中配置）
    //   - 选项：{ expiresIn: '7d' } 表示 7 天过期
    //   - 返回 Token 字符串（格式：header.payload.signature）
    const token = jwt.sign(
      { uid: newUser.uid, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. 返回成功响应
    // HTTP 状态码：201 Created（创建成功）
    return res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        token: token,
        uid: newUser.uid
      }
    })

  } catch (error) {
    // 捕获所有错误（数据库错误、bcrypt 错误、JWT 错误等）
    console.error('注册错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 登录接口 ---
const login = async (req, res) => {
  try {
    // 从请求体获取用户名和密码
    const { username, password } = req.body

    // 参数校验
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
        data: null
      })
    }

    // 1. 查询用户是否存在
    // Prisma Client 用法：
    //   prisma.user.findUnique({ where: { username: username } })
    const user = await prisma.user.findUnique({
      where: { username: username }
    })

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      })
    }

    // 2. 验证密码
    // bcrypt.compare(明文密码, 加密密码) 用法：
    //   - 明文密码：用户输入的密码
    //   - 加密密码：数据库中存储的密码（包含盐）
    //   - 返回 boolean（true 表示密码正确）
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      })
    }

    // 3. 生成 Token
    // jwt.sign(载荷, 密钥, 选项) 用法：
    //   - 载荷：{ uid: user.uid, username: user.username }
    //   - 密钥：JWT_SECRET
    //   - 选项：{ expiresIn: '7d' }
    const token = jwt.sign(
      { uid: user.uid, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 4. 返回成功响应
    // HTTP 状态码：200 OK（登录成功）
    return res.status(200).json({
      code: 200,
      message: '登录成功',
      data: {
        token: token,
        uid: user.uid
      }
    })

  } catch (error) {
    console.error('登录错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// --- 获取当前用户信息（需要认证）---
// 注意：Token 验证已由 needToken 中间件完成，req.user 中包含用户信息
const getProfile = async (req, res) => {
  try {
    // 从 req.user 获取用户信息（由 needToken 中间件设置）
    // req.user 包含：{ uid, username, iat, exp }
    const { uid } = req.user

    // 根据 Token 中的 uid 查询用户
    // Prisma Client 用法：
    //   prisma.user.findUnique({ where: { uid: uid } })
    const user = await prisma.user.findUnique({
      where: { uid: uid },
      // select: 指定返回的字段（不返回 password）
      select: {
        uid: true,
        username: true,
        profilePictureUrl: true,
        info: true,
        followerCount: true,
        followingCount: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      })
    }

    // 返回用户信息
    return res.status(200).json({
      code: 200,
      message: '获取成功',
      data: user
    })

  } catch (error) {
    console.error('获取用户信息错误:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
      data: null
    })
  }
}

// 导出控制器函数
module.exports = {
  register,
  login,
  getProfile
}

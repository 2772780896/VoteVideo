const { PrismaClient } = require('@prisma/client')
const { faker: fakerZh } = require('@faker-js/faker/locale/zh_CN')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

// ==================== 工具函数 ====================

/** 从数组中随机取 n 个不重复元素 */
const pickN = (arr, n) => fakerZh.helpers.arrayElements(arr, Math.min(n, arr.length))

/** 随机日期（最近 N 天内） */
const recentDate = (days = 90) => fakerZh.date.recent({ days })

/** 从 createMany 返回的 count + 起始 ID 推断完整记录 */
const inferRecords = (startId, count, extraFn = () => ({})) =>
  Array.from({ length: count }, (_, i) => ({ ...extraFn(i), _idx: i }))

/** 构建计数 Map: "type|item_id" → count */
const buildCountMap = (records) => {
  const map = new Map()
  for (const r of records) {
    const key = `${r.type}|${r.item_id}`
    map.set(key, (map.get(key) || 0) + 1)
  }
  return map
}

/** 构建 ID → count 映射 */
const buildIdCountMap = (items, matchFn) => {
  const map = new Map()
  for (const item of items) {
    map.set(item._id || item, matchFn(item))
  }
  return map
}

// ==================== 预定义数据 ====================

const TAG_NAMES = [
  '前端', '后端', '数据库', 'React', 'Node.js',
  'Prisma', 'JavaScript', 'Python', 'Vue', 'TypeScript',
  'CSS', 'Docker', '算法', '微服务'
]

const USER_PROFILES = [
  { username: 'testuser', info: '测试账号，用于功能验证和登录测试' },
  { username: '前端小王', info: '3年前端开发经验，热爱React生态，分享前端技巧' },
  { username: '全栈老张', info: '十年全栈工程师，专注Node.js与数据库优化' },
  { username: 'Python达人', info: '数据科学与后端开发，Python/Go双修' },
  { username: 'Vue小姐姐', info: 'Vue3深度玩家，组件库贡献者，技术博主' },
  { username: 'DevOps阿明', info: '容器化部署爱好者，Docker/K8s实践者' },
  { username: '算法新手', info: '刷题中，记录算法学习过程与心得' },
  { username: '设计转码', info: 'UI设计师转前端，关注用户体验与交互设计' },
]

const VIDEO_DATA = [
  { title: 'React 18 并发模式深度解析', duration: '15:32' },
  { title: 'Node.js 搭建 RESTful API 实战', duration: '22:10' },
  { title: 'Prisma ORM 从入门到项目实战', duration: '18:45' },
  { title: 'JavaScript 原型链与闭包精讲', duration: '12:08' },
  { title: 'TypeScript 高级类型技巧', duration: '20:15' },
  { title: '前端性能优化：从加载到渲染', duration: '25:33' },
  { title: 'Vue3 Composition API 实战指南', duration: '16:20' },
  { title: 'Docker 容器化部署 Node 应用', duration: '14:50' },
  { title: 'CSS Grid 与 Flexbox 布局对比', duration: '10:28' },
  { title: 'SQLite 性能调优实战经验', duration: '11:45' },
  { title: 'Express 中间件机制源码分析', duration: '19:02' },
  { title: 'Python FastAPI 快速搭建后端', duration: '17:38' },
]

const ESSAY_DATA = [
  { title: '深入理解 React Hooks 原理与实践', text: 'React Hooks 是 React 16.8 引入的全新特性，它让函数组件也能拥有状态管理和生命周期能力。\n\n本文将从 useState、useEffect 的底层实现出发，深入分析 Hooks 的工作原理。通过闭包陷阱、依赖数组等常见问题的实战案例，帮助读者真正理解 Hooks 而非仅仅会用。\n\n最后我们会手写一个简易版 useState，加深对 Hooks 运行机制的理解。' },
  { title: 'Node.js 异步编程模型全解析', text: 'Node.js 以其非阻塞 I/O 和事件驱动架构闻名。本文将系统梳理 Node.js 的异步编程范式。\n\n从回调函数到 Promise，再到 async/await，我们会看到异步编程风格的演进。同时深入 Event Loop 的六个阶段，理解 setImmediate、process.nextTick 的执行时机。\n\n配合实际项目中的并发控制案例，让你写出高性能的异步代码。' },
  { title: 'Prisma ORM 最佳实践与踩坑记录', text: 'Prisma 作为新一代 ORM，以类型安全和直观的开发体验著称。\n\n本文总结了在 VoteVideo 项目中使用 Prisma 的实践经验，包括 Schema 设计、关联查询优化、事务处理等关键话题。特别针对 SQLite 场景下的性能优化给出了具体建议。\n\n适合正在评估或已经使用 Prisma 的后端开发者参考。' },
  { title: 'JavaScript 闭包：从理论到实战', text: '闭包是 JavaScript 中最强大也最容易被误解的概念之一。\n\n本文从作用域链开始，逐步揭示闭包的形成机制。通过防抖节流、模块模式、柯里化等经典案例，展示闭包在实际开发中的广泛应用。\n\n理解闭包不仅能提升代码质量，也是面试中的高频考点。' },
  { title: '前端工程化：构建工具演进之路', text: '从 Grunt、Gulp 到 Webpack，再到 Vite，前端构建工具经历了巨大的变革。\n\n本文对比了各代构建工具的设计理念和适用场景，重点分析了 Vite 为何能在开发体验上实现质的飞跃。通过 ESM 原生支持和按需编译的思路，理解现代构建工具的核心思想。\n\n最后给出了新项目技术选型的建议。' },
  { title: 'RESTful API 设计原则与版本管理', text: '良好的 API 设计是后端服务的基石。\n\n本文从资源命名、HTTP 方法语义、状态码使用、分页策略等方面，系统总结 RESTful API 的设计规范。同时讨论 API 版本管理的几种主流方案及其优劣。\n\n配合实际项目中的案例，帮助你设计出易维护、易扩展的 API。' },
  { title: '数据库事务隔离级别详解', text: '事务隔离级别直接影响数据库的并发性能和数据一致性。\n\n本文用通俗易懂的例子解释 Read Uncommitted、Read Committed、Repeatable Read、Serializable 四种隔离级别的区别。分析脏读、不可重复读、幻读三种并发问题。\n\n最后结合 SQLite 的实际实现，讨论如何在项目中选择合适的隔离级别。' },
  { title: 'TypeScript 泛型进阶：条件类型与映射类型', text: 'TypeScript 的类型系统远比表面看起来强大。\n\n本文深入讲解条件类型（Conditional Types）、映射类型（Mapped Types）和模板字面量类型（Template Literal Types）。通过 Extract、Exclude、ReturnType 等内置工具类型的实现原理，带你掌握类型编程的核心技巧。\n\n适合有一定 TS 基础、想要进阶类型体操的开发者。' },
  { title: 'Vue3 响应式系统源码走读', text: 'Vue3 使用 Proxy 替代 Object.defineProperty 实现了全新的响应式系统。\n\n本文从 reactive 和 ref 的源码出发，逐步分析依赖收集、触发更新、effect 调度等核心流程。对比 Vue2 的实现，理解 Proxy 方案的优势。\n\n阅读源码是深入理解框架的最佳途径。' },
  { title: 'Docker Compose 多容器编排实践', text: '在微服务架构下，多个容器协同工作成为常态。\n\n本文以一个完整的前后端项目为例，演示如何使用 Docker Compose 编排 Node.js 后端、React 前端和 SQLite 数据库。涵盖网络配置、卷挂载、环境变量管理等核心话题。\n\n适合想要容器化部署全栈项目的开发者。' },
]

const POST_TEXTS = [
  '刚完成了一个 React 项目的重构，从 Class 组件全部迁移到 Hooks，代码量减少了 30%，可读性提升不少。分享一下重构过程中的几个关键决策。',
  '今天研究了 Prisma 的交互式事务 API，相比传统的事务写法优雅太多了。尤其是在处理多表关联写入时，代码量直接减半。',
  '分享一个 Node.js 性能优化小技巧：使用 stream 处理大文件上传，内存占用从 500MB 降到了 20MB。',
  '周末刷了一遍 TypeScript 5.0 的新特性，装饰器终于标准化了！配合新的 const 类型参数，类型推导更智能了。',
  'Vue3 的 Suspense 配合异步组件，做代码分割真的很方便。对比 React 的 Suspense，各有千秋。',
  'Docker 镜像瘦身记：把 Node.js 应用镜像从 1.2GB 压缩到 180MB，关键是 multi-stage build + alpine 基础镜像。',
  '最近在学算法，今天搞懂了动态规划的背包问题。用 JS 实现了一遍，感觉对内存管理有了更深的理解。',
  '推荐一个 VSCode 插件组合：Error Lens + GitLens + Thunder Client，开发效率直接翻倍。',
  'CSS 新特性 :has() 选择器太好用了，终于可以写"父选择器"了。浏览器兼容性也在快速提升。',
  '前端面试八股文整理完毕，涵盖了 JS、CSS、网络、框架等方向，需要的同学自取。',
]

const COMMENT_TEXTS = [
  '讲得很清楚，学到了！', '这个方案在生产环境中性能如何？', '补充一下，其实还可以用另一种写法',
  '正好在学这个，太及时了', '有没有配套的代码仓库？', '第三步那里有个小问题，应该是 await 而不是直接调用',
  '感谢分享，收藏了', '能出一期进阶版的吗？', '这个思路很新颖，之前没想到过',
  '实测有效，赞一个', '建议加一下错误处理的部分', '看完之后回去重构了自己的代码',
  '请问这个和另一种方案对比有什么优势？', '评论区也有大佬在补充，收获满满', '期待后续更新',
  '这个坑我也踩过，当时折腾了好久', '楼主总结得很到位', '有没有视频版本的教程？',
  '新手请问一下，这里的环境配置怎么搞？', '已经在项目中用上了，效果不错',
]

const DIALOGUE_PAIRS = [
  [0, 1], [0, 2], [1, 3], [2, 4], [0, 5], [3, 6], [4, 7]
]

const DIALOGUE_MESSAGES = [
  ['你好，看到你发的 React 视频了，讲得很好！', '谢谢！有什么建议吗？', '可以加一下 React.memo 的对比部分', '好的，我考虑一下，感谢反馈'],
  ['最近在学 Prisma，你的文章帮了大忙', '很高兴能帮到你！有问题的话随时问', '请问多对多关系怎么写？', '通过 @@id 定义复合主键就行，参考我文章里的 VideoTag 示例'],
  ['看了你的动态，TypeScript 5.0 确实有很多改进', '是的，装饰器标准化是我最期待的', '你用的什么版本的 tsc？', '最新的 5.3，向下兼容做得不错'],
  ['Vue3 的响应式系统文章写得很详细', '谢谢，源码走读花了不少时间', '有没有计划出 Vue Router 的教程？', '正在准备中，下周应该能发'],
  ['Docker 部署那篇文章很实用', '感谢支持！你的 Docker Compose 方案也不错', '我们项目正在从 K8s 迁移，想参考一下你的方案', '没问题，我把配置文件分享给你'],
  ['算法打卡坚持得不错', '谢谢鼓励，动态规划还是有点难', '推荐一个 B 站的算法课，讲得很好', '好的我去看看，谢谢推荐'],
  ['你的前端面试八股文整理得很全', '花了一个周末整理的，希望对找工作有帮助', '我补充了几个 CSS 的题目，你看看要不要加进去', '太好了，发给我看看'],
]

// ==================== 主函数 ====================

async function main() {
  console.log('🌱 开始生成 VoteVideo 测试数据...\n')
  const stats = {} // 统计数据

  // ── Step 0: 清空现有数据（事务，按外键依赖倒序） ──
  console.log('[0/14] 清空现有数据...')
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),
    prisma.dialogue.deleteMany(),
    prisma.userDislike.deleteMany(),
    prisma.userReshare.deleteMany(),
    prisma.userLike.deleteMany(),
    prisma.userFollowing.deleteMany(),
    prisma.userHistory.deleteMany(),
    prisma.userFavourite.deleteMany(),
    prisma.videoTag.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.essay.deleteMany(),
    prisma.video.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // ── Step 1: 创建标签（14 个，createMany 批量） ──
  console.log('[1/14] 创建标签...')
  await prisma.tag.createMany({
    data: TAG_NAMES.map(tagName => ({
      tagName,
      viewCount: fakerZh.number.int({ min: 200, max: 5000 }),
    }))
  })
  const tags = await prisma.tag.findMany({ orderBy: { tid: 'asc' } })
  stats.tags = tags.length
  console.log(`  ✓ ${tags.length} 个标签`)

  // ── Step 2: 创建用户（8 个，密码统一 123456） ──
  console.log('[2/14] 创建用户...')
  const hashedPassword = await bcrypt.hash('123456', 10)
  await prisma.user.createMany({
    data: USER_PROFILES.map((p, i) => ({
      username: p.username,
      password: hashedPassword,
      profilePictureUrl: `https://picsum.photos/seed/avatar${i}/200/200`,
      info: p.info,
      date: recentDate(180),
    }))
  })
  const users = await prisma.user.findMany({ orderBy: { uid: 'asc' } })
  stats.users = users.length
  console.log(`  ✓ ${users.length} 个用户（测试账号: testuser / 123456）`)

  // ── Step 3: 创建视频（12 个 + 标签关联） ──
  console.log('[3/14] 创建视频...')
  const videos = []
  const videoTagData = []

  for (let i = 0; i < VIDEO_DATA.length; i++) {
    const v = VIDEO_DATA[i]
    const video = await prisma.video.create({
      data: {
        title: v.title,
        coverUrl: `https://picsum.photos/seed/cover${i}/640/360`,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: v.duration,
        viewCount: fakerZh.number.int({ min: 50, max: 8000 }),
        date: recentDate(120),
        uploader_uid: users[i % users.length].uid,
      }
    })
    videos.push(video)

    // 每个视频关联 1-3 个标签
    const selectedTags = pickN(tags, fakerZh.number.int({ min: 1, max: 3 }))
    for (const tag of selectedTags) {
      videoTagData.push({ vid: video.vid, tid: tag.tid })
    }
  }

  // 批量创建视频-标签关联
  if (videoTagData.length > 0) {
    await prisma.videoTag.createMany({ data: videoTagData })
  }
  stats.videos = videos.length
  stats.videoTags = videoTagData.length
  console.log(`  ✓ ${videos.length} 个视频 + ${videoTagData.length} 条标签关联`)

  // ── Step 4: 创建文章（10 篇，createMany 批量） ──
  console.log('[4/14] 创建文章...')
  await prisma.essay.createMany({
    data: ESSAY_DATA.map((e, i) => ({
      title: e.title,
      text: e.text,
      viewCount: fakerZh.number.int({ min: 30, max: 3000 }),
      date: recentDate(100),
      uploader_uid: users[i % users.length].uid,
    }))
  })
  const essays = await prisma.essay.findMany({ orderBy: { eid: 'asc' } })
  stats.essays = essays.length
  console.log(`  ✓ ${essays.length} 篇文章`)

  // ── Step 5: 创建动态（10 条，createMany 批量） ──
  console.log('[5/14] 创建动态...')
  await prisma.post.createMany({
    data: POST_TEXTS.map((text, i) => {
      const hasPicture = i % 3 !== 0
      const hasVideo = i % 5 === 0
      return {
        text,
        pictureList: hasPicture ? JSON.stringify([
          `https://picsum.photos/seed/post${i}a/400/300`,
          ...(i % 2 === 0 ? [`https://picsum.photos/seed/post${i}b/400/300`] : []),
        ]) : null,
        videoList: hasVideo ? JSON.stringify([
          { url: 'https://www.w3schools.com/html/mov_bbb.mp4', cover: `https://picsum.photos/seed/postv${i}/320/180` }
        ]) : null,
        viewCount: fakerZh.number.int({ min: 10, max: 1500 }),
        date: recentDate(60),
        uploader_uid: users[i % users.length].uid,
      }
    })
  })
  const posts = await prisma.post.findMany({ orderBy: { pid: 'asc' } })
  stats.posts = posts.length
  console.log(`  ✓ ${posts.length} 条动态`)

  // ── Step 6: 创建评论（视频 + 文章 + 动态 + 标签，含子评论） ──
  console.log('[6/14] 创建评论...')
  const allComments = []
  let cIdx = 0

  // 视频评论（每个视频 2-4 条主评论 + 0-2 条子评论）
  for (const video of videos) {
    const numMain = fakerZh.number.int({ min: 2, max: 4 })
    for (let j = 0; j < numMain; j++) {
      const comment = await prisma.comment.create({
        data: {
          text: COMMENT_TEXTS[cIdx % COMMENT_TEXTS.length],
          vid: video.vid,
          uploader_uid: users[(cIdx + j) % users.length].uid,
          date: recentDate(60),
        }
      })
      allComments.push(comment)
      cIdx++

      // 子评论（回复）
      const numReplies = fakerZh.number.int({ min: 0, max: 2 })
      for (let r = 0; r < numReplies; r++) {
        const reply = await prisma.comment.create({
          data: {
            text: COMMENT_TEXTS[(cIdx + r + 3) % COMMENT_TEXTS.length],
            vid: video.vid,
            uploader_uid: users[(cIdx + r + 2) % users.length].uid,
            replyTo_cid: comment.cid,
            date: recentDate(30),
          }
        })
        allComments.push(reply)
      }
    }
  }

  // 文章评论（每篇 1-3 条）
  for (const essay of essays) {
    const numComments = fakerZh.number.int({ min: 1, max: 3 })
    for (let j = 0; j < numComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          text: COMMENT_TEXTS[(cIdx + j + 5) % COMMENT_TEXTS.length],
          eid: essay.eid,
          uploader_uid: users[(cIdx + j + 1) % users.length].uid,
          date: recentDate(45),
        }
      })
      allComments.push(comment)
      cIdx++
    }
  }

  // 动态评论（每条 0-2 条）
  for (const post of posts) {
    const numComments = fakerZh.number.int({ min: 0, max: 2 })
    for (let j = 0; j < numComments; j++) {
      const comment = await prisma.comment.create({
        data: {
          text: COMMENT_TEXTS[(cIdx + j + 8) % COMMENT_TEXTS.length],
          pid: post.pid,
          uploader_uid: users[(cIdx + j + 2) % users.length].uid,
          date: recentDate(30),
        }
      })
      allComments.push(comment)
      cIdx++
    }
  }

  // 标签评论（前 6 个标签各 1 条）
  const tagComments = []
  for (let i = 0; i < 6; i++) {
    const comment = await prisma.comment.create({
      data: {
        text: `关于「${tags[i].tagName}」这个话题，我有一些想法想和大家分享。`,
        tid: tags[i].tid,
        uploader_uid: users[(i + 3) % users.length].uid,
        date: recentDate(40),
      }
    })
    allComments.push(comment)
    tagComments.push(comment)
  }

  const replyCount = allComments.filter(c => c.replyTo_cid).length
  stats.comments = allComments.length
  stats.subComments = replyCount
  stats.tagComments = tagComments.length
  console.log(`  ✓ ${allComments.length} 条评论（含 ${replyCount} 条子评论 + ${tagComments.length} 条标签评论）`)

  // ── Step 7: 创建关注关系 + 更新计数 ──
  console.log('[7/14] 创建关注关系...')
  const followPairs = new Set()
  const followData = []

  // testuser 关注其他所有用户
  for (let i = 1; i < users.length; i++) {
    followData.push({ uid: users[0].uid, following_uid: users[i].uid })
    followPairs.add(`${users[0].uid}-${users[i].uid}`)
  }

  // 其他用户之间随机关注（每人 1-3 个）
  for (let i = 1; i < users.length; i++) {
    const targets = pickN(users.filter((_, idx) => idx !== i), fakerZh.number.int({ min: 1, max: 3 }))
    for (const target of targets) {
      const key = `${users[i].uid}-${target.uid}`
      if (!followPairs.has(key)) {
        followData.push({ uid: users[i].uid, following_uid: target.uid })
        followPairs.add(key)
      }
    }
  }

  await prisma.userFollowing.createMany({ data: followData })

  // 更新关注/粉丝计数
  await Promise.all(users.map(async (user) => {
    const followingCount = followData.filter(f => f.uid === user.uid).length
    const followerCount = followData.filter(f => f.following_uid === user.uid).length
    return prisma.user.update({
      where: { uid: user.uid },
      data: { followingCount, followerCount }
    })
  }))
  stats.follows = followData.length
  console.log(`  ✓ ${followData.length} 条关注关系`)

  // ── Step 8: 批量创建交互记录（收藏/点赞/转发/踩/历史） ──
  console.log('[8/14] 创建交互记录...')

  const favouriteRecords = []
  const likeRecords = []
  const reshareRecords = []
  const dislikeRecords = []
  const historyRecords = []

  const parentComments = allComments.filter(c => !c.replyTo_cid)

  for (const user of users) {
    // 收藏：视频 2-5 / 文章 1-3 / 动态 0-2
    for (const v of pickN(videos, fakerZh.number.int({ min: 2, max: 5 })))
      favouriteRecords.push({ uid: user.uid, type: 'video', item_id: v.vid })
    for (const e of pickN(essays, fakerZh.number.int({ min: 1, max: 3 })))
      favouriteRecords.push({ uid: user.uid, type: 'essay', item_id: e.eid })
    for (const p of pickN(posts, fakerZh.number.int({ min: 0, max: 2 })))
      favouriteRecords.push({ uid: user.uid, type: 'post', item_id: p.pid })

    // 点赞：视频 3-6 / 文章 2-4 / 动态 1-3 / 评论 2-5 / 标签 1-3
    for (const v of pickN(videos, fakerZh.number.int({ min: 3, max: 6 })))
      likeRecords.push({ uid: user.uid, type: 'video', item_id: v.vid })
    for (const e of pickN(essays, fakerZh.number.int({ min: 2, max: 4 })))
      likeRecords.push({ uid: user.uid, type: 'essay', item_id: e.eid })
    for (const p of pickN(posts, fakerZh.number.int({ min: 1, max: 3 })))
      likeRecords.push({ uid: user.uid, type: 'post', item_id: p.pid })
    for (const c of pickN(parentComments, fakerZh.number.int({ min: 2, max: 5 })))
      likeRecords.push({ uid: user.uid, type: 'comment', item_id: c.cid })
    for (const t of pickN(tags, fakerZh.number.int({ min: 1, max: 3 })))
      likeRecords.push({ uid: user.uid, type: 'tag', item_id: t.tid })

    // 转发：视频 0-2 / 文章 0-2 / 动态 0-3
    for (const v of pickN(videos, fakerZh.number.int({ min: 0, max: 2 })))
      reshareRecords.push({ uid: user.uid, type: 'video', item_id: v.vid })
    for (const e of pickN(essays, fakerZh.number.int({ min: 0, max: 2 })))
      reshareRecords.push({ uid: user.uid, type: 'essay', item_id: e.eid })
    for (const p of pickN(posts, fakerZh.number.int({ min: 0, max: 3 })))
      reshareRecords.push({ uid: user.uid, type: 'post', item_id: p.pid })

    // 历史：视频 4-8 / 文章 3-5 / 动态 1-4
    for (const v of pickN(videos, fakerZh.number.int({ min: 4, max: 8 })))
      historyRecords.push({ uid: user.uid, type: 'video', item_id: v.vid })
    for (const e of pickN(essays, fakerZh.number.int({ min: 3, max: 5 })))
      historyRecords.push({ uid: user.uid, type: 'essay', item_id: e.eid })
    for (const p of pickN(posts, fakerZh.number.int({ min: 1, max: 4 })))
      historyRecords.push({ uid: user.uid, type: 'post', item_id: p.pid })
  }

  // 踩：仅前 5 个用户，评论 1-3 / 标签 0-2
  for (const user of users.slice(0, 5)) {
    for (const c of pickN(parentComments, fakerZh.number.int({ min: 1, max: 3 })))
      dislikeRecords.push({ uid: user.uid, type: 'comment', item_id: c.cid })
    for (const t of pickN(tags, fakerZh.number.int({ min: 0, max: 2 })))
      dislikeRecords.push({ uid: user.uid, type: 'tag', item_id: t.tid })
  }

  // 批量写入（事务）
  await prisma.$transaction([
    prisma.userFavourite.createMany({ data: favouriteRecords }),
    prisma.userLike.createMany({ data: likeRecords }),
    prisma.userReshare.createMany({ data: reshareRecords }),
    prisma.userDislike.createMany({ data: dislikeRecords }),
    prisma.userHistory.createMany({ data: historyRecords }),
  ])

  stats.favourites = favouriteRecords.length
  stats.likes = likeRecords.length
  stats.reshares = reshareRecords.length
  stats.dislikes = dislikeRecords.length
  stats.history = historyRecords.length
  console.log(`  ✓ 收藏 ${favouriteRecords.length} / 点赞 ${likeRecords.length} / 转发 ${reshareRecords.length} / 踩 ${dislikeRecords.length} / 历史 ${historyRecords.length}`)

  // ── Step 9: 同步所有计数器（Map 优化，O(n) 替代 O(n×m)） ──
  console.log('[9/14] 同步计数器...')

  // 构建计数 Map: "type|item_id" → count
  const likeMap = buildCountMap(likeRecords)
  const favMap = buildCountMap(favouriteRecords)
  const reshareMap = buildCountMap(reshareRecords)
  const dislikeMap = buildCountMap(dislikeRecords)

  // 构建内容 → 评论数 Map
  const vidCommentMap = new Map()
  const eidCommentMap = new Map()
  const pidCommentMap = new Map()
  const tidCommentMap = new Map()
  for (const c of allComments) {
    if (c.vid != null) vidCommentMap.set(c.vid, (vidCommentMap.get(c.vid) || 0) + 1)
    if (c.eid != null) eidCommentMap.set(c.eid, (eidCommentMap.get(c.eid) || 0) + 1)
    if (c.pid != null) pidCommentMap.set(c.pid, (pidCommentMap.get(c.pid) || 0) + 1)
    if (c.tid != null) tidCommentMap.set(c.tid, (tidCommentMap.get(c.tid) || 0) + 1)
  }

  // 视频计数器
  await prisma.$transaction(videos.map(v =>
    prisma.video.update({
      where: { vid: v.vid },
      data: {
        likeCount: likeMap.get(`video|${v.vid}`) || 0,
        favouriteCount: favMap.get(`video|${v.vid}`) || 0,
        reshareCount: reshareMap.get(`video|${v.vid}`) || 0,
        commentCount: vidCommentMap.get(v.vid) || 0,
      }
    })
  ))

  // 文章计数器
  await prisma.$transaction(essays.map(e =>
    prisma.essay.update({
      where: { eid: e.eid },
      data: {
        likeCount: likeMap.get(`essay|${e.eid}`) || 0,
        favouriteCount: favMap.get(`essay|${e.eid}`) || 0,
        reshareCount: reshareMap.get(`essay|${e.eid}`) || 0,
        commentCount: eidCommentMap.get(e.eid) || 0,
      }
    })
  ))

  // 动态计数器
  await prisma.$transaction(posts.map(p =>
    prisma.post.update({
      where: { pid: p.pid },
      data: {
        likeCount: likeMap.get(`post|${p.pid}`) || 0,
        favouriteCount: favMap.get(`post|${p.pid}`) || 0,
        reshareCount: reshareMap.get(`post|${p.pid}`) || 0,
        commentCount: pidCommentMap.get(p.pid) || 0,
      }
    })
  ))

  // 标签计数器（含 likeCount + dislikeCount + commentCount）
  await prisma.$transaction(tags.map(t =>
    prisma.tag.update({
      where: { tid: t.tid },
      data: {
        likeCount: likeMap.get(`tag|${t.tid}`) || 0,
        commentCount: tidCommentMap.get(t.tid) || 0,
      }
    })
  ))

  // 评论计数器（likeCount + dislikeCount + subCommentCount）
  // 构建子评论数 Map
  const subCountMap = new Map()
  for (const c of allComments) {
    if (c.replyTo_cid != null) {
      subCountMap.set(c.replyTo_cid, (subCountMap.get(c.replyTo_cid) || 0) + 1)
    }
  }

  await prisma.$transaction(allComments.map(c =>
    prisma.comment.update({
      where: { cid: c.cid },
      data: {
        likeCount: likeMap.get(`comment|${c.cid}`) || 0,
        dislikeCount: dislikeMap.get(`comment|${c.cid}`) || 0,
        subCommentCount: subCountMap.get(c.cid) || 0,
      }
    })
  ))

  console.log('  ✓ 视频/文章/动态/标签/评论计数器已同步')

  // ── Step 10: 创建对话和消息 ──
  console.log('[10/14] 创建对话和消息...')
  let messageCount = 0

  for (let i = 0; i < DIALOGUE_PAIRS.length; i++) {
    const [idx1, idx2] = DIALOGUE_PAIRS[i]
    const p1 = users[idx1]
    const p2 = users[idx2]
    const msgs = DIALOGUE_MESSAGES[i]

    const dialogue = await prisma.dialogue.create({
      data: {
        participant1_uid: Math.min(p1.uid, p2.uid),
        participant2_uid: Math.max(p1.uid, p2.uid),
        lastMessage: msgs[msgs.length - 1],
        lastDate: recentDate(14),
      }
    })

    // 创建对话消息
    for (let j = 0; j < msgs.length; j++) {
      await prisma.message.create({
        data: {
          mid: dialogue.mid,
          sender_uid: (j % 2 === 0 ? p1 : p2).uid,
          text: msgs[j],
          date: recentDate(14 - j),
        }
      })
      messageCount++
    }
  }
  stats.dialogues = DIALOGUE_PAIRS.length
  stats.messages = messageCount
  console.log(`  ✓ ${DIALOGUE_PAIRS.length} 条对话 + ${messageCount} 条消息`)

  // ── Step 11: 创建通知 ──
  console.log('[11/14] 创建通知...')
  const notificationData = []
  const testUserUid = users[0].uid

  // testuser 的有意义通知
  // 点赞通知 ×3
  for (let i = 1; i < 4; i++) {
    notificationData.push({
      type: 'like', from_uid: users[i].uid, to_uid: testUserUid,
      targetType: 'video', targetId: videos[i % videos.length].vid,
      text: `${users[i].username} 赞了你的视频「${videos[i % videos.length].title}」`,
      isRead: i < 3, date: recentDate(7),
    })
  }
  // 评论通知 ×2
  for (let i = 1; i < 3; i++) {
    notificationData.push({
      type: 'comment', from_uid: users[i + 2].uid, to_uid: testUserUid,
      targetType: 'comment', targetId: allComments[i].cid,
      parentType: 'video', parentId: videos[0].vid,
      text: `${users[i + 2].username} 评论了你的视频：「${COMMENT_TEXTS[i]}」`,
      isRead: false, date: recentDate(3),
    })
  }
  // 关注通知 ×3
  for (let i = 3; i < 6; i++) {
    notificationData.push({
      type: 'follow', from_uid: users[i].uid, to_uid: testUserUid,
      targetType: 'user', targetId: users[i].uid,
      text: `${users[i].username} 关注了你`,
      isRead: i < 5, date: recentDate(10),
    })
  }
  // 收藏通知 ×2
  for (let i = 1; i < 3; i++) {
    notificationData.push({
      type: 'favourite', from_uid: users[i + 4].uid, to_uid: testUserUid,
      targetType: 'video', targetId: videos[i + 3].vid,
      text: `${users[i + 4].username} 收藏了你的视频「${videos[i + 3].title}」`,
      isRead: true, date: recentDate(14),
    })
  }

  // 其他用户随机通知（每人 2-4 条）
  for (let i = 1; i < users.length; i++) {
    const numNotifs = fakerZh.number.int({ min: 2, max: 4 })
    for (let j = 0; j < numNotifs; j++) {
      const type = fakerZh.helpers.arrayElement(['like', 'comment', 'follow', 'favourite'])
      const fromUser = users[(i + j + 1) % users.length]

      if (type === 'follow') {
        notificationData.push({
          type: 'follow', from_uid: fromUser.uid, to_uid: users[i].uid,
          targetType: 'user', targetId: fromUser.uid,
          text: `${fromUser.username} 关注了你`,
          isRead: fakerZh.datatype.boolean(), date: recentDate(20),
        })
      } else {
        const targetType = fakerZh.helpers.arrayElement(['video', 'essay', 'post'])
        let targetId, targetTitle
        if (targetType === 'video') {
          const v = videos[j % videos.length]
          targetId = v.vid; targetTitle = v.title
        } else if (targetType === 'essay') {
          const e = essays[j % essays.length]
          targetId = e.eid; targetTitle = e.title
        } else {
          const p = posts[j % posts.length]
          targetId = p.pid; targetTitle = p.text.slice(0, 20) + '...'
        }
        const actionText = type === 'like' ? '赞了' : type === 'comment' ? '评论了' : '收藏了'
        const typeLabel = targetType === 'video' ? '视频' : targetType === 'essay' ? '文章' : '动态'
        notificationData.push({
          type, from_uid: fromUser.uid, to_uid: users[i].uid,
          targetType, targetId,
          text: `${fromUser.username} ${actionText}你的${typeLabel}「${targetTitle}」`,
          isRead: fakerZh.datatype.boolean(), date: recentDate(20),
        })
      }
    }
  }

  await prisma.notification.createMany({ data: notificationData })
  stats.notifications = notificationData.length
  console.log(`  ✓ ${notificationData.length} 条通知`)

  // ── 最终统计 ──
  console.log('\n═══════════════════════════════════════')
  console.log('  ✅ VoteVideo 测试数据生成完成！')
  console.log('═══════════════════════════════════════')
  console.log(`  👤 用户:       ${stats.users} 个`)
  console.log(`  🏷  标签:       ${stats.tags} 个`)
  console.log(`  🎬 视频:       ${stats.videos} 个 (${stats.videoTags} 条标签关联)`)
  console.log(`  📝 文章:       ${stats.essays} 篇`)
  console.log(`  💬 动态:       ${stats.posts} 条`)
  console.log(`  💭 评论:       ${stats.comments} 条 (${stats.subComments} 子评论 + ${stats.tagComments} 标签评论)`)
  console.log(`  👥 关注:       ${stats.follows} 条`)
  console.log(`  ⭐ 收藏:       ${stats.favourites} 条`)
  console.log(`  👍 点赞:       ${stats.likes} 条`)
  console.log(`  👎 踩:         ${stats.dislikes} 条`)
  console.log(`  🔄 转发:       ${stats.reshares} 条`)
  console.log(`  📖 历史:       ${stats.history} 条`)
  console.log(`  📮 对话:       ${stats.dialogues} 条`)
  console.log(`  ✉️  消息:       ${stats.messages} 条`)
  console.log(`  🔔 通知:       ${stats.notifications} 条`)
  console.log('───────────────────────────────────────')
  console.log('  🔑 测试账号: testuser / 123456')
  console.log('═══════════════════════════════════════\n')

  // 返回统计信息供外部使用
  return stats
}

main()
  .catch((e) => {
    console.error('❌ Seed 失败:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

async function main() {
  console.log('开始生成测试数据...')

  // 清空现有数据（按依赖顺序倒序删除）
  console.log('清空现有数据...')
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),
    prisma.dialogue.deleteMany(),
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

  // ==================== 1. 创建标签 ====================
  console.log('创建标签...')
  const tagNames = ['前端', '后端', '数据库', 'React', 'Node.js', 'Prisma', 'JavaScript', 'Python']
  const tags = []
  for (const tagName of tagNames) {
    const tag = await prisma.tag.create({
      data: {
        tagName,
        likeCount: faker.number.int({ min: 0, max: 100 }),
        favouriteCount: faker.number.int({ min: 0, max: 50 }),
        commentCount: faker.number.int({ min: 0, max: 30 }),
      }
    })
    tags.push(tag)
  }
  console.log(`已创建 ${tags.length} 个标签`)

  // ==================== 2. 创建用户 ====================
  console.log('创建用户...')
  const bcrypt = require('bcrypt')
  const hashedPassword = await bcrypt.hash('123456', 10)

  const users = []
  // 创建测试用户（用于登录测试）
  const testUser = await prisma.user.create({
    data: {
      username: 'testuser',
      password: hashedPassword,
      profilePictureUrl: 'https://picsum.photos/seed/testuser/200/200',
      info: '这是一个测试用户，用于功能测试',
      followerCount: 0,
      followingCount: 0,
    }
  })
  users.push(testUser)

  // 创建更多用户
  for (let i = 0; i < 4; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        password: hashedPassword,
        profilePictureUrl: `https://picsum.photos/seed/user${i}/200/200`,
        info: faker.person.bio(),
        followerCount: 0,
        followingCount: 0,
      }
    })
    users.push(user)
  }
  console.log(`已创建 ${users.length} 个用户`)

  // ==================== 3. 创建视频 ====================
  console.log('创建视频...')
  const videos = []
  const videoTitles = [
    'React 18 新特性详解',
    'Node.js 实战教程',
    'Prisma ORM 入门到精通',
    'JavaScript 高级技巧',
    'TypeScript 类型体操',
    '前端性能优化指南',
    '后端架构设计',
    '数据库索引优化',
    'Webpack 配置全解析',
    'CSS 布局技巧大全',
  ]

  for (let i = 0; i < 10; i++) {
    const uploader = users[i % users.length]
    const video = await prisma.video.create({
      data: {
        title: videoTitles[i],
        coverUrl: `https://picsum.photos/seed/video${i}/640/360`,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        viewCount: faker.number.int({ min: 100, max: 10000 }),
        commentCount: faker.number.int({ min: 0, max: 100 }),
        likeCount: faker.number.int({ min: 0, max: 500 }),
        favouriteCount: faker.number.int({ min: 0, max: 200 }),
        uploader_uid: uploader.uid,
      }
    })
    videos.push(video)

    // 关联标签（每个视频 1-3 个标签）
    const numTags = faker.number.int({ min: 1, max: 3 })
    const selectedTags = faker.helpers.arrayElements(tags, numTags)
    for (const tag of selectedTags) {
      await prisma.videoTag.create({
        data: {
          vid: video.vid,
          tid: tag.tid,
        }
      })
    }
  }
  console.log(`已创建 ${videos.length} 个视频`)

  // ==================== 4. 创建文章 ====================
  console.log('创建文章...')
  const essays = []
  const essayTitles = [
    '深入理解 React Hooks',
    'Node.js 异步编程指南',
    'Prisma 最佳实践',
    'JavaScript 闭包详解',
    '前端工程化思考',
    'RESTful API 设计原则',
    '数据库事务隔离级别',
    'TypeScript 泛型进阶',
  ]

  for (let i = 0; i < 8; i++) {
    const uploader = users[i % users.length]
    const essay = await prisma.essay.create({
      data: {
        title: essayTitles[i],
        text: faker.lorem.paragraphs(5, '\n\n'),
        viewCount: faker.number.int({ min: 50, max: 5000 }),
        commentCount: faker.number.int({ min: 0, max: 50 }),
        likeCount: faker.number.int({ min: 0, max: 300 }),
        favouriteCount: faker.number.int({ min: 0, max: 100 }),
        uploader_uid: uploader.uid,
      }
    })
    essays.push(essay)
  }
  console.log(`已创建 ${essays.length} 篇文章`)

  // ==================== 5. 创建动态 ====================
  console.log('创建动态...')
  const posts = []
  for (let i = 0; i < 8; i++) {
    const uploader = users[i % users.length]
    const hasPicture = faker.datatype.boolean()
    const post = await prisma.post.create({
      data: {
        text: faker.lorem.paragraph(),
        pictureList: hasPicture ? JSON.stringify([
          `https://picsum.photos/seed/post${i}_1/400/300`,
          `https://picsum.photos/seed/post${i}_2/400/300`,
        ]) : null,
        viewCount: faker.number.int({ min: 10, max: 2000 }),
        commentCount: faker.number.int({ min: 0, max: 30 }),
        likeCount: faker.number.int({ min: 0, max: 200 }),
        uploader_uid: uploader.uid,
      }
    })
    posts.push(post)
  }
  console.log(`已创建 ${posts.length} 条动态`)

  // ==================== 6. 创建评论 ====================
  console.log('创建评论...')
  const comments = []

  // 视频评论
  for (let i = 0; i < 5; i++) {
    const video = videos[i % videos.length]
    const uploader = users[i % users.length]
    const comment = await prisma.comment.create({
      data: {
        text: faker.lorem.sentence(),
        vid: video.vid,
        uploader_uid: uploader.uid,
        likeCount: faker.number.int({ min: 0, max: 50 }),
        subCommentCount: 0,
      }
    })
    comments.push(comment)

    // 子评论（回复）
    const numReplies = faker.number.int({ min: 1, max: 3 })
    for (let j = 0; j < numReplies; j++) {
      const replyUser = users[(i + j + 1) % users.length]
      await prisma.comment.create({
        data: {
          text: faker.lorem.sentence(),
          vid: video.vid,
          uploader_uid: replyUser.uid,
          replyTo_cid: comment.cid,
          likeCount: faker.number.int({ min: 0, max: 20 }),
          subCommentCount: 0,
        }
      })
    }

    // 更新主评论的子评论数
    const replyCount = await prisma.comment.count({
      where: { replyTo_cid: comment.cid }
    })
    await prisma.comment.update({
      where: { cid: comment.cid },
      data: { subCommentCount: replyCount }
    })
  }

  // 文章评论
  for (let i = 0; i < 3; i++) {
    const essay = essays[i % essays.length]
    const uploader = users[i % users.length]
    const comment = await prisma.comment.create({
      data: {
        text: faker.lorem.sentence(),
        eid: essay.eid,
        uploader_uid: uploader.uid,
        likeCount: faker.number.int({ min: 0, max: 30 }),
        subCommentCount: 0,
      }
    })
    comments.push(comment)
  }

  // 动态评论
  for (let i = 0; i < 3; i++) {
    const post = posts[i % posts.length]
    const uploader = users[i % users.length]
    const comment = await prisma.comment.create({
      data: {
        text: faker.lorem.sentence(),
        pid: post.pid,
        uploader_uid: uploader.uid,
        likeCount: faker.number.int({ min: 0, max: 30 }),
        subCommentCount: 0,
      }
    })
    comments.push(comment)
  }

  console.log(`已创建 ${comments.length} 条主评论及若干子评论`)

  // ==================== 7. 创建关注关系 ====================
  console.log('创建关注关系...')
  let followCount = 0
  for (let i = 0; i < users.length; i++) {
    // 每个用户关注后面的 2-3 个用户
    const numFollows = faker.number.int({ min: 2, max: 3 })
    const followTargets = users.filter((_, idx) => idx !== i).slice(0, numFollows)
    
    for (const target of followTargets) {
      await prisma.userFollowing.create({
        data: {
          uid: users[i].uid,
          following_uid: target.uid,
        }
      })
      followCount++
    }
  }

  // 更新关注/粉丝计数
  for (const user of users) {
    const followingCount = await prisma.userFollowing.count({
      where: { uid: user.uid }
    })
    const followerCount = await prisma.userFollowing.count({
      where: { following_uid: user.uid }
    })
    await prisma.user.update({
      where: { uid: user.uid },
      data: { followingCount, followerCount }
    })
  }
  console.log(`已创建 ${followCount} 条关注关系`)

  // ==================== 8. 创建收藏记录 ====================
  console.log('创建收藏记录...')
  let favouriteCount = 0
  for (let i = 0; i < users.length; i++) {
    // 收藏 2-4 个视频
    const numVideoFavs = faker.number.int({ min: 2, max: 4 })
    const favVideos = faker.helpers.arrayElements(videos, numVideoFavs)
    for (const video of favVideos) {
      await prisma.userFavourite.create({
        data: {
          uid: users[i].uid,
          type: 'video',
          item_id: video.vid,
        }
      })
      favouriteCount++
    }

    // 收藏 1-3 篇文章
    const numEssayFavs = faker.number.int({ min: 1, max: 3 })
    const favEssays = faker.helpers.arrayElements(essays, numEssayFavs)
    for (const essay of favEssays) {
      await prisma.userFavourite.create({
        data: {
          uid: users[i].uid,
          type: 'essay',
          item_id: essay.eid,
        }
      })
      favouriteCount++
    }
  }
  console.log(`已创建 ${favouriteCount} 条收藏记录`)

  // ==================== 9. 创建历史记录 ====================
  console.log('创建历史记录...')
  let historyCount = 0
  for (let i = 0; i < users.length; i++) {
    // 浏览 3-5 个视频
    const numVideoHistory = faker.number.int({ min: 3, max: 5 })
    const histVideos = faker.helpers.arrayElements(videos, numVideoHistory)
    for (const video of histVideos) {
      await prisma.userHistory.create({
        data: {
          uid: users[i].uid,
          type: 'video',
          item_id: video.vid,
        }
      })
      historyCount++
    }

    // 浏览 2-4 篇文章
    const numEssayHistory = faker.number.int({ min: 2, max: 4 })
    const histEssays = faker.helpers.arrayElements(essays, numEssayHistory)
    for (const essay of histEssays) {
      await prisma.userHistory.create({
        data: {
          uid: users[i].uid,
          type: 'essay',
          item_id: essay.eid,
        }
      })
      historyCount++
    }
  }
  console.log(`已创建 ${historyCount} 条历史记录`)

  // ==================== 10. 创建对话和消息 ====================
  console.log('创建对话和消息...')
  let dialogueCount = 0
  let messageCount = 0
  for (let i = 0; i < users.length - 1; i++) {
    const participant1 = users[i]
    const participant2 = users[i + 1]
    
    const dialogue = await prisma.dialogue.create({
      data: {
        participant1_uid: Math.min(participant1.uid, participant2.uid),
        participant2_uid: Math.max(participant1.uid, participant2.uid),
        lastMessage: faker.lorem.sentence(),
        lastDate: faker.date.recent(),
      }
    })
    dialogueCount++

    // 每条对话 3-5 条消息
    const numMessages = faker.number.int({ min: 3, max: 5 })
    for (let j = 0; j < numMessages; j++) {
      const sender = j % 2 === 0 ? participant1 : participant2
      await prisma.message.create({
        data: {
          mid: dialogue.mid,
          sender_uid: sender.uid,
          text: faker.lorem.sentence(),
          date: faker.date.recent(),
        }
      })
      messageCount++
    }
  }
  console.log(`已创建 ${dialogueCount} 条对话和 ${messageCount} 条消息`)

  // ==================== 11. 创建通知 ====================
  console.log('创建通知...')
  let notificationCount = 0
  const notificationTypes = ['like', 'comment', 'follow', 'favourite']
  for (let i = 0; i < users.length; i++) {
    const numNotifications = faker.number.int({ min: 3, max: 6 })
    for (let j = 0; j < numNotifications; j++) {
      const type = faker.helpers.arrayElement(notificationTypes)
      const fromUser = users[(i + j + 1) % users.length]
      const targetType = faker.helpers.arrayElement(['video', 'essay', 'post'])
      let targetId
      if (targetType === 'video') {
        targetId = videos[j % videos.length].vid
      } else if (targetType === 'essay') {
        targetId = essays[j % essays.length].eid
      } else {
        targetId = posts[j % posts.length].pid
      }

      await prisma.notification.create({
        data: {
          type,
          from_uid: fromUser.uid,
          to_uid: users[i].uid,
          targetType,
          targetId,
          text: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
          date: faker.date.recent(),
        }
      })
      notificationCount++
    }
  }
  console.log(`已创建 ${notificationCount} 条通知`)

  console.log('\n✅ 测试数据生成完成！')
  console.log(`   用户: ${users.length}`)
  console.log(`   标签: ${tags.length}`)
  console.log(`   视频: ${videos.length}`)
  console.log(`   文章: ${essays.length}`)
  console.log(`   动态: ${posts.length}`)
  console.log(`   评论: ${comments.length}+`)
  console.log(`   关注: ${followCount}`)
  console.log(`   收藏: ${favouriteCount}`)
  console.log(`   历史: ${historyCount}`)
  console.log(`   对话: ${dialogueCount}`)
  console.log(`   消息: ${messageCount}`)
  console.log(`   通知: ${notificationCount}`)
  console.log('\n测试账号: testuser / 123456')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

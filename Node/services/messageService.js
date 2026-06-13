// services/messageService.js - 消息相关服务（私信、通知、SSE）

// 引入 Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- 在线用户管理（用于SSE推送）---
// 存储在线用户的 SSE 连接（uid -> response对象）
const onlineUsers = new Map()

// 添加用户到在线列表
function addOnlineUser(uid, res) {
  onlineUsers.set(uid, res)
}

// 从在线列表移除用户
function removeOnlineUser(uid) {
  onlineUsers.delete(uid)
}

// 检查用户是否在线
function isUserOnline(uid) {
  return onlineUsers.has(uid)
}

// 推送消息给用户（通过SSE）
function pushMessageToUser(uid, message) {
  const res = onlineUsers.get(uid)
  if (res) {
    // SSE 格式：data: {JSON}\n\n
    res.write(`data: ${JSON.stringify(message)}\n\n`)
    return true  // 推送成功
  }
  return false  // 用户不在线
}

// --- 发送私信 ---
// 参数：senderUid (发送者ID), receiverUid (接收者ID), text (消息内容)
// 返回：{ messageId, dialogueId }
// 用途：创建或更新对话，插入消息记录，并通过SSE推送
async function sendMessage(senderUid, receiverUid, text, dialogueMid = null) {
  // 参数校验
  if (!text) {
    throw new Error('消息内容不能为空')
  }

  // 1. 查找或创建对话
  let dialogue = null

  // 优先通过 dialogueMid 查找已有对话
  if (dialogueMid) {
    dialogue = await prisma.dialogue.findUnique({
      where: { mid: parseInt(dialogueMid) }
    })
    if (!dialogue) {
      throw new Error('对话不存在')
    }
  }

  // 如果没有通过 dialogueMid 找到，则通过用户ID查找
  if (!dialogue) {
    dialogue = await prisma.dialogue.findFirst({
      where: {
        OR: [
          { participant1_uid: senderUid, participant2_uid: receiverUid },
          { participant1_uid: receiverUid, participant2_uid: senderUid }
        ]
      }
    })

    if (!dialogue) {
      // 创建新对话
      dialogue = await prisma.dialogue.create({
        data: {
          participant1_uid: senderUid,
          participant2_uid: receiverUid,
          lastMessage: text,
          lastDate: new Date()
        }
      })
    }
  }

  // 更新对话的最后消息和时间
  dialogue = await prisma.dialogue.update({
    where: { mid: dialogue.mid },
    data: {
      lastMessage: text,
      lastDate: new Date()
    }
  })

  // 2. 插入消息记录
  const newMessage = await prisma.message.create({
    data: {
      mid: dialogue.mid,
      sender_uid: senderUid,
      text: text
    }
  })

  // 3. 通过SSE推送消息给接收者（如果在线）
  const messageData = {
    type: 'new_message',
    data: {
      messageId: newMessage.id,
      dialogueId: dialogue.mid,
      senderUid: senderUid,
      text: text,
      date: newMessage.date
    }
  }

  // 确定接收者（对话中的另一方）
  const receiverId = dialogue.participant1_uid === senderUid
    ? dialogue.participant2_uid
    : dialogue.participant1_uid
  const pushed = pushMessageToUser(receiverId, messageData)

  // 4. 返回结果
  return {
    messageId: newMessage.id,
    dialogueId: dialogue.mid,
    pushed: pushed  // 是否成功推送（用于调试）
  }
}

// --- 获取对话列表 ---
// 参数：uid (用户ID)
// 返回：DialogueItem[]
// 用途：获取用户的所有对话
async function getDialogues(uid) {
  // 查询对话
  const dialogues = await prisma.dialogue.findMany({
    where: {
      OR: [
        { participant1_uid: uid },
        { participant2_uid: uid }
      ]
    },
    include: {
      // 关联查询：获取参与者1信息
      participant1: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      },
      // 关联查询：获取参与者2信息
      participant2: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      },
      // 关联查询：获取消息列表
      messages: {
        orderBy: { date: 'asc' },
        include: {
          sender: {
            select: {
              uid: true,
              username: true,
              profilePictureUrl: true
            }
          }
        }
      }
    }
  })

  // 转换为 DialogueItem 格式
  const dialogueItems = dialogues.map(dialogue => {
    // 确定对手（不是当前用户的参与者）
    const opponent = dialogue.participant1_uid === uid
      ? dialogue.participant2
      : dialogue.participant1

    return {
      mid: dialogue.mid,
      opponent: {
        uid: opponent.uid,
        userName: opponent.username,
        profilePictureUrl: opponent.profilePictureUrl
      },
      sentences: dialogue.messages.map(msg => ({
        text: msg.text,
        sender: msg.sender_uid === uid ? null : {
          uid: msg.sender.uid,
          userName: msg.sender.username,
          profilePictureUrl: msg.sender.profilePictureUrl
        },
        date: formatDate(msg.date)
      })),
      lastMessage: dialogue.lastMessage,
      lastDate: formatDate(dialogue.lastDate)
    }
  })

  return dialogueItems
}

// --- 获取通知列表 ---
// 参数：uid (用户ID)
// 返回：NotificationItem[]
// 用途：获取用户的通知列表
async function getNotifications(uid) {
  const notifications = await prisma.notification.findMany({
    where: { to_uid: uid },
    orderBy: { date: 'desc' },
    include: {
      fromUser: {
        select: {
          uid: true,
          username: true,
          profilePictureUrl: true
        }
      }
    }
  })

  // 转换为 NotificationItem 格式
  const notificationItems = notifications.map(notification => ({
    mid: notification.nid,
    type: notification.type,
    text: notification.text,
    sender: {
      uid: notification.fromUser.uid,
      userName: notification.fromUser.username,
      profilePictureUrl: notification.fromUser.profilePictureUrl
    },
    targetType: notification.targetType,
    targetId: notification.targetId,
    parentType: notification.parentType,
    parentId: notification.parentId,
    date: formatDate(notification.date)
  }))

  return notificationItems
}

// --- 工具函数 ---

// 格式化日期
function formatDate(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 导出服务函数
module.exports = {
  addOnlineUser,
  removeOnlineUser,
  isUserOnline,
  pushMessageToUser,
  sendMessage,
  getDialogues,
  getNotifications
}

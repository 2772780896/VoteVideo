import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import DataList from '@/components/common/DataList'
import ChatApp from '@/components/common/Chat'
import { getProfileSubdata, sendMessage } from '@/apis/account'

const subTabs = [
  { key: 'dialogue',     label: '对话' },
  { key: 'notification', label: '通知' },
]

// 根据通知类型拼跳转路径
const buildUrl = (msg) => {
  const { targetType, targetId, parentType, parentId } = msg
  if (!targetType || !targetId) return null
  // 评论 → 跳它所属的视频/动态页，query 传评论 ID
  if (targetType === 'comment') return `/${parentType}/${parentId}?comment=${targetId}`
  return `/${targetType}/${targetId}`
}

/**
 * ProfileMessage — Profile 页的消息子页面
 *
 * ================================================================
 * 职责分工（ProfileMessage vs ChatApp）
 * ================================================================
 *
 *   ProfileMessage（本组件）— 状态管理者
 *     职责：持有聊天相关 state，处理业务逻辑（进入/退出/发送），
 *           渲染对话列表或把数据传给 ChatApp
 *
 *   ChatApp（子组件）— 纯展示组件
 *     职责：接收 messages + onSend + onBack 三个 prop，
 *           负责 UI 布局（气泡、输入框、滚动），不持有任何业务 state
 *
 *   耦合度：ProfileMessage 知道 ChatApp 需要什么 prop → 传给它
 *          ChatApp 不知道 ProfileMessage 的存在 → 低耦合（标准 React 父子）
 *
 * ================================================================
 * 通信流程
 * ================================================================
 *
 *   ┌───────────── 对话列表页 ─────────────┐
 *   │ 张三 ── 最后一条消息预览              │
 *   │ 李四 ── 最后一条消息预览              │
 *   │ 王五 ── 最后一条消息预览              │
 *   └─────────────────────────────────────┘
 *         │ 点击张三
 *         ↓
 *   enterChat(dialogue)
 *     → setChatDialogue(dialogue)       // 记住"在跟张三聊天"
 *     → setChatMessages([...历史消息])    // 拷贝历史消息（... 展开新数组，不污染原数据）
 *                                       // 为什么需要独立 state？handSend 要追加新消息，
 *                                       // 必须存在可变容器里，不能直接改 mock 数据
 *         ↓
 *   ┌───────────── 聊天窗口 ─────────────┐
 *   │  ← 张三                            │  ← ChatApp 渲染
 *   │  ────────────────────────────────  │
 *   │  对方: 你好                        │  ← chatMessages[0]
 *   │                   我: 在吗   │  ← chatMessages[1]
 *   │  ────────────────────────────────  │
 *   │  [_________] [发送]                │
 *   └─────────────────────────────────────┘
 *         │ 输入文字 → 点发送 / 按 Enter
 *         ↓
 *   handleSend("新消息")
 *     → 构造 { id, sender: null, text: "新消息", date: "6-2 23:42" }
 *       // sender: null = 自己发的（ChatApp 里 isMine 靠 sender 判 null）
 *       // 这里没有调 API → mock 没有发送消息的接口，等后端补
 *     → setChatMessages([...旧消息, 新消息])
 *       → ChatApp 重新渲染 → 蓝色气泡出现在聊天窗口
 *
 *         │ 点 ← 返回
 *         ↓
 *   exitChat()
 *     → setChatDialogue(null) → 对话列表重新出现
 *     → setChatMessages([])   → 释放内存
 */
/**
 * @param {Object} targetUser — 外部传入的私信目标用户（来自导航头 / ProfileFollow 私信按钮）
 *   { uid, userName, profilePictureUrl }
 *   有值 → 自动手搓空对话并 enterChat；无值 → 正常对话列表
 */
const ProfileMessage = ({ targetUser }) => {
  const [active, setActive] = useState('dialogue')

  // chatDialogue — null=在对话列表页，非null=正在跟某人聊天
  const [chatDialogue, setChatDialogue] = useState(null)
  // chatMessages — 当前聊天窗口的所有消息（历史 + 新发的）
  //  必须独立 state：enterChat 要写入历史，handleSend 要追加新消息
  const [chatMessages, setChatMessages] = useState([])
  // refreshKey — 退出聊天时强制 DataList 重新拉取（key 变化 → 卸载重装 → 重新请求）
  const [refreshKey, setRefreshKey] = useState(0)

  // enterChat — 点击对话列表某一项（也由 useEffect 通过 targetUser 触发）
  const enterChat = (dialogue) => {
    setChatDialogue(dialogue)
    setChatMessages([...dialogue.sentences])  // ... 展开 → 新数组，不污染 mock 数据
  }

  // 外部传入 targetUser → 手搓空对话并进入聊天（私信入口）
  useEffect(() => {
    if (targetUser && !chatDialogue) {
      enterChat({
        mid: null,                    // 新对话，mock 里还没有 mid
        opponent: targetUser,
        sentences: [],
      })
    }
  }, [targetUser])

  // exitChat — ChatApp 的 ← 返回按钮 → 回到对话列表
  const exitChat = () => {
    setChatDialogue(null)
    setChatMessages([])
    setRefreshKey(prev => prev + 1)  // 强制 DataList 重装 → 拿到最新数据
  }

  // handleSend — ChatApp 输入框提交（乐观更新：消息先出现，后台发请求）
  const handleSend = async (text) => {
    const now = new Date()
    const tempId = Date.now()
    const msg = {
      id: tempId,
      sender: null,
      text,
      date: `${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`,
    }
    // ① 乐观更新：消息立刻出现在聊天窗口
    setChatMessages(prev => [...prev, msg])
    // ② 后台发请求
    try {
      await sendMessage(chatDialogue.mid, text, chatDialogue.opponent?.uid)
    } catch {
      // TODO: 失败标记（当前静默）
    }
  }

  return (
    <>
      {/* 二级 Tab */}
      <div className="flex border-b border-gray-200 mb-4">
        {subTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              key === active
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 对话列表 or 聊天窗口 */}
      {active === 'dialogue' && (
        chatDialogue ? (
          <ChatApp
            messages={chatMessages}
            onSend={handleSend}
            onBack={exitChat}
            selfName={null} // mock 里自己发的消息 sender=null
          />
        ) : (
          <DataList
            key={refreshKey}
            request={getProfileSubdata}
            params={['message', 'dialogueList']}
            sort={null}
            renderItem={(dialogue) => (
              <div
                key={dialogue.mid || Math.random()}
                onClick={() => enterChat(dialogue)}
                className="flex items-center gap-3 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <img
                  src={dialogue.opponent?.profilePictureUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{dialogue.opponent?.userName}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {dialogue.sentences?.at(-1)?.text || '暂无消息'}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{dialogue.sentences?.at(-1)?.date}</span>
              </div>
            )}
            gridClassName="flex flex-col gap-0"
          />
        )
      )}

      {/* 通知列表（@ + 赞 + 系统 合并） */}
      {active === 'notification' && (
        <DataList
          request={getProfileSubdata}
          params={['message', 'notificationList']}
          sort={null}
          renderItem={(msg) => {
            const url = buildUrl(msg)
            const content = (
              <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                <img
                  src={msg.sender?.profilePictureUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{msg.sender?.userName}</span>
                    <span className="text-gray-500 ml-1">{msg.text}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{msg.date}</div>
                </div>
              </div>
            )
            // 有跳转目标 → 可点击；无目标 → 纯展示
            return url
              ? <Link key={msg.mid} to={url} className="block no-underline text-inherit hover:bg-gray-50 transition-colors">{content}</Link>
              : <div key={msg.mid}>{content}</div>
          }}
          gridClassName="flex flex-col gap-0"
        />
      )}
    </>
  )
}

export default ProfileMessage

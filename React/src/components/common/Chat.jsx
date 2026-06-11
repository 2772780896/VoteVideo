import React, { useState, useRef, useEffect } from 'react';

/**
 * 聊天窗口
 *   messages  — 对话的 sentences 数组
 *   onSend    — 发送消息回调 (text) => void
 *   onBack    — 点返回按钮回调
 *   selfName  — 自己的用户名（用于判断左右对齐）
 */
const App = ({ messages = [], onSend, onBack, selfName }) => {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  // 新消息来了自动滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  // 判断消息发送者是对方还是自己
  const isMine = (sender) => {
    if (!sender) return true                          // mock 对话里 null = 自己发的
    return sender.userName === selfName
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px]">

      {/* 头部：返回 + 对方用户名 */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
        {onBack && (
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none cursor-pointer"
          >
            ←
          </button>
        )}
        <span className="font-semibold text-gray-900">
          {messages[0]?.sender?.userName || '对话'}
        </span>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg, i) => {
          const mine = isMine(msg.sender)
          return (
            <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              {/* 对方：头像在左，气泡在右 */}
              {!mine && msg.sender && (
                <img
                  src={msg.sender.profilePictureUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover bg-gray-200 flex-shrink-0 mr-2"
                />
              )}

              {/* 气泡 */}
              <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                mine
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <div>{msg.text}</div>
                <div className={`text-xs mt-1 ${mine ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.date}
                </div>
              </div>

              {/* 自己：气泡在左，头像在右 */}
              {mine && msg.sender && (
                <img
                  src={msg.sender.profilePictureUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover bg-gray-200 flex-shrink-0 ml-2"
                />
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入消息..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg
            hover:bg-blue-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          发送
        </button>
      </div>
    </div>
  )
}

export default App

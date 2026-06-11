import React, { useState } from 'react';
import { uploadContent } from '@/apis/content'

const App = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    try {
      await uploadContent('essay', { title, description })
      setTitle('')
      setDescription('')
      alert('上传成功')
    } catch {
      alert('上传失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* 标题 */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">标题</div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 内容 */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">编辑内容</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          placeholder="输入内容..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* 提交 */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
          submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {submitting ? '上传中...' : '上传'}
      </button>
    </div>
  )
}

export default App

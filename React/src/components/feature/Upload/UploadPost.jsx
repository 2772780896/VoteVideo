import React, { useState, useRef } from 'react';
import { uploadContent } from '@/apis/content'

const App = () => {
  const [text, setText] = useState('')
  // images 是一个纯字符串数组，每个元素是一张图片的 base64：
  //   ["data:image/png;base64,iVBORw0...", "data:image/jpeg;base64,/9j/4A..."]
  // 可以直接放 <img src={url}>，不需要服务器路径
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fileRef = useRef(null)

  // 添加图片（最多 9 张）
  const handleImageAdd = (e) => {
    // e.target.files → FileList（类数组，没有 .slice 等数组方法）
    // Array.from() → 把 FileList 转成真正的数组
    // .slice(0, 9 - images.length) → 只取还能放的张数（已选 3 张 → 最多再取 6 张）
    const files = Array.from(e.target.files).slice(0, 9 - images.length)
    files.forEach(file => {
      const reader = new FileReader()
      // onload：异步——readAsDataURL 发起后立刻返回，读完才触发 onload
      // reader.result：读完后变成 "data:image/png;base64,..." 字符串
      reader.onload = () => setImages(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
  }

  // 移除图片 — 通过索引匹配
  //   images 存的是纯字符串，没有 id → 用数组索引标识"第几张图"
  //   filter((_, i) => i !== idx)：保留索引不等于 idx 的 → 丢弃目标图片
  //   _ 是元素本身（不用），i 是索引（用来比较）
  const handleImageRemove = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  // 发布
  const handlePublish = async () => {
    if (!text.trim()) return
    setSubmitting(true)
    try {
      await uploadContent('post', { text, images })
      setText('')
      setImages([])
      alert('发布成功')
    } catch {
      alert('发布失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-xl">

      {/* 文字输入 */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">动态内容</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          placeholder="分享你的想法..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* 图片预览 — .map 遍历 images（base64 字符串数组）→ 每张图一个缩略图 + ✕ 按钮 */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
              <button
                onClick={() => handleImageRemove(idx)}
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center
                  bg-gray-800 text-white text-xs rounded-full cursor-pointer"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* 操作 + 发布 */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileRef}
          className="hidden"
          onChange={handleImageAdd}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={images.length >= 9}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
        >📷 添加图片</button>

        <button
          onClick={handlePublish}
          disabled={submitting || !text.trim()}
          className={`px-5 py-1.5 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
            submitting || !text.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {submitting ? '发布中...' : '发布'}
        </button>
      </div>
    </div>
  )
}

export default App

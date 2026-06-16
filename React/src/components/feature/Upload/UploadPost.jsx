import React, { useState, useRef } from 'react';
import { uploadContent } from '@/apis/content'

const App = () => {
  const [text, setText] = useState('')

  // ========== 改造：images 从 base64 字符串数组改为 File 对象数组 ==========
  // 每个元素：{ file: File, preview: string }
  //   file    — 原始 File 对象（提交时放入 FormData，服务端收到二进制文件）
  //   preview — URL.createObjectURL 生成的临时 URL（仅用于 <img> 缩略图展示）
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const fileRef = useRef(null)

  // 添加图片（最多 9 张）
  const handleImageAdd = (e) => {
    // e.target.files → FileList（类数组，没有 .slice 等数组方法）
    // Array.from() → 把 FileList 转成真正的数组
    // .slice(0, 9 - images.length) → 只取还能放的张数（已选 3 张 → 最多再取 6 张）
    const files = Array.from(e.target.files).slice(0, 9 - images.length)

    // ========== 改造：直接保存 File 对象 + 生成预览 URL ==========
    // 改造前：FileReader.readAsDataURL(file) → 得到 base64 字符串存 state → 提交时 JSON 发 base64
    // 改造后：保存 File 对象 → 提交时放入 FormData → 服务端收到二进制文件（体积更小、速度更快）
    const newImages = files.map(file => ({
      file: file,                                // File 对象（FormData 上传用）
      preview: URL.createObjectURL(file)         // blob URL（仅用于 <img> 预览）
    }))
    setImages(prev => [...prev, ...newImages])
  }

  // 移除图片 — 通过索引匹配
  //   filter((_, i) => i !== idx)：保留索引不等于 idx 的 → 丢弃目标图片
  //   _ 是元素本身（不用），i 是索引（用来比较）
  const handleImageRemove = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  // ========== 改造：发布时构建 FormData ==========
  // 文字和图片至少有一个才允许发布（与后端 uploadService 校验逻辑一致）
  const handlePublish = async () => {
    if (!text.trim() && images.length === 0) return
    setSubmitting(true)
    try {
      // FormData：浏览器原生 API，构建 multipart/form-data 请求体
      //   后端 postUpload 中间件配置了 multer.array('images', 9)
      //   所以这里 append 的字段名必须是 'images'（严格匹配）
      const formData = new FormData()
      formData.append('text', text)              // 文本字段
      images.forEach(img => {
        formData.append('images', img.file)      // 逐个 append 图片文件（同名字段多值 = 数组）
      })

      // axios 检测到 FormData 时自动设置 Content-Type: multipart/form-data
      await uploadContent('post', formData)
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

      {/* 图片预览 — .map 遍历 images 对象数组 → 每张图取 .preview 做缩略图 + ✕ 按钮 */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img src={img.preview} alt="" className="w-20 h-20 object-cover rounded-lg" />
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
          disabled={submitting || (!text.trim() && images.length === 0)}
          className={`px-5 py-1.5 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
            submitting || (!text.trim() && images.length === 0)
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

import React, { useState, useRef } from 'react';
import { uploadContent } from '@/apis/content'

const App = () => {
  // 表单字段
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ========== 改造：state 改为保存原始 File 对象 ==========
  // videoFile: 用户选择的视频 File 对象（提交时放入 FormData）
  // coverFile: 封面 File/Blob 对象（canvas 截图或本地上传，提交时放入 FormData）
  // videoPreview: URL.createObjectURL 生成的临时 URL（仅用于 <video> 标签预览，不上传）
  // coverPreview: 封面预览 URL（用于 <img> 标签展示，不上传）
  const [videoFile, setVideoFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')

  // 文件选择 — <input type="file"> 被点击 → 浏览器自动弹出系统文件夹
  //   onChange 在"用户选完文件点确定"时触发，e.target.files 是 FileList（类数组）
  //   e.target.files[0] → File 对象 { name, size, type }，并非文件内容本身
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // 保存原始 File 对象（提交时通过 FormData 发送二进制文件到服务端）
    setVideoFile(file)
    // URL.createObjectURL(file)：浏览器原生 API → 把本地 File 对象转成临时 blob URL
    //   返回 "blob:http://localhost:5173/abc-123..." → 可直接放 <video src>
    //   纯本地预览，不经过服务器。页面关闭后浏览器自动释放
    setVideoPreview(URL.createObjectURL(file))
  }

  // 删除文件（同时清除视频和封面）
  const handleRemove = () => {
    setVideoFile(null)
    setCoverFile(null)
    setVideoPreview('')
    setCoverPreview('')
  }

  // 预览弹窗
  const [previewOpen, setPreviewOpen] = useState(false)
  const handlePreview = () => setPreviewOpen(true)

  // canvas 截图封面 — 把视频当前暂停的画面截成一张 JPEG 图片
  //   canvas 是浏览器底层像素操作 API，全过程无网络请求、无后端
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const getCover = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    // getContext('2d') → 拿到 2D 画笔
    // drawImage(video, 0, 0, w, h) → 把 video 当前帧画到 canvas 的 (0,0) 位置
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

    // ========== 改造：toBlob 替代 toDataURL ==========
    // toBlob(callback, type, quality) → 异步把 canvas 像素转成 Blob 对象
    //   对比 toDataURL：toDataURL 同步返回 base64 字符串（大 canvas 会阻塞主线程）
    //   toBlob 异步回调，返回 Blob 对象（可直接放入 FormData 上传）
    canvas.toBlob((blob) => {
      if (!blob) return
      // 把 Blob 包装成 File 对象（带上文件名），FormData append 时更规范
      const file = new File([blob], 'cover.jpg', { type: 'image/jpeg' })
      setCoverFile(file)
      // 生成预览 URL（blob URL 仅用于 <img> 展示，不上传）
      setCoverPreview(URL.createObjectURL(file))
    }, 'image/jpeg', 0.9)
  }

  // 本地封面上传 — 直接保存 File 对象（不再用 FileReader 转 base64）
  //   改造前：FileReader.readAsDataURL(file) → 得到 base64 字符串存 state
  //   改造后：直接保存 File 对象 → 提交时放入 FormData，服务端收到二进制文件
  const handleCoverFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // ========== 改造：提交时构建 FormData ==========
  // FormData 是浏览器原生 API，用于构建 multipart/form-data 请求体
  //   append(name, value) → 添加表单字段（name 必须与后端 multer 配置的 field name 对应）
  //   后端 videoUpload 中间件配置了 fields: [{name:'video'}, {name:'cover'}]
  //   所以这里 append 的字段名必须严格匹配：'video'、'cover'、'title'、'description'
  const handleSubmit = async () => {
    if (!title.trim() || !videoFile) return
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('video', videoFile)       // 视频文件（必选）
      if (coverFile) {
        formData.append('cover', coverFile)     // 封面文件（可选）
      }
      formData.append('title', title)           // 标题（文本字段）
      formData.append('description', description) // 描述（文本字段）

      // uploadContent 会把 FormData 作为请求体发送
      // axios 检测到 FormData 时会自动设置 Content-Type: multipart/form-data（不需要手动设置）
      await uploadContent('video', formData)
      setTitle('')
      setDescription('')
      setVideoFile(null)
      setCoverFile(null)
      setVideoPreview('')
      setCoverPreview('')
      alert('上传成功')
    } catch {
      alert('上传失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">

      {/* === 标题 === */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">标题</div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入视频标题"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* === 上传视频 === */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">上传视频</div>

        {videoFile ? (
          // 已选择视频 → 显示预览卡 + 删除按钮
          <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img src={coverPreview || videoPreview} alt="封面" className="w-24 h-16 object-cover rounded bg-black" />
            <div className="flex-1">
              <div className="text-sm text-gray-700 truncate max-w-[200px]">{videoFile.name}</div>
              <button onClick={handlePreview} className="text-xs text-blue-500 hover:underline mt-1 cursor-pointer">预览视频</button>
            </div>
            <button onClick={handleRemove} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">✕ 移除</button>
          </div>
        ) : (
          // 未选择 → 拖拽/点击选区
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
            <span className="text-3xl text-gray-400 mb-1">+</span>
            <span className="text-sm text-gray-500">点击或拖拽上传视频</span>
            {/* <input type="file"> — 浏览器原生能力：点击自动弹出系统文件夹，不需要 JS
                onChange 在用户选完文件点确定时触发，e.target.files 是选中的文件列表 */}
            <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>

      {/* === 预览弹窗 === */}
      {/* 外层黑色遮罩：点空白处关闭 → 内层白色卡片必须 stopPropagation，否则点任何按钮都会冒泡到遮罩导致弹窗关闭 */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewOpen(false)}>
          {/* onClick stopPropagation：阻止点击事件往上冒泡到黑色遮罩 → 点卡片内部不会关闭弹窗 */}
          <div className="bg-white rounded-xl p-4 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <video
              ref={videoRef}
              controls
              poster={coverPreview}
              crossOrigin="anonymous"
              className="w-full rounded-lg"
            >
              <source src={videoPreview} />
            </video>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={getCover} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">截取当前帧做封面</button>
              <button onClick={() => setPreviewOpen(false)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 cursor-pointer">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* === 选择封面 === */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">选择封面</div>
        <div className="flex gap-2">
          <button onClick={handlePreview} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">从视频截取</button>
          <label className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            本地文件上传
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
          </label>
        </div>
        {coverPreview && (
          <img src={coverPreview} alt="封面预览" className="mt-2 w-24 h-16 object-cover rounded bg-gray-200" />
        )}
      </div>

      {/* === 编辑简介 === */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">编辑简介</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          placeholder="输入内容..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      {/* === 提交 === */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
          submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {submitting ? '上传中...' : '提交'}
      </button>
    </div>
  )
}

export default App

import React, { useState, useRef } from 'react';
import { uploadContent } from '@/apis/content'

const App = () => {
  // 表单字段
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 存放上传的视频文件（供预览用）
  const [fileList, setFileList] = useState([{
    url: "https://cdn.pixabay.com/video/2025/04/29/275633_large.mp4",
    thumbUrl: 'https://bpic.588ku.com/element_origin_min_pic/23/07/11/d32dabe266d10da8b21bd640a2e9b611.jpg'
  }])

  // 文件选择 — <input type="file"> 被点击 → 浏览器自动弹出系统文件夹
  //   onChange 在"用户选完文件点确定"时触发，e.target.files 是 FileList（类数组）
  //   e.target.files[0] → File 对象 { name, size, type }，并非文件内容本身
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // URL.createObjectURL(file)：浏览器原生 API → 把本地 File 对象转成临时 blob URL
    //   返回 "blob:http://localhost:5173/abc-123..." → 可直接放 <video src>
    //   纯本地预览，不经过服务器。页面关闭后浏览器自动释放
    const url = URL.createObjectURL(file)
    setFileList([{ url, thumbUrl: url }])
  }

  // 删除文件
  const handleRemove = () => setFileList([])

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
    // toDataURL('image/jpeg') → 把 canvas 像素导出为 base64 JPEG 字符串
    //   返回 "data:image/jpeg;base64,/9j/4AAQ..." → 可直接放 <img src>
    const cover = canvas.toDataURL('image/jpeg')
    // 展开旧属性 (...i)，覆盖 cover 和 thumbUrl
    setFileList(prev => prev.map(i => ({ ...i, cover, thumbUrl: cover })))
  }

  // 本地封面上传 — 把本地图片文件读成 base64 字符串
  //   FileReader：浏览器内建 API，异步读本地文件内容
  //   为什么必须 onload 回调？readAsDataURL 是异步的 → 发起读取立刻返回
  //   → 此时 reader.result 是 null → 必须等 onload 触发才能拿到数据
  //   对比 createObjectURL：视频用 blob URL（大文件不转码），图片用 base64（小文件方便直接存 state）
  const handleCoverFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()          // 创建读取器
    reader.onload = () => {                  // 读完后的回调——此时 reader.result 才有值
      setFileList(prev => prev.map(i => ({ ...i, cover: reader.result, thumbUrl: reader.result })))
    }
    reader.readAsDataURL(file)               // 开始读，转成 base64 → 完成后触发 onload
  }

  // 提交 — 收集表单数据，调上传 API
  const handleSubmit = async () => {
    if (!title.trim() || fileList.length === 0) return
    setSubmitting(true)
    try {
      const { cover, url } = fileList[0]
      await uploadContent('video', { title, description, cover, videoUrl: url })
      setTitle('')
      setDescription('')
      setFileList([])
      alert('上传成功')
    } catch {
      alert('上传失败')
    } finally {
      setSubmitting(false)
    }
  }

  const current = fileList[0]

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

        {current ? (
          // 已上传 → 显示预览卡 + 删除按钮
          <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <img src={current.thumbUrl} alt="封面" className="w-24 h-16 object-cover rounded bg-black" />
            <div className="flex-1">
              <div className="text-sm text-gray-700 truncate max-w-[200px]">{current.url}</div>
              <button onClick={handlePreview} className="text-xs text-blue-500 hover:underline mt-1 cursor-pointer">预览视频</button>
            </div>
            <button onClick={handleRemove} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">✕ 移除</button>
          </div>
        ) : (
          // 未上传 → 拖拽/点击选区
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
              poster={current?.cover}
              crossOrigin="anonymous"
              className="w-full rounded-lg"
            >
              <source src={current?.url} />
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
        {current?.cover && (
          <img src={current.cover} alt="封面预览" className="mt-2 w-24 h-16 object-cover rounded bg-gray-200" />
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

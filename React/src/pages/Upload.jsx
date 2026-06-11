import React, { useState } from 'react';
import TopMenuApp from '@/components/common/TopMenu'
import UploadVideo from '@/components/feature/Upload/UploadVideo'
import UploadEssay from '@/components/feature/Upload/UploadEssay'
import UploadPost from '@/components/feature/Upload/UploadPost'

const tabs = [
  { key: 'video', label: '视频上传' },
  { key: 'essay', label: '文章上传' },
  { key: 'post',  label: '发布动态' },
]

const UploadPage = () => {
  const [active, setActive] = useState('video')

  return (
    <div className="min-h-screen bg-white">
      <TopMenuApp />

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                key === active
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 上传内容 */}
        {active === 'video' && <UploadVideo />}
        {active === 'essay' && <UploadEssay />}
        {active === 'post'  && <UploadPost />}
      </main>
    </div>
  )
}

export default UploadPage

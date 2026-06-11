import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopMenuApp from '@/components/common/TopMenu'
import VideoCard from '@/components/common/DataCard/VideoCard'

// ===== 自包含组件：不导入 Main.jsx，只是复刻了它的渲染逻辑 =====
// Storybook 文件里的重复代码是正常的 — 测试代码不依赖被测代码的内部结构

function DemoCarousel({ urlList }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (!urlList || urlList.length === 0) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % urlList.length), 3000)
    return () => clearInterval(timer)
  }, [urlList])

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-200">
      <div className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}>
        {urlList?.map((item, i) => (
          <div key={item.id || i} className="min-w-full h-full flex-shrink-0">
            <img src={item.src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function MainDemo({ carouselUrlList, carouselLoading, carouselError, mainVideoList, mainVideoLoading, mainVideoError }) {
  return (
    <div className="min-h-screen bg-white">
      <TopMenuApp />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="max-w-3xl mx-auto">
            {carouselLoading ? (
              <div className="w-full aspect-video rounded-xl bg-gray-200 animate-pulse" />
            ) : carouselError ? (
              <div className="w-full aspect-video rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-2">⚠</span>
                <span className="text-sm">轮播图加载失败</span>
              </div>
            ) : (
              <DemoCarousel urlList={carouselUrlList} />
            )}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">推荐视频</h2>
          {mainVideoLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
              {Array(16).fill(0).map((_, i) => (
                <div key={i} className="w-[300px] animate-pulse">
                  <div className="aspect-video rounded-xl bg-gray-200 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : mainVideoError ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-3">⚠</span>
              <span className="text-lg font-medium text-gray-500 mb-1">视频加载失败</span>
              <span className="text-sm">请检查网络后刷新页面</span>
            </div>
          ) : mainVideoList?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-3">📭</span>
              <span className="text-lg font-medium text-gray-500">暂无推荐视频</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
              {mainVideoList?.map((video) => (
                <VideoCard key={video.vid} video={video} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

// ===== Mock 数据 =====
const mockCarousel = [
  { id: 1, src: 'https://picsum.photos/800/450?random=1' },
  { id: 2, src: 'https://picsum.photos/800/450?random=2' },
  { id: 3, src: 'https://picsum.photos/800/450?random=3' },
]
const mockVideos = Array(8).fill(0).map((_, i) => ({
  vid: i + 1, coverUrl: `https://picsum.photos/300/170?random=${i + 10}`,
  title: `测试视频 ${i + 1} — 正常长短标题`, viewCount: '12.3万',
  messageCount: '456', duration: '10:30',
  uploader: { userName: `用户${i + 1}` }, date: '2024-01-15',
}))

// ===== 故事 =====
export default {
  title: 'Main/完整页面',
  decorators: [(Story) => <BrowserRouter><Story /></BrowserRouter>],
}

export const 正常 = () => (
  <MainDemo carouselUrlList={mockCarousel} carouselLoading={false} carouselError={null}
    mainVideoList={mockVideos} mainVideoLoading={false} mainVideoError={null} />
)
export const 加载中 = () => (
  <MainDemo carouselUrlList={null} carouselLoading={true} carouselError={null}
    mainVideoList={null} mainVideoLoading={true} mainVideoError={null} />
)
export const 加载失败 = () => (
  <MainDemo carouselUrlList={null} carouselLoading={false} carouselError={true}
    mainVideoList={null} mainVideoLoading={false} mainVideoError={true} />
)
export const 视频列表为空 = () => (
  <MainDemo carouselUrlList={mockCarousel} carouselLoading={false} carouselError={null}
    mainVideoList={[]} mainVideoLoading={false} mainVideoError={null} />
)
export const 轮播正常_视频加载中 = () => (
  <MainDemo carouselUrlList={mockCarousel} carouselLoading={false} carouselError={null}
    mainVideoList={null} mainVideoLoading={true} mainVideoError={null} />
)

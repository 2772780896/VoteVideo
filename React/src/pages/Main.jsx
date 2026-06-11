import TopMenuApp from "@/components/common/TopMenu";
import { useState, useEffect } from 'react';
import VideoCard from '@/components/common/DataCard/VideoCard';
import useData from '@/hooks/useData'
import { fetchItemList } from "@/apis/content";

// 自定义轮播图组件
function Carousel({ urlList }) {
  const [current, setCurrent] = useState(0)

  // 自动轮播
  useEffect(() => {
    if (!urlList || urlList.length === 0) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % urlList.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [urlList])

  const goTo = (index) => setCurrent(index)
  const prev = () => setCurrent(prev => (prev - 1 + urlList.length) % urlList.length)
  const next = () => setCurrent(prev => (prev + 1) % urlList.length)

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-200">
      {/* 图片容器 */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {urlList?.map((item, index) => (
          <div key={item.id || index} className="min-w-full h-full flex-shrink-0">
            <img
              src={item.src}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
      >
        ›
      </button>

      {/* 指示器小圆点 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {urlList?.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const HomePage = () => {
  const { data: carouselData, loading: carouselLoading, error: carouselError } = useData(
    () => fetchItemList('picture', { subType: 'carousel', number: 5 }),
    []
  )
  const { data: mainVideoData, loading: mainVideoLoading, error: mainVideoError } = useData(
    () => fetchItemList('video', { subType: 'main', page: 1, element: 16 }),
    []
  )

  const carouselUrlList = carouselData?.data
  const mainVideoList = mainVideoData?.data

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <TopMenuApp />

      {/* 主体内容 */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ===== 轮播区 ===== */}
        <section className="mb-8">
          <div className="max-w-3xl mx-auto">
            {carouselLoading ? (
              // ① 轮播图骨架屏
              <div className="w-full aspect-video rounded-xl bg-gray-200 animate-pulse" />
            ) : carouselError ? (
              // ② 轮播图错误
              <div className="w-full aspect-video rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                <span className="text-4xl mb-2">⚠</span>
                <span className="text-sm">轮播图加载失败</span>
              </div>
            ) : (
              <Carousel urlList={carouselUrlList} />
            )}
          </div>
        </section>

        {/* ===== 视频列表区 ===== */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">推荐视频</h2>

          {mainVideoLoading ? (
            // ③ 视频列表骨架屏
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
            // ④ 视频列表错误
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-5xl mb-3">⚠</span>
              <span className="text-lg font-medium text-gray-500 mb-1">视频加载失败</span>
              <span className="text-sm">请检查网络后刷新页面</span>
            </div>
          ) : mainVideoList?.length === 0 ? (
            // ⑤ 视频列表为空
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

export default HomePage

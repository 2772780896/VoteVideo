import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import InteractionBar from '@/components/common/InteractionBar'
import CommentSection from '@/components/common/CommentSection'
import RelatedSidebar from '@/components/common/RelatedSidebar'
import useData from '@/hooks/useData';
import { fetchItem, interact } from '@/apis/content';

const EssayPage = () => {
  const { eid } = useParams()
  // ① useData 四状态解构：data / loading / error / refresh
  const { data: essayData, loading, error, refresh } = useData(fetchItem, 'essay', eid)
  const essay = essayData

  // 历史记录：文章加载完成后自动记录到历史
  useEffect(() => {
    if (essay && !loading) {
      // 调用历史记录接口（静默失败，不影响用户体验）
      interact('essay', 'history', eid).catch(() => {
        // 历史记录失败不影响主要功能
      })
    }
  }, [essay, loading, eid])

  return (
    <div className="min-h-screen bg-white">

      {/* 顶部导航 */}
      <TopMenuApp />

      {/* 主体 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 双栏布局：左侧主内容 + 右侧边栏 */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ===== 左侧：文章信息 + 评论区 ===== */}
          <div className="flex-1 min-w-0">

            {/* ② 加载态：骨架屏 */}
            {loading && (
              <div className="animate-pulse">
                {/* 标题占位 */}
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-6" />
                {/* 作者区占位 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
                {/* 正文占位 */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-11/12" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            )}

            {/* ② 错误态：错误提示 + 重试按钮 */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-5xl mb-3">⚠</span>
                <span className="text-lg font-medium text-gray-500 mb-1">
                  {error?.data?.code === 404 ? '文章不存在' : '文章加载失败'}
                </span>
                {error?.data?.code !== 404 && (
                  <button
                    onClick={refresh}
                    className="mt-3 px-5 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    重试
                  </button>
                )}
              </div>
            )}

            {/* ② 空态：数据为空 */}
            {!loading && !error && !essay && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-5xl mb-3">📄</span>
                <span className="text-lg font-medium text-gray-500">文章不存在</span>
              </div>
            )}

            {/* ② 正常态：渲染内容 */}
            {!loading && !error && essay && (
              <>
                {/* 标题 */}
                <h1 className="text-2xl font-bold text-gray-900 mb-6">{essay.title}</h1>

                {/* 作者信息 */}
                <div className="flex items-center gap-3 mb-6">
                  {/* 【Tailwind】w-12 h-12 固定尺寸 | rounded-full 圆形 | bg-gray-300 占位底色
                      flex 居中 | text-white 白色文字 | font-bold 加粗 | text-lg 字号 */}
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {essay.uploader?.userName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{essay.uploader?.userName}</div>
                    <div className="text-sm text-gray-500">编辑于 {essay.date}</div>
                  </div>
                </div>

                {/* 正文 */}
                {/* 【Tailwind】text-gray-700 深灰正文 | leading-relaxed 舒适行高 | whitespace-pre-wrap 保留换行 */}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{essay.text}</p>

                {/* ③ 通用交互栏 */}
                <InteractionBar mediaType="essay" item={essay} />

                {/* ④ 通用评论区（内置排序 + 分页） */}
                <CommentSection parentId={essay?.eid} parentType="essay" />
              </>
            )}

          </div>

          {/* ===== 右侧：上传者信息 + 相关文章 ===== */}
          <RelatedSidebar item={essay} mediaType="essay" />

        </div>
      </main>
    </div>
  )
}
export default EssayPage

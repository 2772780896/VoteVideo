import React, { useState } from 'react';
import TopMenuApp from '@/components/common/TopMenu'
import DataList from '@/components/common/DataList'
import SortDropdown from '@/components/common/SortDropdown'
import PostCard from '@/components/common/DataCard/PostCard'
import { fetchItemList } from '@/apis/content'

const sortList = [
  { label: '最新动态', key: '-date' },
  { label: '最早动态', key: 'date' },
]

const DynamicPage = () => {
  const [sort, setSort] = useState('-date')

  return (
    <div className="min-h-screen bg-white">
      <TopMenuApp />

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* 标题 + 排序 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">动态</h2>
          <SortDropdown pushSort={setSort} defaultSort="-date" sortList={sortList} />
        </div>

        {/* 动态流 */}
        <DataList
          request={(s, p, e) => fetchItemList('post', { sort: s, page: p, element: e })}
          sort={sort}
          pageSize={10}
          renderItem={(post) => <PostCard key={post.pid} post={post} />}
          gridClassName="flex flex-col gap-4"
        />
      </main>
    </div>
  )
}

export default DynamicPage

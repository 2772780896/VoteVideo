import React, { useState } from 'react'
import DataList from '@/components/common/DataList'
import CommentCard from '@/components/common/DataCard/CommentCard'
import SortDropdown from '@/components/common/SortDropdown'
import { fetchItemList } from '@/apis/content'

/**
 * 通用评论区组件
 *
 * 功能：
 * - 内置排序下拉（最新评论 / 最早评论）
 * - 内置分页列表（DataList）
 * - 自动将 parentId 作为查询参数传给后端
 *
 * Props：
 * @param {string|number} parentId   - 父资源 ID（vid / eid / pid / tid）
 * @param {string}        parentType - 父资源类型 'video' | 'essay' | 'post' | 'tag'
 *
 * 所需后端接口：
 * GET /api/comment?sort={sort}&page={page}&pageSize={pageSize}&{parentType}Id={parentId}
 * 返回格式：{ items: Comment[], total: number }
 */
const commentSortList = [
  { label: '最新评论', key: '-date' },
  { label: '最早评论', key: 'date' },
]

const CommentSection = ({ parentId, parentType }) => {
  const [sort, setSort] = useState('-date')

  // parentId 尚未就绪时不渲染列表
  if (parentId === undefined || parentId === null) return null

  return (
    <div className="mt-6">
      {/* 标题 + 排序 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">评论区</h2>
        <SortDropdown pushSort={setSort} defaultSort="-date" sortList={commentSortList} />
      </div>

      {/* 评论列表 */}
      <DataList
        request={(sort, page, element) =>
          fetchItemList('comment', {
            sort,
            page,
            element,
            [parentType + 'Id']: parentId,
          })
        }
        sort={sort}
        params={[parentId]}
        pageSize={16}
        renderItem={(item) => <CommentCard key={item.cid} comment={item} />}
      />
    </div>
  )
}

export default CommentSection

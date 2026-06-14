import React from 'react'
import DataList from '@/components/common/DataList'
import UploaderCard from '@/components/common/UploaderCard'
import VideoCard from '@/components/common/DataCard/VideoCard'
import EssayCard from '@/components/common/DataCard/EssayCard'
import PostCard from '@/components/common/DataCard/PostCard'
import TagCard from '@/components/common/DataCard/TagCard'
import { fetchItemList } from '@/apis/content'

/**
 * 通用侧边推荐组件
 *
 * 功能：
 * - 显示上传者卡片（UploaderCard）
 * - 显示相关推荐列表（根据 mediaType 自动选择推荐内容和卡片）
 *
 * Props：
 * @param {Object} item      - 当前资源对象（需含 uploader 字段）
 * @param {string} mediaType - 'video' | 'essay' | 'post' | 'tag'
 *
 * 所需后端接口：
 * GET /api/{mediaType}/related?{mediaType}Id={itemId}&sort={sort}&page={page}&pageSize={pageSize}
 * 返回格式：{ items: Resource[], total: number }
 *
 * 各类型推荐内容：
 * - video -> 相关视频（VideoCard）
 * - essay -> 相关文章（EssayCard）
 * - post  -> 相关图文（PostCard）
 * - tag   -> 相关标签（TagCard）
 */

// mediaType → { 推荐标题, ID字段名, 卡片组件, 卡片prop名, 资源key }
const CONFIG_MAP = {
  video: {
    title: '视频推荐',
    idKey: 'vid',
    Card: VideoCard,
    cardProp: 'video',
  },
  essay: {
    title: '文章推荐',
    idKey: 'eid',
    Card: EssayCard,
    cardProp: 'essay',
  },
  post: {
    title: '动态推荐',
    idKey: 'pid',
    Card: PostCard,
    cardProp: 'post',
  },
  tag: {
    title: '标签推荐',
    idKey: 'tid',
    Card: TagCard,
    cardProp: 'tag',
  },
}

const RelatedSidebar = ({ item, mediaType }) => {
  const config = CONFIG_MAP[mediaType]
  if (!config || !item) return null

  const { title, idKey, Card, cardProp } = config
  const itemId = item[idKey]

  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
      {/* 上传者信息卡 */}
      <UploaderCard item={item} mediaType={mediaType} />

      {/* 相关推荐标题 */}
      <h2 className="text-base font-semibold text-gray-800 mb-3">{title}</h2>

      {/* 相关推荐列表 */}
      {itemId !== undefined && (
        <DataList
          request={(sort, page, element) =>
            fetchItemList(mediaType, {
              subType: 'related',
              [mediaType + 'Id']: itemId,
              sort,
              page,
              element,
            })
          }
          sort={null}
          params={[itemId]}
          pageSize={5}
          renderItem={(v) => <Card key={v[idKey]} {...{ [cardProp]: v }} />}
          gridClassName="flex flex-col gap-3"
        />
      )}
    </div>
  )
}

export default RelatedSidebar

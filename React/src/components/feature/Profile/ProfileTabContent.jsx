import React, { useState } from 'react';
import SortDropdown from '@/components/common/SortDropdown'
import { getProfileSubdata } from '@/apis/account'
import DataList from '@/components/common/DataList'
import VideoCard from '@/components/common/DataCard/VideoCard'
import PostCard from '@/components/common/DataCard/PostCard'
import EssayCard from '@/components/common/DataCard/EssayCard'
import CommentCard from '@/components/common/DataCard/CommentCard'

/**
 * 【面试必考】DATA_MAP 映射表 — 三个旧组件合并为一个
 *
 * 旧：ProfileUpload / ProfileFavourite / ProfileHistory 三个 99% 相同文件
 * 新：profileType prop 驱动，DATA_MAP 负责资源类型到卡片/ID/prop名 的映射
 *
 * DATA_MAP 结构：
 *   {                                            // Object.entries 展开后 ↓
 *     videos: { label:'视频', Card:VideoCard, idKey:'vid', propName:'video' },   → ['videos', { label:'视频', ... }]
 *     posts:  { label:'动态', Card:PostCard,  idKey:'pid', propName:'post' },    → ['posts',  { label:'动态', ... }]
 *     essays: { label:'文章', Card:EssayCard, idKey:'eid', propName:'essay' },   → ['essays', { label:'文章', ... }]
 *     comments: { label:'评论', Card:CommentCard, idKey:'cid', propName:'comment' }, → ['comments', { label:'评论', ... }]
 *   }
 *
 * Object.entries({ a:1, b:2 })  →  [ ['a', 1], ['b', 2] ]
 * 把对象的键值对拆成 [key, value] 的二维数组，方便 .map() 遍历
 */
const DATA_MAP = {
  videos: { label: '视频', Card: VideoCard, idKey: 'vid', propName: 'video' },
  posts:  { label: '动态', Card: PostCard,  idKey: 'pid', propName: 'post' },
  essays: { label: '文章', Card: EssayCard, idKey: 'eid', propName: 'essay' },
  comments: { label: '评论', Card: CommentCard, idKey: 'cid', propName: 'comment' },
}

// tabs = [ ['videos',{label:'视频',...}], ['posts',{label:'动态',...}], ['essays',{label:'文章',...}] ]
const tabs = Object.entries(DATA_MAP)

/**
 * Profile 子页面统一组件
 * @param {string} profileType — 'uploads' | 'favourites' | 'history'
 */
const ProfileTabContent = ({ profileType }) => {
  const [sort, setSort] = useState()
  const [active, setActive] = useState('videos')

  const { Card, idKey, propName } = DATA_MAP[active]

  return (
    <>
      {/* Tailwind Tabs */}
      {/* .map 遍历 tabs 二维数组：
          第 1 轮 → key='videos', label='视频'
          第 2 轮 → key='posts',  label='动态'
          第 3 轮 → key='essays', label='文章'
          [key, { label }] 是一次拆两次：先拆 entry 成 [k, v]，再从 v 里拆出 label */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              key === active
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 排序下拉 */}
      <div className="mb-4">
        <SortDropdown pushSort={setSort} />
      </div>

      {/* 数据列表 */}
      <DataList
        sort={sort}
        request={getProfileSubdata}
        params={[profileType, active]}
        renderItem={(item) => {
          /* ============================================================
           * 三步动态构造组件 prop：
           *
           * ① propName = 'video'   ← 从 DATA_MAP 拿当前 tab 对应的 prop 名
           *
           * ② { [propName]: item }  ← 计算属性名：键名取变量值，不是字面量
           *    JS 规则：不加 [] 的键名永远是字符串字面量
           *    如 { propName: item } 键名是 "propName"，不是 "video"
           *    只有 { [propName]: item } 键名才取 propName 变量的值
           *
           * ③ <Card {...props} />  ← JSX 属性展开：把对象的键值拆成独立 prop
           *    【面试必考】{} 在 JSX 里有两套规则：
           *      - 属性位置 <Tag attr={expr}>  → ... 拆成 prop（只在属性区有效）
           *      - 内容位置 <Tag>{expr}</Tag>  → ... 就是普通 JS 对象展开
           *    如 props = { video: item }，则 <Card {...props} /> =
           *    <Card video={item} />，跟手写完全一致
           * ============================================================ */
          const props = { [propName]: item }
          return <Card key={item[idKey]} {...props} />
        }}
      />
    </>
  )
}

export default ProfileTabContent

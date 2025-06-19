import React, {useState, useMemo} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs } from "antd";
import SortDropdown from '@/components/common/SortDropdown'
import VideoList from '@/components/common/DataList/VideoList'
import PostList from '@/components/common/DataList/PostList'
import EssayList from '@/components/common/DataList/EssayList'
import UserList from '@/components/common/DataList/UserList'
import TagList from '@/components/common/DataList/TagList'

const App = () => {
    // 设置排序方式
    const [sort, setSort] = useState()

    // 当get参数更新时获取参数
    const [params] = useSearchParams()
    const activeKey = useMemo(() => {
        if (params.size !== 0) {return params.get('search')}
        else {return '1'}
    }, [params])

    // 当元素切换时更新url，通过get传递key参数
    const navigate = useNavigate()
    const handleChange = (key) => {
        navigate(`/search?search=${key}`)
    }

    const tab = [
        {key: '1', label: '综合', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <VideoList sort={sort}/>
            </>
        )},
        {key: '2', label: '视频', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <VideoList sort={sort}/>
            </>
        )},
        {key: '3', label: '文章', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <EssayList sort={sort}/>
            </>
        )},
        {key: '4', label: '动态', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <PostList sort={sort}/>
            </>
        )},
        {key: '5', label: '用户', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <UserList sort={sort}/>
            </>
        )},
        {key: '6', label: '标签', children: (
            <>
            <SortDropdown pushSort={setSort}/>
            <TagList sort={sort}/>
            </>
        )},
    ]
    
    return (
        <Tabs activeKey={activeKey} items={tab} onChange={handleChange}></Tabs>
    )
}

export default App
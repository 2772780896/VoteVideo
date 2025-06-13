import React, {useState, useMemo} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Col, Row, Segmented, Tabs } from "antd";
import SearchSortDropdownApp from '@/components/feature/Search/SearchSortDropdown'
import VideoList from '@/components/common/DataList/VideoList'
import SearchPostFlexApp from '@/components/common/DataList/PostList'
import SearchEssayFlexApp from '@/components/common/DataList/EssayList'
import SearchUserFlexApp from '@/components/common/DataList/UserList'
import SearchTagFlexApp from '@/components/common/DataList/TagList'

const App = () => {
    // 设置排序方式
    const [sort, setSort] = useState('viewCount')

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
            {/* <SearchSortDropdownApp pushSort={setSort}/> */}
            <VideoList sort={sort}/>
            </>
        )},
        // {key: '2', label: '视频', children: (
        //     <>
        //     <SearchSortDropdownApp pushSort={setSort}/>
        //     <VideoList sort={sort}/>
        //     </>
        // )},
        // {key: '3', label: '文章', children: (
        //     <>
        //     <SearchSortDropdownApp pushSort={setSort}/>
        //     <SearchEssayFlexApp sort={sort}/>
        //     </>
        // )},
        // {key: '4', label: '动态', children: (
        //     <>
        //     <SearchSortDropdownApp pushSort={setSort}/>
        //     <SearchPostFlexApp sort={sort}/>
        //     </>
        // )},
        // {key: '5', label: '用户', children: (
        //     <>
        //     <SearchSortDropdownApp pushSort={setSort}/>
        //     <SearchUserFlexApp sort={sort}/>
        //     </>
        // )},
        // {key: '6', label: '标签', children: (
        //     <>
        //     <SearchSortDropdownApp pushSort={setSort}/>
        //     <SearchTagFlexApp sort={sort}/>
        //     </>
        // )},
    ]
    
    return (
        <Tabs activeKey={activeKey} items={tab} onChange={handleChange}></Tabs>
    )
}

export default App
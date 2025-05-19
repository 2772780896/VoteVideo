import React, {useState} from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import SearchSortDropdownApp from '@/components/feature/SearchSortDropdown'
import SearchVideoFlexApp from '@/components/feature/SearchVideoFlex'
import SearchFocusFlexApp from '@/components/feature/SearchFocusFlex'
import SearchEssayFlexApp from '@/components/feature/SearchEssayFlex'
import SearchUserFlexApp from '@/components/feature/SearchUserFlex'
import SearchTagFlexApp from '@/components/feature/SearchTagFlex'

const App = ({search='1'}) => {
    const  [sort, setSort] = useState(search)
    const tab = [
        {key: '1', label: '综合', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchVideoFlexApp sort={sort}/>
            </>
        )},
        {key: '2', label: '视频', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchVideoFlexApp sort={sort}/>
            </>
        )},
        {key: '3', label: '文章', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchEssayFlexApp sort={sort}/>
            </>
        )},
        {key: '4', label: '动态', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchFocusFlexApp sort={sort}/>
            </>
        )},
        {key: '5', label: '用户', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchUserFlexApp sort={sort}/>
            </>
        )},
        {key: '6', label: '标签', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchTagFlexApp sort={sort}/>
            </>
        )},
    ]
    return (
        <Tabs defaultActiveKey={search} items={tab}></Tabs>
    )
}

export default App
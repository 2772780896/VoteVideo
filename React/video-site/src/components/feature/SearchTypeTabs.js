import React, {useState} from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import SearchSortDropdownApp from '@/components/feature/SearchSortDropdown'
import SearchVideoFlexApp from '@/components/feature/SearchVideoFlex'
import SearchFocusFlexApp from '@/components/feature/SearchFocusFlex'
import SearchEssayFlexApp from '@/components/feature/SearchEssayFlex'
import SearchUserFlexApp from '@/components/feature/SearchUserFlex'

const App = () => {
    const  [sort, setSort] = useState()
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
        {key: '3', label: '专栏', children: (
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
    ]
    return (
        <Tabs defaultActiveKey="1" items={tab}></Tabs>
    )
}

export default App
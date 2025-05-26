import React, {useState, useEffect, use} from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import SearchSortDropdownApp from '@/components/feature/Search/SearchSortDropdown'
import SearchVideoFlexApp from '@/components/feature/Search/SearchVideoFlex'
import SearchFocusFlexApp from '@/components/feature/Search/SearchFocusFlex'
import SearchEssayFlexApp from '@/components/feature/Search/SearchEssayFlex'
import SearchUserFlexApp from '@/components/feature/Search/SearchUserFlex'
import SearchTagFlexApp from '@/components/feature/Search/SearchTagFlex'

const App = ({search='1'}) => {
    const [sort, setSort] = useState('1')
    const [type, setType] = useState(search)
    useEffect(() => {setType(search)}, [search])
    const handleChange = (key) => {
        setType(key)
    }
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
        <Tabs activeKey={type} items={tab} onChange={handleChange}></Tabs>
    )
}

export default App
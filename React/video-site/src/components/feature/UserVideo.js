import React, {use, useState} from 'react';
import SearchSortDropdown from '@/components/feature/SearchSortDropdown'
import UserVideoFlex from '@/components/feature/UserVideoFlex'

const App = () => {
    const [sort, setSort] = useState()
    return (
        <>
        <SearchSortDropdown pushSort={setSort} defaultSort='时间顺序'/>
        <UserVideoFlex sort={sort}/>
        </>
    )
}

export default App;
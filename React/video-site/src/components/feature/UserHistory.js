import React from 'react';
import UserHistoryCard from '@/components/feature/UserHistoryCard'
import { Flex, Tabs } from 'antd'

const App = () => {
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <Flex wrap>
                    <UserHistoryCard type={'video'} />
                    <UserHistoryCard type={'video'} />
                    <UserHistoryCard type={'video'} />
                </Flex>)
        },
        {
            key: '2',
            label: '动态',
            children: (
                <Flex wrap>
                    <UserHistoryCard type={'post'} />
                    <UserHistoryCard type={'post'} />
                    <UserHistoryCard type={'post'} />
                </Flex>)
        },
        {
            key: '3',
            label: '文章',
            children: (
                <Flex wrap>
                    <UserHistoryCard type={'essay'} />
                    <UserHistoryCard type={'essay'} />
                    <UserHistoryCard type={'essay'} />
                </Flex>)
        },
    ];
    return (
        <Tabs defaultActiveKey="1" items={items} />
    )
}

export default App
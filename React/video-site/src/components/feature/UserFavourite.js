import React from 'react';
import UserFavouriteCard from '@/components/feature/UserFavouriteCard'
import { Flex, Tabs } from 'antd'

const App = () => {
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <Flex wrap>
                    <UserFavouriteCard type={'video'} />
                    <UserFavouriteCard type={'video'} />
                    <UserFavouriteCard type={'video'} />
                </Flex>)
        },
        {
            key: '2',
            label: '动态',
            children: (
                <Flex wrap>
                    <UserFavouriteCard type={'post'} />
                    <UserFavouriteCard type={'post'} />
                    <UserFavouriteCard type={'post'} />
                </Flex>)
        },
        {
            key: '3',
            label: '文章',
            children: (
                <Flex wrap>
                    <UserFavouriteCard type={'essay'} />
                    <UserFavouriteCard type={'essay'} />
                    <UserFavouriteCard type={'essay'} />
                </Flex>)
        },
    ];
    return (
        <Tabs defaultActiveKey="1" items={items} />
    )
}

export default App
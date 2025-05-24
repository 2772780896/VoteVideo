import React from 'react';
import TopMenuApp from '@/components/common/TopMenu'
import { Tabs, Flex } from "antd";
import UploadVideo from '@/components/feature/UploadVideo'
import UploadEssay from '@/components/feature/UploadEssay'

const App = () => {
    const tab = [
        {key: '1', label: '视频上传', children: (
            <UploadVideo />
        )},
        {key: '2', label: '文章上传', children: (
            <UploadEssay />
        )}
    ]
    return (
        <>
        <TopMenuApp />
        <Flex justify='center'>
            <Tabs activeKey={'1'} items={tab} centered style={{width:'80%'}}></Tabs>
        </Flex>
        </>
    )
}
export default App
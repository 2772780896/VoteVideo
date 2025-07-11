import React from 'react';
import {Flex} from 'antd'
import MainVideoCard from '@/components/common/DataCard/VideoCard'
import FocusUploaderCard from '@/components/feature/FollowUploader/FollowUploaderCard'
import EssayCard from '@/components/common/DataCard/EssayCard'

const App = ({type='video'}) => {
    const resolveType = (type) => {
        if (type === 'video') {
            return <MainVideoCard />
        }else if (type === 'post') {
            return <FocusUploaderCard type='text' />
        }else if (type === 'essay') {
            return <EssayCard />
        }
    }
    return (
        <Flex vertical gap='large'>
            <div>时间 查看了</div>
            {resolveType(type)}
        </Flex>
    )
}

export default App
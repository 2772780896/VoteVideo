import React, {useState} from 'react';
import { useParams } from 'react-router-dom'
import { Flex } from 'antd';
import TopMenuApp from '@/components/common/TopMenu'
import SideVideoFlexApp from '@/components/common/Video/SideVideoFlex'
import VideoPlayerApp from '@/components/common/Video/VideoPlayer'
import { Col, Row } from "antd";
import CommentFlexApp from '@/components/common/DataList/CommentList'
import UploadCardApp from '@/components/common/UploaderCard'
import TagRow from '@/components/common/TagRow'
import useData from '@/hooks/useData';
import getVideo from '@/apis/getData/getVideo';
import SortDropdown from '@/components/common/SortDropdown'
 
const App = () => {
  const { vid } = useParams()
  console.log('videoVid:', vid)

  // 获取视频数据
  const video = useData(getVideo, vid)?.data
  console.log('videoData:', video)

  const [sort, setSort] = useState()
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={1}>
        <h1>{video?.title}</h1>
        <Flex justify="start" gap="middle">
          <span>{video?.viewCount}</span>
          <span>{video?.messageCount}</span>
          <span>{video?.date}</span>
        </Flex>
        <VideoPlayerApp playVideo={video} />
        <TagRow tagList={video?.tagList} />
        <Flex justify="start" gap="middle">
          <span>点赞</span>
          <span>收藏</span>
          <span>转发</span>
        </Flex>
        <SortDropdown pushSort={setSort}/>
        <CommentFlexApp sort={sort}/>
      </Col>
      <Col span={5} offset={1}>
        {/* <UploadCardApp playVideo={video} /> */}
        {/* <SideVideoFlexApp/> */}
      </Col>
    </Row>
  )
}
export default App
import React from 'react';
import { useSearchParams } from 'react-router-dom'
import { Flex, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PostVideo from '@/components/feature/Post/PostVideo'
import PostPicture from '@/components/feature/Post/PostPicture'
import useData from '@/hooks/useData';
import getShowPost from '@/apis/post/getShowPost';

const App = () => {
    const [params] = useSearchParams()
    const pid = params.get('pid')
    const showPostList = useData(getShowPost, pid).data
    const showPost = showPostList[0]
    const type = showPost?.type
    const showContent = (type) => {
        if (type === 'video') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{showPost.uploader}</span>
                    <span>{showPost.date} 投稿了视频</span>
                    <PostVideo post={showPost.videoList[0]} />
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{showPost.commentCount}</span>
                        <span>{showPost.likeCount}</span>
                    </Flex>
                </Flex>
            )
        } else if (type === 'text') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{showPost.uploader}</span>
                    <span>{showPost.date}</span>
                    <div style={{width:'60%'}}>{showPost.text}</div>
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{showPost.commentCount}</span>
                        <span>{showPost.likeCount}</span>
                    </Flex>
                </Flex>
            )
        } else if (type === 'picture') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{showPost.uploader}</span>
                    <span>{showPost.date}</span>
                    <div style={{width:'60%'}}>
                        <PostPicture post={showPost} />
                    </div>
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{showPost.commentCount}</span>
                        <span>{showPost.likeCount}</span>
                    </Flex>
                </Flex>
            )
        }
    }
    return(
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col span={22}>
                {showContent(type)}
            </Col>
        </Row>
    )
}
export default App
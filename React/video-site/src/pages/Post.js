import React from 'react';
import { useParams } from 'react-router-dom'
import { Flex, Row, Col, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PostVideo from '@/components/feature/Post/PostVideo'
import PostPicture from '@/components/feature/Post/PostPicture'
import useData from '@/hooks/useData';
import getPost from '@/apis/getData/getPost';

const App = () => {
    const { pid } = useParams()
    console.log('postPid:', pid)

    // 获取动态数据
    const post = useData(getPost, pid)?.data
    const type = post?.type
    const showContent = (type) => {
        if (type === 'video') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{post.uploader?.userName}</span>
                    <span>{post.date} 投稿了视频</span>
                    <PostVideo post={post.videoList[0]} />
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{post.commentCount}</span>
                        <span>{post.likeCount}</span>
                    </Flex>
                </Flex>
            )
        } else if (type === 'text') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{post.uploader?.userName}</span>
                    <span>{post.date}</span>
                    <div style={{width:'60%'}}>{post.text}</div>
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{post.commentCount}</span>
                        <span>{post.likeCount}</span>
                    </Flex>
                </Flex>
            )
        } else if (type === 'picture') {
            return (
                <Flex vertical justify="start" gap="middle">
                    <span>{post.uploader?.userName}</span>
                    <span>{post.date}</span>
                    <div style={{width:'60%'}}>
                        <PostPicture post={post} />
                    </div>
                    <Flex justify='space-between'>
                        <span>转发数</span>
                        <span>{post.commentCount}</span>
                        <span>{post.likeCount}</span>
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
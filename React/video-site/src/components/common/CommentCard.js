import React, {useState} from 'react';
import { Flex, Row, Col, Avatar, Typography, Button } from 'antd';
const { Text } = Typography

const App = ({comment}) => {
    const [showSub, setShowSub] = useState('展开')
    const handelShowSub = () => {
        if (showSub === '展开') {
            setShowSub('折叠')
        }else if (showSub === '折叠') {
            setShowSub('展开')
        }
    }
    return(
        <Flex style={{width:'100%', borderLeft:'1px solid blue'}}>
            <div style={{width:'50px'}}>
                <Avatar size={30} src={comment.uploader.profilePictureUrl} />
            </div>
            <div >
                <div><Text strong>{comment.uploader.userName}</Text></div>
                {comment.type === 'picture' && (
                    comment.pictureList.map(i => (
                        <img src={i} style={{width:'75px', aspectRatio:'16/9'}} />
                    ))
                )}
                <div style={{minWidth:'150px'}}>{comment.text}</div>
                <Flex justify="start" gap="middle">
                    <span style={{width:'80px'}}>{comment.date}</span>
                    <span style={{width:'50px'}}>{comment.likeCount}</span>
                    <span style={{width:'50px'}}>点踩</span>
                    <span style={{width:'50px'}}>回复</span>
                </Flex>
                {showSub === '折叠' && (
                    <Row>
                    <Col offset={2}>
                        {comment.subCommentCount !== 0 && (
                            comment.subCommentList.map(i => (
                                <App comment={i} />
                            ))
                        )}
                    </Col>
                    </Row>
                )}
                <Button onClick={handelShowSub}>{showSub}</Button>
            </div>
        </Flex>
    )
}
export default App
import React, {useState, useRef} from 'react';
import { Input, Button, Avatar, List, message, Row, Col, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = () => {
    const selfName = '自己用户名'
    const oldMessage = [
        {id: 1, sender: '对方用户名', content:'111', time: '1-23 9:00'},
        {id: 2, sender: '自己用户名', content:'222', time: '1-23 9:30'}
    ]
    const [message, setMessage] = useState(oldMessage)
    const InputRef = useRef(null)
    const submitMessage = () => {
        const newMessage = InputRef.current.value
        setMessage([
            ...message, 
            {id: message.at(-1).id + 1, sender: selfName, content: newMessage, time: '1-23 9:30'}
        ])
        InputRef.current.value = ''
    }
    return (
        <>
        <List 
            dataSource={message}
            renderItem={(msg) => (
                <>
                {msg.sender != selfName ? ( 
                    <Flex justify="start"> 
                    {/* 当发送者为对方时，在左侧显示信息 */}
                        <Row>
                            <Col span={2}>
                                <Avatar size={20} icon={<UserOutlined />} />
                            </Col>
                            <Col offset={4}>
                                <div>{msg.content}</div>
                                <div>{msg.time}</div>
                            </Col>
                        </Row>
                    </Flex>
                ):(
                    <Flex justify="end">
                    {/* 当发送者为自己时，在右侧显示信息 */}
                        <Row>
                            <Col span={20}>
                                <div>{msg.content}</div>
                                <div>{msg.time}</div>
                            </Col>
                            <Col span={2} offset={2}>
                                <Avatar size={20} icon={<UserOutlined />} />
                            </Col>
                        </Row>
                    </Flex>
                )}
                </>
            )}    
        />
        <input ref={InputRef} style={{width:'100%'}}></input>
        <Flex justify='end'>
            <Button type='primary' onClick={submitMessage}>发送</Button>
        </Flex>
        </>
    )
}
export default App
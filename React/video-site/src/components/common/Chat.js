import React, {useState, useRef} from 'react';
import { Input, Button, Avatar, List, message, Row, Col, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const App = ({dialogue}) => {
    const opponent = dialogue.opponent.userName
    const oldMessage = dialogue.sentences
    const [message, setMessage] = useState(oldMessage)
    const InputRef = useRef(null)
    // const submitMessage = () => {
    //     const newMessage = InputRef.current.value
    //     setMessage([
    //         ...message, 
    //         {id: message.at(-1).id + 1, sender: selfName, content: newMessage, time: '1-23 9:30'}
    //     ])
    //     InputRef.current.value = ''
    // }
    return (
        <>
        <List 
            dataSource={message}
            renderItem={(msg) => (
                <>
                {msg.sender.userName === opponent ? ( 
                    <Flex justify="start"> 
                    {/* 当发送者为对方时，在左侧显示信息 */}
                        <Row>
                            <Col span={2}>
                                <Avatar size={20} src={msg.sender.profilePictureUrl} />
                            </Col>
                            <Col offset={4}>
                                <div>{opponent}</div>
                                <div style={{border:'1px solid black'}}>{msg.text}</div>
                                <div>{msg.date}</div>
                            </Col>
                        </Row>
                    </Flex>
                ):(
                    <Flex justify="end">
                    {/* 当发送者为自己时，在右侧显示信息 */}
                        <Row>
                            <Col span={20}>
                                <div>{msg.sender.userName}</div>
                                <div style={{border:'1px solid black'}}>{msg.text}</div>
                                <div>{msg.date}</div>
                            </Col>
                            <Col span={2} offset={2}>
                                <Avatar size={20} src={msg.sender.profilePictureUrl} />
                            </Col>
                        </Row>
                    </Flex>
                )}
                </>
            )}    
        />
        <input ref={InputRef} style={{width:'100%'}}></input>
        <Flex justify='end'>
            {/* <Button type='primary' onClick={submitMessage}>发送</Button> */}
        </Flex>
        </>
    )
}
export default App
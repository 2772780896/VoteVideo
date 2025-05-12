import TopMenuApp from "@/components/common/TopMenu";
import React from 'react';
import { Col, Row, Button, Form, Flex } from "antd";
import UploadFileListApp from "@/components/common/UploadFlieList";
import UploadTextApp from '@/components/common/UploadText'
import FocusTabsApp from '@/components/feature/FocusTabs'

const App = () => {
    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
            </Col>
            <Col span={20} offset={2}>
                <Form
                    layout="horizontal">
                    <Form.Item>
                        <UploadTextApp />
                    </Form.Item>
                    <Form.Item >
                        <UploadFileListApp />
                    </Form.Item>
                    <Form.Item >
                        <Flex justify="end">
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Flex>
                    </Form.Item>
                </Form>
                <FocusTabsApp />
            </Col>
        </Row>
    )
}
export default App
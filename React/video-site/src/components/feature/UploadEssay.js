import UploadText from '@/components/common/UploadText'
import React from 'react';
import {Form, Button} from 'antd'

const App = () => {
    return (
        <>
        <Form>
            <UploadText />
            <Button type='primary'>
                上传
            </Button>
        </Form>
        </>
    )
}
export default App
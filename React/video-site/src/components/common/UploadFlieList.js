import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Upload, Image, Button } from 'antd'

const App = () => {
    const [fileList, setFileList] = useState([{url:"https://bpic.588ku.com/element_origin_min_pic/23/07/11/d32dabe266d10da8b21bd640a2e9b611.jpg"}])
    const handleChange = (file) => {
        if (file.status === 'done') {
            setFileList(file.fileList)
        }
    }
    const [previewImage, setPreviewImage] = useState()
    const [previewOpen, setPreviewOpen] = useState()
    const handlePreivew = (file) => {
        setPreviewImage(file.url);setPreviewOpen(true)
    }
    const [uploadOpen, setUploadOpen] = useState(false)
    const handleUploadOpen = () => {setUploadOpen(!uploadOpen)}
    const handleRemove = (file) => {
        setFileList(fileList.filter(i => i.url !== file.url))
    }
    return(
        <>
        {uploadOpen && (
            <>
            <Upload 
                action="" 
                listType="picture-card" 
                maxCount={9}
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreivew}
                onRemove={handleRemove}
                >
                {fileList.length <= 9 && (
                    <button
                        style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                        type="button"
                    >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                )}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
            </>
        )}
        <Button type='primary' onClick={handleUploadOpen}>添加图片</Button>
        </>
    )
} 
export default App
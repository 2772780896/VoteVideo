import React, {useState, useRef} from 'react';
import { Upload, Modal, Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import UploadText from '@/components/common/UploadText'

const App = () => {
    // 存放上传的文件
    const [fileList, setFileList] = useState([
        {
            url:"https://cdn.pixabay.com/video/2025/04/29/275633_large.mp4",
            thumbUrl: 'https://bpic.588ku.com/element_origin_min_pic/23/07/11/d32dabe266d10da8b21bd640a2e9b611.jpg'
        }
    ])

    // 上传成功后更新文件列表
    const handleChange = (file) => {
        if (file.status === 'done') {
            setFileList(file.fileList)
        }
        console.log(fileList.length)
    }

    // 控制预览的文件的显示
    const [previewVideo, setPreviewVideo] = useState()
    const [previewOpen, setPreviewOpen] = useState()
    const handlePreivew = (file) => {
        setPreviewVideo(file.url)
        setPreviewOpen(true)
    }
    const handleCancel = () => {
        setPreviewOpen(false);
    };

    // 控制文件列表中文件的删除
    const handleRemove = (file) => {
        setFileList(fileList.filter(i => i.url !== file.url))
    }

    // 将视频中的指定帧截下来
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const getCover = () => {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageUrl = canvas.toDataURL('image/jpeg')
        setFileList(
            fileList.map(i => ({
                ...i,
                cover: imageUrl,
                thumbUrl: imageUrl
            }))
        )
    }

    // 单独控制封面的上传
    const handleCoverChange = (file) => {
        if (file.status === 'done') {
            setFileList(
                fileList.map(i => ({
                    ...i,
                    cover:file.url,
                    thumbUrl:file.url
                })
            )
            )
        }
    }

    // 控制截图按钮的显示
    const [coverPreview, setCoverPreview] = useState('none')
    const handleCoverPreview = (file) => {
        handlePreivew(file)
        setCoverPreview('inline-flex')
    }

    return (
        <Form>
            <div>上传视频</div>
            <Upload 
                action="" 
                accept='video/*'
                listType="picture-card" 
                fileList={fileList}
                maxCount={1}
                onChange={handleChange}
                onPreview={handlePreivew}
                onRemove={handleRemove}
                >
                {fileList.length < 1 && (
                    <button
                        style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                        type="button"
                    >
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </button>
                )}
            </Upload>
            {previewVideo && (
                <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                    <video 
                        controls 
                        style={{width:'100%', aspectRatio: '16/9'}}
                        ref={videoRef}
                        poster={fileList[0].cover}
                        crossOrigin="anonymous">
                        <source src={previewVideo} />
                    </video>
                    <canvas ref={canvasRef} style={{display:'none'}}></canvas>
                    <button onClick={getCover} style={{display: coverPreview}}>截取封面</button>
                </Modal>
            )}
            <div>选择封面</div>
            <Button type='primary' onClick={() => {handleCoverPreview(fileList[0])}}>从视频中截取封面</Button>
            <br></br>
            <Upload 
                listType='text'
                onChange={handleCoverChange}
                action="" >
                <Button type='primary'>从本地文件中上传封面</Button>
            </Upload>
            <div>编辑简介</div>
            <UploadText />
            <Button type="primary" htmlType="submit">
                提交
            </Button>
        </Form>
    )
}
export default App
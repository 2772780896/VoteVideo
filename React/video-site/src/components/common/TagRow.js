import React, {useState} from 'react';
import { Button, Flex, Tag, Row, Col } from 'antd';
import TagPopover from '@/components/common/TagPopover'

const App = () => {
  const tagItem = [1,2,3,4,5,6,7,8,9,10]
  const [showOmission, setShowOmission] = useState(false)
  const displayTag = (showOmission) => {
    setShowOmission(!showOmission)
  }
  const showTag = (tagItem) => {
    const sliceItem = tagItem.slice(0,8)
    return sliceItem.map(() => (
        <Col span={3}>
            <TagPopover />
        </Col>
    ))
  }
  const showOmissionTag = (tagItem) => {
    const sliceItem = tagItem.slice(8)
    return sliceItem.map(() => (
        <Col span={3}>
            <TagPopover />
        </Col>
    ))
  }
  return (
    <Row>
    <Col span={20}>
      <Row justify='start'>
        {showTag(tagItem)}
        {showOmission && showOmissionTag(tagItem)}
      </Row>
    </Col>
    <Col span={4}>
      {tagItem.length > 8 && (
        <Button onClick={() => displayTag(showOmission)}>
          {showOmission ? '隐藏' : '展开'}
        </Button>
      )}
    </Col>
    </Row>
  )
}

export default App;
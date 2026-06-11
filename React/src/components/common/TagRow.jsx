import React, {useState, useMemo} from 'react';
import { Button, Flex, Tag, Row, Col } from 'antd';
import TagPopover from '@/components/common/TagPopover'

const App = ({tagList}) => {
  const dataList = useMemo(() => (
    tagList?.map(i => (
      <TagPopover key={i?.tid} tag={i} />
    )
  )), [tagList])
  const [showTag, setShowTag] = useState(false)
  const displayTag = () => {setShowTag(!showTag)}
  return (
    <Row>
    <Col span={20}>
      <Row justify='start'>
        {dataList?.slice(0, 6)}
        {showTag && dataList?.slice(6)}
      </Row>
    </Col>
    <Col span={4}>
      {dataList?.length > 8 && (
        <Button onClick={() => displayTag(showTag)}>
          {showTag ? '隐藏' : '展开'}
        </Button>
      )}
    </Col>
    </Row>
  )
}

export default App;
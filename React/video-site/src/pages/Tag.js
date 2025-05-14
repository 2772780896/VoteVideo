import React, {useState} from 'react';
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import SearchSortDropdownApp from '@/components/feature/SearchSortDropdown'


const App = () => {
  const [sort, setSort] = useState()
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>标签名</h1>
        <SearchSortDropdownApp pushSort={setSort} />
        <CommentFlexApp sort={sort} />
      </Col>
    </Row>
  )
}
export default App
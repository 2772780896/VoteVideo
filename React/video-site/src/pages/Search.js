import React from 'react';
import {Row, Col} from 'antd'
import SearchInputApp from '@/components/common/SearchInput'
import TopMenuApp from "@/components/common/TopMenu";
import SearTypeTableApp from '@/components/feature/Search/SearchTypeTabs'

const App = () => {
    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
            </Col>
            <Col span={10} offset={7}>
                <SearchInputApp />
            </Col>
            <Col span={20} offset={2}>
                <SearTypeTableApp />
            </Col>
        </Row>
    )
}
export default App
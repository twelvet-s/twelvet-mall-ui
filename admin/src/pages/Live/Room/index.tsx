import React from 'react'

import styles from './index.css'
import Video from './Video'
import RightTool from './RightTool'
import { PageContainer } from '@ant-design/pro-components'
import BottomTool from './BottomTool'
import { Row, Col } from 'antd'

const Live: React.FC = () => {

    return (
        <PageContainer>
            <Row gutter={{ sm: 15 }}>
                <Col sm={18} xs={24}>
                    <div className={styles.liveCtn}>
                        <div className={styles.liveCtnVideo}>
                            <Video />
                        </div>
                        <div className={styles.liveCtnOption}>
                            <BottomTool />
                        </div>
                    </div>
                </Col>
                <Col sm={6} xs={24}>
                    <div className={styles.rightTool}>
                        <RightTool />
                    </div>
                </Col>
            </Row>
        </PageContainer>
    )
}

export default Live

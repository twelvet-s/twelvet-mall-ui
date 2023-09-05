import React from 'react'

import styles from './style.module.css'
import Video from './Video'
import RightTool from './RightTool'
import BottomTool from './BottomTool'
import { Row, Col, Divider } from 'antd'

const Live: React.FC = () => {

    return (
        <>
            <Divider />
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
        </>

    )
}

export default Live

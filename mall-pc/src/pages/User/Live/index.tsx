import React, { useRef } from 'react'

import styles from './style.module.css'
import Video from './Video'
import RightTool from './RightTool'
import BottomTool from './BottomTool'
import { Row, Col, Divider } from 'antd'
import LiveContextProvider from './LiveContextProvider'

const Live: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null)

    return (
        <>
            <Divider />
            <Row gutter={{ sm: 15 }}>
                <Col sm={18} xs={24}>
                    <div className={styles.liveCtn}>
                        <div className={styles.liveCtnVideo}>
                            <video ref={videoRef} autoPlay={false} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className={styles.liveCtnOption}>
                            <LiveContextProvider>
                                <BottomTool />
                            </LiveContextProvider>
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

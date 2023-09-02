import React, { useState } from 'react'

import './index.css'
import { Button, Col, Modal, Row } from 'antd'
import Video from './Video'
import Chat from './Chat'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'

const { confirm } = Modal;

const Live: React.FC = () => {

    // 是否开启直播
    const [initLive, setInitLive] = useState<boolean>(false)

    /**
     * 开始直播
     */
    const handleLiveStart = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: '是否确认发起直播',
            onOk() {
                setInitLive(true)
            },
        });
    }

    return (
        <PageContainer>
            {
                initLive ? (
                    <Row gutter={{ sm: 15 }}>
                        <Col sm={18} xs={24}>
                            <div id='live-ctn'>
                                <div id='live-ctn-header'></div>
                                <div id='live-ctn-video'>
                                    <Video />
                                </div>
                                <div id='live-ctn-option'></div>
                            </div>
                        </Col>
                        <Col sm={6} xs={24}>
                            <div id='chat-ctn'>
                                <Chat />
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Button onClick={handleLiveStart}> 发起直播</Button>
                )
            }
        </PageContainer>
    )
}

export default Live

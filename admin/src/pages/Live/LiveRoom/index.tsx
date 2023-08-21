import React, { useState } from 'react'

import './index.css'
import { Button, Col, Modal, Row } from 'antd'
import Video from './Video'
import Chat from './Chat'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'

const Live: React.FC = () => {

    const { confirm } = Modal;

    // 是否开启直播
    const [initLive, setInitLive] = useState<boolean>(false)

    return (
        <PageContainer>
            {
                initLive ? (
                    <Row gutter={{ sm: 15 }}>
                        <Col sm={18} xs={24}>
                            <div id='live-ctn'>
                                <div id='live-ctn-header'></div>
                                <div id='live-ctn-video'>
                                    <Video live={initLive} />
                                </div>
                                <div id='live-ctn-option'></div>
                            </div>
                        </Col>
                        <Col sm={6} xs={24}>
                            <div id='chat-ctn'>
                                <Chat live={initLive} />
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Button onClick={() => {
                        confirm({
                            icon: <ExclamationCircleOutlined />,
                            content: '是否确认发起直播',
                            onOk() {
                                setInitLive(true)
                            },
                          });
                    }}> 发起直播</Button>
                )
            }
        </PageContainer>
    )
}

export default Live

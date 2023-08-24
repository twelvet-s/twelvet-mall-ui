import React, { useState } from 'react'

import './index.css'
import { Button, Col, Divider, Input, Row, Space } from 'antd'
import Video from './Video'
import Chat from './Chat'

const Live: React.FC = () => {

    const [inputFlvSource, setInputFlvSource] = useState<string>()

    const [flvSource, setFlvSource] = useState<string>('')

    return (
        <>
            <Divider />
            <Row gutter={{ sm: 15 }}>
                <Col sm={18} xs={24}>
                    <div id='live-ctn'>
                        <div id='live-ctn-header'>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input onChange={e => {
                                    setInputFlvSource(e.target.value)
                                }} placeholder='请输入FLV格式播放源，进行直播' />
                                <Button type="primary" onClick={() => {
                                    if (inputFlvSource) {
                                        setFlvSource(inputFlvSource)
                                    }

                                }}>播放</Button>
                            </Space.Compact>
                        </div>
                        <div id='live-ctn-video'>
                            <Video flvSource={flvSource} />
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
        </>
    )
}

export default Live

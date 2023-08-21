import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import { Avatar, Button, Col, Divider, Input, Row, Space, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Video from './Video'
import Chat from './Chat'

const Live: React.FC = () => {


    return (
        <>
            <Divider />
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
        </>
    )
}

export default Live

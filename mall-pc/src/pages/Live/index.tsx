import React, {  } from 'react'

import './index.css'
import { Col, Divider, Row } from 'antd'
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

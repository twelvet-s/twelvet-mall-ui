import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import { Avatar, Button, Col, Divider, Input, Row, Space, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'

interface VideoProps {
    live: boolean
}

const Video: React.FC<VideoProps> = props => {

    const { live } = props

    useEffect(() => {
        // 打开摄像头开始获取视频流

        
    }, [])

    return (
        <>
            视频播放{live}
        </>
    )
}

export default Video

import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import { Avatar, Button, Col, Divider, Input, Row, Space, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'

interface ChatProps {
    live: boolean
}

const Chat: React.FC<ChatProps> = props => {

    const { live } = props

    return (
        <>
            聊天室{live}
        </>
    )
}

export default Chat

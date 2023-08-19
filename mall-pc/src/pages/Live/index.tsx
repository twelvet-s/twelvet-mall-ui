import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import { Avatar, Button, Divider, Input, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const Live: React.FC = () => {

    const [chatList, setChatList] = useState<{
        self: boolean
        username: string
        info: string
    }[]>([])

    const [chatInfo, setChatInfo] = useState<string>('')

    const [username, setUsername] = useState<string>('')

    const chatListRef = useRef<HTMLDivElement>(null)

    const [webSocket, setWebSocket] = useState<WebSocket>()


    /**
     * 监听参数变化
     */
    useEffect(() => {
        // 移动聊天框Y轴到最后
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current?.scrollHeight;
        }
    }, [chatList])

    /**
     * TODO 用户登录名称
     */
    useEffect(() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        setUsername(`${result}`)

        // 创建WebSocket
        const socket = new WebSocket('ws://127.0.0.1:8080/im')
        // 监听消息接收事件
        socket.onmessage = (event: MessageEvent) => {
            const message = event.data as string;

            const msg = JSON.parse(message) as { self: boolean, username: string, info: string }

            const info: {
                self: boolean
                username: string
                info: string
            } = {
                self: false,
                username: msg.username,
                info: msg.info
            }

            handleAddChatInfo(info)

        }
        setWebSocket(socket)
    }, [])

    /**
     * 处理添加内容
     * @param info 添加内容
     */
    const handleAddChatInfo = (
        info: {
            self: boolean
            username: string
            info: string
        }
    ) => {
        setChatList(prevChatList => [
            ...prevChatList,
            info
        ])
    }

    /**
     * 发送消息
     */
    const send = () => {
        if (chatInfo) {

            const info: {
                self: boolean
                username: string
                info: string
            } = {
                self: true,
                username,
                info: chatInfo
            }

            // 发送信息
            if (webSocket && webSocket.readyState === WebSocket.OPEN) {
                webSocket.send(JSON.stringify(info))
            }

            handleAddChatInfo(info)

            // 清空聊天框信息
            setChatInfo('')
        } else {
            alert('不能发送空白消息')
        }
    }

    return (
        <>
            <Divider />
            <div id='chat-ctn'>
                <div id='chat-list' ref={chatListRef}>
                    <ul>
                        {
                            chatList.map((chat, index) => {
                                if (chat.self) {
                                    return (
                                        <li className='chat-list-right' key={index}>
                                            <Avatar className='chat-list-avatar' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                            <div className='chat-list-ctn'>
                                                <Tooltip placement='top' title={chat.username}>
                                                    <span className='chat-list-name'>{chat.username}</span>
                                                </Tooltip>

                                                <span className='chat-list-info'>
                                                    {chat.info}
                                                </span>
                                            </div>
                                        </li>
                                    )
                                } else {
                                    return (
                                        <li className='chat-list-left' key={index}>
                                            <Avatar className='chat-list-avatar' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                            <div className='chat-list-ctn'>
                                                <Tooltip placement='top' title={chat.username}>
                                                    <span className='chat-list-name'>{chat.username}</span>
                                                </Tooltip>

                                                <span className='chat-list-info'>
                                                    {chat.info}
                                                </span>
                                            </div>
                                        </li>
                                    )
                                }
                            })
                        }

                    </ul>
                </div>

                <div id='chat-input-box'>
                    <Input.TextArea
                        id='chat-input'
                        value={chatInfo}
                        // 回车发送信息
                        onPressEnter={(e) => {
                            // 阻止默认的回车行为
                            e.preventDefault();
                            send()
                        }}
                        onChange={(e) => {
                            setChatInfo(e.target.value)
                        }}
                    />
                    <Button id='chat-send' onClick={send}>Send</Button>
                </div>
            </div>
        </>
    )
}

export default Live

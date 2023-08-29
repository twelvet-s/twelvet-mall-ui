import React, { useEffect, useRef } from 'react'

import './index.css'

interface VideoProps {
    liveType: 'video' | 'shareScreen'
}

const Video: React.FC<VideoProps> = porps => {

    // 发起的直播类型
    const { liveType } = porps

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (liveType === 'video') { // 视频直播
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // 获取用户媒体设备的权限
                navigator.mediaDevices.getUserMedia({
                    video: true
                })
                    .then((stream) => {
                        // 将摄像头画面流附加到 video 元素
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream
                        }

                    })
                    .catch((error) => {
                        console.error("Error accessing camera:", error);
                    });
            } else {
                // 浏览器不支持 getUserMedia
                alert('浏览器不支持')
            }
        } else if (liveType === 'shareScreen') { // 共享屏幕直播
            const startScreenSharing = async () => {
                try {
                    if (videoRef.current) {
                        const stream = await navigator.mediaDevices.getDisplayMedia();
                        videoRef.current.srcObject = stream;
                    }

                } catch (error) {
                    console.error('Error accessing screen:', error);
                }
            }
            startScreenSharing()

        }

    }, [])

    return (
        <>
            <video ref={videoRef} controls autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </>
    )
}

export default Video

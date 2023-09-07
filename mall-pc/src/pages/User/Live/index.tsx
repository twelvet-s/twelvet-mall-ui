import React, { useEffect, useRef, useState } from 'react'

import styles from './style.module.css'
import { Row, Col, Divider } from 'antd'
import BottomTool from './BottomTool'
import RightTool from './RightTool'
import Video from './Video'

const Live: React.FC = () => {

    // WebRTC
    const rtcPeerConnection = new RTCPeerConnection()

    // 本地播放器
    const videoRef = useRef<HTMLVideoElement>(null)

    // 是否开启直播 0: 初始化 1：开启,2：关闭
    const [liveStatus, setLiveStatus] = useState<0 | 1 | 2>(0)

    // 设置直播状态
    const handleLiveStatus = (liveStatus: 1 | 2) => {
        setLiveStatus(liveStatus)
    }

    // 播放码率
    const [playbackRate, setPlaybackRate] = useState<number>(4000)

    // 分辨率
    const [resolutionRatio, setResolutionRatio] = useState<1080 | 720>(1080)

    // 直播素材
    const [liveStreamingMaterials, setLiveStreamingMaterials] = useState<{
        title: string,
    }[]>([
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
        {
            title: '自行车自自行车自自行'
        },
    ])

    // 直播弹幕
    const [bulletList, setBulletList] = useState<{
        username: string,
        info: string,
    }[]>([
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
        {
            username: 'twelvet-s',
            info: '你好，进入直播观看'
        },
    ])

    // 使用webrtc发送数据
    const startScreenSharing = async (stream: MediaStream) => {
        rtcPeerConnection.addTransceiver("audio", { direction: "sendonly" })
        rtcPeerConnection.addTransceiver("video", { direction: "sendonly" })

        // 添加流
        // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
        stream.getTracks().forEach(function (track: MediaStreamTrack) {
            rtcPeerConnection.addTrack(track)

            // Notify about local track when stream is ok.
            //mediaStream.addTrack(track)
        })

        // 创建offer并设置本地
        const offer = await rtcPeerConnection.createOffer()
        await rtcPeerConnection.setLocalDescription(offer)

        // 发送数据
        const response: {
            sdp: string
        } = await fetch(`http://127.0.0.1:1985/rtc/v1/publish/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/jsoncharset=UTF-8'
            },
            body: JSON.stringify({
                sdp: offer.sdp,
                streamurl: '/live/livestream/1'
            }),
        }).then(res => {
            return res.json()
        })


        // 设置远程sdp
        await rtcPeerConnection.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: response.sdp })
        )

    }


    // 生成video，canvas需要基于video进行绘制
    const genVideo = (stream: MediaProvider | null, width: number, height: number) => {
        const videoEl = document.createElement('video')
        videoEl.autoplay = true
        videoEl.srcObject = stream
        videoEl.width = width
        videoEl.height = height
        videoEl.play().then(() => {
            // 使用 Promise 解析后的结果进行操作
        }).catch(() => {
            // 处理 Promise 拒绝时的错误
        })
        return videoEl
    }


    // 开始直播
    const startLive = async () => {
        const canvas = document.createElement('canvas')

        canvas.width = videoRef.current!.offsetWidth
        canvas.height = videoRef.current!.offsetHeight
        const canvasContext = canvas.getContext('2d')

        const condition = false
        if (condition) {
            if (!canvasContext) { return }
            // 获取用户媒体设备的权限
            // 麦克风
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            })

            // 摄像头
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
            // 生成视频流
            const cameraVideo = genVideo(videoStream, canvas.width, canvas.height)

            const drawFrame = () => {
                if (!canvasContext) { return }
                canvasContext?.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height)


                canvasContext.font = "40px Microsoft YaHei"
                canvasContext.fillStyle = "#409eff"
                canvasContext.textAlign = "center"
                // 添加文字和位置
                canvasContext.fillText("twelvet", 200, 50)
                requestAnimationFrame(drawFrame)
            }
            drawFrame()


            // 只播放摄像头的流
            // videoRef.current!.srcObject = canvas.captureStream()
            // videoRef.current!.play().then(() => {
            //     console.log('开始播放')
            // }).catch(e => {
            //     console.log(e)
            // })

            // 合流
            const mergedStream = new MediaStream()
            audioStream.getAudioTracks().forEach(track => mergedStream.addTrack(track))
            //videoStream.getVideoTracks().forEach(track => mergedStream.addTrack(track))
            canvas.captureStream().getVideoTracks().forEach(track => mergedStream.addTrack(track))

            // 定义动画函数，在每一帧上绘制视频图像
            // const drawFrame = () => {
            //     canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height)
            //     // 传输canvas画像
            //     canvas.captureStream().getVideoTracks().forEach(track => mergedStream.addTrack(track))
            //     requestAnimationFrame(drawFrame)
            // }
            // drawFrame()



            startScreenSharing(mergedStream).then(() => {
                // 使用 Promise 解析后的结果进行操作
            }).catch(() => {
                // 处理 Promise 拒绝时的错误
            })

        } else {
            // 开启共享桌面直播
            const displayMediastream = await navigator.mediaDevices.getDisplayMedia()

            // 生成视频流
            const cameraVideo = genVideo(displayMediastream, canvas.width, canvas.height)

            const drawFrame = () => {
                if (!canvasContext) { return }
                canvasContext.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height)


                canvasContext.font = "40px Microsoft YaHei"
                canvasContext.fillStyle = "#409eff"
                canvasContext.textAlign = "center"
                // 添加文字和位置
                canvasContext.fillText("twelvet", 200, 50)
                requestAnimationFrame(drawFrame)
            }
            drawFrame()

            // 本地播放
            videoRef.current!.srcObject = canvas.captureStream()
            videoRef.current!.play().then(() => {
                console.log('开始播放')
            }).catch(e => {
                console.log(e)
            })

            startScreenSharing(canvas.captureStream()).then(() => {
                // 使用 Promise 解析后的结果进行操作
            }).catch(() => {
                // 处理 Promise 拒绝时的错误
            })

        }

    }

    // 关闭直播
    const closeLive = () => {
        alert('关闭直播')
    }

    // 监控直播的开关
    useEffect(() => {
        if (liveStatus === 1) { //开始直播
            startLive().then(() => {
                console.log('开始直播')
            }).catch(e => {
                console.log(e)
            })
        } else if (liveStatus === 2) {// 关闭直播
            closeLive()
        }
    }, [liveStatus])

    return (
        <>
            <Divider />
            <Row gutter={{ sm: 15 }}>
                <Col sm={18} xs={24}>
                    <div className={styles.liveCtn}>
                        <div className={styles.liveCtnVideo}>
                            <Video ref={videoRef} />
                        </div>
                        <div className={styles.liveCtnOption}>
                            <BottomTool handleLiveStatus={handleLiveStatus} />
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

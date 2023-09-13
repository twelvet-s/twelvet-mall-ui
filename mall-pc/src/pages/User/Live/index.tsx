import React, { useEffect, useRef, useState } from 'react'

import styles from './style.module.css'
import { Row, Col, Divider } from 'antd'
import BottomTool from './BottomTool'
import RightTool from './RightTool'
import { createVideo } from '../../../utils/videoUtils'
import { fabric } from 'fabric'
import LiveContext, { LiveStreamingMaterial } from './LiveContextProvider'

const Live: React.FC = () => {

    const [fabricCanvas, setFabricCanvas] = useState()

    // WebRTC
    const rtcPeerConnection = new RTCPeerConnection()

    // 本地播放器容器
    const videoCtnRef = useRef<HTMLDivElement>(null)

    // 本地播放器
    const videoRef = useRef<HTMLCanvasElement>(null)

    // 是否开启直播 0: 初始化 1：开启,2：关闭
    const [liveStatus, setLiveStatus] = useState<0 | 1 | 2>(0)

    // 容器大小
    const [wrapSize, setWrapSize] = useState<{
        width: number,
        height: number,
    }>({
        width: 0,
        height: 0,
    })

    // 分辨率
    const resolutionRatios = [
        { value: 360, label: '360P' },
        { value: 540, label: '540P' },
        { value: 720, label: '720P' },
        { value: 1080, label: '1080P' },
    ]

    // 设置直播状态
    const handleLiveStatus = (liveStatus: 1 | 2) => {
        setLiveStatus(liveStatus)
    }

    // 播放码率
    const [playbackRate, setPlaybackRate] = useState<number>(4000)

    // 分辨率
    const [resolutionRatio, setResolutionRatio] = useState<1080 | 720>(1080)

    // 直播素材
    const [liveStreamingMaterials, setLiveStreamingMaterials] = useState<LiveStreamingMaterial[]>([
        {
            id: '1',
            disabled: false,
            title: '自行车自自行车自自行'
        },
        {
            id: '2',
            disabled: true,
            title: '自行车自自行车自自行'
        },
    ])

    // 处理直播素材
    const handleLiveStreamingMaterials = (liveStreamingMaterials: { title: string }[]) => {
        setLiveStreamingMaterials(liveStreamingMaterials)
    }

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
        videoRef.current.captureStream().getTracks().forEach((track: MediaStreamTrack) => {
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

    // 监控渲染canvas
    useEffect(() => {
        console.log('重新渲染直播流')
    }, [liveStreamingMaterials])

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

            // // 开启共享桌面直播
            const event = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    deviceId: "",
                    // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
                },
                audio: true,
            })



            console.log('==========', event.getVideoTracks())

            const mediaName = '窗口名称'
            const screen = '窗口'

            // 视频
            const videoTrack = {
                id: 1,
                audio: 2,
                video: 1,
                mediaName: mediaName,
                type: screen,
                track: event.getVideoTracks()[0],
                trackid: event.getVideoTracks()[0].id,
                stream: event,
                streamid: event.id,
                hidden: false,
                muted: false,
                scaleInfo: {},
            };

            videoTrack.audio = 1
            videoTrack.volume = 60

            const audio = event.getAudioTracks();
            if (audio.length) {
                // 音频
                const audioTrack = {
                    id: videoTrack.id,
                    audio: 1,
                    video: 2,
                    mediaName: mediaName,
                    type: screen,
                    track: event.getAudioTracks()[0],
                    trackid: event.getAudioTracks()[0].id,
                    stream: event,
                    streamid: event.id,
                    hidden: true,
                    muted: false,
                    volume: videoTrack.volume,
                    scaleInfo: {},
                };
            }


            // 生成视频流
            //const cameraVideo = genVideo(event, canvas.width, canvas.height)
            const { canvasDom, videoEl, scale } = await autoCreateVideo({
                stream: event,
                id: videoTrack.id,
            })
            startScreenSharing()
            // canvasDom.canvas.getTracks().forEach((track) => {
            //     console.log('插入track', track);
            // })

            // const videoEl = createVideo({ appendChild: true })
            // videoEl.srcObject = event
            // await new Promise((resolve) => {
            //     videoEl.onloadedmetadata = () => {
            //         const width = event.getVideoTracks()[0].getSettings().width!
            //         const height = event.getVideoTracks()[0].getSettings().height!
            //         const ratio = handleLcale({ width, height })
            //         videoEl.width = width
            //         videoEl.height = height

            //         // 创建 Fabric 的 Image 对象
            //         const canvasDom = new fabric.Image(videoEl, {
            //             left: 0,
            //             top: 0,
            //             width: 1000,
            //             height: 1000,
            //         })

            //         // 处理缩放
            //         handleLcaling({ canvasDom, id: item.id });

            //         canvasDom.scale(ratio / window.devicePixelRatio);
            //         // 将 Image 对象添加到 Fabric 画布中
            //         fabricCanvas.add(canvasDom);

            //         resolve({ videoEl });
            //     };
            // });

            // const drawFrame = () => {
            //     if (!canvasContext) { return }
            //     canvasContext.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height)


            //     canvasContext.font = "40px Microsoft YaHei"
            //     canvasContext.fillStyle = "#409eff"
            //     canvasContext.textAlign = "center"
            //     // 添加文字和位置
            //     canvasContext.fillText("twelvet", 200, 50)


            //     requestAnimationFrame(drawFrame)
            // }
            // drawFrame()

            // // 本地播放
            // // videoRef.current!.srcObject = canvas.captureStream()
            // // videoRef.current!.play().then(() => {
            // //     console.log('开始播放')
            // // }).catch(e => {
            // //     console.log(e)
            // // })



            // startScreenSharing(canvas.captureStream()).then(() => {
            //     // 使用 Promise 解析后的结果进行操作
            // }).catch(() => {
            //     // 处理 Promise 拒绝时的错误
            // })

        }

    }

    const handleLcale = ({ width, height }: { width: number; height: number }) => {
        const resolutionHeight =
            resolutionRatios[3].value * window.devicePixelRatio;
        const resolutionWidth =
            resolutionRatios[3].value *
            window.devicePixelRatio *
            (16 / 9);
        let ratio = 1;
        if (width > resolutionWidth) {
            const r1 = resolutionWidth / width;
            ratio = r1;
        }
        if (height > resolutionHeight) {
            const r1 = resolutionHeight / height;
            if (ratio > r1) {
                ratio = r1;
            }
        }
        return ratio;
    }

    // 处理移动记录坐标
    const handleLoving = ({
        canvasDom,
        id,
    }: {
        canvasDom: fabric.Image | fabric.Text;
        id: string;
    }) => {
        // 监控拖动canvas记录坐标
        canvasDom.on('moving', () => {
            console.log(
                'moving',
                canvasDom.width,
                canvasDom.height,
                canvasDom.scaleX,
                canvasDom.scaleY
            );
            console.log(`TOP: ${canvasDom.top}, Left ${canvasDom.left}`)
        });

    }

    // 处理缩放记录坐标
    const handleLcaling = ({ canvasDom, id }) => {
        canvasDom.on('scaling', () => {
            console.log(
                'scaling',
                canvasDom.width,
                canvasDom.height,
                canvasDom.scaleX,
                canvasDom.scaleY
            );
        });
    }

    const autoCreateVideo = ({
        stream,
        id,
        rect,
        muted,
    }: {
        stream: MediaStream;
        id: number;
        rect?: { left: number; top: number };
        muted?: boolean;
    }) => {
        const videoEl = createVideo({ appendChild: true });
        if (muted !== undefined) {
            videoEl.muted = muted;
        }
        videoEl.srcObject = stream;
        return new Promise<{
            canvasDom: fabric.Image;
            videoEl: HTMLVideoElement;
            scale: number;
        }>((resolve) => {
            videoEl.onloadedmetadata = () => {
                const width = stream.getVideoTracks()[0].getSettings().width!;
                const height = stream.getVideoTracks()[0].getSettings().height!;
                const ratio = handleLcale({ width, height });
                videoEl.width = width;
                videoEl.height = height;

                const canvasDom = new fabric.Image(videoEl, {
                    top: rect?.top || 0,
                    left: rect?.left || 0,
                    width,
                    height,
                })

                handleLoving({ canvasDom, id });
                handleLcaling({ canvasDom, id });
                canvasDom.scale(ratio / window.devicePixelRatio);
                fabricCanvas.add(canvasDom);

                resolve({ canvasDom, scale: ratio, videoEl });
            };
        });
    }


    const changeCanvasStyle = () => {
        // @ts-ignore
        fabricCanvas.wrapperEl.style.width = `${wrapSize.width}px`;
        // @ts-ignore
        fabricCanvas.wrapperEl.style.height = `${wrapSize.height}px`;
        // @ts-ignore
        fabricCanvas.lowerCanvasEl.style.width = `${wrapSize.width}px`;
        // @ts-ignore
        fabricCanvas.lowerCanvasEl.style.height = `${wrapSize.height}px`;
        // @ts-ignore
        fabricCanvas.upperCanvasEl.style.width = `${wrapSize.width}px`;
        // @ts-ignore
        fabricCanvas.upperCanvasEl.style.height = `${wrapSize.height}px`;
    }

    const renderAll = () => {
        fabricCanvas.renderAll()
        requestAnimationFrame(renderAll)
    }

    // 定时渲染画面
    const renderFrame = () => {
        renderAll()
    }

    // 关闭直播
    const closeLive = () => {
        alert('关闭直播')
    }

    const init = () => {
        const resolutionHeight =
            resolutionRatios[3].value / window.devicePixelRatio;
        const resolutionWidth =
            (resolutionRatios[3].value / window.devicePixelRatio) *
            (16 / 9);
        const wrapWidth = videoCtnRef.current!.getBoundingClientRect().width;
        //const wrapWidth = 1920;
        const ratio = wrapWidth / resolutionWidth;
        const wrapHeight = resolutionHeight * ratio;
        // 创建一个Canvas实例
        const videoCanvas = new fabric.Canvas(videoRef.current)

        videoCanvas.setWidth(resolutionWidth)
        videoCanvas.setHeight(resolutionHeight)
        videoCanvas.setBackgroundColor('black');
        setWrapSize({
            width: wrapWidth,
            height: wrapHeight
        })
        setFabricCanvas(videoCanvas)
    }

    // 监控直播的开关
    useEffect(() => {
        if (liveStatus === 1) { //开始直播
            startLive().then(() => {
                console.log('开始直播')
            }).catch(e => {
                console.log(e)
            })
        } else if (liveStatus === 2) { // 关闭直播
            closeLive()
        }
    }, [liveStatus])

    useEffect(() => {
        init()
    }, [])

    useEffect(() => {
        if (fabricCanvas) {
            // 定时渲染
            renderFrame()
            // 改变大小
            changeCanvasStyle()
        }
    }, [fabricCanvas])

    return (
        <>
            <Divider />
            <Row gutter={{ sm: 15 }}>
                <Col sm={18} xs={24}>
                    <div className={styles.liveCtn}>
                        <div ref={videoCtnRef} className={styles.liveCtnVideo} >
                            <canvas ref={videoRef} id="videoCanvas"></canvas>

                        </div>
                        <div className={styles.liveCtnOption}>
                            <BottomTool handleLiveStatus={handleLiveStatus} />
                        </div>
                    </div>
                </Col>
                <Col sm={6} xs={24}>
                    <div className={styles.rightTool}>
                        <LiveContext.Provider value={{
                            liveStreamingMaterials,
                            handleLiveStreamingMaterials
                        }}>
                            <RightTool />
                        </LiveContext.Provider>
                    </div>
                </Col>
            </Row>
        </>

    )
}

export default Live

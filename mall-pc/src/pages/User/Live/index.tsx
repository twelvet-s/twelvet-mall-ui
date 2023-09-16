import React, { useEffect, useRef, useState } from 'react'

import styles from './style.module.css'
import { Row, Col, Divider } from 'antd'
import BottomTool from './BottomTool'
import RightTool from './RightTool'
import { createVideo } from '../../../utils/videoUtils'
import { fabric } from 'fabric'
import LiveContext, { LiveStreamingMaterial } from './LiveContextProvider'
import { MaterialTypeEnum } from './RightTool/MaterialList/AddMaterial/interface'

const Live: React.FC = () => {

    // 分辨率比例
    const resolutionScale = 16 / 9

    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas>()

    // WebRTC
    const [rtcPeerConnection, setRtcPeerConnection] = useState<RTCPeerConnection>()

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

    // 当前码率
    const [bitrate, setBitrate] = useState<number>(1000)

    // 设置直播状态
    const handleLiveStatus = () => {
        setLiveStatus((liveStatus === 0 || liveStatus === 2) ? 1 : 2)
    }

    // 播放码率
    const [playbackRate, setPlaybackRate] = useState<number>(4000)

    // 分辨率
    const [resolutionRatio, setResolutionRatio] = useState<number>(1080)

    // 直播素材
    const [liveStreamingMaterials, setLiveStreamingMaterials] = useState<LiveStreamingMaterial[]>([])

    // 处理直播素材
    const handleLiveStreamingMaterials = (liveStreamingMaterial: LiveStreamingMaterial, type: 'update' | 'add') => {
        if (type === 'add') {
            // 生成canvas
            genCanvas(liveStreamingMaterial).then(canvasData => {
                // 保存媒体类型，用于删除
                if (
                    liveStreamingMaterial.type === MaterialTypeEnum.SCREEN ||
                    liveStreamingMaterial.type === MaterialTypeEnum.AUDIO ||
                    liveStreamingMaterial.type === MaterialTypeEnum.VIDEO
                ) {
                    liveStreamingMaterial.canvasDom = canvasData?.canvasDom
                    liveStreamingMaterial.videoEl = canvasData?.videoEl
                    liveStreamingMaterial.videoStream = canvasData?.videoStream
                }

                // 设置数据
                setLiveStreamingMaterials([...liveStreamingMaterials, liveStreamingMaterial])
            }).catch((err: Error) => {
                console.error(err)
            })
        } else {
            // 更新数据
            const newLiveStreamingMaterials = liveStreamingMaterials.map(item => {
                if (item.id === liveStreamingMaterial.id) {
                    item.title = liveStreamingMaterial.title
                }
                return item
            })
            // 设置数据
            setLiveStreamingMaterials(newLiveStreamingMaterials)
        }


    }

    // 删除直播素材，ID为0时全部删除
    const handleDeleteLiveStreamingMaterial = (id: number) => {
        const newLiveStreamingMaterials = liveStreamingMaterials.filter(liveStreamingMaterial => {
            if (id === 0 || liveStreamingMaterial.id === id) {
                fabricCanvas!.remove(liveStreamingMaterial.canvasDom!)
                // 移除视频video节点并关闭流
                if (
                    liveStreamingMaterial.type === MaterialTypeEnum.SCREEN ||
                    liveStreamingMaterial.type === MaterialTypeEnum.AUDIO ||
                    liveStreamingMaterial.type === MaterialTypeEnum.VIDEO
                ) {
                    fabricCanvas?.remove(liveStreamingMaterial.canvasDom!)
                    liveStreamingMaterial.videoEl?.remove()
                    liveStreamingMaterial.videoStream!.getTracks().forEach(track => {
                        track.stop();
                    });
                }
            }
            return id !== 0 && liveStreamingMaterial.id !== id
        })
        setLiveStreamingMaterials(newLiveStreamingMaterials)
    }

    // 修改canvas状态
    const handleVisibleLiveStreamingMaterial = (id: number) => {
        const newLiveStreamingMaterials = liveStreamingMaterials.filter(liveStreamingMaterial => {
            if (liveStreamingMaterial.id === id) {
                liveStreamingMaterial.visible = !liveStreamingMaterial.visible
                liveStreamingMaterial.canvasDom!.visible = liveStreamingMaterial.visible
            }
            return liveStreamingMaterial
        })
        setLiveStreamingMaterials(newLiveStreamingMaterials)
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

    // 设置最大码率
    const setMaxBitrate = (maxBitrate: number) => {
        return new Promise<number>((resolve) => {
            rtcPeerConnection?.getSenders().forEach(s => {
                console.log('sender.track')
            })
            rtcPeerConnection?.getSenders().forEach((sender) => {
                console.log('sender.track')
                if (sender.track?.kind === 'video') {
                    console.log('设置最大码率ing', sender.track.id);
                    const parameters = { ...sender.getParameters() };
                    if (parameters.encodings[0]) {
                        const val = 1000 * maxBitrate;
                        if (parameters.encodings[0].maxBitrate === val) {
                            console.log('最大码率不变，不设置');
                            resolve(1);
                            return;
                        }
                        parameters.encodings[0].maxBitrate = val;
                        sender
                            .setParameters(parameters)
                            .then(() => {
                                console.log('设置最大码率成功', maxBitrate);
                                resolve(1);
                            })
                            .catch((error) => {
                                console.error('设置最大码率失败', maxBitrate, error);
                                resolve(0);
                            });
                    }
                }
            })
        })
    }

    // 使用webrtc发送数据
    const startScreenSharing = async () => {
        const newRtcPeerConnection = new RTCPeerConnection({ iceServers: [] })
        setRtcPeerConnection(newRtcPeerConnection)

        newRtcPeerConnection.addTransceiver("audio", { direction: "sendonly" })
        newRtcPeerConnection.addTransceiver("video", { direction: "sendonly" })

        // 添加流
        // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
        videoRef.current!.captureStream().getTracks().forEach((track: MediaStreamTrack) => {
            newRtcPeerConnection.addTrack(track, videoRef.current!.captureStream())

            // Notify about local track when stream is ok.
            //mediaStream.addTrack(track)
        })

        // 创建offer并设置本地
        const offer = await newRtcPeerConnection.createOffer()
        await newRtcPeerConnection.setLocalDescription(offer)

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
        await newRtcPeerConnection.setRemoteDescription(
            new RTCSessionDescription({ type: 'answer', sdp: response.sdp })
        )

    }

    // 添加摄像头
    const addCamera = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加音频
    const addAudio = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加窗口
    const addScreen = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加图片
    const addPicture = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加文字
    const addText = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加媒体
    const addVideo = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加相册
    const addFolder = async (data: LiveStreamingMaterial) => {
        // // 开启共享桌面直播
        const event = await navigator.mediaDevices.getDisplayMedia({
            video: {
                // 指定视频设备ID，留空表示使用默认设备
                deviceId: "",
                // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
            },
            audio: true,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    const handleLcale = ({ width, height }: { width: number; height: number }) => {
        const resolutionHeight =
            resolutionRatio * window.devicePixelRatio;
        const resolutionWidth =
            resolutionRatio *
            window.devicePixelRatio *
            resolutionScale;
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
        id: number;
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
                fabricCanvas!.insertAt(canvasDom, id, true);

                resolve({ canvasDom, scale: ratio, videoEl });
            };
        });
    }


    const changeCanvasStyle = () => {
        fabricCanvas.wrapperEl.style.width = `${wrapSize.width}px`
        fabricCanvas.wrapperEl.style.height = `${wrapSize.height}px`
        fabricCanvas.lowerCanvasEl.style.width = `${wrapSize.width}px`
        fabricCanvas.lowerCanvasEl.style.height = `${wrapSize.height}px`
        fabricCanvas.upperCanvasEl.style.width = `${wrapSize.width}px`
        fabricCanvas.upperCanvasEl.style.height = `${wrapSize.height}px`
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
        rtcPeerConnection.close()
    }

    const init = () => {
        const resolutionHeight =
            resolutionRatio / window.devicePixelRatio
        const resolutionWidth =
            (resolutionRatio / window.devicePixelRatio) *
            resolutionScale
        const wrapWidth = videoCtnRef.current!.getBoundingClientRect().width
        // const wrapWidth = 1920
        const ratio = wrapWidth / resolutionWidth
        const wrapHeight = resolutionHeight * ratio
        // 创建一个Canvas实例
        const videoCanvas = new fabric.Canvas(videoRef.current)

        videoCanvas.setWidth(resolutionWidth)
        videoCanvas.setHeight(resolutionHeight)
        videoCanvas.setBackgroundColor('black')
        setWrapSize({
            width: wrapWidth,
            height: wrapHeight
        })
        setFabricCanvas(videoCanvas)


        // 恢复数据
        liveStreamingMaterials.map((item: LiveStreamingMaterial) => {
            genCanvas(item)
        })
    }

    // 生成canvas
    const genCanvas = async (data: LiveStreamingMaterial) => {
        let canvasData
        switch (data.type) {
            case MaterialTypeEnum.CAMERA:
                canvasData = await addCamera(data)
                break
            case MaterialTypeEnum.AUDIO:
                canvasData = await addAudio(data)
                break
            case MaterialTypeEnum.SCREEN:
                canvasData = await addScreen(data)
                break
            case MaterialTypeEnum.PICTURE:
                canvasData = await addPicture(data)
                break
            case MaterialTypeEnum.TEXT:
                canvasData = await addText(data)
                break
            case MaterialTypeEnum.VIDEO:
                canvasData = await addVideo(data)
                break
            case MaterialTypeEnum.FOLDER:
                canvasData = await addFolder(data)
                break
        }
        return canvasData
    }

    // 监控直播的开关
    useEffect(() => {
        if (liveStatus === 1) { //开始直播
            startScreenSharing()
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
                            <LiveContext.Provider value={{
                                // 处理素材
                                handleResolutionRatio: (currentRatio: number) => {
                                    const resolutionHeight =
                                        currentRatio / window.devicePixelRatio
                                    const resolutionWidth =
                                        (currentRatio / window.devicePixelRatio) *
                                        resolutionScale
                                    fabricCanvas?.setWidth(resolutionWidth)
                                    fabricCanvas?.setHeight(resolutionHeight)

                                    liveStreamingMaterials.forEach((iten) => {
                                        const item = iten.canvasDom;

                                        if (item) {
                                            // 分辨率变小了，将图片变小
                                            if (currentRatio < resolutionRatio) {
                                                const ratio2 = resolutionRatio / currentRatio;
                                                item.left = item.left! / ratio2;
                                                item.top = item.top! / ratio2;
                                            } else {
                                                // 分辨率变大了，将图片变大
                                                const ratio2 = resolutionRatio / currentRatio;
                                                item.left = item.left! / ratio2;
                                                item.top = item.top! / ratio2;
                                            }
                                        }
                                    });
                                    liveStreamingMaterials.forEach((iten) => {
                                        const item = iten.canvasDom;

                                        if (item) {
                                            // 分辨率变小了，将图片变小
                                            if (currentRatio < resolutionRatio) {
                                                const ratio = currentRatio / resolutionRatio;
                                                const ratio1 = (item.scaleX || 1) * ratio;
                                                item.scale(ratio1);
                                            } else {
                                                // 分辨率变大了，将图片变大
                                                const ratio = currentRatio / resolutionRatio;
                                                const ratio1 = (item.scaleX || 1) * ratio;
                                                item.scale(ratio1);
                                            }
                                        }
                                    });

                                    changeCanvasStyle()
                                    setResolutionRatio(currentRatio)
                                },
                                // 处理码率
                                handleBitrate: (currentBitrate: number) => {
                                    setMaxBitrate(currentBitrate).then(res => {
                                        if (res === 1) {
                                            console.log('切换码率成功！');
                                            setBitrate(currentBitrate)
                                        } else {
                                            console.error('切换码率失败！');
                                        }
                                    }).catch(err => {
                                        console.error(err)
                                    })

                                }
                            }}>
                                <BottomTool handleLiveStatus={handleLiveStatus} liveStatus={liveStatus} />
                            </LiveContext.Provider>
                        </div>
                    </div>
                </Col>
                <Col sm={6} xs={24}>
                    <div className={styles.rightTool}>
                        <LiveContext.Provider value={{
                            liveStreamingMaterials,
                            handleLiveStreamingMaterials,
                            handleDeleteLiveStreamingMaterial,
                            handleVisibleLiveStreamingMaterial
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

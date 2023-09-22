import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import { Row, Col, Divider } from 'antd'
import BottomTool from './BottomTool'
import RightTool from './RightTool'
import { createVideo } from '../../../utils/videoUtils'
import { fabric } from 'fabric'
import LiveContext, { GenCanvasData, LiveStreamingMaterial } from './LiveContextProvider'
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

    // 音频处理合成
    const audioContext = new AudioContext()

    // 当前码率
    const [bitrate, setBitrate] = useState<number>(1000)

    // 设置直播状态
    const handleLiveStatus = () => {
        setLiveStatus((liveStatus === 0 || liveStatus === 2) ? 1 : 2)
    }

    // 分辨率
    const [resolutionRatio, setResolutionRatio] = useState<number>(1080)

    // 直播素材
    const [liveStreamingMaterials, setLiveStreamingMaterials] = useState<LiveStreamingMaterial[]>()

    // 直播存储
    const liveStreamingMaterialLocalStorage = "liveStreamingMaterials"

    // 处理直播素材
    const handleLiveStreamingMaterials = (liveStreamingMaterial: LiveStreamingMaterial, type: 'update' | 'add') => {
        if (type === 'add') {
            // 生成canvas
            genCanvas(liveStreamingMaterial).then((canvasData: GenCanvasData) => {

                // 保存媒体类型，用于删除
                liveStreamingMaterial.canvasDom = canvasData?.canvasDom
                liveStreamingMaterial.scaleInfo = {}
                if (
                    liveStreamingMaterial.type === MaterialTypeEnum.SCREEN ||
                    liveStreamingMaterial.type === MaterialTypeEnum.AUDIO ||
                    liveStreamingMaterial.type === MaterialTypeEnum.VIDEO
                ) {
                    liveStreamingMaterial.videoEl = canvasData.videoEl!
                    liveStreamingMaterial.stream = canvasData.videoStream!
                }
                setScaleInfo(liveStreamingMaterial, 1)
                // 设置数据
                setLiveStreamingMaterials(liveStreamingMaterials ? [...liveStreamingMaterials, liveStreamingMaterial] : [liveStreamingMaterial])
            }).catch((err: Error) => {
                console.error(err)
            })
        } else {
            // 更新数据
            const newLiveStreamingMaterials = liveStreamingMaterials!.filter(item => {
                if (item.id === liveStreamingMaterial.id) {
                    item.title = liveStreamingMaterial.title
                }
                return item
            })
            setLiveStreamingMaterials(newLiveStreamingMaterials)
        }
    }

    // 删除直播素材，ID为0时全部删除
    const handleDeleteLiveStreamingMaterial = (id: number) => {
        const newLiveStreamingMaterials = liveStreamingMaterials!.filter(liveStreamingMaterial => {
            if (id === 0 || liveStreamingMaterial.id === id) {
                // 关闭流，DOM
                fabricCanvas?.remove(liveStreamingMaterial.canvasDom!)
                liveStreamingMaterial.videoEl?.remove()
                liveStreamingMaterial?.stream?.getTracks().forEach(track => {
                    track.stop();
                })
            }
            return id !== 0 && liveStreamingMaterial.id !== id
        })
        setLiveStreamingMaterials(newLiveStreamingMaterials)
    }

    // 修改canvas状态
    const handleVisibleLiveStreamingMaterial = (id: number) => {
        // 更新数据
        const newLiveStreamingMaterials = liveStreamingMaterials!.filter(liveStreamingMaterial => {
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

    // 设置缩放大小
    const setScaleInfo = (
        track: LiveStreamingMaterial,
        scale = 1
    ) => {
        [1, 2, 3, 4].forEach((devicePixelRatio) => {
            track.scaleInfo[devicePixelRatio] = {
                scaleX: (1 / devicePixelRatio) * scale,
                scaleY: (1 / devicePixelRatio) * scale,
            };
        })

        if (window.devicePixelRatio !== 1) {

            const ratio = (1 / window.devicePixelRatio) * scale;
            track.canvasDom!.scale(ratio);
            track.scaleInfo[window.devicePixelRatio] = {
                scaleX: ratio,
                scaleY: ratio,
            }
        }
    }

    // 处理视频/音频合流
    const handleAudioMixedVideo = () => {
        const allAudioTrack = liveStreamingMaterials!.filter((item) => item.type === MaterialTypeEnum.AUDIO || item.type === MaterialTypeEnum.VIDEO)
        // 控制音频的音量大小
        const gainNode = audioContext.createGain()
        allAudioTrack.forEach((item) => {
            const audioInput = audioContext.createMediaStreamSource(item.stream!)
            // 调节音量
            gainNode.gain.value = (item.volume || 100) / 100
            // 将GainNode与其他音频节点进行连接，以便对音频进行更复杂的处理
            audioInput.connect(gainNode)
        })
        const destination = audioContext.createMediaStreamDestination()
        gainNode.connect(destination)


        const mediaStream = new MediaStream([
            videoRef.current!.captureStream().getVideoTracks()[0],
            destination.stream.getAudioTracks()[0]
        ])

        // 替换流
        const resAudio = destination.stream.getAudioTracks()[0]
        const sender = rtcPeerConnection?.getSenders()
            .find((sender) => sender.track?.id === resAudio.id)
        if (!sender) {
            // 替换音频流
            rtcPeerConnection?.getSenders().find(sender => sender.track?.kind === 'audio')
                ?.replaceTrack(resAudio).catch(e => {
                    console.log('替换WebRTC流失败', e)
                })
        }

        return mediaStream
    }

    // 使用webrtc发送数据
    const startScreenSharing = async () => {
        const newRtcPeerConnection = new RTCPeerConnection({ iceServers: [] })
        setRtcPeerConnection(newRtcPeerConnection)

        newRtcPeerConnection.addTransceiver("audio", { direction: "sendonly" })
        newRtcPeerConnection.addTransceiver("video", { direction: "sendonly" })

        // 添加流
        // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
        handleAudioMixedVideo().getTracks().forEach((track: MediaStreamTrack) => {
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
        const event = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: data.deviceId,
            },
            // 禁用声音
            audio: false,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            rect: data.rect,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加音频
    const addAudio = async (data: LiveStreamingMaterial) => {
        const event = await navigator.mediaDevices.getUserMedia({
            // 禁用视频
            video: false,
            audio: { deviceId: data.deviceId },
        })

        return { videoStream: event }
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
            // 关闭声音
            audio: false,
        })

        // 生成视频流
        const { canvasDom, videoEl, scale } = await autoCreateVideo({
            stream: event,
            rect: data.rect,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: event }
    }

    // 添加图片
    const addPicture = (data: LiveStreamingMaterial) => {
        const imgEl = document.createElement('img');
        imgEl.src = data.imageInfo!.datas![0]
        const canvasDom = new fabric.Image(imgEl, {
            top: (data.rect?.top || 0) / window.devicePixelRatio,
            left: (data.rect?.left || 0) / window.devicePixelRatio,
            width: imgEl.width,
            height: imgEl.height,
            opacity: data.imageInfo!.opacity! / 100,
        })
        fabricCanvas!.add(canvasDom)

        return { canvasDom }
    }

    // 添加文字
    const addText = (data: LiveStreamingMaterial) => {
        // 描边
        let stroke = {}
        if (data.textInfo?.textStroke) {
            stroke = {
                strokeWidth: data.textInfo?.textStrokeWeight,
                stroke: data.textInfo?.textStrokeColor
            }
        }

        // 字体样式
        let fontStyle = {}
        if (data.textInfo?.fontStyle === 'italic') {
            fontStyle = {
                fontStyle: data.textInfo?.fontStyle
            }
        } else if (data.textInfo?.fontStyle === 'weight') {
            fontStyle = {
                fontWeight: 'bold'
            }
        } else if (data.textInfo?.fontStyle === 'italicAndWeight') {
            fontStyle = {
                fontStyle: 'italic',
                fontWeight: 'bold'
            }
        }

        const canvasDom = new fabric.Text(data.textInfo!.text, {
            top: (data.rect?.top || 0) / window.devicePixelRatio,
            left: (data.rect?.left || 0) / window.devicePixelRatio,
            fill: data.textInfo?.color,
            fontSize: data.textInfo?.fontSize,
            fontFamily: data.textInfo?.fontFamily,
            opacity: data.textInfo!.opacity / 100,
            // 字体样式
            ...fontStyle,
            // 描边
            ...stroke
        })


        fabricCanvas!.add(canvasDom)

        return { canvasDom }
    }

    // 添加媒体
    const addVideo = async (data: LiveStreamingMaterial) => {
        // const url = URL.createObjectURL(data.videoInfo?.video.file)
        const videoEl = createVideo({ muted: false, appendChild: true })
        videoEl.src = data.videoInfo!.video.data!
        videoEl.muted = false

        const videoRes: HTMLVideoElement = await new Promise<HTMLVideoElement>((resolve) => {
            videoEl.onloadedmetadata = () => {
                resolve(videoEl)
            }
        })

        const stream = videoRes.captureStream()
        const { canvasDom, scale } = await autoCreateVideo({
            stream,
            rect: data.rect,
            id: data.id,
        })

        return { canvasDom, videoEl, videoStream: stream }
    }

    // 添加相册
    const addFolder = async (data: LiveStreamingMaterial) => {
        const imgEl = await new Promise<HTMLImageElement>((resolve) => {
            const reader = new FileReader()
            reader.addEventListener(
                'load',
                function () {
                    const img = document.createElement('img');
                    img.src = reader.result as string;
                    img.onload = () => {
                        resolve(img);
                    }
                },
                false
            )
            reader.readAsDataURL(data.imageInfo?.picture.file)
        })
        const canvasDom = new fabric.Image(imgEl, {
            top: (data.rect?.top || 0) / window.devicePixelRatio,
            left: (data.rect?.left || 0) / window.devicePixelRatio,
            width: imgEl.width,
            height: imgEl.height,
        })
        fabricCanvas!.add(canvasDom)

        return { canvasDom }
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
    const handleMoving = ({ canvasDom, id, }: {
        canvasDom: fabric.Image | fabric.Text
        id: number
    }) => {
        // 监控拖动canvas记录坐标
        canvasDom.on('mouseup', () => {
            const restoreLiveStreamingMaterialLocalStorageStr = localStorage.getItem(liveStreamingMaterialLocalStorage)
            if (restoreLiveStreamingMaterialLocalStorageStr) {
                const restoreLiveStreamingMaterialLocalStorage = JSON.parse(restoreLiveStreamingMaterialLocalStorageStr) as LiveStreamingMaterial[]
                const rect = {
                    top: (canvasDom.top || 0) * window.devicePixelRatio,
                    left: (canvasDom.left || 0) * window.devicePixelRatio,
                }
                const liveStreamingMaterial = restoreLiveStreamingMaterialLocalStorage.find(item => item.id === id)
                liveStreamingMaterial!.rect = rect
                localStorage.setItem(liveStreamingMaterialLocalStorage, JSON.stringify(restoreLiveStreamingMaterialLocalStorage))
            }
        })
    }



    /**
     * 1: {scaleX: 1, scaleY: 1}
     * 2: {scaleX: 0.5, scaleY: 0.5}
     * 3: {scaleX: 0.3333333333333333, scaleY: 0.3333333333333333}
     * 4: {scaleX: 0.25, scaleY: 0.25}
     * 
     * 二倍屏即1px里面有2个像素；三倍屏1px里面有3个像素，以此类推
     * 一个图片，宽高都是100px
     * 一倍屏展示：100px等于100个像素，一比一展示
     * 二倍屏展示：100px等于100个像素，二比一展示，即在二倍屏的100px看起来会比一倍屏的100px小一倍
     * 如果需要在一杯和二倍屏幕的时候看的大小都一样：
     * 1，在二倍屏的时候，需要将100px放大一倍，即200px；
     * 2，在一倍屏的时候，需要将100px缩小一百，即50px；
     */
    // 处理缩放记录坐标
    const handleScaling = (
        { canvasDom, id }: {
            canvasDom: fabric.Image | fabric.Text
            id: number
        }) => {
        canvasDom.on('scaling', () => {
            const restoreLiveStreamingMaterialLocalStorageStr = localStorage.getItem(liveStreamingMaterialLocalStorage)
            if (restoreLiveStreamingMaterialLocalStorageStr) {
                const restoreLiveStreamingMaterialLocalStorage = JSON.parse(restoreLiveStreamingMaterialLocalStorageStr) as LiveStreamingMaterial[]

                const liveStreamingMaterial = restoreLiveStreamingMaterialLocalStorage.find(item => item.id === id)
                liveStreamingMaterial!.scaleInfo[window.devicePixelRatio] = {
                    scaleX: canvasDom.scaleX || 1,
                    scaleY: canvasDom.scaleY || 1,
                }
                Object.keys(liveStreamingMaterial!.scaleInfo).forEach((iten: number) => {
                    if (window.devicePixelRatio !== Number(iten)) {
                        if (window.devicePixelRatio > Number(iten)) {
                            liveStreamingMaterial!.scaleInfo[iten] = {
                                scaleX:
                                    liveStreamingMaterial!.scaleInfo[window.devicePixelRatio].scaleX *
                                    window.devicePixelRatio,
                                scaleY:
                                    liveStreamingMaterial!.scaleInfo[window.devicePixelRatio].scaleY *
                                    window.devicePixelRatio,
                            };
                        } else {
                            if (window.devicePixelRatio === 1) {
                                liveStreamingMaterial!.scaleInfo[iten] = {
                                    scaleX: liveStreamingMaterial!.scaleInfo[1].scaleX / Number(iten),
                                    scaleY: liveStreamingMaterial!.scaleInfo[1].scaleY / Number(iten),
                                };
                            } else {
                                liveStreamingMaterial!.scaleInfo[iten] = {
                                    scaleX: liveStreamingMaterial!.scaleInfo[1].scaleX * Number(iten),
                                    scaleY: liveStreamingMaterial!.scaleInfo[1].scaleY * Number(iten),
                                };
                            }
                        }
                    }
                })
                localStorage.setItem(liveStreamingMaterialLocalStorage, JSON.stringify(restoreLiveStreamingMaterialLocalStorage))
            }
        });
    }

    const autoCreateVideo = async ({
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
                    top: (rect?.top || 0) / window.devicePixelRatio,
                    left: (rect?.left || 0) / window.devicePixelRatio,
                    width,
                    height,
                })

                canvasDom.scale(ratio / window.devicePixelRatio);
                fabricCanvas!.add(canvasDom);

                resolve({ canvasDom, scale: ratio, videoEl });
            };
        })
    }

    const renderAll = () => {
        fabricCanvas!.renderAll()
        requestAnimationFrame(renderAll)
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
    }

    // 监控直播的开关
    useEffect(() => {
        if (liveStatus === 1) { //开始直播
            startScreenSharing().catch(e => console.log(e))
        } else if (liveStatus === 2) { // 关闭直播
            closeLive()
        }
    }, [liveStatus, startScreenSharing, closeLive])

    // 储存直播数据
    useEffect(() => {
        if (liveStreamingMaterials) {
            localStorage.setItem(liveStreamingMaterialLocalStorage, JSON.stringify(liveStreamingMaterials))
        }
    }, [liveStreamingMaterials])

    // 生成canvas
    const genCanvas = async (data: LiveStreamingMaterial) => {
        if (
            data.type === MaterialTypeEnum.VIDEO
        ) {
            if (!data.videoInfo?.video.data) {
                await new Promise<boolean>((resolve) => {
                    const reader = new FileReader();
                    reader.addEventListener(
                        'load',
                        () => {
                            data.videoInfo!.video.data = reader.result as string
                            resolve(true)
                        },
                        false
                    )
                    reader.readAsDataURL(data.videoInfo!.video.file)
                })
            }
        } else if (
            data.type === MaterialTypeEnum.PICTURE
        ) {
            if (!data.imageInfo?.datas) {
                await new Promise<boolean>((resolve) => {
                    const reader = new FileReader();
                    reader.addEventListener(
                        'load',
                        () => {
                            data.imageInfo!.datas = [reader.result as string]
                            resolve(true)
                        },
                        false
                    )
                    reader.readAsDataURL(data.imageInfo!.picture.file)
                })
            }
        }

        let canvasData: GenCanvasData
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
                canvasData = addPicture(data)
                break
            case MaterialTypeEnum.TEXT:
                canvasData = addText(data)
                break
            case MaterialTypeEnum.VIDEO:
                canvasData = await addVideo(data)
                break
            case MaterialTypeEnum.FOLDER:
                canvasData = await addFolder(data)
                break
            default:
                throw new Error('类型错误')
        }
        if (canvasData.canvasDom) {
            handleMoving({ canvasDom: canvasData.canvasDom, id: data.id })

            handleScaling({ canvasDom: canvasData.canvasDom, id: data.id })
            canvasData.canvasDom.visible = data.visible
        }

        return canvasData
    }

    // 定时渲染画面
    const renderFrame = () => {
        renderAll()
    }

    // 初始化用户摄像头/音频设备授权
    const initUserMedia = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: false,
            })
            .then(() => {
                console.log('初始化获取摄像头成功')
            })
            .catch(e => {
                console.log('初始化获取摄像头失败', e)
            })
            .finally(() => {
                navigator.mediaDevices
                    .getUserMedia({
                        video: false,
                        audio: true,
                    })
                    .then(() => {
                        console.log('初始化获取麦克风成功')
                    })
                    .catch(e => {
                        console.log('初始化获取麦克风失败', e)
                    });
            });
    }

    // 从本地恢复用户直播
    const restoreLive = () => {
        // 获取直播数据并恢复
        const restoreLiveStreamingMaterialLocalStorageStr = localStorage.getItem(liveStreamingMaterialLocalStorage)
        if (restoreLiveStreamingMaterialLocalStorageStr) {
            const restoreLiveStreamingMaterialLocalStorage = JSON.parse(restoreLiveStreamingMaterialLocalStorageStr) as LiveStreamingMaterial[]

            restoreLiveStreamingMaterialLocalStorage.forEach((liveStreamingMaterial: LiveStreamingMaterial) => {
                genCanvas(liveStreamingMaterial).then((canvasData: GenCanvasData) => {

                    // 保存媒体类型，用于删除
                    liveStreamingMaterial.canvasDom = canvasData?.canvasDom
                    if (
                        liveStreamingMaterial.type === MaterialTypeEnum.SCREEN ||
                        liveStreamingMaterial.type === MaterialTypeEnum.AUDIO ||
                        liveStreamingMaterial.type === MaterialTypeEnum.VIDEO
                    ) {
                        liveStreamingMaterial.videoEl = canvasData.videoEl!
                        liveStreamingMaterial.stream = canvasData.videoStream!
                    }
                    // 设置缩放大小
                    liveStreamingMaterial.canvasDom.scaleX = liveStreamingMaterial.scaleInfo[window.devicePixelRatio]?.scaleX
                    liveStreamingMaterial.canvasDom.scaleY = liveStreamingMaterial.scaleInfo[window.devicePixelRatio]?.scaleY
                }).catch((err: Error) => {
                    console.error(err)
                })
            })

            // 设置数据
            setLiveStreamingMaterials(restoreLiveStreamingMaterialLocalStorage)
        }
    }

    const changeCanvasStyle = () => {
        fabricCanvas.wrapperEl.style.width = `${wrapSize.width}px`
        fabricCanvas.wrapperEl.style.height = `${wrapSize.height}px`
        fabricCanvas.lowerCanvasEl.style.width = `${wrapSize.width}px`
        fabricCanvas.lowerCanvasEl.style.height = `${wrapSize.height}px`
        fabricCanvas.upperCanvasEl.style.width = `${wrapSize.width}px`
        fabricCanvas.upperCanvasEl.style.height = `${wrapSize.height}px`
    }

    useEffect(() => {
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
        videoCanvas.setBackgroundColor('black', () => {
            console.log('设置背景颜色')
        })
        setWrapSize({
            width: wrapWidth,
            height: wrapHeight
        })
        setFabricCanvas(videoCanvas)
    }, [])

    useEffect(() => {
        if (fabricCanvas) {
            // 定时渲染
            renderFrame()
            // 改变大小
            changeCanvasStyle()

            // 初始化用户摄像头/音频设备授权
            initUserMedia()
            // 从本地恢复用户直播
            restoreLive()
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

                                    liveStreamingMaterials!.forEach((iten) => {
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
                                    liveStreamingMaterials!.forEach((iten) => {
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
                            handleVisibleLiveStreamingMaterial,
                            // 处理音量
                            handleVolume: (id: number, currentVolume: number) => {
                                const newLiveStreamingMaterials = liveStreamingMaterials!.filter(liveStreamingMaterial => {
                                    if (liveStreamingMaterial.id === id) {
                                        liveStreamingMaterial.volume = currentVolume
                                        // 存在本地播放需要同时减低省道
                                        if (liveStreamingMaterial?.videoEl) {
                                            liveStreamingMaterial.videoEl.volume = currentVolume / 100
                                        }
                                    }
                                    return liveStreamingMaterial
                                })
                                setLiveStreamingMaterials(newLiveStreamingMaterials)
                                handleAudioMixedVideo()
                            }
                        }}>
                            <RightTool />
                        </LiveContext.Provider>
                    </div>
                </Col>
            </Row >
        </>

    )
}

export default Live

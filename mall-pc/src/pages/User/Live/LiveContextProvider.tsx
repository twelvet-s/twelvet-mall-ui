import { UploadFile } from 'antd';
import React from 'react'


export interface GenCanvasData {
    canvasDom?: fabric.Image | fabric.Text;
    videoEl?: HTMLVideoElement;
    videoStream?: MediaStream;
}

export type LiveStreamingMaterial = {
    // ID
    id: string
    // 摄像头/麦克风ID
    deviceId?: string
    // 素材类型
    type: string
    // 是否显示
    visible: boolean
    // 标题
    title: string
    // 音量
    volume?: number
    // canvasDom，用于修改删除等操作
    canvasDom?: fabric.Image | fabric.Text
    // 多媒体播放
    videoEl?: HTMLVideoElement
    // 视频/音频流
    stream?: MediaStream
    // 文字素材所需参数
    textInfo?: {
        // 内容
        text: string
        // 字体
        fontFamily: string
        // 字体大小
        fontSize: number
        // 字体风格
        fontStyle: 'normal' | 'italic' | 'weight' | 'italicAndWeight'
        // 字体颜色
        color: string
        // 是否开启描边
        textStroke: boolean
        // 描边颜色
        textStrokeColor: string
        // 描边大小
        textStrokeWeight: number
        // 不透明度
        opacity: number
    }
    // 图片素材
    imageInfo?: {
        // 是否已保存
        saveOk: boolean,
        // 图片地址
        picture: {
            file: UploadFile,
            fileList: UploadFile[]
        },
        // 不透明度
        opacity?: number
        // 动画效果
        animation?: string
        // 放映时间
        showTime?: number
        // 过渡时间
        transitionTime?: number
    }
    // 媒体素材
    videoInfo?: {
        // 媒体地址
        video: {
            // 是否已保存
            saveOk: boolean,
            file: UploadFile,
            fileList: UploadFile[]
        }
    }
    // 素材位置
    rect: { top: number; left: number }
    scaleInfo: Record<number, { scaleX: number; scaleY: number }>
}

export type LiveContextType = {
    liveStreamingMaterials?: LiveStreamingMaterial[]
    // 增加素材
    handleLiveStreamingMaterials?: (liveStreamingMaterials: LiveStreamingMaterial, type: 'update' | 'add') => void
    // 删除素材
    handleDeleteLiveStreamingMaterial?: (id: string) => void
    // 修改显示状态
    handleVisibleLiveStreamingMaterial?: (id: string) => void
    // 处理分辨率
    handleResolutionRatio?: (currentRatio: number) => void
    // 处理码率
    handleBitrate?: (currentBitrate: number) => void
    // 处理音频声音大小
    handleVolume?: (id: string, currentVolume: number) => void
}

const LiveContext = React.createContext<LiveContextType | undefined>(undefined)


export default LiveContext
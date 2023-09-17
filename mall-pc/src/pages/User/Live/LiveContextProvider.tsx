import React from 'react'


export type LiveStreamingMaterial = {
    // ID
    id: number
    // 素材类型
    type: string
    // 是否显示
    visible: boolean
    // 标题
    title: string
    // canvasDom，用于修改删除等操作
    canvasDom?: fabric.Image | fabric.Text
    // 多媒体播放
    videoEl?: HTMLVideoElement
    // 视频流
    videoStream?: MediaStream
}

export type LiveContextType = {
    liveStreamingMaterials?: LiveStreamingMaterial[]
    // 增加素材
    handleLiveStreamingMaterials?: (liveStreamingMaterials: LiveStreamingMaterial, type: 'update' | 'add') => void
    // 删除素材
    handleDeleteLiveStreamingMaterial?: (id: number) => void
    // 修改显示状态
    handleVisibleLiveStreamingMaterial?: (id: number) => void
    // 处理分辨率
    handleResolutionRatio?: (currentRatio: number) => void
    // 处理码率
    handleBitrate?: (currentBitrate: number) => void
}

const LiveContext = React.createContext<LiveContextType | undefined>(undefined)


export default LiveContext
import React from 'react'


export type LiveStreamingMaterial = {
    // ID
    id: string
    // 是否禁用
    disabled: boolean
    // 标题
    title: string
};

export type LiveContextType = {
    liveStreamingMaterials: LiveStreamingMaterial[]
    handleLiveStreamingMaterials: (liveStreamingMaterials: LiveStreamingMaterial[]) => void
}

const LiveContext = React.createContext<LiveContextType | undefined>(undefined)


export default LiveContext
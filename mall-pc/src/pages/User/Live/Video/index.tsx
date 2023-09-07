import React, { forwardRef } from 'react'


const VideoComponent: React.ForwardRefRenderFunction<HTMLVideoElement> = (props, ref: React.Ref<HTMLVideoElement>) => {

    return (
        <video ref={ref} autoPlay={false} style={{ width: '100%', height: '100%' }} />
    )
}

const ForwardedVideoComponent: React.ForwardRefExoticComponent<React.RefAttributes<HTMLVideoElement>> = forwardRef(VideoComponent);

export default ForwardedVideoComponent
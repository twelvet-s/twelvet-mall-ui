import React, { forwardRef } from 'react'

import styles from './style.module.css'


const VideoComponent: React.ForwardRefRenderFunction<HTMLVideoElement> = (props, ref: React.Ref<HTMLVideoElement>) => {

    return (
        <div id={styles.ctn}>
            <video ref={ref} autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

const ForwardedVideoComponent: React.ForwardRefExoticComponent<React.RefAttributes<HTMLVideoElement>> = forwardRef(VideoComponent);

export default ForwardedVideoComponent
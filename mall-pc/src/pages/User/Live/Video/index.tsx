import React, { useContext, useEffect, useRef } from 'react'

import styles from './style.module.css'
import { LiveContext } from '../LiveContextProvider'


const Video: React.FC = () => {

    const { videoStream } = useContext(LiveContext)

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        console.log('video=============', videoStream)
        videoRef.current.srcObject = videoStream
        videoRef.current.play();
    }, [videoStream])

    return (
        <div id={styles.ctn}>
            <video ref={videoRef} autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default Video


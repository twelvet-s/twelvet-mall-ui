import React, { useRef } from 'react'

import styles from './style.module.css'


const Video: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div id={styles.ctn}>
            <video ref={videoRef} autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default Video


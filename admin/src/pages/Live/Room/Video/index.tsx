import React, { useEffect } from 'react'

import './index.css'

interface VideoProps {
    live: boolean
}

const Video: React.FC<VideoProps> = props => {

    const { live } = props

    useEffect(() => {
        // 打开摄像头开始获取视频流
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(function (stream) {
                
                // 处理获取到的媒体流
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];
                mediaRecorder.addEventListener('dataavailable', function (event) {
                    chunks.push(event.data);
                });
                mediaRecorder.start();

                mediaRecorder.addEventListener('dataavailable', function (event) {
                    console.log(event.data)
                });

            })
            .catch(function (error) {
                // 处理错误
            });


    }, [])

    return (
        <>
            视频播放{live}
        </>
    )
}

export default Video

import React, { useEffect, useRef } from 'react'

import './index.css'

interface VideoProps {

}

const Video: React.FC<VideoProps> = () => {

    const videoRef = useRef(null);

    useEffect(() => {
        // 打开摄像头开始获取视频流
        // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        //     .then(function (stream) {

        //         // 处理获取到的媒体流
        //         const mediaRecorder = new MediaRecorder(stream);
        //         const chunks = [];
        //         mediaRecorder.addEventListener('dataavailable', function (event) {
        //             chunks.push(event.data);
        //         });
        //         mediaRecorder.start();

        //         mediaRecorder.addEventListener('dataavailable', function (event) {
        //             console.log(event.data)
        //         });

        //     })
        //     .catch(function (error) {
        //         // 处理错误
        //     });


        // const constraints = { video: true };

        // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //     // 获取用户媒体设备的权限
        //     navigator.mediaDevices.getUserMedia(constraints)
        //         .then((stream) => {
        //             // 将摄像头画面流附加到 video 元素
        //             videoRef.current.srcObject = stream;
        //         })
        //         .catch((error) => {
        //             console.error("Error accessing camera:", error);
        //         });
        // } else {
        //     // 浏览器不支持 getUserMedia
        //     alert('浏览器不支持')
        // }
        


    }, [])

    return (
        <>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
        </>
    )
}

export default Video

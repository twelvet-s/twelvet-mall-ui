import React, { useEffect, useRef } from 'react'
import { push } from '../service'

import './index.css'


const Video: React.FC = () => {


    const videoRef = useRef<HTMLVideoElement>(null);

    const ctnRef = useRef<HTMLDivElement>(null);

    const rtcPeerConnection = new RTCPeerConnection();


    // 使用webrtc发送数据
    const startScreenSharing = async (stream: MediaStream) => {
        if (videoRef.current) {


            rtcPeerConnection.addTransceiver("audio", { direction: "sendonly" });
            rtcPeerConnection.addTransceiver("video", { direction: "sendonly" });

            // 添加流
            // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
            stream.getTracks().forEach(function (track: MediaStreamTrack) {
                rtcPeerConnection.addTrack(track);

                // Notify about local track when stream is ok.
                //mediaStream.addTrack(track);
            });

            const offer = await rtcPeerConnection.createOffer();

            await rtcPeerConnection.setLocalDescription(offer);

            // 发送数据
            const session: {
                sdp: string,
            } = await push({
                sdp: offer.sdp
            })

            if (session) {
                await rtcPeerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
                );
            }

        }

    };


    // 开始直播
    const startLive = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');

            canvas.width = videoRef.current?.offsetWidth
            canvas.height = videoRef.current?.offsetHeight


            if (navigator.mediaDevices.getUserMedia) {

                // 获取用户媒体设备的权限
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 麦克风
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true }); // 摄像头
                // 只播放摄像头的流
                videoRef.current.srcObject = videoStream;
                videoRef.current.play();

                // 合流
                const mergedStream = new MediaStream();
                audioStream.getAudioTracks().forEach(track => mergedStream.addTrack(track))
                videoStream.getVideoTracks().forEach(track => mergedStream.addTrack(track))

                // 定义动画函数，在每一帧上绘制视频图像
                const drawFrame = () => {
                    canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height)
                    // 传输canvas画像
                    //canvas.captureStream().getVideoTracks().forEach(track => mergedStream.addTrack(track))
                    requestAnimationFrame(drawFrame);
                }
                drawFrame()



                startScreenSharing(mergedStream)

            } else {
                // 浏览器不支持 getUserMedia，开启共享桌面直播
                const stream = await navigator.mediaDevices.getDisplayMedia();
                // 本地播放
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                startScreenSharing(stream)

            }
        }

    }

    useEffect(() => {
        startLive()
    }, [])

    return (
        <div id='ctn' ref={ctnRef}>
            <video ref={videoRef} autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default Video


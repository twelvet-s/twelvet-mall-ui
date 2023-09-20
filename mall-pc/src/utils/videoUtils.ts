export const createVideo = ({
    muted = true,
    autoplay = true,
    // 部分浏览器不插入元素无法播放
    appendChild = false,
  }) => {
    const videoEl = document.createElement('video')
    videoEl.autoplay = autoplay
    videoEl.muted = muted
    videoEl.playsInline = true
    videoEl.loop = true
    videoEl.controls = true
    videoEl.setAttribute('webkit-playsinline', 'true')
    videoEl.setAttribute('x5-video-player-type', 'h5')
    videoEl.setAttribute('x5-video-player-fullscreen', 'true')
    videoEl.setAttribute('x5-video-orientation', 'portraint')
    videoEl.oncontextmenu = (e) => {
      e.preventDefault()
    }
    if (appendChild) {
      videoEl.style.width = `1px`
      videoEl.style.height = `1px`
      videoEl.style.position = 'fixed'
      videoEl.style.bottom = '0'
      videoEl.style.right = '0'
      //videoEl.style.opacity = '0'
      videoEl.style.pointerEvents = 'none'
      document.body.appendChild(videoEl)
    }
    return videoEl
}
  
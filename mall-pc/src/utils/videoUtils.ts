export const createVideo = ({
    muted = true,
    autoplay = true,
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
  
export function videoToCanvas(data: { videoEl: HTMLVideoElement }) {
    const { videoEl } = data
    if (!videoEl) {
      throw new Error('videoEl不能为空！')
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
  
    let timer
    let w = videoEl.videoWidth
    let h = videoEl.videoHeight
    function handleResize() {
      w = videoEl.videoWidth
      h = videoEl.videoHeight
    }
    videoEl.addEventListener('resize', handleResize)
    function drawCanvas() {
      canvas.width = w
      canvas.height = h
      ctx.drawImage(videoEl, 0, 0, w, h)
      timer = requestAnimationFrame(drawCanvas)
    }
  
    function stopDrawing() {
      videoEl.removeEventListener('resize', handleResize)
      cancelAnimationFrame(timer)
    }
  
    drawCanvas()
  
    return { drawCanvas, stopDrawing, canvas }
}
  
'use client'

import jsQR from 'jsqr'
import { useCallback, useEffect, useRef } from 'react'

interface Props {
  onScan?: (data: string) => void;
}

export default function QRReader({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevDataRef = useRef<string>(undefined);

  const scanQrCode = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // カメラの映像をcanvasに描画する
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // QRコードをスキャンする
        const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCodeData && qrCodeData.data !== prevDataRef.current) {
          onScan?.(qrCodeData.data);
          prevDataRef.current = qrCodeData?.data;
          setTimeout(() => {
            prevDataRef.current = undefined;
          }, 3000);
        }
        setTimeout(scanQrCode, 10);
      }
    }
  }, [onScan]);

  useEffect(() => {
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 300 },
        height: { ideal: 300 },
      },
    }

    // デバイスのカメラにアクセスする
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // デバイスのカメラにアクセスすることに成功したら、video要素にストリームをセットする
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          void videoRef.current.play()
          scanQrCode()
        }
      })
      .catch((err) => { console.error('Error accessing media devices:', err); })

    const currentVideoRef = videoRef.current

    // コンポーネントがアンマウントされたら、カメラのストリームを停止する
    return () => {
      if (currentVideoRef && currentVideoRef.srcObject) {
        const stream = currentVideoRef.srcObject as MediaStream
        const tracks = stream.getTracks()
        tracks.forEach((track) => {
          track.stop();
        })
      }
    }
  }, [scanQrCode])

  return (
    <div>
      <div className='relative size-[300px]'>
        <video ref={videoRef} autoPlay playsInline className='absolute left-0 top-0 -z-50 size-[300px]' />
        <canvas ref={canvasRef} width='300' height='300' className='absolute left-0 top-0' />
      </div>
    </div>
  )
}

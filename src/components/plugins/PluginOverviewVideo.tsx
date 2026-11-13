'use client'

import { useRef, useState } from 'react'
import { Maximize2, Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PLUGIN_SYSTEM_VIDEO, pluginVideoUrl } from '@/data/plugins'

const CONTROL_STYLE = {
  background: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.15)',
} as const

type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitRequestFullscreen?: () => Promise<void>
}

export default function PluginOverviewVideo({ assetsUrl }: { assetsUrl: string }) {
  const t = useTranslations('PluginsPage.gallery')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => undefined)
    else v.pause()
  }

  const enterFullscreen = () => {
    const v = videoRef.current as FullscreenVideo | null
    if (!v) return
    if (v.requestFullscreen) void v.requestFullscreen()
    else if (v.webkitRequestFullscreen) void v.webkitRequestFullscreen()
    else v.webkitEnterFullscreen?.()
  }

  return (
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-10 items-center">
      <div className="video-glow w-full">
        <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover fullscreen-contain"
            autoPlay
            muted
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={pluginVideoUrl(assetsUrl, PLUGIN_SYSTEM_VIDEO)} type="video/mp4" />
          </video>
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? t('pauseOverview') : t('playOverview')}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={CONTROL_STYLE}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[1px]" />}
            </button>
            <button
              type="button"
              onClick={enterFullscreen}
              aria-label={t('fullscreen')}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={CONTROL_STYLE}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.35rem, 2.4vw, 1.75rem)', lineHeight: '1.15', letterSpacing: '-0.02em', color: 'var(--hp-on-surface)' }}
        >
          {t('overviewTitle')}
        </h2>
        <p className="text-[0.97rem] leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
          {t('overviewBody')}
        </p>
      </div>
    </div>
  )
}

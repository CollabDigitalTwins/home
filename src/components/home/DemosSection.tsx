'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface DemosSectionProps {
    assetsUrl: string
}

type DemoKey = 'general' | 'viewers' | 'organizational' | 'open-data' | 'openBIM' | 'sensors'

interface Demo {
    key: DemoKey
    file: string
}

const DEMOS: Demo[] = [
    { key: 'general', file: 'cdt-demo-home.mp4' },
    { key: 'viewers', file: 'cdt-viewers.mp4' },
    { key: 'organizational', file: 'cdt-organizational_data.mp4' },
    { key: 'open-data', file: 'cdt-open_data.mp4' },
    { key: 'openBIM', file: 'cdt-openBIM.mp4' },
    { key: 'sensors', file: 'cdt-sensors-demo.mp4' },
]

export default function DemosSection({ assetsUrl }: DemosSectionProps) {
    const t = useTranslations('HomePage.demos')
    const [activeIdx, setActiveIdx] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])
    const didMountRef = useRef(false)

    const updateScrollState = () => {
        const el = trackRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 4)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    useEffect(() => {
        updateScrollState()
        const el = trackRef.current
        if (!el) return
        const onScroll = () => updateScrollState()
        el.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', updateScrollState)
        return () => {
            el.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', updateScrollState)
        }
    }, [])

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            return
        }
        const thumb = thumbRefs.current[activeIdx]
        const track = trackRef.current
        if (!thumb || !track) return
        const left = thumb.offsetLeft - (track.clientWidth - thumb.clientWidth) / 2
        track.scrollTo({ left, behavior: 'smooth' })
    }, [activeIdx])

    const scrollByAmount = (dir: 1 | -1) => {
        const el = trackRef.current
        if (!el) return
        const step = Math.max(el.clientWidth * 0.6, 200)
        el.scrollBy({ left: dir * step, behavior: 'smooth' })
    }

    const active = DEMOS[activeIdx]

    const goTo = (idx: number) => {
        const next = (idx + DEMOS.length) % DEMOS.length
        setActiveIdx(next)
        setIsPlaying(true)
    }

    const togglePlay = () => {
        const v = videoRef.current
        if (!v) return
        if (v.paused) {
            v.play()
            setIsPlaying(true)
        } else {
            v.pause()
            setIsPlaying(false)
        }
    }

    const enterFullscreen = () => {
        const v = videoRef.current
        if (!v) return
        const el = v as HTMLVideoElement & {
            webkitEnterFullscreen?: () => void
            webkitRequestFullscreen?: () => Promise<void>
            msRequestFullscreen?: () => Promise<void>
        }
        if (el.requestFullscreen) el.requestFullscreen()
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
        else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen()
        else if (el.msRequestFullscreen) el.msRequestFullscreen()
    }

    return (
        <section
            id="demos"
            className="py-32 relative"
            style={{ background: 'var(--hp-low)' }}
        >
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                        className="mb-14 max-w-3xl lg:max-w-4xl space-y-4"
                    >
                        <div className="section-label">{t('sectionLabel')}</div>
                        <h2
                            className="font-display font-bold"
                            style={{
                                fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
                                lineHeight: '1.1',
                                letterSpacing: '-0.02em',
                                color: 'var(--hp-on-surface)',
                            }}
                        >
                            {t('title')}
                        </h2>
                        <p
                            className="text-lg leading-relaxed"
                            style={{ color: 'var(--hp-on-surface-variant)' }}
                        >
                            {t('subtitle')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10 items-stretch"
                    >
                        <div className="relative">
                            <div className="video-glow w-full">
                                <div className="relative rounded-xl overflow-hidden aspect-video shadow-lg bg-black">
                                    <AnimatePresence mode="wait">
                                        <motion.video
                                            key={active.key}
                                            ref={videoRef}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="absolute inset-0 w-full h-full object-cover fullscreen-contain"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        >
                                            <source
                                                src={`${assetsUrl}/cdt-homepage/${active.file}`}
                                                type="video/mp4"
                                            />
                                        </motion.video>
                                    </AnimatePresence>

                                    <button
                                        type="button"
                                        onClick={() => goTo(activeIdx - 1)}
                                        aria-label="Previous demo"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.45)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goTo(activeIdx + 1)}
                                        aria-label="Next demo"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.45)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>

                                    <div className="absolute bottom-3 right-3 z-10 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={togglePlay}
                                            aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.45)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#fff',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4 translate-x-[1px]" />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={enterFullscreen}
                                            aria-label="Open demo in fullscreen"
                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.45)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#fff',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-3 left-3 z-10 flex gap-1.5">
                                        {DEMOS.map((d, i) => (
                                            <button
                                                key={d.key}
                                                type="button"
                                                onClick={() => goTo(i)}
                                                aria-label={`Go to demo ${i + 1}`}
                                                className="h-1.5 rounded-full transition-all"
                                                style={{
                                                    width: i === activeIdx ? '1.75rem' : '0.5rem',
                                                    background:
                                                        i === activeIdx
                                                            ? 'var(--hp-primary-container)'
                                                            : 'rgba(255,255,255,0.45)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active.key}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.35 }}
                                    className="tonal-card p-6 lg:p-7 flex-grow flex flex-col"
                                >
                                    <span
                                        className="text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-3"
                                        style={{ color: 'var(--hp-on-surface-variant)' }}
                                    >
                                        {String(activeIdx + 1).padStart(2, '0')} / {String(DEMOS.length).padStart(2, '0')}
                                    </span>
                                    <h3
                                        className="font-display font-bold mb-3"
                                        style={{
                                            fontSize: '1.35rem',
                                            lineHeight: '1.2',
                                            letterSpacing: '-0.01em',
                                            color: 'var(--hp-on-surface)',
                                        }}
                                    >
                                        {t(`${active.key}.title`)}
                                    </h3>
                                    <p
                                        className="text-[0.95rem] leading-relaxed"
                                        style={{ color: 'var(--hp-on-surface-variant)' }}
                                    >
                                        {t.rich(`${active.key}.body`, {
                                            link: (chunks) => (
                                                <a
                                                    href="https://docs.collabdt.org/docs/plugins/overview"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline underline-offset-2 transition-opacity hover:opacity-80"
                                                    style={{
                                                        color: 'var(--hp-primary-container)',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {chunks}
                                                </a>
                                            ),
                                        })}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 relative"
                    >
                        <button
                            type="button"
                            onClick={() => scrollByAmount(-1)}
                            aria-label="Scroll demos left"
                            disabled={!canScrollLeft}
                            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-9 h-9 rounded-full items-center justify-center transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
                            style={{
                                background: 'var(--hp-surface)',
                                color: 'var(--hp-on-surface)',
                                border: '1px solid rgba(74, 61, 92, 0.18)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollByAmount(1)}
                            aria-label="Scroll demos right"
                            disabled={!canScrollRight}
                            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-9 h-9 rounded-full items-center justify-center transition-all hover:scale-110 disabled:opacity-0 disabled:pointer-events-none"
                            style={{
                                background: 'var(--hp-surface)',
                                color: 'var(--hp-on-surface)',
                                border: '1px solid rgba(74, 61, 92, 0.18)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            }}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <div
                            ref={trackRef}
                            className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                        >
                            {DEMOS.map((d, i) => {
                                const isActive = i === activeIdx
                                return (
                                    <button
                                        key={d.key}
                                        ref={(el) => { thumbRefs.current[i] = el }}
                                        type="button"
                                        onClick={() => goTo(i)}
                                        className="group relative rounded-lg overflow-hidden aspect-video transition-all flex-shrink-0 snap-start w-[10rem] sm:w-[11rem]"
                                        style={{
                                            border: isActive
                                                ? '2px solid var(--hp-primary-container)'
                                                : '2px solid transparent',
                                            opacity: isActive ? 1 : 0.7,
                                        }}
                                    >
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            onLoadedMetadata={(e) => {
                                                const v = e.currentTarget
                                                if (v.duration > 2) v.currentTime = 2
                                            }}
                                        >
                                            <source
                                                src={`${assetsUrl}/cdt-homepage/${d.file}#t=2`}
                                                type="video/mp4"
                                            />
                                        </video>
                                        <div
                                            className="absolute inset-0 transition-opacity"
                                            style={{
                                                background: isActive
                                                    ? 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)'
                                                    : 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.7) 100%)',
                                            }}
                                        />
                                        <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-end">
                                            <span
                                                className="font-display font-semibold text-left text-white text-[0.75rem] sm:text-[0.8rem] leading-tight"
                                                style={{ letterSpacing: '-0.01em' }}
                                            >
                                                {t(`${d.key}.title`)}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                        <Link
                            href="/plugins"
                            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
                            style={{ color: 'var(--hp-primary-container)' }}
                        >
                            {t('pluginsLink')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

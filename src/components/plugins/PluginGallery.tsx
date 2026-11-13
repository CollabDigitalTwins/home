'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import PluginOverviewVideo from './PluginOverviewVideo'
import {
  MATURITY_LEVELS,
  PLUGINS_DOCS_URL,
  pluginVideoUrl,
  sortedPlugins,
  type MaturityLevel,
  type PluginEntry,
} from '@/data/plugins'
import type { Language } from '@/lib/language'

interface PluginGalleryProps {
  assetsUrl: string
  expandedSlug: string | null
  onExpand: (slug: string | null) => void
}

type LevelFilter = MaturityLevel | 'all'

function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const read = () => setCanHover(mq.matches)
    read()
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  return canHover
}

export default function PluginGallery({ assetsUrl, expandedSlug, onExpand }: PluginGalleryProps) {
  const t = useTranslations('PluginsPage')
  const locale = useLocale() as Language
  const [filter, setFilter] = useState<LevelFilter>('all')
  const canHover = useCanHover()

  const plugins = useMemo(() => sortedPlugins(locale), [locale])
  const usedLevels = MATURITY_LEVELS.filter((l) => plugins.some((p) => p.level === l))
  const visible = plugins.filter((p) => filter === 'all' || p.level === filter || p.slug === expandedSlug)

  useEffect(() => {
    if (!expandedSlug) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onExpand(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expandedSlug, onExpand])

  return (
    <section id="gallery" className="pb-24 relative" style={{ background: 'var(--hp-surface)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <PluginOverviewVideo assetsUrl={assetsUrl} />

          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="section-label">{t('gallery.label')}</div>
                <h2
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'var(--hp-on-surface)' }}
                >
                  {t('gallery.title')}
                </h2>
              </div>
              <div
                role="group"
                aria-label={t('maturity.label')}
                className="flex gap-2 overflow-x-auto max-w-full pb-1 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                  {t('gallery.filterAll')}
                </FilterChip>
                {usedLevels.map((level) => (
                  <FilterChip key={level} active={filter === level} onClick={() => setFilter(level)}>
                    {t('gallery.levelName', { n: level, name: t(`levels.${level}`) })}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div
              className="grid gap-3 sm:gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 15rem), 1fr))', gridAutoFlow: 'dense' }}
            >
              {visible.map((plugin) => (
                <PluginTile
                  key={plugin.slug}
                  plugin={plugin}
                  assetsUrl={assetsUrl}
                  expanded={plugin.slug === expandedSlug}
                  canHover={canHover}
                  onToggle={() => onExpand(plugin.slug === expandedSlug ? null : plugin.slug)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold transition-colors"
      style={{
        background: active ? 'var(--hp-primary-container)' : 'var(--hp-mid, transparent)',
        color: active ? '#fff' : 'var(--hp-on-surface-variant)',
        border: `1px solid ${active ? 'transparent' : 'var(--hp-outline-variant, rgba(74, 61, 92, 0.18))'}`,
      }}
    >
      {children}
    </button>
  )
}

interface PluginTileProps {
  plugin: PluginEntry
  assetsUrl: string
  expanded: boolean
  canHover: boolean
  onToggle: () => void
}

function PluginTile({ plugin, assetsUrl, expanded, canHover, onToggle }: PluginTileProps) {
  const t = useTranslations('PluginsPage')
  const locale = useLocale() as Language
  const tileRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const name = plugin.name[locale]
  const src = pluginVideoUrl(assetsUrl, plugin.video)

  useEffect(() => {
    const v = videoRef.current
    if (!expanded) {
      v?.pause()
      setHovering(false)
      return
    }
    v?.play().catch(() => undefined)
    tileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [expanded])

  const startPreview = () => {
    if (!canHover || expanded) return
    setHovering(true)
    videoRef.current?.play().catch(() => undefined)
  }

  const stopPreview = () => {
    if (expanded) return
    setHovering(false)
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = plugin.thumbnailTime
  }

  const showName = expanded ? false : hovering || !canHover
  const levelBadge = t('gallery.levelName', { n: plugin.level, name: t(`levels.${plugin.level}`) })

  return (
    <motion.article
      ref={tileRef}
      id={plugin.slug}
      layout
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="scroll-mt-28"
      style={{ gridColumn: expanded ? '1 / -1' : undefined }}
    >
      <div className={expanded ? 'tonal-card overflow-hidden' : ''}>
        <div
          className={`group relative w-full aspect-video overflow-hidden bg-black ${expanded ? 'rounded-t-xl' : 'rounded-2xl'}`}
          onMouseEnter={startPreview}
          onMouseLeave={stopPreview}
        >
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ${expanded ? 'object-contain' : 'object-cover group-hover:scale-[1.03]'}`}
              muted={!expanded}
              loop
              playsInline
              controls={expanded}
              preload="metadata"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget
                if (v.paused && v.duration > plugin.thumbnailTime) v.currentTime = plugin.thumbnailTime
              }}
            >
              <source src={`${src}#t=${plugin.thumbnailTime}`} type="video/mp4" />
            </video>
            {!expanded && (
              <button
                type="button"
                onClick={onToggle}
                onFocus={startPreview}
                onBlur={stopPreview}
                aria-expanded={false}
                aria-label={t('gallery.open', { name })}
                className="absolute inset-0 w-full h-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-2xl"
              >
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)',
                    opacity: showName ? 1 : 0,
                  }}
                />
                <span
                  className="absolute bottom-0 left-0 right-0 p-3 text-left font-display font-semibold text-white text-[0.9rem] leading-tight transition-all duration-300"
                  style={{ opacity: showName ? 1 : 0, transform: showName ? 'none' : 'translateY(6px)', letterSpacing: '-0.01em' }}
                >
                  {name}
                  <span className="mt-1 block font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {levelBadge}
                  </span>
                </span>
                <span
                  className="absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold text-white"
                  style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                >
                  {plugin.shortName[locale]}
                </span>
              </button>
            )}
          {expanded && (
            <button
              type="button"
              onClick={onToggle}
              aria-label={t('gallery.close')}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative p-5 sm:p-7 space-y-3"
          >
            <span
              className="inline-block font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--hp-primary-container)' }}
            >
              {levelBadge}
            </span>
            <h3
              className="font-display font-bold"
              style={{ fontSize: '1.4rem', lineHeight: '1.2', letterSpacing: '-0.01em', color: 'var(--hp-on-surface)' }}
            >
              {name}
            </h3>
            <p className="max-w-3xl text-[0.97rem] leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
              {plugin.description[locale]}
            </p>
            <a
              href={PLUGINS_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
              style={{ color: 'var(--hp-primary-container)' }}
            >
              {t('gallery.pluginDocs')}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import PluginOverviewVideo from './PluginOverviewVideo'
import {
  PLUGIN_CATEGORIES,
  PLUGINS_DOCS_URL,
  pluginVideoUrl,
  sortedPlugins,
  type PluginCategory,
  type PluginEntry,
} from '@/data/plugins'
import type { Language } from '@/lib/language'

interface PluginGalleryProps {
  assetsUrl: string
  expandedSlug: string | null
  onExpand: (slug: string | null) => void
}

type CategoryFilter = PluginCategory | 'all'

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
  const [filter, setFilter] = useState<CategoryFilter>('all')
  const canHover = useCanHover()

  const plugins = useMemo(() => sortedPlugins(locale), [locale])
  const usedCategories = PLUGIN_CATEGORIES.filter((c) => plugins.some((p) => p.category === c))
  const isVisible = (p: PluginEntry) => filter === 'all' || p.category === filter || p.slug === expandedSlug

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
                aria-label={t('gallery.categories')}
                className="flex gap-2 overflow-x-auto max-w-full pb-1 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                  {t('gallery.filterAll')}
                </FilterChip>
                {usedCategories.map((category) => (
                  <FilterChip key={category} active={filter === category} onClick={() => setFilter(category)}>
                    {t(`categories.${category}.name`)}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div
              className="grid grid-cols-3 gap-2 sm:gap-4 sm:[grid-template-columns:repeat(auto-fill,minmax(15rem,1fr))]"
              style={{ gridAutoFlow: 'dense' }}
            >
              {plugins.map((plugin) => (
                <PluginTile
                  key={plugin.slug}
                  plugin={plugin}
                  assetsUrl={assetsUrl}
                  hidden={!isVisible(plugin)}
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
  hidden: boolean
  expanded: boolean
  canHover: boolean
  onToggle: () => void
}

function PluginTile({ plugin, assetsUrl, hidden, expanded, canHover, onToggle }: PluginTileProps) {
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
  const categoryName = t(`categories.${plugin.category}.name`)

  return (
    <motion.article
      ref={tileRef}
      id={plugin.slug}
      hidden={hidden}
      layout
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="scroll-mt-28"
      style={{ gridColumn: expanded ? '1 / -1' : undefined }}
    >
      <div className={expanded ? 'tonal-card overflow-hidden' : ''}>
        <div
          className={`group relative w-full aspect-video overflow-hidden bg-black ${expanded ? 'rounded-t-xl' : 'rounded-lg sm:rounded-2xl'}`}
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
                className="absolute inset-0 w-full h-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg sm:rounded-2xl"
              >
                <div
                  className="hidden sm:block absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)',
                    opacity: showName ? 1 : 0,
                  }}
                />
                <span
                  className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 text-left font-display font-semibold text-white text-[0.9rem] leading-tight transition-all duration-300"
                  style={{ opacity: showName ? 1 : 0, transform: showName ? 'none' : 'translateY(6px)', letterSpacing: '-0.01em' }}
                >
                  {name}
                  <span className="mt-1 block font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/75">
                    {categoryName}
                  </span>
                </span>
                <span
                  className="absolute top-1 left-1 sm:top-2 sm:left-2 max-w-[calc(100%-0.5rem)] truncate rounded-full px-1.5 sm:px-2.5 py-0.5 text-[0.6rem] sm:text-[0.72rem] font-semibold text-white"
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
              {categoryName}
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

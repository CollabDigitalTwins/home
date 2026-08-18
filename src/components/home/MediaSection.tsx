'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { MEDIA_ARTICLES, type MediaArticle, type MediaCategory } from '@/data/mediaArticles'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const DEFAULT_THUMB = `${BASE}/images/cdt-og_card.png`

type Filter = MediaCategory | 'all'

const CATEGORY_ORDER: MediaCategory[] = ['press', 'industry', 'award']

const SORTED = [...MEDIA_ARTICLES].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

const FILTERS: Filter[] = [
  'all',
  ...CATEGORY_ORDER.filter((c) => MEDIA_ARTICLES.some((a) => a.category === c)),
]

export default function MediaSection() {
  const t = useTranslations('HomePage.media')
  const [active, setActive] = useState<Filter>('all')
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  const visible = active === 'all' ? SORTED : SORTED.filter((a) => a.category === active)

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return

    const totalPages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    const nextPage = Math.min(totalPages, Math.max(1, Math.floor(el.scrollLeft / el.clientWidth) + 1))

    setPageCount(totalPages)
    setCurrentPage(nextPage)
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const onScroll = () => updateScrollState()
    const onResize = () => updateScrollState()

    updateScrollState()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [visible.length])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    el.scrollTo({ left: 0, behavior: 'smooth' })
    updateScrollState()
  }, [active])

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return

    const step = Math.max(el.clientWidth * 0.95, 320)
    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <section
      id="media"
      className="py-20 md:py-24 relative"
      style={{ background: 'var(--hp-low)' }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-8 max-w-3xl space-y-3"
          >
            <div className="section-label">{t('sectionLabel')}</div>
            <h2
              className="font-display font-bold"
              style={{
                fontSize: 'clamp(1.85rem, 3.6vw, 2.85rem)',
                lineHeight: '1.12',
                letterSpacing: '-0.02em',
                color: 'var(--hp-on-surface)',
              }}
            >
              {t('title')}
            </h2>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={t('filterLabel')}>
            {FILTERS.map((filter) => {
              const selected = active === filter
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActive(filter)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)]"
                  style={{
                    background: selected ? 'var(--hp-primary-container)' : 'var(--hp-lowest)',
                    color: selected ? 'var(--hp-on-primary-ctr)' : 'var(--hp-on-surface-variant)',
                    border: selected
                      ? '1px solid var(--hp-primary-container)'
                      : '1px solid rgba(74, 61, 92, 0.18)',
                  }}
                  aria-pressed={selected}
                >
                  {filter === 'all' ? t('filterAll') : t(`categories.${filter}`)}
                </button>
              )
            })}
          </div>

          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm" style={{ color: 'var(--hp-on-surface-variant)' }}>
              {currentPage} / {pageCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={!canScrollLeft}
                aria-label={t('previousPage')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--hp-lowest)',
                  color: 'var(--hp-on-surface-variant)',
                  border: '1px solid rgba(74, 61, 92, 0.18)',
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={!canScrollRight}
                aria-label={t('nextPage')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--hp-lowest)',
                  color: 'var(--hp-on-surface-variant)',
                  border: '1px solid rgba(74, 61, 92, 0.18)',
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="media-track flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory"
          >
            {visible.map((article, idx) => (
              <ArticleCard key={article.key} article={article} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleCard({ article, idx }: { article: MediaArticle; idx: number }) {
  const format = useFormatter()

  return (
    <motion.a
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.06 * idx }}
      className="tonal-card overflow-hidden flex flex-col group flex-none snap-start w-[min(88vw,24rem)] sm:w-[min(52vw,22rem)] lg:w-[22rem]"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '3 / 2', background: 'var(--hp-low)' }}
      >
        <img
          src={article.image ?? article.fallbackImage ?? DEFAULT_THUMB}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget
            if (img.dataset.fellBack) return
            img.dataset.fellBack = 'true'
            img.src = article.fallbackImage ?? DEFAULT_THUMB
          }}
        />
      </div>
      <div className="p-5 md:p-6 flex flex-col gap-2 flex-1">
        <div className="section-label" style={{ letterSpacing: '0.18em', fontSize: '0.65rem' }}>
          {article.outlet}
        </div>
        <div className="flex items-start justify-between gap-3 flex-1">
          <h3
            className="font-display font-semibold"
            style={{
              fontSize: '1.05rem',
              lineHeight: '1.25',
              letterSpacing: '-0.01em',
              color: 'var(--hp-on-surface)',
            }}
          >
            {article.title}
          </h3>
          <ArrowUpRight
            className="w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: 'var(--hp-primary-container)' }}
          />
        </div>
        {article.date && (
          <time
            dateTime={article.date}
            className="text-[0.85rem]"
            style={{ color: 'var(--hp-on-surface-variant)' }}
          >
            {format.dateTime(new Date(article.date), {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
        )}
      </div>
    </motion.a>
  )
}

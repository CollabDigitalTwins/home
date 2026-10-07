'use client'

import { motion } from 'framer-motion'
import { User, Code2, Server, ArrowRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

const DOCS_BASE = 'https://docs.collabdt.org'

interface StartCard {
  key: 'user' | 'developer' | 'deployment'
  icon: LucideIcon
  href: string
}

const START_CARDS: StartCard[] = [
  { key: 'user', icon: User, href: `${DOCS_BASE}/docs/guides/overview` },
  { key: 'developer', icon: Code2, href: `${DOCS_BASE}/docs/developer-introduction` },
  { key: 'deployment', icon: Server, href: `${DOCS_BASE}/docs/deployment/overview` },
]

export default function DocsHeroSection() {
  const t = useTranslations('HomePage.docsHero')

  return (
    <section
      className="relative overflow-hidden py-20 md:py-24"
      style={{ background: 'var(--hp-surface)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(239,145,97,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <div className="space-y-5">
            <h2
              className="font-display font-bold"
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
                lineHeight: '1.04',
                letterSpacing: '-0.02em',
                color: 'var(--hp-on-surface)',
              }}
            >
              <span style={{ color: 'var(--hp-primary-container)' }}>{t('titleAccent')}</span>{' '}
              {t('title')}
            </h2>

            <p
              className="text-lg leading-relaxed max-w-xl mx-auto"
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-5">
            <div className="section-label justify-center">{t('startLabel')}</div>

            <div className="grid sm:grid-cols-3 gap-x-3 gap-y-4 text-left">
              {START_CARDS.map(({ key, icon: Icon, href }, idx) => (
                <motion.a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + 0.07 * idx }}
                  className="tab-card group"
                >
                  <span className="tab-card-tab">{t(`${key}.tab`)}</span>
                  <span className="tab-card-glyph" aria-hidden>
                    <Icon className="w-[22px] h-[22px]" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <h3
                        className="font-display font-bold"
                        style={{ fontSize: '1rem', lineHeight: '1.3', color: 'var(--hp-on-surface)' }}
                      >
                        {t(`${key}.title`)}
                      </h3>
                      <ArrowUpRight
                        className="w-4 h-4 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                        style={{ color: 'var(--hp-primary-container)' }}
                        aria-hidden
                      />
                    </div>
                    <p
                      className="text-[0.85rem] leading-snug"
                      style={{ color: 'var(--hp-on-surface-variant)' }}
                    >
                      {t(`${key}.body`)}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <p className="text-[0.9rem]" style={{ color: 'var(--hp-on-surface-variant)' }}>
              {t('browseAll')}{' '}
              <a
                href={`${DOCS_BASE}/site-map`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)] rounded"
                style={{ color: 'var(--hp-primary-container)' }}
              >
                {t('siteMap')}
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

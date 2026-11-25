'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Award {
  key: 'openBIM' | 'buildingTransformations'
  image: string
  alt: string
  href: string
}

const AWARDS: Award[] = [
  {
    key: 'openBIM',
    image: '/images/homepage/recognition/CDT-openBIM%20award.png',
    alt: 'buildingSMART openBIM Award — Professional Research 2025',
    href: 'https://www.buildingsmart.org/the-buildingsmart-openbim-awards-2025-winners-announced/',
  },
  {
    key: 'buildingTransformations',
    image: '/images/homepage/recognition/cdt-bt_award.png',
    alt: 'Building Transformations Awards 2024 — Research Award and Innovation Award',
    href: 'https://www.buildingtransformations.org/submissions/canada-s-digital-twin',
  },
]

export default function RecognitionSection() {
  const t = useTranslations('HomePage.recognition')

  return (
    <section
      id="recognition"
      className="py-20 md:py-24 relative"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-10 max-w-3xl space-y-3"
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

          <div className="grid md:grid-cols-2 gap-5">
            {AWARDS.map((award, idx) => (
              <motion.a
                key={award.key}
                href={award.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="tonal-card overflow-hidden flex flex-col group"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '3 / 2', background: 'var(--hp-low)' }}
                >
                  <img
                    src={award.image}
                    alt={award.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 md:p-6 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="font-display font-semibold"
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: '1.25',
                        letterSpacing: '-0.01em',
                        color: 'var(--hp-on-surface)',
                      }}
                    >
                      {t(`${award.key}.title`)}
                    </h3>
                    <ArrowUpRight
                      className="w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: 'var(--hp-primary-container)' }}
                    />
                  </div>
                  <p
                    className="text-[0.9rem] leading-relaxed"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t(`${award.key}.body`)}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

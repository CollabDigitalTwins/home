'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const CAPABILITIES = ['bridge', 'interop', 'extend', 'deploy', 'customize', 'train'] as const

export default function CapabilitiesSection() {
  const t = useTranslations('HomePage.capabilities')

  return (
    <section id="capabilities" className="py-20 md:py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
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
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: '1.08',
                letterSpacing: '-0.02em',
                color: 'var(--hp-on-surface)',
              }}
            >
              {t('title')}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-x-10 lg:gap-x-16">
            {CAPABILITIES.map((key, idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.06 * idx }}
                className="py-6 border-t"
                style={{ borderColor: 'var(--hp-outline-variant)' }}
              >
                <div className="space-y-1.5">
                  <h3
                    className="font-display font-bold"
                    style={{
                      fontSize: '1.1rem',
                      lineHeight: '1.3',
                      letterSpacing: '-0.01em',
                      color: 'var(--hp-on-surface)',
                    }}
                  >
                    {t(`${key}.title`)}
                  </h3>
                  <p
                    className="text-[0.95rem] leading-relaxed"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t(`${key}.body`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

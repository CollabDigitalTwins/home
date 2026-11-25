'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

interface FaqLink {
  href: string
  label: string
}

interface FaqItem {
  question: string
  answer: string
  link?: FaqLink
}

const isExternal = (href: string) => /^https?:\/\//.test(href)

function AnswerLink({ link }: { link: FaqLink }) {
  const className =
    'inline-flex items-center gap-1.5 text-[0.9rem] font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)] rounded'
  const style = { color: 'var(--hp-primary-container)' }

  if (isExternal(link.href)) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {link.label}
        <ArrowUpRight className="w-4 h-4" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={link.href} className={className} style={style}>
      {link.label}
      <ArrowRight className="w-4 h-4" aria-hidden />
    </Link>
  )
}

export default function FaqSection() {
  const t = useTranslations('HomePage.faq')
  const items = t.raw('items') as FaqItem[]
  const [open, setOpen] = useState<number | null>(0)
  const reduceMotion = useReducedMotion()

  // FAQPage structured data so the answers are eligible for rich results.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <section className="py-20 md:py-24 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-4"
        >
          <div className="section-label justify-center">{t('eyebrow')}</div>
          <h2
            className="font-display font-bold tracking-tight"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: 'var(--hp-on-surface)',
            }}
          >
            {t('title')}
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, idx) => {
            const isOpen = open === idx
            const questionId = `faq-question-${idx}`
            const answerId = `faq-answer-${idx}`
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.04 * idx }}
                className="tonal-card overflow-hidden"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={questionId}
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--hp-primary-container)] rounded-xl"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span
                      className="font-display font-semibold"
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: '1.3',
                        color: 'var(--hp-on-surface)',
                      }}
                    >
                      {item.question}
                    </span>
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                      aria-hidden="true"
                      style={{
                        color: 'var(--hp-primary-container)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                </h3>
                <motion.div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  inert={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-3">
                    <p
                      className="text-[0.95rem] leading-relaxed"
                      style={{ color: 'var(--hp-on-surface-variant)' }}
                    >
                      {item.answer}
                    </p>
                    {item.link && <AnswerLink link={item.link} />}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[0.95rem]" style={{ color: 'var(--hp-on-surface-variant)' }}>
            {t('stillQuestions')}{' '}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hp-primary-container)] rounded"
              style={{ color: 'var(--hp-primary-container)' }}
            >
              {t('contactCta')}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Landmark, FlaskConical, Code2, MoreHorizontal, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

type AudienceKey = 'aec' | 'public' | 'research' | 'developer' | 'other'

interface AudienceChip {
  key: AudienceKey
  labelKey: string
  icon: LucideIcon
}

const AUDIENCES: AudienceChip[] = [
  { key: 'aec', labelKey: 'audienceAec', icon: Building2 },
  { key: 'public', labelKey: 'audiencePublic', icon: Landmark },
  { key: 'research', labelKey: 'audienceResearch', icon: FlaskConical },
  { key: 'developer', labelKey: 'audienceDeveloper', icon: Code2 },
  { key: 'other', labelKey: 'audienceOther', icon: MoreHorizontal },
]

interface ContactSectionProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting?: boolean
}

export default function ContactSection({ onSubmit, isSubmitting = false }: ContactSectionProps) {
  const t = useTranslations('HomePage.contact')
  const [audience, setAudience] = useState<AudienceKey>('aec')
  const [isDemoRequest, setIsDemoRequest] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem('cdt_demo_request')
      if (flag === '1') {
        setIsDemoRequest(true)
        if (messageRef.current && !messageRef.current.value) {
          messageRef.current.value = "I'd like to request a demo of the platform."
        }
        sessionStorage.removeItem('cdt_demo_request')
      }
    } catch {}
  }, [])

  return (
    <section
      id="contact"
      className="pt-32 md:pt-40 pb-20 md:pb-24 relative"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-12 space-y-5 max-w-2xl">
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
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {t('description')}
            </p>
          </div>

          <div
            className="tonal-card tonal-card-static p-8 md:p-10"
            style={
              isDemoRequest
                ? { boxShadow: '0 0 0 1px var(--hp-primary-container), 0 20px 40px rgba(239,145,97,0.15)' }
                : undefined
            }
          >
            <div className="space-y-3 mb-8">
              <p
                className="font-display text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--hp-on-surface-variant)' }}
              >
                {t('audienceLabel')}
              </p>
              <div className="flex flex-wrap gap-2">
                {AUDIENCES.map((a) => {
                  const Icon = a.icon
                  const selected = audience === a.key
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => setAudience(a.key)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={{
                        background: selected
                          ? 'var(--hp-primary-container)'
                          : 'var(--hp-mid)',
                        color: selected
                          ? 'var(--hp-on-primary-ctr)'
                          : 'var(--hp-on-surface-variant)',
                        border: selected
                          ? '1px solid var(--hp-primary-container)'
                          : '1px solid var(--hp-outline-variant)',
                      }}
                      aria-pressed={selected}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(a.labelKey as Parameters<typeof t>[0])}
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <input type="hidden" name="audience" value={audience} />
              <input
                type="hidden"
                name="inquiry_type"
                value={isDemoRequest ? 'demo_request' : 'general'}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="font-display text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t('firstName')}
                  </label>
                  <Input id="firstName" name="firstName" required className="hp-input" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="font-display text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t('lastName')}
                  </label>
                  <Input id="lastName" name="lastName" required className="hp-input" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="font-display text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t('email')}
                  </label>
                  <Input id="email" name="email" type="email" required className="hp-input" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="organization"
                    className="font-display text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--hp-on-surface-variant)' }}
                  >
                    {t('organization')}
                  </label>
                  <Input id="organization" name="organization" className="hp-input" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="font-display text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--hp-on-surface-variant)' }}
                >
                  {t('message')}
                </label>
                <Textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="hp-input resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="btn-sovereign w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('sending') : t('sendButton')}
              </Button>

              <p
                className="text-[0.9rem] text-center pt-1"
                style={{ color: 'var(--hp-on-surface-variant)' }}
              >
                {t('orEmail')}{' '}
                <a
                  href={`mailto:${t('infoEmail')}`}
                  className="hover:underline"
                  style={{ color: 'var(--hp-primary-container)' }}
                >
                  {t('infoEmail')}
                </a>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

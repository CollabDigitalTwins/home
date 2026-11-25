'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'

type SolutionKey = 'managedCloud' | 'selfManaged' | 'customDev' | 'training'

interface Solution {
  key: SolutionKey
  href: string
  external: boolean
}

const SOLUTIONS: Record<SolutionKey, Solution> = {
  managedCloud: { key: 'managedCloud', href: '/contact', external: false },
  selfManaged: { key: 'selfManaged', href: 'https://docs.collabdt.org/', external: true },
  customDev: { key: 'customDev', href: '/contact', external: false },
  training: { key: 'training', href: '/contact', external: false },
}

interface Group {
  labelKey: 'groupDeployment' | 'groupSupport'
  keys: SolutionKey[]
}

const GROUPS: Group[] = [
  { labelKey: 'groupDeployment', keys: ['managedCloud', 'selfManaged'] },
  { labelKey: 'groupSupport', keys: ['customDev', 'training'] },
]

function SolutionCard({ sol, idx }: { sol: Solution; idx: number }) {
  const t = useTranslations('HomePage.solutions')
  const linkClass = 'inline-flex items-center gap-1 font-medium'
  const linkStyle = { color: 'var(--hp-primary-container)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.08 * idx }}
      className="tonal-card p-7 flex flex-col"
    >
      <div className="mb-4">
        <span
          className="text-[0.65rem] font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--hp-on-surface-variant)' }}
        >
          {t(`${sol.key}.tag`)}
        </span>
      </div>

      <h3
        className="font-display font-bold mb-2"
        style={{ fontSize: '1.35rem', lineHeight: '1.2', letterSpacing: '-0.01em', color: 'var(--hp-on-surface)' }}
      >
        {t(`${sol.key}.name`)}
      </h3>
      <p className="font-display text-base mb-3" style={{ color: 'var(--hp-primary-container)' }}>
        {t(`${sol.key}.headline`)}
      </p>
      <p className="text-[0.95rem] leading-relaxed mb-5" style={{ color: 'var(--hp-on-surface-variant)' }}>
        {t(`${sol.key}.body`)}
      </p>

      <ul className="space-y-2 mb-7 flex-grow">
        {(['feature1', 'feature2', 'feature3', 'feature4'] as const).map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-[0.9rem]"
            style={{ color: 'var(--hp-on-surface-variant)' }}
          >
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--hp-primary-container)' }} />
            <span>{t(`${sol.key}.${f}`)}</span>
          </li>
        ))}
      </ul>

      <Button variant="ghost" size="sm" className="self-start -ml-2 px-2 group" asChild>
        {sol.external ? (
          <a href={sol.href} target="_blank" rel="noopener noreferrer" className={linkClass} style={linkStyle}>
            {t(`${sol.key}.cta`)}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        ) : (
          <Link href={sol.href} className={linkClass} style={linkStyle}>
            {t(`${sol.key}.cta`)}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </Button>
    </motion.div>
  )
}

export default function SolutionsSection() {
  const t = useTranslations('HomePage.solutions')

  return (
    <section id="solutions" className="pb-20 md:pb-24 pt-4 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {GROUPS.map((group) => (
            <div key={group.labelKey} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <h2
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
                    lineHeight: '1.15',
                    letterSpacing: '-0.02em',
                    color: 'var(--hp-on-surface)',
                  }}
                >
                  {t(group.labelKey)}
                </h2>
                <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--hp-on-surface-variant)' }}>
                  {t(`${group.labelKey}Sub`)}
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-5">
                {group.keys.map((key, idx) => (
                  <SolutionCard key={key} sol={SOLUTIONS[key]} idx={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

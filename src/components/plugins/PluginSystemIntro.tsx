'use client'

import { Blocks, FolderInput, ShieldCheck, ToggleRight, Waypoints } from 'lucide-react'
import { useTranslations } from 'next-intl'
import DocsEmbed from './DocsEmbed'
import SectionHeading from './SectionHeading'
import { PLUGINS_DOCS_URL } from '@/data/plugins'

const POINTS = [
  { key: 'core', Icon: Blocks },
  { key: 'ways', Icon: FolderInput },
  { key: 'enable', Icon: ToggleRight },
  { key: 'standards', Icon: Waypoints },
] as const

export default function PluginSystemIntro() {
  const t = useTranslations('PluginsPage.how')

  return (
    <section id="how-it-works" className="py-24 relative" style={{ background: 'var(--hp-low)' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading label={t('label')} title={t('title')} body={t('body')} />

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 15rem), 1fr))' }}>
            {POINTS.map(({ key, Icon }) => (
              <div key={key} className="tonal-card p-6 space-y-3">
                <Icon className="w-5 h-5" style={{ color: 'var(--hp-primary-container)' }} strokeWidth={2} />
                <h3 className="font-display font-semibold text-[1.05rem]" style={{ color: 'var(--hp-on-surface)' }}>
                  {t(`points.${key}.title`)}
                </h3>
                <p className="text-[0.92rem] leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
                  {t(`points.${key}.body`)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 text-[0.92rem]" style={{ color: 'var(--hp-on-surface-variant)' }}>
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
            {t('security')}
          </p>

          <h3
            className="mt-16 mb-5 font-display font-bold text-[1.25rem]"
            style={{ color: 'var(--hp-on-surface)', letterSpacing: '-0.01em' }}
          >
            {t('surfacesTitle')}
          </h3>
          <DocsEmbed
            id="plugin-surfaces"
            path="/embed/plugin-surfaces/"
            title={t('surfacesTitle')}
            docsUrl={PLUGINS_DOCS_URL}
            docsLabel={t('openInDocs')}
          />
        </div>
      </div>
    </section>
  )
}

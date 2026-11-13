'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import PluginGallery from './PluginGallery'
import PluginMaturityEmbed from './PluginMaturityEmbed'
import PluginSystemIntro from './PluginSystemIntro'
import SectionHeading from './SectionHeading'
import { PLUGINS, PLUGINS_DOCS_URL } from '@/data/plugins'

const DOCS_BASE = 'https://docs.collabdt.org/docs/plugins'

const isPluginSlug = (slug: string) => PLUGINS.some((p) => p.slug === slug)

export default function PluginsPageBody({ assetsUrl }: { assetsUrl: string }) {
  const t = useTranslations('PluginsPage')
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1))
      if (isPluginSlug(slug)) setExpandedSlug(slug)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const expand = useCallback((slug: string | null) => {
    setExpandedSlug(slug && isPluginSlug(slug) ? slug : null)
  }, [])

  return (
    <>
      <PluginGallery assetsUrl={assetsUrl} expandedSlug={expandedSlug} onExpand={expand} />

      <section id="maturity" className="py-24 relative" style={{ background: 'var(--hp-low)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <PluginMaturityEmbed onSelect={expand} />
          </div>
        </div>
      </section>

      <PluginSystemIntro />

      <section id="build" className="py-24 relative" style={{ background: 'var(--hp-low)' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading label={t('build.label')} title={t('build.title')} body={t('build.body')} />
            <pre
              className="mb-8 inline-block max-w-full overflow-x-auto rounded-lg px-4 py-3 font-mono text-[0.9rem]"
              style={{ background: 'var(--hp-mid, rgba(0,0,0,0.06))', color: 'var(--hp-on-surface)', border: '1px solid var(--hp-outline-variant, rgba(74, 61, 92, 0.18))' }}
            >
              npx create-cdt-plugin
            </pre>
            <div className="flex flex-wrap gap-3">
              <DocsButton href={`${DOCS_BASE}/create-your-first-plugin`} primary>
                {t('build.firstPlugin')}
              </DocsButton>
              <DocsButton href={`${DOCS_BASE}/building-a-plugin-with-ai`}>{t('build.withAi')}</DocsButton>
              <DocsButton href={PLUGINS_DOCS_URL}>{t('readDocs')}</DocsButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function DocsButton({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
      style={{
        background: primary ? 'var(--hp-primary-container)' : 'transparent',
        color: primary ? '#fff' : 'var(--hp-on-surface)',
        border: primary ? '1px solid transparent' : '1px solid var(--hp-outline-variant, rgba(74, 61, 92, 0.3))',
      }}
    >
      {children}
      <ArrowUpRight className="w-4 h-4" />
    </a>
  )
}

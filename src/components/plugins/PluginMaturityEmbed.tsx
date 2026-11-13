'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import DocsEmbed, { DOCS_ORIGIN, type EmbedMessage } from './DocsEmbed'
import { PLUGINS } from '@/data/plugins'
import type { Language } from '@/lib/language'

interface PluginMaturityEmbedProps {
  onSelect: (slug: string) => void
}

export default function PluginMaturityEmbed({ onSelect }: PluginMaturityEmbedProps) {
  const t = useTranslations('PluginsPage')
  const locale = useLocale() as Language
  const frameRef = useRef<HTMLIFrameElement | null>(null)

  const sendUseCases = useCallback(
    (frame: HTMLIFrameElement) => {
      const items = PLUGINS.map((p) => ({ id: p.slug, label: p.name[locale], level: p.level }))
      frame.contentWindow?.postMessage({ type: 'cdt-mm-usecases', items }, DOCS_ORIGIN)
    },
    [locale],
  )

  useEffect(() => {
    if (frameRef.current) sendUseCases(frameRef.current)
  }, [sendUseCases])

  const handleMessage = (data: EmbedMessage, frame: HTMLIFrameElement) => {
    frameRef.current = frame
    if (data.type === 'cdt-mm-ready') sendUseCases(frame)
    if (data.type === 'cdt-mm-select' && typeof data.id === 'string') onSelect(data.id)
  }

  return (
    <DocsEmbed
      id="maturity-model"
      path="/embed/maturity-model/"
      title={t('maturity.label')}
      docsUrl="https://docs.collabdt.org/docs/plugins/overview#plugins-on-the-maturity-model"
      docsLabel={t('how.openInDocs')}
      onMessage={handleMessage}
    />
  )
}

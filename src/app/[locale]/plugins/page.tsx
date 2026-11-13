import { setRequestLocale, getTranslations } from 'next-intl/server'
import { SiteChrome } from '@/components/home/SiteChrome'
import PageHeader from '@/components/home/PageHeader'
import PluginsPageBody from '@/components/plugins/PluginsPageBody'
import { PLUGINS_DOCS_URL } from '@/data/plugins'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PluginsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'PluginsPage' })
  const assetsUrl = process.env.NEXT_PUBLIC_MINIO_BUCKET_URL || ''

  return (
    <SiteChrome>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')}>
        <a
          href={PLUGINS_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: 'var(--hp-primary-container)' }}
        >
          {t('readDocs')}
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </PageHeader>
      <PluginsPageBody assetsUrl={assetsUrl} />
    </SiteChrome>
  )
}

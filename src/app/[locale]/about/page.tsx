import { setRequestLocale, getTranslations } from 'next-intl/server'
import { SiteChrome } from '@/components/home/SiteChrome'
import PageHeader from '@/components/home/PageHeader'
import TeamSection from '@/components/home/TeamSection'
import RecognitionSection from '@/components/home/RecognitionSection'
import MediaSection from '@/components/home/MediaSection'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return (
    <SiteChrome>
      <PageHeader
        align="center"
        eyebrow={t('pageHeaders.about.eyebrow')}
        title={t('mission.title')}
        subtitle={t('mission.body')}
      />
      <TeamSection />
      <RecognitionSection />
      <MediaSection />
    </SiteChrome>
  )
}

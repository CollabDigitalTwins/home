'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { Language } from '@/lib/language'

export default function MaintenancePage() {
  const t = useTranslations('MaintenancePage')
  const locale = useLocale() as Language
  const router = useRouter()
  const pathname = usePathname()

  const selectLanguage = (target: Language) => {
    if (target === locale) return
    router.replace(pathname, { locale: target })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="absolute top-4 right-4">
        <LanguageToggle currentLanguage={locale} onSelect={selectLanguage} />
      </div>

      <div className="max-w-md w-full mx-auto text-center space-y-8">
        <Image
          src="/images/cdt-logo-stroke.svg"
          alt="Collab Digital Twins"
          width={160}
          height={160}
          className="mx-auto"
          priority
        />

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground leading-relaxed">{t('description')}</p>
          <p className="text-sm text-muted-foreground">{t('thankYou')}</p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {t('contactText')}{' '}
            <a
              href="mailto:support@collabdt.org"
              className="underline hover:text-foreground transition-colors"
            >
              support@collabdt.org
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

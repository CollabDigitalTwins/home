'use client'

import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import { Language } from '@/lib/language'

interface SiteChromeProps {
  children: React.ReactNode
}

/**
 * Shared site chrome (navbar + footer + theme/locale handling) wrapping
 * every routed page. Replaces the navbar/footer that used to live inline
 * in the single-page Home component.
 */
export function SiteChrome({ children }: SiteChromeProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const locale = useLocale() as Language
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem('cdt-theme')
    } catch {}
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    try {
      localStorage.setItem('cdt-theme', newTheme)
    } catch {}
  }

  const selectLanguage = (target: Language) => {
    if (target === locale) return
    router.replace(pathname, { locale: target })
  }

  return (
    <div className="hp min-h-screen text-foreground" style={{ background: 'var(--hp-surface)' }}>
      <Toaster richColors />
      <Navbar
        theme={theme}
        locale={locale}
        onToggleTheme={toggleTheme}
        onSelectLanguage={selectLanguage}
      />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

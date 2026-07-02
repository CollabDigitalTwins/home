'use client'

import { useEffect, useState } from 'react'
import { Home, Sun, Moon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { CdtIcon } from '@/components/ui/CdtIcon'
import './policy.css'

interface PolicyLayoutProps {
  children: React.ReactNode
  title: string
  eyebrow: string
  lastUpdated: string
  effectiveDate: string
  /** Brand suffix rendered after the terracotta "cdt" accent, e.g. "privacypolicy". */
  brand: string
}

export function PolicyLayout({ children, title, eyebrow, lastUpdated, effectiveDate, brand }: PolicyLayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

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
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem('cdt-theme', next)
    } catch {}
  }

  return (
    <div className={`policy-page${theme === 'dark' ? ' dark' : ''}`}>
      <nav className="policy-nav">
        <div className="policy-nav-inner">
          <Link href="/" className="policy-nav-brand" aria-label="Back to home">
            <CdtIcon className="policy-nav-logo" />
            <span className="policy-nav-brand-text">
              <span className="policy-nav-brand-accent">cdt</span>
              {brand}
            </span>
          </Link>

          <div className="policy-nav-actions">
            <button
              type="button"
              onClick={toggleTheme}
              className="policy-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link href="/" className="policy-nav-back" aria-label="Back to home" title="Back to home">
              <Home size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="policy-content">
        <div className="policy-hero">
          <div className="policy-eyebrow">{eyebrow}</div>
          <h1 className="policy-title">{title}</h1>
          <div className="policy-meta">
            <span>Last updated: {lastUpdated}</span>
            <span>Effective: {effectiveDate}</span>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}

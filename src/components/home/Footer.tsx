'use client'

import type { MouseEventHandler } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CdtIcon } from '@/components/ui/CdtIcon'
import { usePlatformLink } from '@/hooks/usePlatformLink'

const MAILING_LIST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScB12Qc7khiOk4a_E753jDccx6026AjO-_FINBKoZZZtkmqnA/viewform'
const DOCS_URL = 'https://docs.collabdt.org/'
const PLATFORM_URL = 'https://app.collabdt.org/cdt'

const LINK_CLASS =
  'text-[0.95rem] text-[color:var(--hp-on-surface-variant)] hover:text-[color:var(--hp-on-surface)] transition-colors duration-150 no-underline'

interface FooterLink {
  label: string
  href: string
  external?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

function FooterRow({ label, links }: { label: string; links: FooterLink[] }) {
  return (
    <div className="grid sm:grid-cols-[6.5rem_1fr] gap-1 sm:gap-4 items-baseline">
      <span className="font-mono text-[0.75rem]" style={{ color: 'var(--hp-outline)' }}>
        {label}
      </span>
      <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className={LINK_CLASS}
                onClick={link.onClick}
              >
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={LINK_CLASS}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const t = useTranslations('HomePage.footer')
  const handlePlatformClick = usePlatformLink()

  const rows: { label: string; links: FooterLink[] }[] = [
    {
      label: t('navigate'),
      links: [
        { label: t('navAbout'), href: '/about' },
        { label: t('navServices'), href: '/services' },
        { label: t('navPlugins'), href: '/plugins' },
        { label: t('navContact'), href: '/contact' },
        { label: t('navPlatform'), href: PLATFORM_URL, external: true, onClick: handlePlatformClick },
      ],
    },
    {
      label: t('resources'),
      links: [
        { label: t('documentation'), href: DOCS_URL, external: true },
        { label: t('betaAccess'), href: MAILING_LIST_URL, external: true },
        { label: 'info@collabdt.org', href: 'mailto:info@collabdt.org', external: true },
      ],
    },
    {
      label: t('legal'),
      links: [
        { label: t('privacyPolicy'), href: '/privacypolicy' },
        { label: t('cookiePolicy'), href: '/cookiepolicy' },
      ],
    },
  ]

  return (
    <footer className="relative">
      <div className="container mx-auto px-6 pt-28 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
            <div className="space-y-3 max-w-sm">
              <Link href="/" className="inline-flex items-center gap-3 no-underline" aria-label="Collab Digital Twins">
                <CdtIcon className="w-8 h-8" />
                <span
                  className="font-display text-xl tracking-wide lowercase"
                  style={{ color: 'var(--hp-on-surface)' }}
                >
                  <span style={{ color: 'var(--hp-primary-container)' }}>collab</span>
                  digitaltwins
                </span>
              </Link>
              <p className="font-mono text-[0.78rem]" style={{ color: 'var(--hp-outline)' }}>
                {t('tagline')}
              </p>
              <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
                {t('description')}
              </p>
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <FooterRow key={row.label} label={row.label} links={row.links} />
              ))}
            </div>
          </div>

          <div className="mt-20 space-y-1.5 text-center">
            <p className="text-[0.88rem]" style={{ color: 'var(--hp-on-surface-variant)' }}>
              {t('governance')}
            </p>
            <p className="text-xs" style={{ color: 'var(--hp-outline)' }}>
              {t('license')} · {t('stewardship')} · © {new Date().getFullYear()} {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

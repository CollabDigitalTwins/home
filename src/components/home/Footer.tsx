'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePlatformLink } from '@/hooks/usePlatformLink'

const NAV_LINKS = [
  { key: 'navAbout', href: '/about' },
  { key: 'navServices', href: '/services' },
  { key: 'navContact', href: '/contact' },
  { key: 'navPlatform', href: 'https://app.collabdt.org/cdt', external: true },
] as const

const MAILING_LIST_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScB12Qc7khiOk4a_E753jDccx6026AjO-_FINBKoZZZtkmqnA/viewform'
const DOCS_URL = 'https://docs.collabdt.org/'

export default function Footer() {
  const tFooter = useTranslations('HomePage.footer')
  const handlePlatformClick = usePlatformLink()

  return (
    <footer className="relative" style={{ background: 'var(--hp-lowest)' }}>
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          <div className="col-span-2 md:col-span-1 space-y-5">
            <div
              className="font-display font-bold"
              style={{ fontSize: '1.05rem', letterSpacing: '-0.01em', color: 'var(--hp-on-surface)' }}
            >
              Collab Digital Twins
            </div>
            <p
              className="text-[0.75rem] italic lowercase tracking-wide"
              style={{ color: 'var(--hp-primary-container)' }}
            >
              {tFooter('tagline')}
            </p>
            <p
              className="text-[0.9rem] leading-relaxed max-w-[260px]"
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {tFooter('description')}
            </p>
          </div>

          <div className="space-y-5">
            <div className="section-label">{tFooter('navigate')}</div>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => {
                const external = 'external' in link && link.external
                const className = 'text-[0.9rem] transition-colors duration-150'
                const style = { color: 'var(--hp-on-surface-variant)', textDecoration: 'none' }
                const onMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = 'var(--hp-on-surface)')
                const onMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = 'var(--hp-on-surface-variant)')
                return (
                  <li key={link.key}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                        style={style}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onClick={link.key === 'navPlatform' ? handlePlatformClick : undefined}
                      >
                        {tFooter(link.key)}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={className}
                        style={style}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                      >
                        {tFooter(link.key)}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="section-label">{tFooter('resources')}</div>
            <ul className="space-y-3">
              <li>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.9rem] transition-colors duration-150"
                  style={{ color: 'var(--hp-on-surface-variant)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface-variant)')}
                >
                  {tFooter('documentation')}
                </a>
              </li>
              <li>
                <a
                  href={MAILING_LIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.9rem] transition-colors duration-150"
                  style={{ color: 'var(--hp-on-surface-variant)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface-variant)')}
                >
                  {tFooter('betaAccess')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@collabdt.org"
                  className="text-[0.9rem] transition-colors duration-150"
                  style={{ color: 'var(--hp-on-surface-variant)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface-variant)')}
                >
                  info@collabdt.org
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <div className="section-label">{tFooter('legal')}</div>
            <ul className="space-y-3">
              <li>
                <p
                  className="text-[0.9rem] leading-relaxed"
                  style={{ color: 'var(--hp-on-surface-variant)' }}
                >
                  {tFooter('license')}
                </p>
              </li>
              {([
                { key: 'privacyPolicy', href: '/privacypolicy' },
                { key: 'cookiePolicy', href: '/cookiepolicy' },
              ] as const).map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-[0.9rem] transition-colors duration-150"
                    style={{ color: 'var(--hp-on-surface-variant)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hp-on-surface-variant)')}
                  >
                    {tFooter(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-16 pt-8 max-w-5xl mx-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p
            className="text-xs leading-relaxed text-center max-w-3xl mx-auto"
            style={{ color: 'var(--hp-on-surface-variant)' }}
          >
            {tFooter('governance')}
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          <p className="text-xs" style={{ color: 'var(--hp-outline)' }}>
            {tFooter('stewardship')}
          </p>
          <p className="text-xs" style={{ color: 'var(--hp-outline)' }}>
            © {new Date().getFullYear()} {tFooter('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

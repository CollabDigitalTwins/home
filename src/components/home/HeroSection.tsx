'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import Globe from '@/components/ui/Globe'
import { usePlatformLink } from '@/hooks/usePlatformLink'

const GH_URL = 'https://github.com/CollabDigitalTwins/core'
const MAP_STYLE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

interface HeroSectionProps {
  assetsUrl: string
}

export default function HeroSection({ assetsUrl }: HeroSectionProps) {
  const tHero = useTranslations('HomePage.hero')
  const tGh = useTranslations('HomePage.githubRelease')
  const handlePlatformClick = usePlatformLink()

  // Below `md` (768px) the two-up layout collapses and the right column is gone,
  // so we drop the globe in as a dimmed full-bleed backdrop instead. Gating on a
  // media query (rather than CSS `hidden`) means only ONE globe ever mounts — we
  // never pay for two WebGL contexts + duplicate data fetches. Defaults to the
  // desktop branch so SSR and first client paint agree (no hydration mismatch).
  // `reduceMotion` skips the mobile backdrop entirely for users who ask their OS
  // to minimise motion (the constantly-rotating globe is exactly that).
  const [isMobile, setIsMobile] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setIsMobile(mqMobile.matches)
      setReduceMotion(mqMotion.matches)
    }
    update()
    mqMobile.addEventListener('change', update)
    mqMotion.addEventListener('change', update)
    return () => {
      mqMobile.removeEventListener('change', update)
      mqMotion.removeEventListener('change', update)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
      style={{ background: 'var(--hp-surface)' }}
    >
      <AnimatedBackground assetsUrl={assetsUrl} />

      {/* Mobile-only: the globe as a dimmed, non-interactive backdrop. Sits
          behind the content (z-0 < the container's z-10) and lets touches pass
          through so page scroll is never captured by the map. Skipped when the
          user prefers reduced motion. */}
      {isMobile && !reduceMotion && (
        <div
          className="md:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {/* Nudge the sphere down so its top clears the fixed header with a
                small gap instead of sitting behind it. */}
            <div className="absolute inset-0 translate-y-12">
              <Globe mapStyleUrl={MAP_STYLE} interactive={false} sizeToHeight={1} />
            </div>
          </motion.div>
          {/* Scrim: keeps the headline (top) and buttons (bottom) legible while
              leaving the sphere most visible through the middle. */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/25 to-background/80" />
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-[1760px] mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="stat-pill">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: 'var(--hp-primary-container)' }}
                />
                {tHero('tagline')}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold"
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 6.25rem)',
                lineHeight: '0.98',
                letterSpacing: '-0.02em',
                color: 'var(--hp-on-surface)',
              }}
            >
              {tHero('title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl leading-relaxed max-w-xl"
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {tHero('description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap items-start gap-3 pt-2"
            >
              <Button
                size="lg"
                className="btn-sovereign text-base px-8 w-full sm:w-auto"
                asChild
              >
                <a
                  href="https://app.collabdt.org/cdt"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handlePlatformClick}
                >
                  {tHero('secondaryCta')}
                </a>
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  size="lg"
                  className="btn-glass text-base px-8 flex-1 sm:flex-none"
                  asChild
                >
                  <a href="https://docs.collabdt.org/" target="_blank" rel="noopener noreferrer">
                    {tHero('docsButton')}
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="btn-glass text-base px-4 md:px-6 flex-none"
                  aria-label={tGh('githubAria')}
                  title={tGh('viewOnGithub')}
                  asChild
                >
                  <a href={GH_URL} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" aria-hidden />
                    {/* Label on desktop only; phones keep the compact icon. */}
                    <span className="hidden md:inline">{tHero('sourceCodeButton')}</span>
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              id="demo"
              className="relative w-full hidden md:block"
            >
              <div className="w-full relative aspect-square">
                <Globe mapStyleUrl={MAP_STYLE} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

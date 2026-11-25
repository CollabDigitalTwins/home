'use client'

import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

const CIMS_URL = 'https://cims.carleton.ca/'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

type TitleKey = 'director' | 'directorFemale' | 'secretary' | 'president' | 'treasurer'

interface Director {
  name: string
  titleKey: TitleKey
  avatar: string
  email: string
  github?: string
  linkedin?: string
}

const directors: Director[] = [
  {
    name: 'Lara Chow',
    titleKey: 'secretary',
    avatar: `${BASE}/images/homepage/team/lc.png`,
    email: 'lara@collabdt.org',
    github: 'lchowCIMS',
    linkedin: 'lara-chow-1508666a',
  },
  {
    name: 'Dr. Nicolas Arellano',
    titleKey: 'president',
    avatar: `${BASE}/images/homepage/team/na.png`,
    email: 'nico@collabdt.org',
    github: 'nicoarellano',
    linkedin: 'nicolasarellano',
  },
  {
    name: 'Ken Percy',
    titleKey: 'treasurer',
    avatar: `${BASE}/images/homepage/team/kp.png`,
    email: 'ken@collabdt.org',
    github: 'ken-99',
    linkedin: 'kenpercyarchitecture',
  },
  {
    name: 'Dr. Stephen Fai',
    titleKey: 'director',
    avatar: `${BASE}/images/homepage/team/sf.png`,
    email: 'steve@collabdt.org',
    linkedin: 'stephen-fai-58a211a3',
  },
  {
    name: 'Laurie Smith',
    titleKey: 'directorFemale',
    avatar: `${BASE}/images/homepage/team/ls.png`,
    email: 'laurie@collabdt.org',
  },
]

function initials(name: string) {
  return name
    .replace(/^Dr\.\s+/, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
}

function DirectorCard({ director }: { director: Director }) {
  const tTitles = useTranslations('HomePage.leadership.titles')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      className="flex flex-col items-center text-center gap-4"
    >
      {/* Avatar */}
      <div
        className="w-48 h-48 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-shadow duration-300 shadow-[0_0_18px_4px_rgba(239,145,97,0.25)] hover:shadow-[0_0_48px_16px_rgba(239,145,97,0.55)]"
        style={{ background: 'var(--hp-surface-variant)' }}
      >
        {director.avatar ? (
          <img
            src={director.avatar}
            alt={director.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const el = e.currentTarget
              el.style.display = 'none'
              el.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <span
          className={`font-display font-bold text-2xl ${director.avatar ? 'hidden' : ''}`}
          style={{ color: 'var(--hp-primary-container)' }}
        >
          {initials(director.name)}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p
          className="font-display font-semibold text-sm leading-tight"
          style={{ color: 'var(--hp-on-surface)' }}
        >
          {director.name}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--hp-on-surface-variant)' }}
        >
          {tTitles(director.titleKey)}
        </p>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="p-2 rounded-lg" asChild>
          <a href={`mailto:${director.email}`} aria-label={`Email ${director.name}`}>
            <Mail className="w-4 h-4" style={{ color: 'var(--hp-on-surface-variant)' }} />
          </a>
        </Button>
        {director.github && (
          <Button variant="ghost" size="sm" className="p-2 rounded-lg" asChild>
            <a
              href={`https://github.com/${director.github}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${director.name} on GitHub`}
            >
              <Github className="w-4 h-4" style={{ color: 'var(--hp-on-surface-variant)' }} />
            </a>
          </Button>
        )}
        {director.linkedin && (
          <Button variant="ghost" size="sm" className="p-2 rounded-lg" asChild>
            <a
              href={`https://www.linkedin.com/in/${director.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${director.name} on LinkedIn`}
            >
              <Linkedin className="w-4 h-4" style={{ color: 'var(--hp-on-surface-variant)' }} />
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default function TeamSection() {
  const tTeam = useTranslations('HomePage.leadership')

  return (
    <section
      id="team"
      className="py-20 md:py-24 relative"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-5 mb-12 max-w-3xl lg:max-w-4xl"
        >
          <div className="section-label">{tTeam('sectionLabel')}</div>
          <h2
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: '1.08',
              letterSpacing: '-0.02em',
              color: 'var(--hp-on-surface)',
            }}
          >
            {tTeam('title')}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--hp-on-surface-variant)' }}
          >
            {tTeam('intro')}
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-between">
          {directors.map((director) => (
            <DirectorCard key={director.name} director={director} />
          ))}
        </div>

        <motion.a
          href={CIMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="tonal-card block p-8 md:p-10 mt-16 group transition-shadow duration-300 hover:shadow-[0_0_36px_4px_rgba(239,145,97,0.18)]"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            <div className="space-y-4 md:w-52 md:flex-shrink-0">
              <div className="section-label">{tTeam('heritage.label')}</div>
              <img
                src={`${BASE}/images/homepage/CIMS_logo.png`}
                alt={tTeam('heritage.logoAlt')}
                className="h-16 w-auto dark:invert"
              />
            </div>
            <div className="space-y-4 flex-1 min-w-0">
              <h3
                className="font-display font-bold"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
                  lineHeight: '1.25',
                  color: 'var(--hp-on-surface)',
                }}
              >
                {tTeam('heritage.title')}
              </h3>
              <p
                className="text-[0.95rem] leading-relaxed"
                style={{ color: 'var(--hp-on-surface-variant)' }}
              >
                {tTeam('heritage.body')}
              </p>
              <p
                className="text-[0.95rem] leading-relaxed"
                style={{ color: 'var(--hp-on-surface-variant)' }}
              >
                {tTeam('heritage.bodyExtra')}
              </p>
              <div
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: 'var(--hp-primary-container)' }}
              >
                <span>{tTeam('heritage.cta')}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  )
}

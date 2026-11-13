'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  children?: ReactNode
}

/**
 * Lightweight page header for the inner routed pages (About / Developers /
 * Contact / FAQ). Clears the fixed navbar and establishes the page title
 * hierarchy using the shared section-label + heading styling.
 *
 * `align="center"` centers the stack over a stronger radial glow — used for
 * the About page, where the header carries the mission statement.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  children,
}: PageHeaderProps) {
  const centered = align === 'center'
  return (
    <section
      className="relative pt-36 pb-12 md:pt-40 md:pb-16"
      style={{ background: 'var(--hp-surface)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: centered
            ? 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(239,145,97,0.10) 0%, transparent 72%)'
            : 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239,145,97,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`max-w-4xl space-y-5 ${centered ? 'mx-auto text-center' : ''}`}
        >
          <div className="section-label">{eyebrow}</div>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              color: 'var(--hp-on-surface)',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-lg md:text-xl leading-relaxed max-w-2xl ${
                centered ? 'mx-auto' : ''
              }`}
              style={{ color: 'var(--hp-on-surface-variant)' }}
            >
              {subtitle}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  label: string
  title: string
  body?: string
}

export default function SectionHeading({ label, title, body }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mb-10 max-w-3xl space-y-4"
    >
      <div className="section-label">{label}</div>
      <h2
        className="font-display font-bold"
        style={{ fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'var(--hp-on-surface)' }}
      >
        {title}
      </h2>
      {body && (
        <p className="text-lg leading-relaxed" style={{ color: 'var(--hp-on-surface-variant)' }}>
          {body}
        </p>
      )}
    </motion.div>
  )
}

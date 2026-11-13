'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export const DOCS_ORIGIN = process.env.NEXT_PUBLIC_DOCS_ORIGIN || 'https://docs.collabdt.org'

export interface EmbedMessage {
  type?: string
  id?: string
  height?: number
  [key: string]: unknown
}

interface DocsEmbedProps {
  id: string
  path: string
  title: string
  docsUrl: string
  docsLabel: string
  onMessage?: (data: EmbedMessage, frame: HTMLIFrameElement) => void
}

function useSiteTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  useEffect(() => {
    const read = () => setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return theme
}

/** Iframes a chrome-less docs.collabdt.org/embed page that reports its own height. */
export default function DocsEmbed({ id, path, title, docsUrl, docsLabel, onMessage }: DocsEmbedProps) {
  const theme = useSiteTheme()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      const frame = frameRef.current
      if (e.origin !== DOCS_ORIGIN || !frame || e.source !== frame.contentWindow) return
      const data = e.data as EmbedMessage
      if (data?.type === 'cdt-embed-height' && data.id === id && typeof data.height === 'number') {
        setHeight(Math.max(240, Math.round(data.height)))
        return
      }
      onMessageRef.current?.(data, frame)
    }
    window.addEventListener('message', listener)
    sayHello()
    return () => window.removeEventListener('message', listener)
  }, [id])

  function sayHello() {
    frameRef.current?.contentWindow?.postMessage({ type: 'cdt-embed-hello' }, DOCS_ORIGIN)
  }

  return (
    <div className="space-y-3">
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{
          border: '1px solid var(--hp-outline-variant, rgba(74, 61, 92, 0.18))',
          background: 'var(--hp-surface)',
          aspectRatio: height ? undefined : '16 / 9',
          height: height ?? undefined,
        }}
      >
        <iframe
          key={theme}
          ref={frameRef}
          src={`${DOCS_ORIGIN}${path}?theme=${theme}`}
          title={title}
          loading="lazy"
          onLoad={sayHello}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
        />
      </div>
      <a
        href={docsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
        style={{ color: 'var(--hp-primary-container)' }}
      >
        {docsLabel}
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  )
}

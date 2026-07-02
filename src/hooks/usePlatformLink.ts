import type { MouseEvent } from 'react'
import { useRouter } from '@/i18n/navigation'
import { isPlatformReachable } from '@/lib/platformStatus'

/**
 * Click handler for links to the CDT platform (app.collabdt.org). Probes the
 * platform's health check before navigating; if it's unreachable, sends the
 * visitor to our own /maintenance page instead of a dead external link.
 */
export function usePlatformLink() {
  const router = useRouter()

  return async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.href
    const reachable = await isPlatformReachable()
    if (reachable) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      router.push('/maintenance')
    }
  }
}

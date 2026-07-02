const HEALTH_CHECK_URL = 'https://app.collabdt.org/api/health'
const HEALTH_CHECK_TIMEOUT_MS = 4000

/**
 * The health route doesn't send CORS headers, so this is an opaque no-cors
 * request: we can't read its status or body, only whether the request
 * completed at all. That's enough to catch the app being fully offline
 * (DNS failure, connection refused, timeout) and is what triggers sending
 * visitors to our own /maintenance page instead of a dead external link.
 */
export async function isPlatformReachable(): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS)

  try {
    await fetch(HEALTH_CHECK_URL, {
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

interface GlobePosterProps {
  size: string
  visible: boolean
}

// First frame of <Globe> at its initial view, so the live map fades in over an identical image.
export default function GlobePoster({ size, visible }: GlobePosterProps) {
  return (
    <img
      src={`${BASE}/images/homepage/globe-poster.webp`}
      alt=""
      aria-hidden
      fetchPriority="high"
      draggable={false}
      className={`pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-none transition-opacity ${
        visible ? 'opacity-100' : 'opacity-0 delay-700 duration-300'
      }`}
      style={{ width: size, height: size }}
    />
  )
}

'use client'

import * as React from 'react'
import Map from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'

// @ts-ignore
import 'maplibre-gl/dist/maplibre-gl.css'

import DeckOverlay from './DeckOverlay'
import { buildConnections, type Connection } from './globeConnections'
import PulseArcLayer from './PulseArcLayer'

const CONNECTIONS = buildConnections()

const DARK_PURPLE: [number, number, number] = [88, 28, 135]
const TERRACOTTA: [number, number, number] = [222, 101, 53]
const PULSE_COLOR: [number, number, number] = [255, 236, 210]
const HOVER_GLOW: [number, number, number, number] = [255, 236, 210, 255]
const ARC_HEIGHT = 0.15
const PULSE_LENGTH = 0.18
const PICKING_RADIUS_PX = 6

interface PaddingOptions {
  top: number
  bottom: number
  left: number
  right: number
}

interface Props {
  mapStyleUrl?: string
  padding?: PaddingOptions
  // When false the globe is purely decorative: it can't be dragged and it lets
  // pointer/touch events pass through (so it never hijacks page scroll behind
  // hero content). Defaults to true — the interactive desktop behaviour.
  interactive?: boolean
  // Background mode: size the sphere to this fraction of the viewport height
  // (e.g. 0.8) and let it bleed past the viewport width instead of fitting a
  // column. Omit for the default desktop column-fit sizing.
  sizeToHeight?: number
}

const ROTATION_SPEED = 0.1

// Globe diameter ≈ FIT_DIVISOR * 2^zoom (px) — the empirical constant that fits
// the sphere to a given pixel size.
const FIT_DIVISOR = 160

// We size the globe off the viewport + the known hero layout (stable and
// correct the instant the component mounts) instead of measuring the hero box,
// which can be reported mid-layout when the page remounts (About -> Home) and
// used to latch the globe at the wrong size.

// Hero layout constants — mirror tailwind.config.ts `screens` + HeroSection.
// Tailwind's centered `.container` is 100% wide but its max-width steps up to
// the largest screen <= viewport width, so it caps at 1400px on big displays.
const CONTAINER_SCREENS = [450, 575, 768, 992, 1200, 1400]
const CONTAINER_PADDING = 48 // px-6 => 1.5rem each side
const TWO_COL_BREAKPOINT = 992 // `lg` — grid switches to two columns
const COLUMN_GAP = 64 // lg:gap-16 => 4rem

// The sphere is inset inside its square canvas so the canvas edges never crop
// it, and the square is never taller than (a fraction of) the viewport so the
// whole globe always stays on screen.
const GLOBE_INSET = 0.94
const VH_FILL = 0.85

// On large screens (past the container's max width) let the globe grow a little
// to fill more of its column, gaining GROWTH_PER_PX per extra px of viewport.
// MAX_GROWTH is capped so the globe never grows wider than its column — it just
// fills it — and so it never overflows across the gap toward the headline.
const CONTAINER_MAX = 1400 // largest entry in CONTAINER_SCREENS
const GROWTH_PER_PX = 0.12
const MAX_GROWTH = 40

// Final safety clamp; in practice the column width is what limits the size.
const MAX_ZOOM = 2.6
// Server render has no window; this default is corrected on mount.
const DEFAULT_SIDE = 560

function rightColumnWidth(vw: number) {
  let containerWidth = vw
  for (const screen of CONTAINER_SCREENS) {
    if (vw >= screen) containerWidth = screen
  }
  const content = containerWidth - CONTAINER_PADDING
  // Two columns at lg+, otherwise the globe block spans the full content width.
  return vw >= TWO_COL_BREAKPOINT ? (content - COLUMN_GAP) / 2 : content
}

function computeGlobeSide(sizeToHeight?: number) {
  if (typeof window === 'undefined') return DEFAULT_SIDE
  // Background mode: size purely to a fraction of the viewport height and let the
  // sphere bleed past the viewport width (its container crops it). Skips the
  // column-fit logic below, which is meant for the desktop two-up layout.
  if (sizeToHeight) return window.innerHeight * sizeToHeight
  // clientWidth excludes the scrollbar, matching the actual layout width.
  const vw = document.documentElement.clientWidth || window.innerWidth
  const growth = Math.min(Math.max(0, vw - CONTAINER_MAX) * GROWTH_PER_PX, MAX_GROWTH)
  // Never wider than its column (+ the large-screen growth) nor taller than the
  // viewport, so it stays off the headline and the whole sphere stays visible.
  return Math.min(rightColumnWidth(vw) + growth, window.innerHeight * VH_FILL)
}

function sideToZoom(side: number) {
  return Math.max(-1, Math.min(MAX_ZOOM, Math.log2((side * GLOBE_INSET) / FIT_DIVISOR)))
}

export default function Globe({ mapStyleUrl, padding, interactive = true, sizeToHeight }: Props) {
  const [side, setSide] = React.useState(DEFAULT_SIDE)
  const [zoom, setZoom] = React.useState(() => sideToZoom(DEFAULT_SIDE))
  const mapRef = React.useRef<MapRef>(null)
  const paddingRef = React.useRef<PaddingOptions | undefined>(padding)
  const animationRef = React.useRef<number>(0)
  const userInteracting = React.useRef(false)
  const resumeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    paddingRef.current = padding
  }, [padding])

  React.useEffect(() => {
    const onResize = () => {
      const next = computeGlobeSide(sizeToHeight)
      setSide(next)
      setZoom(sideToZoom(next))
      // Tell maplibre its canvas changed size so the projection re-centers.
      mapRef.current?.getMap()?.resize()
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sizeToHeight])

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current)
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  const layers = React.useMemo(
    () => [
      new PulseArcLayer<Connection>({
        id: 'connection-halos',
        data: CONNECTIONS,
        getSourcePosition: (d) => d.from,
        getTargetPosition: (d) => d.to,
        getPhase: (d) => d.phase,
        getDuration: (d) => d.duration,
        getSourceColor: TERRACOTTA,
        getTargetColor: DARK_PURPLE,
        getHeight: ARC_HEIGHT,
        getWidth: 7,
        pulseLength: PULSE_LENGTH,
        pulseColor: PULSE_COLOR,
        baseAlpha: 0,
        pulseAlpha: 0.3,
        parameters: { cullMode: 'none' },
      }),
      new PulseArcLayer<Connection>({
        id: 'connections',
        data: CONNECTIONS,
        getSourcePosition: (d) => d.from,
        getTargetPosition: (d) => d.to,
        getPhase: (d) => d.phase,
        getDuration: (d) => d.duration,
        getSourceColor: TERRACOTTA,
        getTargetColor: DARK_PURPLE,
        getHeight: ARC_HEIGHT,
        getWidth: 1.5,
        pulseLength: PULSE_LENGTH,
        pulseColor: PULSE_COLOR,
        baseAlpha: 0.45,
        pulseAlpha: 1,
        parameters: { cullMode: 'none' },
        pickable: interactive,
        autoHighlight: true,
        highlightColor: HOVER_GLOW,
      }),
    ],
    [interactive],
  )

  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    // Order matters: setMinZoom rejects values above the current maxZoom (and vice versa).
    // Widen first, then collapse to the desired window so we never cross the invariant mid-update.
    const nextMin = zoom
    const nextMax = zoom + 0.2
    map.setMinZoom(-2)
    map.setMaxZoom(24)
    map.setZoom(zoom)
    map.setMaxZoom(nextMax)
    map.setMinZoom(nextMin)

    const currentPadding = paddingRef.current
    if (!currentPadding) return
    map.setPadding(currentPadding)
  }, [padding, zoom])

  const viewState = {
    longitude: -75.74,
    latitude: 0,
    zoom,
  }

  const resolvedStyle = React.useMemo(() => {
    if (!mapStyleUrl) return undefined

    const isTileTemplate =
      mapStyleUrl.includes('{x}') && mapStyleUrl.includes('{y}') && mapStyleUrl.includes('{z}')
    if (!isTileTemplate) return mapStyleUrl

    return {
      version: 8 as const,
      sources: {
        rasterTiles: {
          type: 'raster' as const,
          tiles: [mapStyleUrl],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'raster-tiles',
          type: 'raster' as const,
          source: 'rasterTiles',
        },
      ],
    }
  }, [mapStyleUrl])

  const handleMapLoad = React.useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const applyCurrentPadding = () => {
      const currentPadding = paddingRef.current
      if (!currentPadding) return
      map.setPadding(currentPadding)
    }

    applyCurrentPadding()
    map.on('styledata', applyCurrentPadding)

    const onInteractionStart = () => {
      userInteracting.current = true
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }

    const onInteractionEnd = () => {
      resumeTimeoutRef.current = setTimeout(() => {
        userInteracting.current = false
      }, 1500)
    }

    const onMouseDown = (e: maplibregl.MapMouseEvent) => {
      if (e.originalEvent.button !== 0) return
      onInteractionStart()
    }
    const onMouseUp = (e: maplibregl.MapMouseEvent) => {
      if (e.originalEvent.button !== 0) return
      onInteractionEnd()
    }

    map.on('mousedown', onMouseDown)
    map.on('mouseup', onMouseUp)
    map.on('touchstart', onInteractionStart)
    map.on('touchend', onInteractionEnd)
    map.on('dragstart', onInteractionStart)
    map.on('dragend', onInteractionEnd)

    function rotate() {
      if (!userInteracting.current) {
        const center = map.getCenter()
        center.lng -= ROTATION_SPEED
        map.jumpTo({
          center: { lng: center.lng, lat: center.lat },
          padding: map.getPadding(),
        })
      } else {
        map.triggerRepaint()
      }
      animationRef.current = requestAnimationFrame(rotate)
    }

    animationRef.current = requestAnimationFrame(rotate)
  }, [])

  return (
    <div
      className={`${
        interactive ? 'pointer-events-auto' : 'pointer-events-none'
      } opacity-75 absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2`}
      style={{ width: side, height: side }}
    >
      <Map
        ref={mapRef}
        mapStyle={resolvedStyle}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        initialViewState={viewState}
        projection="globe"
        onLoad={handleMapLoad}
        attributionControl={false}
        dragPan={interactive}
        dragRotate={false}
        touchPitch={false}
        keyboard={false}
        boxZoom={false}
        pitchWithRotate={false}
        // Zoom is fixed at the fit level; allowing zoom-in lets the sphere grow
        // past its square canvas and expose the canvas edge ("frames").
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
      >
        <DeckOverlay interleaved layers={layers} pickingRadius={PICKING_RADIUS_PX} />
      </Map>
    </div>
  )
}

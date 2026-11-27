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
const ARC_HEIGHT = 0.15
const PULSE_LENGTH = 0.18

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
  // CSS length for the globe's square box; share it with <GlobePoster> so both render identically.
  size: string
  onReady?: () => void
}

const ROTATION_SPEED = 0.1

// Globe diameter ≈ FIT_DIVISOR * 2^zoom (px) — the empirical constant that fits
// the sphere to a given pixel size.
const FIT_DIVISOR = 160

// The sphere is inset inside its square canvas so the canvas edges never crop it.
const GLOBE_INSET = 0.94

function sideToZoom(side: number) {
  return Math.max(-1, Math.log2((side * GLOBE_INSET) / FIT_DIVISOR))
}

export default function Globe({ mapStyleUrl, padding, interactive = true, size, onReady }: Props) {
  const [ready, setReady] = React.useState(false)
  const [side, setSide] = React.useState<number | null>(null)
  const zoom = side === null ? null : sideToZoom(side)
  const mapRef = React.useRef<MapRef>(null)
  const paddingRef = React.useRef<PaddingOptions | undefined>(padding)
  const animationRef = React.useRef<number>(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const onScreenRef = React.useRef(true)
  const userInteracting = React.useRef(false)
  const resumeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    paddingRef.current = padding
  }, [padding])

  React.useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    setSide(el.clientWidth)
    const observer = new ResizeObserver(() => setSide(el.clientWidth))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting
      if (entry.isIntersecting) mapRef.current?.getMap()?.triggerRepaint()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
      }),
    ],
    [],
  )

  React.useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || zoom === null) return
    map.resize()

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
    setReady(true)
    onReady?.()
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
      if (!onScreenRef.current) {
        animationRef.current = requestAnimationFrame(rotate)
        return
      }
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
  }, [onReady])

  return (
    <div
      ref={containerRef}
      className={`${
        interactive ? 'pointer-events-auto' : 'pointer-events-none'
      } ${ready ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2`}
      style={{ width: size, height: size }}
    >
      {zoom !== null && (
        <Map
          ref={mapRef}
          mapStyle={resolvedStyle}
          mapLib={maplibregl}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
          }}
          initialViewState={{ longitude: -75.74, latitude: 0, zoom }}
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
          <DeckOverlay interleaved layers={layers} />
        </Map>
      )}
    </div>
  )
}

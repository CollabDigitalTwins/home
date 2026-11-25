export interface Connection {
  from: [number, number]
  to: [number, number]
  phase: number
  duration: number
}

// [lng, lat]
const CITIES: [number, number][] = [
  // North America
  [-75.7, 45.42], [-79.38, 43.65], [-73.57, 45.5], [-123.12, 49.28], [-114.07, 51.05],
  [-74.0, 40.71], [-87.63, 41.88], [-118.24, 34.05], [-122.42, 37.77], [-95.37, 29.76],
  [-80.19, 25.76], [-77.04, 38.91], [-99.13, 19.43], [-103.35, 20.66],
  // Central America & Caribbean
  [-79.52, 8.98], [-84.09, 9.93], [-90.51, 14.63], [-82.37, 23.13], [-66.1, 18.47],
  // South America
  [-46.63, -23.55], [-43.2, -22.91], [-58.38, -34.6], [-70.67, -33.45], [-77.04, -12.05],
  [-74.07, 4.71], [-78.47, -0.18], [-66.9, 10.48], [-47.88, -15.79], [-38.52, -3.73],
  [-56.16, -34.9], [-68.15, -16.5], [-57.58, -25.26], [-60.02, -3.12], [-75.56, 6.25],
  // Europe
  [-0.13, 51.51], [2.35, 48.86], [13.4, 52.52], [-3.7, 40.42], [12.5, 41.9],
  [4.9, 52.37], [18.07, 59.33], [21.01, 52.23], [-9.14, 38.72], [23.73, 37.98],
  [37.62, 55.75], [28.98, 41.01], [-6.26, 53.35], [10.75, 59.91],
  // Africa
  [31.24, 30.04], [3.38, 6.52], [36.82, -1.29], [28.05, -26.2], [18.42, -33.92],
  [38.75, 9.03], [-7.59, 33.57], [-17.44, 14.69], [-0.19, 5.6], [39.28, -6.79],
  [13.23, -8.84], [47.52, -18.88], [32.58, 0.35], [15.27, -4.44],
  // Middle East & South Asia
  [55.27, 25.2], [51.53, 25.29], [46.68, 24.71], [51.39, 35.69], [72.88, 19.08],
  [77.21, 28.61], [77.59, 12.97], [88.36, 22.57], [67.01, 24.86], [90.41, 23.81],
  [79.86, 6.93], [85.32, 27.72],
  // East & Southeast Asia
  [116.4, 39.9], [121.47, 31.23], [114.17, 22.32], [139.69, 35.69], [126.98, 37.57],
  [103.82, 1.35], [100.5, 13.75], [106.85, -6.21], [120.98, 14.6], [106.63, 10.82],
  [101.69, 3.14], [121.56, 25.03],
  // Oceania
  [151.21, -33.87], [144.96, -37.81], [153.03, -27.47], [115.86, -31.95], [174.76, -36.85],
  [172.64, -43.53], [178.44, -18.14], [147.18, -9.44],
]

const CONNECTION_COUNT = 141
const MIN_DISTANCE_KM = 1500
const MAX_DISTANCE_KM = 11000
const MIN_DURATION_S = 8
const MAX_DURATION_S = 15

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

function distanceKm([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
  const rad = Math.PI / 180
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(a))
}

/** Random city-to-city arcs, the same on every load so the globe never reshuffles. */
export function buildConnections(seed = 2026): Connection[] {
  const random = seededRandom(seed)
  const pick = () => CITIES[Math.floor(random() * CITIES.length)]
  const connections: Connection[] = []
  while (connections.length < CONNECTION_COUNT) {
    const from = pick()
    const to = pick()
    const km = distanceKm(from, to)
    if (km < MIN_DISTANCE_KM || km > MAX_DISTANCE_KM) continue
    connections.push({
      from,
      to,
      phase: random(),
      duration: MIN_DURATION_S + random() * (MAX_DURATION_S - MIN_DURATION_S),
    })
  }
  return connections
}

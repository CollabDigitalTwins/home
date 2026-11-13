import type { Language } from '@/lib/language'

export type MaturityLevel = 1 | 2 | 3 | 4 | 5

export type Localized = Record<Language, string>

export interface PluginEntry {
  slug: string
  name: Localized
  /** Tile label in the gallery; keep it to one or two words. */
  shortName: Localized
  description: Localized
  /** File name under `cdt-homepage/plugins/` in MinIO. Spaces are fine; URLs are encoded. */
  video: string
  /** Second of the video used as the gallery thumbnail. */
  thumbnailTime: number
  level: MaturityLevel
}

export const MATURITY_LEVELS: MaturityLevel[] = [1, 2, 3, 4, 5]

export const PLUGINS_DOCS_URL = 'https://docs.collabdt.org/docs/plugins/overview'

export const PLUGIN_SYSTEM_VIDEO = 'cdt-plugin-system.mp4'

export const PLUGINS: PluginEntry[] = [
  {
    slug: 'building-permits',
    shortName: { En: 'Permits', Fr: 'Permis', Es: 'Permisos' },
    name: { En: 'Ottawa building permits', Fr: 'Permis de construire d’Ottawa', Es: 'Permisos de construcción de Ottawa' },
    description: {
      En: 'Every City of Ottawa building permit since July 2011 on the map: a count per ward when zoomed out, each permit as a point from zoom 13, with filters, tables and a popup that shows where each record came from.',
      Fr: 'Tous les permis de construire de la Ville d’Ottawa depuis juillet 2011 sur la carte : un total par quartier à petite échelle, chaque permis en point à partir du zoom 13, avec filtres, tableaux et une fenêtre qui indique la source de chaque enregistrement.',
      Es: 'Todos los permisos de construcción de la Ciudad de Ottawa desde julio de 2011 en el mapa: un total por distrito a escala general, cada permiso como un punto desde el zoom 13, con filtros, tablas y una ventana que indica el origen de cada registro.',
    },
    video: 'cdt-ps-building-permits.mp4',
    thumbnailTime: 2,
    level: 1,
  },
  {
    slug: 'airplanes',
    shortName: { En: 'Flights', Fr: 'Vols', Es: 'Vuelos' },
    name: { En: 'Live flights', Fr: 'Vols en direct', Es: 'Vuelos en directo' },
    description: {
      En: 'Live aircraft worldwide from the OpenSky Network. Filter by country and altitude, follow a flight track, and show airports by size or find one by code.',
      Fr: 'Les aéronefs en vol dans le monde entier, en direct depuis l’OpenSky Network. Filtrez par pays et par altitude, suivez la trajectoire d’un vol, et affichez les aéroports selon leur taille ou trouvez-en un par son code.',
      Es: 'Aeronaves en vuelo en todo el mundo, en directo desde OpenSky Network. Filtre por país y altitud, siga la trayectoria de un vuelo, y muestre los aeropuertos por tamaño o busque uno por su código.',
    },
    video: 'cdt-ps-airplanes.mp4',
    thumbnailTime: 2,
    level: 2,
  },
  {
    slug: 'oc-transpo',
    shortName: { En: 'OC Transpo', Fr: 'OC Transpo', Es: 'OC Transpo' },
    name: { En: 'OC Transpo live transit', Fr: 'OC Transpo en direct', Es: 'OC Transpo en directo' },
    description: {
      En: 'Live OC Transpo routes, stops, buses and O-Train in Ottawa, read from the GTFS Realtime feed.',
      Fr: 'Les trajets, arrêts, autobus et O-Train d’OC Transpo à Ottawa, en direct depuis le flux GTFS Realtime.',
      Es: 'Rutas, paradas, autobuses y O-Train de OC Transpo en Ottawa, en directo desde el flujo GTFS Realtime.',
    },
    video: 'cdt-ps-oc-transpo.mp4',
    thumbnailTime: 2,
    level: 2,
  },
  {
    slug: 'space-planner',
    shortName: { En: 'Space planner', Fr: 'Espaces', Es: 'Espacios' },
    name: { En: 'Space planner', Fr: 'Planificateur d’espaces', Es: 'Planificador de espacios' },
    description: {
      En: 'Plans and books the spaces in a building. Rooms are read from the IFC model or drawn on the plan, bookings are checked for conflicts and capacity, and utilisation is reported per building and across the portfolio.',
      Fr: 'Planifie et réserve les espaces d’un bâtiment. Les locaux sont lus dans le modèle IFC ou dessinés sur le plan, les réservations sont vérifiées pour les conflits et la capacité, et l’utilisation est mesurée par bâtiment et pour l’ensemble du parc.',
      Es: 'Planifica y reserva los espacios de un edificio. Los locales se leen del modelo IFC o se dibujan en el plano, las reservas se comprueban por conflictos y capacidad, y el uso se mide por edificio y en toda la cartera.',
    },
    video: 'cdt-ps-space planning.mp4',
    thumbnailTime: 2,
    level: 2,
  },
  {
    slug: 'wildfires',
    shortName: { En: 'Wildfires', Fr: 'Feux de forêt', Es: 'Incendios' },
    name: { En: 'Wildfire monitoring', Fr: 'Suivi des feux de forêt', Es: 'Monitoreo de incendios forestales' },
    description: {
      En: 'Live wildfires across Canada from the Canadian Interagency Forest Fire Centre (CIFFC): location, size and stage of control, with layers for wildfire smoke, fire perimeter estimates and the Fire Weather Index.',
      Fr: 'Les feux de forêt actifs au Canada, en direct depuis le Centre interservices des feux de forêt du Canada (CIFFC) : emplacement, superficie et état de maîtrise, avec des couches pour la fumée, les périmètres estimés et l’Indice forêt-météo.',
      Es: 'Incendios forestales activos en Canadá, en directo desde el Canadian Interagency Forest Fire Centre (CIFFC): ubicación, superficie y estado de control, con capas de humo, perímetros estimados y el índice meteorológico de incendios.',
    },
    video: 'cdt-ps-willdfires.mp4',
    thumbnailTime: 2,
    level: 2,
  },
  {
    slug: 'flooding',
    shortName: { En: 'Flooding', Fr: 'Submersion', Es: 'Inundación' },
    name: { En: 'Coastal flooding', Fr: 'Submersion côtière', Es: 'Inundación costera' },
    description: {
      En: 'Coastal water levels over the digital twin: drone terrain, buildings and live tide data under a waterline that can be raised, lowered and animated, for flood and sea-level planning in exposed areas.',
      Fr: 'Les niveaux d’eau côtiers sur le jumeau numérique : relief par drone, bâtiments et marégraphe en direct sous une ligne d’eau que l’on peut monter, descendre et animer, pour planifier face aux crues et à la hausse du niveau de la mer.',
      Es: 'Niveles de agua costeros sobre el gemelo digital: relieve por dron, edificios y mareógrafo en directo bajo una línea de agua que se puede subir, bajar y animar, para planificar ante inundaciones y la subida del nivel del mar.',
    },
    video: 'cdt-ps-flooding.mp4',
    thumbnailTime: 2,
    level: 3,
  },
  {
    slug: 'electric-grid',
    shortName: { En: 'Power grid', Fr: 'Réseau électrique', Es: 'Red eléctrica' },
    name: { En: 'Power grid what-if', Fr: 'Scénarios du réseau électrique', Es: 'Escenarios de la red eléctrica' },
    description: {
      En: 'An estimated electrical grid for one neighbourhood, drawn from OpenStreetMap. Cut a line or a transformer and see which buildings lose power. The layout is an estimate, not the utility’s records.',
      Fr: 'Un réseau électrique estimé pour un quartier, tracé à partir d’OpenStreetMap. Coupez une ligne ou un transformateur et voyez quels bâtiments perdent le courant. Le tracé est une estimation, pas le registre du distributeur.',
      Es: 'Una red eléctrica estimada para un barrio, trazada a partir de OpenStreetMap. Corte una línea o un transformador y vea qué edificios se quedan sin electricidad. El trazado es una estimación, no el registro de la distribuidora.',
    },
    video: 'cdt-ps-electric grid.mp4',
    thumbnailTime: 2,
    level: 4,
  },
  {
    slug: 'tabletop',
    shortName: { En: 'Tabletop', Fr: 'Exercice', Es: 'Simulacro' },
    name: { En: 'Disaster response simulation', Fr: 'Simulation de réponse aux catastrophes', Es: 'Simulación de respuesta a desastres' },
    description: {
      En: 'Real-time emergency scenario simulation. Model a developing incident with live wind-driven smoke, moving traffic, evacuation zones, and 3D building context on the map.',
      Fr: 'Simulation en temps réel de scénarios d’urgence. Modélise un incident en développement avec de la fumée poussée par le vent, du trafic en mouvement, des zones d’évacuation et un contexte 3D des bâtiments sur la carte.',
      Es: 'Simulación en tiempo real de escenarios de emergencia. Modela un incidente en desarrollo con humo arrastrado por el viento, tráfico en movimiento, zonas de evacuación y contexto 3D de edificios en el mapa.',
    },
    video: 'cdt-ps-tabletop.mp4',
    thumbnailTime: 2,
    level: 4,
  },
]

export const sortedPlugins = (locale: Language): PluginEntry[] =>
  [...PLUGINS].sort((a, b) => a.level - b.level || a.name[locale].localeCompare(b.name[locale], locale.toLowerCase()))

export const pluginVideoUrl = (assetsUrl: string, file: string): string =>
  `${assetsUrl}/cdt-homepage/plugins/${encodeURIComponent(file)}`

export type MediaCategory = 'press' | 'industry' | 'award'

export interface MediaArticle {
  key: string
  title: string
  outlet: string
  href: string
  category: MediaCategory
  /** ISO yyyy-mm-dd. Omit when the source is undated; undated entries sort last. */
  date?: string
  image?: string
  /** Path under public/, shown when `image` fails to load. Defaults to the CDT card. */
  fallbackImage?: string
}

export const MEDIA_ARTICLES: MediaArticle[] = [
  {
    key: 'globeAndMail',
    title: 'Carleton University team launches platform for digital twin of Canada',
    outlet: 'The Globe and Mail',
    href: 'https://www.theglobeandmail.com/canada/science/article-digital-twin-canada-carleton-university/',
    category: 'press',
    date: '2026-07-25',
    image:
      'https://www.theglobeandmail.com/resizer/v2/FYZ4SVKQ25DLJBMBF2J7UVUS3A.JPG?auth=10f18227e6cb27a8d865145e4529e2a88e640f9b5e6cfff97b0bfa401061675b&width=900&quality=80',
  },
  {
    key: 'buildingSmartAward',
    title: 'CIMS researchers win buildingSMART international award for Digital Twin project',
    outlet: 'Carleton University',
    href: 'https://architecture.carleton.ca/2025/cims-researchers-win-buildingsmart-international-award-for-digital-twin-project/',
    category: 'award',
    date: '2025-11-10',
    image: 'https://architecture.carleton.ca/wp-content/uploads/2025/11/cimsinberlin-1024x768.jpg',
  },
  {
    key: 'gogeomaticsHousing',
    title:
      'Building Faster, Smarter: Canada’s Housing Crisis and the Missing Digital Delivery Mandate',
    outlet: 'GoGeomatics',
    href: 'https://gogeomatics.ca/building-faster-smarter-canadas-housing-crisis-and-the-missing-digital-delivery-mandate/',
    category: 'industry',
    date: '2025-10-01',
    image: 'https://gogeomatics.ca/wp-content/uploads/ICDT_HomePageHeader.jpg',
  },
  {
    key: 'innovationSpotlight',
    title: 'CIMS’ Canada’s Digital Twin project recognized for innovation, research',
    outlet: 'Carleton University',
    href: 'https://architecture.carleton.ca/2024/cims-canadas-digital-twin-project-recognized-for-innovation-research/',
    category: 'award',
    date: '2024-12-10',
    image: 'https://architecture.carleton.ca/wp-content/uploads/2024/12/20241205_205043.jpg',
  },
  {
    key: 'gogeomaticsPlatform',
    title:
      'How an Open-Source Digital Twin Platform Could Transform Construction & Infra Industry in Canada',
    outlet: 'GoGeomatics',
    href: 'https://gogeomatics.ca/how-an-open-source-digital-twin-platform-could-transform-construction-infra-industry-in-canada/',
    category: 'industry',
    date: '2024-10-23',
    image: 'https://gogeomatics.ca/wp-content/uploads/Open-Source-Digital-Twin-Platform-2.png',
  },
  {
    key: 'buildingTransformations',
    title: 'Canada’s Digital Twin',
    outlet: 'Building Transformations',
    href: 'https://www.buildingtransformations.org/submissions/canada-s-digital-twin',
    category: 'award',
    date: '2024-12-05',
    image:
      "https://cdn.prod.website-files.com/5bf090a8df7c09bfde2ca36c/6716f864ffd66e43187cacf4_Canada%27s%20Digital%20Twin%205.png",
  },
  {
    key: 'geoweekUrbanDevelopment',
    title: 'What’s Hindering the Adoption of Digital Twin Technology in Canada’s Urban Development?',
    outlet: 'Geo Week News',
    href: 'https://www.geoweeknews.com/articles/what-s-hindering-the-adoption-of-digital-twin-technology-in-canada-s-urban-development/',
    category: 'industry',
    date: '2024-10-09',
    image:
      'https://www.geoweeknews.com/wp-content/uploads/2026/05/Screenshot-2024-09-25-at-7.18.39-PM.medium.800x800.png',
  },
  {
    key: 'geoweekHousingShortage',
    title: 'How Digital Twins Can Help Address Canada’s Housing Shortage',
    outlet: 'Geo Week News',
    href: 'https://www.geoweeknews.com/articles/how-digital-twins-can-help-address-canada-s-housing-shortage/',
    category: 'industry',
    date: '2024-10-07',
    image:
      'https://www.geoweeknews.com/wp-content/uploads/2026/05/2024-10-07-Digital-Twins-Canada-Hero.medium.800x800.jpg',
  },
]

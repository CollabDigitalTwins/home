import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Maintenance - CDT platform',
  description: 'The CDT platform is currently undergoing maintenance. We will be back shortly.',
  openGraph: {
    title: 'Under Maintenance - CDT platform',
    description: 'The CDT platform is currently undergoing maintenance. We will be back shortly.',
    images: ['https://collabdt.org/images/cdt-og_card.png'],
    type: 'website',
  },
}

interface Props {
  children: React.ReactNode
}

export default function MaintenanceLayout({ children }: Props) {
  return children
}

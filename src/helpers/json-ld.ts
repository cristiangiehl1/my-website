import { __SOCIAL__ } from '@/constants/social'

const baseUrl = process.env.BASE_URL!

export function buildPersonJsonLd(jobTitle: string) {
  return {
    '@type': 'Person',
    name: 'Cristian Giehl',
    url: baseUrl,
    image: `${baseUrl}/images/me.jpeg`,
    jobTitle,
    sameAs: [__SOCIAL__.github.href, __SOCIAL__.linkedin.href],
  }
}

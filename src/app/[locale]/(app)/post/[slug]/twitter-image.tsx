import { ogSize, renderPostOgImage } from './og-image'

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Cristian Giehl'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  return renderPostOgImage(locale, slug)
}

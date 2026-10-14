import { buildFeed } from '@/helpers/build-feed'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'

export function GET() {
  return buildFeed(routing.defaultLocale)
}

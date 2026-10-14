import { buildFeed } from '@/helpers/build-feed'

export const dynamic = 'force-static'

export function GET() {
  return buildFeed('en-US')
}

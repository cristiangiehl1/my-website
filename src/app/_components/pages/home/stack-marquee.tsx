import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'

import { StackMarqueeRow } from './stack-marquee-row'

const ALL_TECHNOLOGIES = Object.keys(TECHNOLOGY_DATA) as TechnologyName[]
const SPLIT_AT = Math.ceil(ALL_TECHNOLOGIES.length / 2)
const STACK_ROWS = [
  ALL_TECHNOLOGIES.slice(0, SPLIT_AT),
  ALL_TECHNOLOGIES.slice(SPLIT_AT),
]

export function StackMarquee({ title }: { title: string }) {
  return (
    <section className='flex flex-col gap-10 py-12'>
      {STACK_ROWS.map((items, index) => (
        <StackMarqueeRow
          key={index}
          items={items}
          reverse={index % 2 === 1}
          label={title}
        />
      ))}
    </section>
  )
}

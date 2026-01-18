import { BiCodeAlt } from 'react-icons/bi'

import type { Work } from '@/@types/work'
import { getTechOptions } from '@/constants/technology-data'

import { MatchTechnologyPopover } from './match-technology-popover'
import { MultiSelect } from './ui/multi-select'

interface TechnologyFilters {
  works: Array<Work>
  selectedTechs: Array<string>
  setSelectedTechs: (techs: Array<string>) => void
  isExactMatchEnable: boolean
  setIsExactMatchEnable: (isEnable: boolean) => void
}

export function TechnologyFilters({
  isExactMatchEnable,
  works,
  selectedTechs,
  setIsExactMatchEnable,
  setSelectedTechs,
}: TechnologyFilters) {
  return (
    <div className='bg-card/50 border-border mb-12 rounded-lg border p-6 backdrop-blur-sm'>
      <div className='mb-4 flex items-center gap-3'>
        <BiCodeAlt size={24} className='text-primary' />
        <h2 className='text-lg font-semibold'>Filtrar por tecnologias</h2>
      </div>

      <MultiSelect
        options={getTechOptions()}
        value={selectedTechs}
        onValueChange={setSelectedTechs}
        placeholder='Selecione as tecnologias...'
        responsive={true}
        maxWidth='600px'
      />

      <MatchTechnologyPopover
        onChange={setIsExactMatchEnable}
        value={isExactMatchEnable}
        containerClassName='mt-4'
      />

      {selectedTechs.length > 0 && (
        <p className='text-muted-foreground mt-3 text-sm'>
          {works.length} resultado
          {works.length !== 1 ? 's' : ''} encontrado
          {works.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

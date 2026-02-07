import { BiCodeAlt } from 'react-icons/bi'

import type { Project } from '@/@types/project'
import { getTechOptions } from '@/constants/technology-data'

import { MatchTechnologyPopover } from './match-technology-popover'
import { MultiSelect } from './ui/multi-select'

interface TechnologyFilters {
  items: Array<Project>
  selectedTechs: Array<string>
  setSelectedTechs: (techs: Array<string>) => void
  isExactMatchEnable: boolean
  setIsExactMatchEnable: (isEnable: boolean) => void
}

export function PortfolioFilters({
  isExactMatchEnable,
  items,
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
          {items.length} resultado
          {items.length !== 1 ? 's' : ''} encontrado
          {items.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}

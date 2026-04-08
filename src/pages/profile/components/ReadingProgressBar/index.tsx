import { Label, ProgressIndicator, ProgressRoot, ReadingProgressBarContainer } from "./styles";

type ReadingProgressProps = {
  currentPage: number
  totalPages: number
  abandoned: boolean
}

export function ReadingProgress({currentPage, totalPages, abandoned}: ReadingProgressProps) {

  const progress = Math.round((currentPage / totalPages) * 100) || 0

  return (
    <ReadingProgressBarContainer>
      <div>
        <Label>Progresso de leitura: {progress}%</Label>
        <span>
          <span>Páginas: {currentPage} </span>
          <span>{` / ${totalPages}`}</span>
        </span>
          
      </div>
      <ProgressRoot value={progress}>
        <ProgressIndicator
          abandoned={abandoned}
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </ProgressRoot>
    </ReadingProgressBarContainer>
  );
}

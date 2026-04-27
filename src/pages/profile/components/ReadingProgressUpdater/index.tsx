import React, { useState } from "react";
import {
  IncrementButton,
  IncrementContainer,
  InputRow,
  PageInput,
  ReadingProgressUpdaterContainer,
  SaveButton,
  TotalPagesText,
} from "./styles";
import { BookOpenCheck } from "lucide-react";
import { AppTooltip } from "@/components/Tooltip";

interface ReadingProgressUpdaterProps {
  currentPage: number;
  totalPages: number;
  onUpdate: (newPage: number, customTotalPage?: number) => void;
  handleCloseReadingProgressUpdater: () => void;
}

const increments = [5, 10, 15, 20, 50, 100];

export function ReadingProgressUpdater({
  currentPage,
  totalPages,
  onUpdate,
  handleCloseReadingProgressUpdater,
}: ReadingProgressUpdaterProps) {
  
  const [page, setPage] = useState<number>(currentPage);
  const [totalPagesState, setTotalPagesState] = useState<number>(totalPages)

  const clampNewPageValue = (value: number) => {
    if (!totalPages) return Math.max(0, value);
    return Math.min(Math.max(0, value), totalPagesState);
  };

  const clampTotalPagesValue = (value: number) => {
    return Math.min(Math.max(0, value), 50560)
  };

  const handleNewPageManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!isNaN(value)) {
      setPage(clampNewPageValue(value));
    }
  };

  const handleTotalPageManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!isNaN(value)) {
      setTotalPagesState(clampTotalPagesValue(value));
    }
  };

  const applyIncrement = (value: number) => {
    const updated = clampNewPageValue(page + value);

    setPage(updated);
  };

  const handleSubmit = () => {

    if ( (page > totalPagesState) || totalPagesState < 1) {
      return
    }

    onUpdate(clampNewPageValue(page), totalPagesState);
    handleCloseReadingProgressUpdater();
  };

  return (
    <ReadingProgressUpdaterContainer>
      <InputRow onSubmit={(e) => e.preventDefault()}>
        <PageInput value={page} onChange={handleNewPageManualChange} />

        {totalPages && (
          <TotalPagesText>
            {`/ `}
            <PageInput value={totalPagesState} onChange={handleTotalPageManualChange} />
          </TotalPagesText>
        )}

        <AppTooltip content="Salvar progresso de leitura">
          <SaveButton onClick={handleSubmit}>
            <BookOpenCheck />
          </SaveButton>
        </AppTooltip>
      </InputRow>

      <IncrementContainer>
        {increments.map((value) => (
          <IncrementButton key={value} onClick={() => applyIncrement(value)}>
            +{value}
          </IncrementButton>
        ))}
      </IncrementContainer>
    </ReadingProgressUpdaterContainer>
  );
}

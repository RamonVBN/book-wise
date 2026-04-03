import React, { useState } from "react";
import { Check } from "phosphor-react";
import { IncrementButton, IncrementContainer, InputRow, PageInput, ReadingProgressUpdaterContainer, SaveButton, TotalPagesText } from "./styles";
import { BookCheck, BookmarkCheck, BookOpenCheck } from "lucide-react";

interface ReadingProgressUpdaterProps {
  currentPage: number;
  totalPages?: number;
  onUpdate: (newPage: number) => void;
  handleCloseReadingProgressUpdater: () => void
}

const increments = [5, 10, 15, 20, 50, 100];

export function ReadingProgressUpdater({
  currentPage,
  totalPages,
  onUpdate,
  handleCloseReadingProgressUpdater
}: ReadingProgressUpdaterProps) {
  
  const [page, setPage] = useState<number>(currentPage);

  const clampValue = (value: number) => {
    if (!totalPages) return Math.max(0, value);
    return Math.min(Math.max(0, value), totalPages);
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (!isNaN(value)) {
      setPage(clampValue(value));
    }
  };

  const applyIncrement = (value: number) => {
    const updated = clampValue(page + value);

    setPage(updated);
  };

  const handleSubmit = () => {
    onUpdate(clampValue(page));
    handleCloseReadingProgressUpdater();
  };

  return (
    <ReadingProgressUpdaterContainer>
      <InputRow onSubmit={(e) => e.preventDefault()}>
        <PageInput
          value={page}
          onChange={handleManualChange}
        />

        {totalPages && <TotalPagesText>/ {totalPages}</TotalPagesText>}

        <SaveButton onClick={handleSubmit}>
            <BookOpenCheck/>
        </SaveButton>
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

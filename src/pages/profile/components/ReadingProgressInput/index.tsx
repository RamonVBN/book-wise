import React, { useState } from "react";
import { BarBackground, BarFill, Input, Label, ProgressRow, Slider, Wrapper } from "./styles";


interface ReadingProgressProps {
  value?: number;
  max?: number;
  label?: string;
  color?: "green" | "yellow" | "blue";
  onChange?: (value: number) => void;
}

export const ReadingProgressInput: React.FC<ReadingProgressProps> = ({
  value = 0,
  max = 100,
  label = "Reading progress",
  color = "green",
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const safeValue = Math.min(Math.max(internalValue, 0), max);

  const percentage = (safeValue / max) * 100;

  const handleChange = (newValue: number) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Wrapper>
      <Label>{label}</Label>

      <ProgressRow>
        <BarBackground>
          <BarFill
            color={color}
            style={{ width: `${percentage}%` }}
          />
        </BarBackground>

        <Input
          type="number"
          min={0}
          max={max}
          value={safeValue}
          onChange={(e) => handleChange(Number(e.target.value))}
        />
      </ProgressRow>

      <Slider
        type="range"
        min={0}
        max={max}
        value={safeValue}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
    </Wrapper>
  );
};

export default ReadingProgressInput;

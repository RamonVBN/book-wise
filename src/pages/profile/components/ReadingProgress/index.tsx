import React, { useState } from "react"
import { Container, Input, Label, Row, SaveButton, TotalPages } from "./styles"

type ReadingProgressInputProps = {
  totalPages: number
  initialValue?: number
  onChange?: (value: number) => void
  onSave?: (value: number) => void
}

export function ReadingProgress({
  totalPages,
  initialValue = 0,
  onChange,
  onSave,
}: ReadingProgressInputProps) {
  const [value, setValue] = useState(initialValue)

  function clamp(val: number) {
    if (val < 0) return 0
    if (val > totalPages) return totalPages
    return val
  }

  function handleChange(newValue: string) {
    const numeric = clamp(Number(newValue))

    setValue(numeric)
    onChange?.(numeric)
  }

  function handleSave() {
    onSave?.(value)
  }

  return (
    <Container>

      <Row>
        <Input
          value={value}
          min={0}
          max={totalPages}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
          }}
        />

        <TotalPages>/ {totalPages}</TotalPages>
      </Row>
    </Container>
  )
}
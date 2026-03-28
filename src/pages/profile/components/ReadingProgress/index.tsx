import { PageInput } from "./styles"

type Props = {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export function ReadingProgressInput({
  currentPage,
  totalPages,
  onChange
}: Props) {

  return (
    <div style={{ display: "flex", gap: 8 }}>

      <PageInput
        type="slider"
        min={0}
        max={totalPages}
        value={currentPage}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
      />

      <span>de {totalPages}</span>

    </div>
  )
}
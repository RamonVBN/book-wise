import * as Select from "@radix-ui/react-select"
import { Content, Item, Trigger } from "./styles"
import { CheckIcon, ChevronDownIcon } from "lucide-react"


type ReadingStatus =
  | "WANT_TO_READ"
  | "READING"
  | "READ"
  | "ABANDONED"

type ReadingStatusSelectProps = {
  value?: ReadingStatus
  onChange: (status: ReadingStatus) => void
}

    
export function ReadingStatusSelect({
  value,
  onChange,
}: ReadingStatusSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Trigger>
        <Select.Value placeholder="Adicionar" />

        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Trigger>

      <Select.Portal>
        <Content position="popper"
 >
          <Select.Viewport>

            <Item value="WANT_TO_READ">
              <Select.ItemText>
                Quero ler
              </Select.ItemText>

              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Item>

            <Item value="READING">
              <Select.ItemText>
                Lendo
              </Select.ItemText>

              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Item>

            <Item value="READ">
              <Select.ItemText>
                Lido
              </Select.ItemText>

              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Item>

            <Item value="ABANDONED">
              <Select.ItemText>
                Abandonei
              </Select.ItemText>

              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Item>

          </Select.Viewport>
        </Content>
      </Select.Portal>
    </Select.Root>
  )
}
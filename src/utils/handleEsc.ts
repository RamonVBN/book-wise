type handleEscProps = {
  event: React.KeyboardEvent<HTMLDivElement>
  closeFunction: () => void
}

export function handleEsc({event, closeFunction} : handleEscProps) {
    if (event.key === "Escape" ) {
      return closeFunction();
    }
  }
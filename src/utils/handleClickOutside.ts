type handleClickOutsideProps = {
  event: React.PointerEvent<HTMLDivElement>
  ref: React.RefObject<HTMLDivElement | null>
  closeFunction: () => void
}

export function handleClickOutside({
  event,
  ref,
  closeFunction,
}: handleClickOutsideProps) {
  if (
    ref.current &&
    !ref.current.contains(event.target as Node)
  ) {
    setTimeout(() => {
      return closeFunction()
    }, 150)
  }
}

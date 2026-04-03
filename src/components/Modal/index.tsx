import { ReactNode, RefObject } from "react";
import { ModalContainer, ModalOverlay } from "./styles";


interface ModalProps {
    ref: RefObject<HTMLDivElement | null>
    children: ReactNode
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
    onPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void
}

export function Modal({ ref, children, onKeyDown, onPointerDown }: ModalProps){

    return (
        <ModalOverlay onPointerDown={onPointerDown} >
            <ModalContainer ref={ref} tabIndex={-1} onKeyDown={onKeyDown} >
               {children}
            </ModalContainer>
        </ModalOverlay>
    )
}
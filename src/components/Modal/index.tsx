import { ReactNode, RefObject } from "react";
import { ModalContainer, ModalOverlay } from "./styles";


interface ModalProps {
    ref: RefObject<HTMLDivElement | null>
    children: ReactNode
}

export function Modal({ ref, children }: ModalProps){

    return (
        <ModalOverlay >
            <ModalContainer ref={ref}>
               {children}
            </ModalContainer>
        </ModalOverlay>
    )
}
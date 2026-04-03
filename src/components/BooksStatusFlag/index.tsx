import { ReadingStatus } from "@/generated/prisma";
import { StatusMark } from "./styles";
import { Bookmark } from "lucide-react";


type BooksStatusFlagProps = {
    status: ReadingStatus
    explore?: boolean
}

export function BooksStatusFlag({status, explore = false}: BooksStatusFlagProps){

    return (
        <StatusMark status={status} explore={explore}>
            <Bookmark/>
        </StatusMark>
    )
}
import { ReadingStatus } from "@/generated/prisma";
import { StatusMark } from "./styles";


type ExploreBooksStatusFlagProps = {

    status: ReadingStatus
}

export function ExploreBooksStatusFlag({status}: ExploreBooksStatusFlagProps){

    return (
        <StatusMark status={status}>
            {
                status === 'FINISHED' && 'LIDO'
            }
            {
                status === 'READING' && 'LENDO'
            }
            {
                status === 'WANT_TO_READ' && 'QUERO LER'
            }
            {
                status === 'ABANDONED' && 'ABANDONEI'
            }
            
        </StatusMark>
    )
}
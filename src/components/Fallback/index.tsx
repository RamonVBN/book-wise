import LoadingSpinner from "@/pages/explore/components/LoadingSpinner";
import { FallbackContainer } from "./styles";


export function Fallback(){

    return (
        <FallbackContainer>
            <LoadingSpinner/>
        </FallbackContainer>
    )
}
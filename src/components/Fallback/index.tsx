import LoadingSpinner from "@/components/LoadingSpinner";
import { FallbackContainer } from "./styles";

export function Fallback() {
  return (
    <FallbackContainer>
      <LoadingSpinner />
    </FallbackContainer>
  );
}

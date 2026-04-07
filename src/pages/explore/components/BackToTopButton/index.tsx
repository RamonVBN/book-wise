
import { ArrowUp } from 'lucide-react'
import { TopButton } from './style';

export default function BackToTop({onClick}: {onClick: () => void}) {
  
  return (
    (
      <TopButton onClick={onClick}>
        <ArrowUp />
      </TopButton>
    )
  );
}
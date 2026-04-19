import { AvatarContainer, AvatarFallback, AvatarImage, AvatarInner } from "./styles";

type AvatarProps = {
  width: number;
  height: number;
  src?: string;
  userName: string
  borderWidth?: 'sm' | 'md'
  onClick?: () => void
};

export function Avatar({ height, width, src, userName, borderWidth = 'sm', onClick }: AvatarProps) {
  return (
    <AvatarContainer
    onClick={onClick}
      css={{
        $$width: `${width}px`,
        $$height: `${height}px`,
        $$borderWidth: `${borderWidth === 'md' ? '2px' : '1px'}`
      }}
    >
      <AvatarInner>
        {
            src ? (
                <AvatarImage unoptimized quality={100} priority width={width} height={height} src={src} alt="" />
            ) : (
                <AvatarFallback>
                    {userName[0]}
                </AvatarFallback>
            )
        }
      </AvatarInner>
    </AvatarContainer>
  );
}

import { useState } from "react";
import { CoverContainer, Skeleton, StyledImage } from "./styles";

type BookCoverProps = {
  src?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  width: number;
  height: number;
};

export function BookCover({
  src,
  alt = "",
  sizes = "100vw",
  priority = false,
  width,
  height,
}: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fallback = "/book-placeholder.png";

  return (
    <CoverContainer
      css={{
        $$width: `${width}px`,
        $$height: `${height}px`,
      }}
    >
      {!loaded && <Skeleton />}

      <StyledImage
        css={{
          $$width: width,
          $$height: height,
        }}
        quality={100}
        key={src}
        width={width}
        height={height}
        src={(!error && src) ? src : fallback}
        alt={alt}
        sizes={sizes}
        priority={priority}
        loaded={loaded}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setError(true)}
        unoptimized
      />
    </CoverContainer>
  );
}

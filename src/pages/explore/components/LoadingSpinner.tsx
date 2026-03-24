import { styled } from "@/pages/globalStyles";
import { keyframes } from "@stitches/react";

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

// Pulsação do arco
const dash = keyframes({
  '0%': { strokeDasharray: '1, 150', strokeDashoffset: '0' },
  '50%': { strokeDasharray: '90, 150', strokeDashoffset: '-35' },
  '100%': { strokeDasharray: '90, 150', strokeDashoffset: '-124' },
});

// Container centralizado
const SpinnerContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 0',
});

// Spinner SVG
const Spinner = styled('svg', {
  width: '50px',
  height: '50px',
  transformOrigin: 'center',
  animation: `${rotate} 2s linear infinite`,
  circle: {
    fill: 'none',
    strokeLinecap: 'round',
  },
});

// Componente React
export default function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner viewBox="0 0 50 50">
        {/* Fundo suave */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#E6E8F2"         // cor de fundo suave
          strokeWidth="5"
        />
        {/* Arco animado */}
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="#8381D9"         // arco principal
          strokeWidth="5"
          strokeDasharray="90,150"
          strokeDashoffset="0"
          style={{
            animation: `${dash} 1.5s ease-in-out infinite`,
          }}
        />
      </Spinner>
    </SpinnerContainer>
  );
}
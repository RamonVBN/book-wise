import { styled } from "@/pages/globalStyles";


export const TopButton = styled('button', {
  position: 'fixed',
  
  bottom: '40px',
  right: '40px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#8381D9', // cor principal da paleta
  color: '#F8F9FC',           // ícone em cor clara
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s, opacity 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});
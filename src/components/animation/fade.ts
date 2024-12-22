import { css, keyframes } from 'styled-components';

const animateFadeIn = (display: string | undefined) => keyframes`
  from {
    display: ${display || 'block'};
    opacity: 0;
  } 
  
  to {

    display: ${display || 'block'};
    opacity: 1;
  }
`;

const animateFadeOut = (display: string | undefined) => keyframes`
  from {
    display: ${display || 'block'};
    opacity: 1;
  }

  to {
    display: ${display};
    opacity: 0;
  }
`;

export const fadeStyles = (isOpen: boolean, display?: string) => css`
  animation: ${isOpen ? animateFadeIn(display) : animateFadeOut(display)} 0.3s
    ease-in-out;
  display: ${isOpen ? display || 'block' : 'none'};
`;

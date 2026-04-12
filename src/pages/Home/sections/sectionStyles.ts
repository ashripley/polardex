import styled, { css } from 'styled-components';

export const ButtonContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  text-align: start;
  color: ${({ theme }) => theme.color.text.primary};

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: center;
    `}
`;

export const SectionText = styled.span`
  display: block;
  /* Fluid scale: 1.5rem at 320px viewport → xxxl on desktop */
  font-size: clamp(1.5rem, 5vw, ${({ theme }) => theme.typography.size.xxxl});
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-top: 0;
  margin-bottom: 0.8em;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const SectionParagraph = styled.p`
  margin-top: 0;
  margin-bottom: 1em;
  font-size: ${({ theme }) => theme.typography.size.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: start;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: ${({ theme }) => theme.typography.size.lg};
  }
`;

export const SectionWrapper = styled.div`
  /* Mobile uses tighter vertical rhythm; was space[8] (2rem). The home page
     is the only consumer that needs the bigger padding so the marketing
     sections breathe. Other pages use this wrapper for max-width only. */
  padding: ${({ theme }) => `${theme.space[6]} ${theme.space[4]}`};
  width: 100%;
  margin-inline: auto;

  @media (min-width: ${({ theme }) => theme.breakpoint.sm}) {
    padding-left: ${({ theme }) => theme.space[6]};
    padding-right: ${({ theme }) => theme.space[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    padding-top: ${({ theme }) => theme.space[20]};
    padding-bottom: ${({ theme }) => theme.space[20]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.lg}) {
    max-width: ${({ theme }) => theme.breakpoint.lg};
    padding-left: ${({ theme }) => theme.space[6]};
    padding-right: ${({ theme }) => theme.space[6]};
  }
`;

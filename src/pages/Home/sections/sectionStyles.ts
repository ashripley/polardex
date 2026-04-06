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
  font-size: ${({ theme }) => theme.typography.size.xxxl};
  margin-top: 0px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin-bottom: 0.8em;
`;

export const SectionParagraph = styled.p`
  margin-top: 0px;
  margin-bottom: 1em;
  font-size: ${({ theme }) => theme.typography.size.lg};
  transition: ${({ theme }) => theme.transition.normal};
  color: ${({ theme }) => theme.color.text.primary};
  text-align: start;
`;

export const SectionWrapper = styled.div`
  padding: ${({ theme }) => `${theme.space[10]} ${theme.space[6]}`};
  width: 100%;
  margin-inline: auto;

  @media (min-width: 75em) {
    max-width: 75em;
    padding: unset;
  }

  @media (min-width: 56.25em) {
    padding-top: ${({ theme }) => theme.space[20]};
    padding-bottom: ${({ theme }) => theme.space[20]};
  }
`;

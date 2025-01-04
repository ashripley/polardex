import styled, { css } from 'styled-components';
import { pxToRem } from '../../../components/helpers';

export const ButtonContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  gap: ${pxToRem('xxs')};
  text-align: start;
  color: ${({ theme }) => theme.textColor.t1};

  ${({ isMobile }) =>
    isMobile &&
    css`
      justify-content: center;
    `}
`;

export const SectionText = styled.span`
  font-size: 2.5em;
  margin-top: 0px;
  font-weight: 700;
  margin-bottom: 0.8em;
`;

export const SectionParagraph = styled.p`
  margin-top: 0px;
  margin-bottom: 1em;
  font-size: 1.26562em;
  transition: color 0.3s ease-in-out;
  color: ${({ theme }) => theme.textColor.t1};
  text-align: start;
`;

export const SectionWrapper = styled.div`
  padding: 2.5em 1.5em;
  width: 100%;
  margin-inline: auto;

  @media (min-width: 75em) {
    max-width: 75em;
    padding: unset;
  }

  @media (min-width: 56.25em) {
    padding-top: 5em;
    padding-bottom: 5em;
  }
`;

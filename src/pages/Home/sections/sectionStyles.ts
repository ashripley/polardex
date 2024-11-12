import styled from 'styled-components';
import { pxToRem } from '../../../components/helpers';

export const ButtonContainer = styled.div`
  display: flex;
  gap: ${pxToRem('xxs')};
  text-align: start;
  color: ${({ theme }) => theme.textColor.t1};
`;

export const SectionText = styled.h1`
  font-size: 2.56578em;
  margin-top: 0px;
  font-weight: 700;
  margin-bottom: 0.8em;
  transition: color 400ms ease-in-out;
`;

export const SectionParagraph = styled.p`
  margin-top: 0px;
  margin-bottom: 1em;
  font-size: 1.26562em;
  transition: color 400ms ease-in-out;
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

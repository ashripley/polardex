import styled, { css } from 'styled-components';
import { ButtonHTMLAttributes } from 'react';
import { pxToRem } from '../helpers';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType: 'primary' | 'secondary';
};

const buttonStyles = css<Props>`
  font-family: inherit;
  letter-spacing: ${pxToRem('xxxxs')};
  color: rgb(282, 282, 282);
  background-image: none;
  background-clip: padding-box;
  display: block;
  border-radius: ${pxToRem('xxxs')};
  padding: 0.5rem;
  box-sizing: border-box;
  min-width: 100px;
  border: none;
  background-color: rgb(282, 282, 282, 0.3);
  flex-shrink: 0;

  &::placeholder {
    color: rgb(282 282 282);
  }

  &:focus {
    outline: none;
  }
`;

export const StyledButton = styled.button<Props>`
  ${buttonStyles}
`;

export function Button(props: Props) {
  const { buttonType } = props;
  return buttonType === 'primary' ? (
    <PrimaryButton {...props} />
  ) : buttonType === 'secondary' ? (
    <SecondaryButton {...props} />
  ) : (
    <StyledButton {...props} />
  );
}

const newButtonStyles = css`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: inherit;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  white-space: nowrap;
  border-radius: 0.5em;
  background: none;
  padding: 0.375em 0.75em;
  user-select: none;
  line-height: 1.15;
  justify-content: center;
  transition: background-color 200ms ease-in, border-color 200ms ease-in,
    box-shadow 200ms ease-in, color 200ms ease-in;
  border: 0.0625em solid rgb(76, 86, 106);
`;

export const PrimaryButton = styled(StyledButton)`
  ${newButtonStyles}
  background: none ${({ theme }) => theme.color.text.tertiary};
  margin-left: 0;
  color: ${({ theme }) => theme.color.text.primary};
  border: none;

  @media not all and (hover: none) {
    &:hover {
      background-color: ${({ theme }) => theme.color.frost.sky};
      cursor: pointer;
    }
  }
`;

export const SecondaryButton = styled(StyledButton)`
  ${newButtonStyles}
  color: ${({ theme }) => theme.color.text.primary};

  @media not all and (hover: none) {
    &:hover {
      border-color: rgb(115, 151, 186);
      color: rgb(115, 151, 186);
      cursor: pointer;
    }
  }
`;

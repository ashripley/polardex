import styled, { css } from 'styled-components';
import { ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonType: 'primary' | 'secondary';
};

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[4]}`};
  min-width: 100px;
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast},
    border-color ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};
  white-space: nowrap;
  user-select: none;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.frost.blue};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const PrimaryBase = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'buttonType',
})<Props>`
  ${baseStyles}
  background-color: ${({ theme }) => theme.color.text.tertiary};
  color: ${({ theme }) => theme.color.text.primary};

  @media not all and (hover: none) {
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.color.frost.sky};
      color: ${({ theme }) => theme.color.surface.base};
    }
  }
`;

const SecondaryBase = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'buttonType',
})<Props>`
  ${baseStyles}
  background: transparent;
  color: ${({ theme }) => theme.color.text.primary};
  border: 1px solid ${({ theme }) => theme.color.text.primary};

  @media not all and (hover: none) {
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.color.frost.blue};
      color: ${({ theme }) => theme.color.frost.blue};
    }
  }
`;

const motionProps = {
  whileTap: { scale: 0.97 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

export function PrimaryButton(props: Props) {
  return <PrimaryBase {...motionProps} {...props} />;
}

export function SecondaryButton(props: Props) {
  return <SecondaryBase {...motionProps} {...props} />;
}

export function Button(props: Props) {
  return props.buttonType === 'primary' ? (
    <PrimaryButton {...props} />
  ) : (
    <SecondaryButton {...props} />
  );
}

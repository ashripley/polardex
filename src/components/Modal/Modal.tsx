import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { fadeStyles } from '../animation';

interface ModalProps {
  isOpen: boolean;
}

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  margin: auto;
  width: 80dvw;
  height: 70dvh;
  position: absolute;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  background-color: ${({ theme }) => theme.color.surface.subtle};

  ${({ isOpen }) => fadeStyles(isOpen, 'flex')};
`;

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { isOpen, children } = props;

  return <Container isOpen={isOpen}>{children}</Container>;
}

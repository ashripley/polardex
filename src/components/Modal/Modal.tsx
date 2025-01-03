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
  height: 80dvh;
  position: absolute;
  border-radius: 0.5rem;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  background-color: ${({ theme }) => theme.bgColor.bg1};

  ${({ isOpen }) => fadeStyles(isOpen, 'flex')};
`;

export function Modal(props: PropsWithChildren<ModalProps>) {
  const { isOpen, children } = props;
  console.log({ isOpen });

  return <Container isOpen={isOpen}>{children}</Container>;
}

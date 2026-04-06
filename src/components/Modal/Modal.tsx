import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';
import { PropsWithChildren } from 'react';

const overlayShow = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const overlayHide = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const contentHide = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(100%); }
`;

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(76, 86, 106, 0.35);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndex.modal};

  &[data-state='open']   { animation: ${overlayShow} 200ms ease; }
  &[data-state='closed'] { animation: ${overlayHide} 150ms ease; }
`;

const Handle = styled.div`
  display: none;
  width: 2.5rem;
  height: 4px;
  background: ${({ theme }) => theme.color.surface.muted};
  border-radius: 2px;
  margin: 0 auto ${({ theme }) => theme.space[2]};
  flex-shrink: 0;

  @media (max-width: 56.25em) {
    display: block;
  }
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90dvw, 900px);
  max-height: min(85dvh, 720px);
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:focus { outline: none; }

  &[data-state='open']   { animation: ${contentShow} 250ms cubic-bezier(0.16, 1, 0.3, 1); }
  &[data-state='closed'] { animation: ${contentHide} 150ms ease-in; }

  @media (max-width: 56.25em) {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    transform: none;
    width: 100%;
    max-height: 90dvh;
    border-radius: ${({ theme }) => theme.radius.xl} ${({ theme }) => theme.radius.xl} 0 0;
    padding-top: ${({ theme }) => theme.space[2]};

    &[data-state='open']   { animation: ${slideUp} 350ms cubic-bezier(0.16, 1, 0.3, 1); }
    &[data-state='closed'] { animation: ${slideDown} 200ms ease-in; }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ isOpen, onClose, children }: PropsWithChildren<ModalProps>) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Overlay />
        <Content aria-describedby={undefined}>
          <Dialog.Title style={{ display: 'none' }}>Studio</Dialog.Title>
          <Handle />
          {children}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

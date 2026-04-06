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

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(76, 86, 106, 0.35);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndex.modal};

  &[data-state='open']   { animation: ${overlayShow} 200ms ease; }
  &[data-state='closed'] { animation: ${overlayHide} 150ms ease; }
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: min(80dvw, 900px);
  max-height: min(70dvh, 700px);
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  z-index: ${({ theme }) => theme.zIndex.modal + 1};
  display: flex;
  overflow: hidden;

  &:focus { outline: none; }

  &[data-state='open']   { animation: ${contentShow} 250ms cubic-bezier(0.16, 1, 0.3, 1); }
  &[data-state='closed'] { animation: ${contentHide} 150ms ease-in; }
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
          {children}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

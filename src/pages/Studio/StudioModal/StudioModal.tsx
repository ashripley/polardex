import styled from 'styled-components';
import { Modal } from '../../../components';
import { IconX } from '@tabler/icons-react';
import { StudioModalDialog } from './StudioModalDialog';
import { StudioModalCanvas } from './StudioModalCanvas';

interface StudioModalProps {
  isOpen: boolean;
  actionType: string;
  onClose: () => void;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.space[2]};
  margin: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  width: fit-content;
  margin-left: auto;
  transition: ${({ theme }) => theme.transition.fast};

  & > svg {
    color: ${({ theme }) => theme.color.text.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.color.text.primaryHover};
    cursor: pointer;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  margin: ${({ theme }) => theme.space[4]};
`;

export function StudioModal(props: StudioModalProps) {
  const { isOpen, onClose, actionType } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Container>
        <ModalHeader onClick={onClose} role='button' aria-label='Close'>
          <IconX stroke={2} />
        </ModalHeader>
        <ContentContainer>
          <Content>
            <StudioModalDialog type={actionType} />
          </Content>
          <Content>
            <StudioModalCanvas type={actionType} />
          </Content>
        </ContentContainer>
      </Container>
    </Modal>
  );
}

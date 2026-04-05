import styled from 'styled-components';
import { Modal } from '../../../components';
import { IconX } from '@tabler/icons-react';
import { StudioModalDialog } from './StudioModalDialog';
import { StudioModalCanvas } from './StudioModalCanvas';

interface StudioModalProps {
  isOpen: boolean;
  actionType: string;
  toggleModal: () => void;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: end;
  padding: 0.5rem;
  margin: 1rem;
  border-radius: 0.5rem;
  width: auto;
  margin-left: auto;
  transition: background-color 0.3s ease-in-out;

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
`;

const Content = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  margin: 1rem;
`;

export function StudioModal(props: StudioModalProps) {
  const { isOpen, toggleModal, actionType } = props;

  return (
    <Modal isOpen={isOpen}>
      <Container>
        <ModalHeader onClick={toggleModal}>
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
        <div>
          <div style={{ height: '5rem' }}></div>
        </div>
      </Container>
    </Modal>
  );
}

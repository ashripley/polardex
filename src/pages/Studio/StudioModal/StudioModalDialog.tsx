import styled from 'styled-components';
import { PrimaryButton } from '../../../components';

interface StudioModalDialogProps {
  type: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const CommonSpan = styled.span`
  color: ${({ theme }) => theme.color.text.primary};
`;

const Header = styled(CommonSpan)`
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 1em;
  margin-bottom: auto;
`;

const Action = styled.div`
  display: flex;
  margin-top: 3rem;
`;

const Content = styled(CommonSpan)``;

export function StudioModalDialog(props: StudioModalDialogProps) {
  const { type } = props;

  const content: Record<string, Record<string, string>> = {
    add: {
      title: 'Card Canvas',
      description:
        'Add a new card from your collection with the interactive canvas.',
    },
    modify: {
      title: 'Card Canvas',
      description: 'Search your collection and modify an existing card.',
    },
    attribute: {
      title: 'Attribute Canvas',
      description: 'Create new attributes to add to your cards.',
    },
  };

  return (
    <Container>
      <Header>{content[type]?.title}</Header>
      <Content>{content[type]?.description}</Content>
      <Action>
        <PrimaryButton buttonType='primary'>{'Save'}</PrimaryButton>
      </Action>
    </Container>
  );
}

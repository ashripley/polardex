import { IconPhotoScan } from '@tabler/icons-react';
import styled from 'styled-components';
import { Card } from '../Card';
import { SearchField } from '../Input';
import { useState } from 'react';

type StudioCardProps = Partial<Parameters<typeof Card>[0]> & {
  isDemo?: boolean;
};

const Container = styled.div`
  flex-grow: 1;
  padding: 1em;
  border-radius: 1.5em;
  height: auto;
  min-width: 18rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 250px;
  margin-inline: auto;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.color.surface.base};
  position: relative;
  justify-items: center;
  padding: 1rem;
  filter: drop-shadow(0 0px 0px hsl(0deg 0% 0% / 0.1))
    drop-shadow(0 0px 1px hsl(0deg 0% 0% / 0.1));
  transition: all ease-in-out 0.3s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    border-radius: 0.5rem 0.5rem 0 0;
    background: ${({ theme }) => theme.color.surface.muted};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.surface.base};
  overflow: visible;
  justify-content: flex-end;
  border: 3px solid ${({ theme }) => theme.color.surface.muted};
  margin-inline: auto;
`;

const TitleContainer = styled.p`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 0.5rem 0;
`;

const Type = styled.span`
  display: block;
  color: ${({ theme }) => theme.color.text.primary};
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: capitalize;
  max-width: 100%;
`;

const BaseUl = styled.ul<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-weight: 700;
  gap: ${({ expanded }) => (expanded ? '3rem' : '1rem')};
  padding: 0;
  color: ${({ theme }) => theme.color.text.primary};
  min-width: 0;
  width: 100%;
  transition: all 0.3s ease-in-out;

  & > li {
    font-weight: ${({ expanded }) => (expanded ? '400' : '700')};
    opacity: ${({ expanded }) => (expanded ? 1 : 0.7)};
    transition: all 0.3s ease-in-out;
  }

  & > input {
    width: 33%;
    font-weight: 400;
  }
`;

const StatUl = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  justify-content: flex-start;
  font-weight: 500;
  transition: height 0.3s ease-in-out;
  overflow: hidden;
  flex-flow: column;
  place-items: start;
  place-items: center;
  padding: 0;
  border-top: ${({ theme }) => `2px solid ${theme.color.surface.muted}`};
`;

const List = styled.li`
  display: flex;
  flex-flow: column;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem;
  color: ${({ theme }) => theme.color.text.primary};
`;

const StyledImage = styled.img`
  padding: 0.8rem;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
`;

const StyledDemoImage = styled(IconPhotoScan)`
  padding: 0.8rem;
  width: calc(100% - 8px);
  height: calc(100% - 8px);

  & {
    color: ${({ theme }) => theme.color.text.secondary};
  }
`;

const DuplicateIdentifer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.text.secondary};
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 50%;
  top: 0;
  right: 0;
  margin: 0.5rem;
  position: absolute;
  z-index: 5;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const IdentifierText = styled.span`
  color: ${({ theme }) => theme.color.surface.muted};
  display: block;
  font-size: 0.9rem;
`;

const Label = styled(Type)`
  font-size: 1rem;
  opacity: 0.7;
`;

export function StudioCard(props: StudioCardProps) {
  const [card, setCard] = useState<Partial<Parameters<typeof Card>[0]>>({});

  const { pokemonData, attributes, quantity, isDemo } = props;

  const onCardChange = (field: string, payload: string) => {
    const update = {
      [field]: payload,
    };

    setCard({ ...card, ...update });
  };

  return (
    <Container>
      <Wrapper>
        <InnerWrapper>
          <ImageContainer>
            {isDemo ? (
              <StyledDemoImage stroke={1} />
            ) : (
              <StyledImage
                className='a9bdap5'
                src={`https://img.pokemondb.net/sprites/home/normal/${pokemonData?.name?.toLowerCase()}.png`}
              />
            )}
            {quantity && (
              <DuplicateIdentifer>
                <IdentifierText>{quantity}</IdentifierText>
              </DuplicateIdentifer>
            )}
          </ImageContainer>
          <TitleContainer>
            <SearchField
              active
              onClear={() => {}}
              onSubmit={() => {}}
              onChange={(val) => onCardChange('name', val)}
              placeholder='Name'
            />
            <SearchField
              active
              onClear={() => {}}
              onSubmit={() => {}}
              onChange={(val) => onCardChange('type', val)}
              placeholder='Type'
            />
            <BaseUl expanded={false}>
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('id', val)}
                placeholder='#'
              />
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('year', val)}
                placeholder='Year'
              />
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('setNumber', val)}
                placeholder='0/0'
              />
            </BaseUl>
          </TitleContainer>
          <StatUl>
            <List>
              <Label>Set:</Label>
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('set', val)}
                placeholder='Set'
              />
            </List>
            <List>
              <Label>Type:</Label>
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('cardType', val)}
                placeholder='Card Type'
              />
            </List>
            <List>
              <Label>Condition:</Label>
              <SearchField
                active
                onClear={() => {}}
                onSubmit={() => {}}
                onChange={(val) => onCardChange('condition', val)}
                placeholder='Condition'
              />
            </List>
            {attributes?.grading && (
              <List>
                <Label>Grading:</Label>
                <SearchField
                  active
                  onClear={() => {}}
                  onSubmit={() => {}}
                  onChange={(val) => onCardChange('grading', val)}
                  placeholder='Grading'
                />
              </List>
            )}
          </StatUl>
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}

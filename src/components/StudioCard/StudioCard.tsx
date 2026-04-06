import { IconPhotoScan } from '@tabler/icons-react';
import styled from 'styled-components';
import { spriteUrl, spriteUrlFallback } from '../../utils';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { SearchField } from '../Input';
import {
  BaseCardWrapper,
  BaseCardInnerWrapper,
  BaseCardImageContainer,
  BaseCardTitleContainer,
} from '../BaseCard';

type StudioCardProps = Partial<Parameters<typeof Card>[0]> & {
  isDemo?: boolean;
};

const Container = styled.div`
  flex-grow: 1;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.xl};
  height: auto;
  min-width: 18rem;
`;

const Wrapper = styled(BaseCardWrapper)``;
const InnerWrapper = styled(BaseCardInnerWrapper)``;
const ImageContainer = styled(BaseCardImageContainer)``;
const TitleContainer = styled(BaseCardTitleContainer)``;

const Label = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const BaseUl = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  gap: ${({ theme }) => theme.space[2]};
  padding: 0;
  color: ${({ theme }) => theme.color.text.primary};
  min-width: 0;
  width: 100%;
  transition: ${({ theme }) => theme.transition.normal};

  & > input {
    width: 33%;
    font-weight: ${({ theme }) => theme.typography.weight.regular};
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space[1]};
  border-top: 2px solid ${({ theme }) => theme.color.surface.muted};
  padding-top: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space[2]};
`;

const StyledImage = styled(motion.img)`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);
`;

const StyledDemoImage = styled(motion(IconPhotoScan))`
  padding: ${({ theme }) => theme.space[3]};
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  color: ${({ theme }) => theme.color.text.secondary};
`;

const DuplicateIdentifer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.frost.blue};
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radius.full};
  top: 0;
  right: 0;
  margin: ${({ theme }) => theme.space[2]};
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const IdentifierText = styled.span`
  color: #ffffff;
  display: block;
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 1;
`;

export function StudioCard(props: StudioCardProps) {
  const { pokemonData, attributes, quantity, isDemo } = props;

  const onCardChange = (_field: string, _payload: string) => {
    // TODO: wire up to form state / Firestore
  };

  return (
    <Container>
      <Wrapper>
        <InnerWrapper>
          <ImageContainer>
            {isDemo ? (
              <StyledDemoImage
                stroke={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <StyledImage
                src={spriteUrl(pokemonData?.name ?? '')}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  const fallback = spriteUrlFallback(pokemonData?.name ?? '');
                  if (img.src !== fallback) { img.src = fallback; }
                  else { img.style.opacity = '0'; }
                }}
              />
            )}
            {quantity && (
              <DuplicateIdentifer>
                <IdentifierText>{quantity}</IdentifierText>
              </DuplicateIdentifer>
            )}
          </ImageContainer>

          <TitleContainer>
            <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('name', val)} placeholder='Name' />
            <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('type', val)} placeholder='Type' />
            <BaseUl>
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('id', val)} placeholder='#' />
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('year', val)} placeholder='Year' />
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('setNumber', val)} placeholder='0/0' />
            </BaseUl>
          </TitleContainer>

          <StatGrid>
            <StatItem>
              <Label>Set</Label>
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('set', val)} placeholder='Set' />
            </StatItem>
            <StatItem>
              <Label>Card Type</Label>
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('cardType', val)} placeholder='Type' />
            </StatItem>
            <StatItem>
              <Label>Condition</Label>
              <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('condition', val)} placeholder='Condition' />
            </StatItem>
            {attributes?.grading !== undefined && (
              <StatItem>
                <Label>Grading</Label>
                <SearchField active onClear={() => {}} onSubmit={() => {}} onChange={(val) => onCardChange('grading', val)} placeholder='Grading' />
              </StatItem>
            )}
          </StatGrid>
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}

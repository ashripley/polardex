import styled from 'styled-components';
import { pxToRem } from '../helpers';
import { CSSProperties } from 'react';

interface CardProps {
  title: string;
  bg: string;
  imageUrl: string;
  style?: CSSProperties;
  height?: number;
  width?: number;
}

const Container = styled.div<{ height: number; width: number; bg: string }>`
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  border-radius: ${pxToRem('md')};
  background-color: ${({ bg }) => bg};
  display: flex;
  flex-direction: column;
  padding: 1em;
`;

const Header = styled.div`
  display: flex;
  height: 10%;
  width: 100%;
  background-color: inherit;
  border-top-right-radius: 1.5em;
  border-top-left-radius: 1.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  background-color: inherit;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
`;

const Footer = styled.div`
  display: flex;
  height: 10%;
  width: 100%;
  background-color: inherit;
  border-bottom-right-radius: 1.5em;
  border-bottom-left-radius: 1.5em;
`;

export const Title = styled.h1`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.bgColor.bg1};
  text-align: start;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1em;
`;

const ImageContainer = styled.div`
  height: 50%;
  width: 100%;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  height: 40%;
  width: 100%;
  border-radius: 1em;
`;

const Image = styled.img`
  width: 5em;
  height: 5em;
`;

const Line = styled.div`
  height: 2px;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  margin: 10px 0;
  width: 100%;
  margin: 10px auto;
`;

const FooterLine = styled(Line)`
  width: 20%;
`;

const Avatar = styled.div`
  height: 1em;
  width: 1em;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  border-radius: 100%;
  margin-right: 0.5em;
`;

export function Card({
  style,
  height = 550,
  width = 350,
  title,
  bg,
  imageUrl,
}: CardProps) {
  return (
    <Container height={height} width={width} style={style} bg={bg}>
      <Header>
        <Title>{title}</Title>
        <Avatar />
      </Header>
      <Content>
        <ImageContainer>
          <Image src={imageUrl} width='5em' height='5em' />
        </ImageContainer>
        <Info>
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
        </Info>
      </Content>
      <Footer>
        <FooterLine />
        <FooterLine />
        <FooterLine />
      </Footer>
    </Container>
  );
}

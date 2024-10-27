import styled, { css } from 'styled-components';
import { pxToRem } from '../helpers';
import { CSSProperties } from 'react';

interface CardProps {
  title: string;
  bg: string;
  imageUrl: string;
  style?: CSSProperties;
  titleSize?: string;
  height?: number;
  width?: number;
  image?: {
    height: string;
    width: string;
  };
  imageRadius?: string;
  display: boolean;
}

const Container = styled.div<{ height: number; width: number; bg: string }>`
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  border-radius: ${pxToRem('sm')};
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

export const Title = styled.h1<{ titleSize: string }>`
  font-size: ${({ titleSize }) => titleSize};
  font-weight: 500;
  color: ${({ theme }) => theme.bgColor.bg1};
  text-align: start;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1em;
`;

const ImageContainer = styled.div<{ imageRadius: string }>`
  height: 50%;
  width: 100%;
  background-color: ${({ theme }) => theme.bgColor.bg1};
  border-radius: ${({ imageRadius }) => imageRadius};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  height: 40%;
  width: 100%;
  border-radius: 1em;
`;

const Image = styled.img<{ height: string; width: string }>`
  ${({ width, height }) => {
    return css`
      height: ${height};
      width: ${width};
    `;
  }}
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
  titleSize = '0.8em',
  bg,
  imageRadius = '1em',
  imageUrl,
  image = {
    height: '5em',
    width: '5em',
  },
  display = false,
}: CardProps) {
  return (
    <Container height={height} width={width} style={style} bg={bg}>
      <Header>
        <Title titleSize={titleSize}>{title}</Title>
        <Avatar />
      </Header>
      <Content>
        <ImageContainer imageRadius={imageRadius}>
          <Image src={imageUrl} height={image.height} width={image.width} />
        </ImageContainer>
        {display && (
          <Info>
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
          </Info>
        )}
      </Content>
      {display && (
        <Footer>
          <FooterLine />
          <FooterLine />
          <FooterLine />
        </Footer>
      )}
    </Container>
  );
}

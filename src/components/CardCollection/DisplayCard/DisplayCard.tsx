import { CSSProperties } from 'styled-components';
import { Card } from '../../Card';

interface DisplayCardProps {
  title: string;
  bg: string;
  imageUrl: string;
  style?: CSSProperties;
}

export function DisplayCard({ style, title, bg, imageUrl }: DisplayCardProps) {
  return (
    <Card
      height={300}
      width={200}
      style={style}
      title={title}
      bg={bg}
      imageUrl={imageUrl}
    />
  );
}

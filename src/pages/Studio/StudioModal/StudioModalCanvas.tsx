import { Attribute, Card, StudioCard } from '../../../components';

interface StudioModalCanvasProps {
  type: string;
}

export function StudioModalCanvas({ type }: StudioModalCanvasProps) {
  if (type === 'add') {
    return (
      <StudioCard
        isDemo
        pokemonData={{
          name: 'Charizard',
          id: '#009',
          type: 'Fire',
        }}
        attributes={{
          cardType: 'Holo',
          condition: 'Excellent',
          set: 'Base',
          grading: 10,
          year: 1999,
        }}
        setNumber={'12/102'}
      />
    );
  }

  if (type === 'modify') {
    return (
      <Card
        pokemonData={{
          name: 'Articuno',
          id: '#009',
          type: 'Ice',
        }}
        attributes={{
          cardType: 'Holo',
          condition: 'Excellent',
          set: 'Base',
          grading: 10,
          year: 1999,
        }}
        setNumber={'12/102'}
      />
    );
  }

  if (type === 'attribute') {
    return <Attribute inOverview={false} />;
  }

  return;
}

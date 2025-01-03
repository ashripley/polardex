import { StudioCard } from '../../../components';

export function StudioModalCanvas() {
  return (
    <div>
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
    </div>
  );
}

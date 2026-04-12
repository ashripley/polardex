import { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { SectionWrapper } from '../Home/sections/sectionStyles';
import { useGetCardsQuery } from '../../api';
import { usePokemonSetsQuery } from '../../api/tcg/usePokemonSetsQuery';
import { useTcgPrices } from '../../api/tcg/useTcgPrices';
import { useAudRate } from '../../hooks/useAudRate';
import { useCurrency, fmtPrice } from '../../hooks/useCurrency';
import { spriteUrl, spriteUrlFallback } from '../../utils';

const POKEBALL_FALLBACK = 'https://img.pokemondb.net/sprites/items/poke-ball.png';

const SkeletonBox = styled(motion.div)`
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.surface.base};
`;

// ── Shell ─────────────────────────────────────────────────────────────────────

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.muted};
  min-height: 60dvh;
  transition: background-color 200ms ease;
`;

const PageHeader = styled.div`
  padding: ${({ theme }) => `${theme.space[6]} 0 ${theme.space[4]}`};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xxl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[1]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space[4]};
  padding-bottom: ${({ theme }) => theme.space[8]};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// ── Cards ─────────────────────────────────────────────────────────────────────

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.color.surface.base};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.space[5]};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  min-width: 0;
  overflow: hidden;
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin: 0 0 ${({ theme }) => theme.space[4]} 0;
`;

// ── Overview stats ────────────────────────────────────────────────────────────

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
`;

const StatBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[3]};
  background: ${({ theme }) => theme.color.surface.muted};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 5rem;
`;

const StatValue = styled.span`
  font-size: clamp(1.25rem, 4vw, ${({ theme }) => theme.typography.size.xxl});
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.frost.blue};
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
`;

// ── Bar chart ─────────────────────────────────────────────────────────────────

const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 6rem) 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const BarLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  min-width: 0;
`;

const BarTrack = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.color.surface.muted};
  border-radius: 4px;
  overflow: hidden;
  min-width: 0;
`;

const BarFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  border-radius: 4px;
  background: ${({ $color }) => $color};
`;

const BarCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

// ── Pill grid ─────────────────────────────────────────────────────────────────

const PillGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const StatPill = styled(motion.div)<{ $accent: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $accent }) => `${$accent}15`};
  border: 1px solid ${({ $accent }) => `${$accent}30`};
  overflow: hidden;
`;

const PillLabel = styled.span<{ $accent: string }>`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ $accent }) => $accent};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  text-transform: capitalize;
`;

const PillCount = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  font-variant-numeric: tabular-nums;
`;

// ── Top lists ─────────────────────────────────────────────────────────────────

const TopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const TopItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.muted};
`;

const Rank = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.tertiary};
  width: 1.25rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const ThumbImg = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
`;

const TopName = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.text.primary};
  text-transform: capitalize;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TopBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.frost.blue};
  background: ${({ theme }) => `${theme.color.frost.blue}15`};
  padding: ${({ theme }) => `2px ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

const PriceBadge = styled.span<{ $tier: 'normal' | 'high' | 'ultra' }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ $tier }) => $tier === 'ultra' ? '#d08770' : $tier === 'high' ? '#ebcb8b' : '#a3be8c'};
  background: ${({ $tier }) => $tier === 'ultra' ? 'rgba(208,135,112,0.15)' : $tier === 'high' ? 'rgba(235,203,139,0.15)' : 'rgba(163,190,140,0.15)'};
  padding: ${({ theme }) => `2px ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

// ── Color palette ─────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  fire: '#d08770', water: '#81a1c1', grass: '#a3be8c', electric: '#ebcb8b',
  psychic: '#b48ead', ice: '#88c0d0', dragon: '#5e81ac', dark: '#4c566a',
  fighting: '#bf616a', poison: '#b48ead', ground: '#d08770', flying: '#88c0d0',
  bug: '#a3be8c', rock: '#7b88a1', ghost: '#b48ead', steel: '#7b88a1',
  fairy: '#bf616a', normal: '#d8dee9', colorless: '#d8dee9',
};

const conditionColors: Record<string, string> = {
  'near mint': '#a3be8c', 'mint': '#a3be8c',
  'lightly played': '#81a1c1', 'excellent': '#81a1c1',
  'moderately played': '#ebcb8b', 'good': '#ebcb8b',
  'heavily played': '#d08770', 'light played': '#d08770',
  'played': '#bf616a', 'poor': '#bf616a', 'damaged': '#bf616a',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function BarChart({
  data, colorFn, max, setTotals,
}: {
  data: [string, number][];
  colorFn: (key: string) => string;
  max: number;
  setTotals?: Map<string, number>;
}) {
  return (
    <BarList>
      {data.map(([key, count], i) => {
        const setTotal = setTotals?.get(key.toLowerCase());
        return (
          <BarRow key={key}>
            <BarLabel title={key}>{key || '-'}</BarLabel>
            <BarTrack>
              <BarFill
                $color={colorFn(key)}
                initial={{ width: 0 }}
                animate={{ width: `${(count / (setTotal ?? max)) * 100}%` }}
                transition={{ duration: 0.55, delay: i * 0.04, ease: 'easeOut' }}
              />
            </BarTrack>
            <BarCount>{setTotal ? `${count} / ${setTotal}` : count}</BarCount>
          </BarRow>
        );
      })}
    </BarList>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const CurrencyToggle = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.color.frost.blue : theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) => $active ? `${theme.color.frost.blue}12` : theme.color.surface.subtle};
  color: ${({ $active, theme }) => $active ? theme.color.frost.blue : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: all 150ms ease;
  &:hover { border-color: ${({ theme }) => theme.color.frost.blue}; color: ${({ theme }) => theme.color.frost.blue}; }
`;

export function Overview() {
  const { cards, loading } = useGetCardsQuery();
  const { sets } = usePokemonSetsQuery();
  const audRate = useAudRate();
  const { currency, toggle: toggleCurrency } = useCurrency();

  const tcgIds = useMemo(
    () => cards.map((c) => c.attributes.tcgId).filter((id): id is string => Boolean(id)),
    [cards],
  );
  const { priceMap } = useTcgPrices(tcgIds);

  const setTotals = useMemo(
    () => new Map(sets.map((s) => [s.name.toLowerCase(), s.total])),
    [sets]
  );

  const stats = useMemo(() => {
    if (!cards.length) return null;

    const qty = (c: { quantity?: number | string | null }) => Math.max(1, Number(c.quantity) || 1);

    const total = cards.reduce((s, c) => s + qty(c), 0);
    const unique = new Set(cards.map((c) => c.pokemonData.name.toLowerCase())).size;
    const setsCount = new Set(cards.map((c) => c.attributes.set)).size;
    const graded = cards.filter((c) => c.attributes.isGraded || Number(c.attributes.grading) > 0).length;

    // Type distribution
    const byType = new Map<string, number>();
    for (const card of cards) {
      const t = (card.pokemonData.type || 'Unknown').toLowerCase();
      byType.set(t, (byType.get(t) ?? 0) + qty(card));
    }
    const typeEntries = [...byType.entries()].sort((a, b) => b[1] - a[1]);

    // Condition distribution
    const byCond = new Map<string, number>();
    for (const card of cards) {
      const c = (card.attributes.condition || 'Unknown').toLowerCase();
      byCond.set(c, (byCond.get(c) ?? 0) + 1);
    }
    const condEntries = [...byCond.entries()].sort((a, b) => b[1] - a[1]);

    // Set distribution
    const bySet = new Map<string, number>();
    for (const card of cards) {
      const s = card.attributes.set || 'Unknown';
      bySet.set(s, (bySet.get(s) ?? 0) + 1);
    }
    const setEntries = [...bySet.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

    // Most collected Pokémon
    const byPokemon = new Map<string, { name: string; type: string; total: number }>();
    for (const card of cards) {
      const key = card.pokemonData.name.toLowerCase();
      const existing = byPokemon.get(key);
      if (existing) {
        existing.total += qty(card);
      } else {
        byPokemon.set(key, { name: card.pokemonData.name, type: card.pokemonData.type ?? '', total: qty(card) });
      }
    }
    const topPokemon = [...byPokemon.values()].sort((a, b) => b.total - a.total).slice(0, 8);

    return { total, unique, sets: setsCount, graded, typeEntries, condEntries, setEntries, topPokemon };
  }, [cards]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.07 } }),
  };

  // Collection value — quantity × price, in AUD
  const collectionValue = useMemo(() => {
    if (!cards.length || !priceMap.size) return null;
    let total = 0;
    let priced = 0;
    for (const card of cards) {
      const price = card.attributes.tcgId ? priceMap.get(card.attributes.tcgId) : undefined;
      if (price != null) {
        total += price * Math.max(1, Number(card.quantity) || 1);
        priced++;
      }
    }
    return priced > 0 ? { total, priced } : null;
  }, [cards, priceMap]);

  // Top 10 most expensive cards by TCGPlayer market price
  const topExpensive = useMemo(() => {
    if (!priceMap.size) return [];
    return cards
      .filter((c) => c.attributes.tcgId && priceMap.has(c.attributes.tcgId))
      .map((c) => ({ card: c, price: priceMap.get(c.attributes.tcgId!)! }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 10);
  }, [cards, priceMap]);

  return (
    <Main>
      <section>
        <SectionWrapper>
          <PageHeader style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <PageTitle>Collection Stats</PageTitle>
              <PageSubtitle>A snapshot of your Pokémon card collection.</PageSubtitle>
            </div>
            <CurrencyToggle $active={currency === 'AUD'} onClick={toggleCurrency} title='Toggle currency' style={{ marginTop: '0.25rem', flexShrink: 0 }}>
              {currency}
            </CurrencyToggle>
          </PageHeader>

          {loading || !stats ? (
            <Grid>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox
                  key={i}
                  style={{ height: '10rem' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </Grid>
          ) : (
            <>
              {/* ── Overview ── */}
              <Card custom={0} variants={cardVariants} initial='hidden' animate='visible' style={{ marginBottom: '1rem' }}>
                <CardTitle>Overview</CardTitle>
                <StatRow>
                  {[
                    { label: 'Total Cards', value: stats.total },
                    { label: 'Unique Pokémon', value: stats.unique },
                    { label: 'Sets', value: stats.sets },
                    { label: 'Graded', value: stats.graded },
                  ].map(({ label, value }, i) => (
                    <StatBox
                      key={label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                    >
                      <StatValue>{value}</StatValue>
                      <StatLabel>{label}</StatLabel>
                    </StatBox>
                  ))}
                  {collectionValue && (
                    <StatBox
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.34 }}
                      style={{ flex: '1 1 100%' }}
                    >
                      <StatValue style={{ fontSize: '1.5rem', color: '#a3be8c' }}>
                        {fmtPrice(collectionValue.total, currency, audRate)}
                      </StatValue>
                      <StatLabel>
                        Est. Collection Value · {collectionValue.priced} cards priced · qty included
                      </StatLabel>
                    </StatBox>
                  )}
                </StatRow>
              </Card>

              <Grid>
                {/* ── Type breakdown ── */}
                <Card custom={1} variants={cardVariants} initial='hidden' animate='visible'>
                  <CardTitle>By Type</CardTitle>
                  <BarChart
                    data={stats.typeEntries}
                    colorFn={(t) => typeColors[t] ?? '#81a1c1'}
                    max={stats.typeEntries[0]?.[1] ?? 1}
                  />
                </Card>

                {/* ── Condition breakdown ── */}
                <Card custom={2} variants={cardVariants} initial='hidden' animate='visible'>
                  <CardTitle>By Condition</CardTitle>
                  <PillGrid>
                    {stats.condEntries.map(([cond, count]) => {
                      const color = conditionColors[cond] ?? '#81a1c1';
                      return (
                        <StatPill key={cond} $accent={color} whileHover={{ scale: 1.04 }}>
                          <PillLabel $accent={color}>{cond || '-'}</PillLabel>
                          <PillCount>{count}</PillCount>
                        </StatPill>
                      );
                    })}
                  </PillGrid>
                </Card>

                {/* ── Top 10 most expensive cards ── */}
                <Card custom={3} variants={cardVariants} initial='hidden' animate='visible'>
                  <CardTitle>Most Expensive Cards</CardTitle>
                  {topExpensive.length === 0 ? (
                    <StatLabel style={{ fontStyle: 'italic' }}>Prices loading…</StatLabel>
                  ) : (
                    <TopList>
                      {topExpensive.map(({ card, price }, i) => {
                        const displayPrice = currency === 'AUD' ? price * audRate : price;
                        const tier = displayPrice >= (currency === 'AUD' ? 220 : 140) ? 'ultra' : displayPrice >= (currency === 'AUD' ? 77 : 50) ? 'high' : 'normal';
                        return (
                          <TopItem
                            key={card.cardId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                          >
                            <Rank>#{i + 1}</Rank>
                            <TopName>{card.pokemonData.name}</TopName>
                            <StatLabel style={{ fontSize: '0.7rem', opacity: 0.7 }}>{card.attributes.set}</StatLabel>
                            <PriceBadge $tier={tier}>{fmtPrice(price, currency, audRate)}</PriceBadge>
                          </TopItem>
                        );
                      })}
                    </TopList>
                  )}
                </Card>

                {/* ── Top sets ── */}
                <Card custom={4} variants={cardVariants} initial='hidden' animate='visible'>
                  <CardTitle>Top Sets</CardTitle>
                  <BarChart
                    data={stats.setEntries}
                    colorFn={() => '#b48ead'}
                    max={stats.setEntries[0]?.[1] ?? 1}
                    setTotals={setTotals}
                  />
                </Card>

                {/* ── Most collected Pokémon ── */}
                <Card custom={5} variants={cardVariants} initial='hidden' animate='visible' style={{ gridColumn: '1 / -1' }}>
                  <CardTitle>Most Collected Pokémon</CardTitle>
                  <TopList>
                    {stats.topPokemon.map((pokemon, i) => (
                      <TopItem
                        key={pokemon.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <Rank>#{i + 1}</Rank>
                        <ThumbImg
                          src={spriteUrl(pokemon.name)}
                          alt={pokemon.name}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            const fallback = spriteUrlFallback(pokemon.name);
                            if (img.src !== fallback) {
                              img.src = fallback;
                            } else {
                              img.src = POKEBALL_FALLBACK;
                              img.style.opacity = '0.4';
                            }
                          }}
                        />
                        <TopName>{pokemon.name}</TopName>
                        <PillLabel $accent='#81a1c1' style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                          {pokemon.type}
                        </PillLabel>
                        <TopBadge>×{pokemon.total}</TopBadge>
                      </TopItem>
                    ))}
                  </TopList>
                </Card>
              </Grid>
            </>
          )}
        </SectionWrapper>
      </section>
    </Main>
  );
}

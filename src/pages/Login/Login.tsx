import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase.config';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';

// ── Card data ─────────────────────────────────────────────────────────────────

const CARDS = [
  { src: 'https://images.pokemontcg.io/base1/4.png',    alt: 'Charizard',  rot: -14, x: '8%',   y: '12%',  delay: 0,    scale: 1.05 },
  { src: 'https://images.pokemontcg.io/base1/10.png',   alt: 'Mewtwo',     rot: 8,   x: '78%',  y: '6%',   delay: 0.15, scale: 0.9  },
  { src: 'https://images.pokemontcg.io/base1/16.png',   alt: 'Zapdos',     rot: -6,  x: '88%',  y: '55%',  delay: 0.3,  scale: 1.0  },
  { src: 'https://images.pokemontcg.io/base1/2.png',    alt: 'Blastoise',  rot: 12,  x: '5%',   y: '58%',  delay: 0.45, scale: 0.95 },
  { src: 'https://images.pokemontcg.io/swsh45/25.png',  alt: 'Pikachu',    rot: -10, x: '72%',  y: '75%',  delay: 0.6,  scale: 1.1  },
  { src: 'https://images.pokemontcg.io/base1/6.png',    alt: 'Gyarados',   rot: 7,   x: '18%',  y: '80%',  delay: 0.75, scale: 0.88 },
  { src: 'https://images.pokemontcg.io/base1/15.png',   alt: 'Venusaur',   rot: -4,  x: '55%',  y: '4%',   delay: 0.9,  scale: 0.92 },
];

// ── Animations ────────────────────────────────────────────────────────────────

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
  50%       { transform: translateY(-14px) rotate(var(--rot)); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const pulseOrb = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.4; }
  50%       { transform: scale(1.2); opacity: 0.65; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50%       { opacity: 1; transform: scale(1) rotate(180deg); }
`;

// ── Shell ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.muted};
`;

// ── Background orbs ───────────────────────────────────────────────────────────

const Orb = styled.div<{ $size: string; $top: string; $left: string; $color: string; $delay: string }>`
  position: absolute;
  border-radius: 9999px;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  background: ${({ $color }) => $color};
  filter: blur(90px);
  animation: ${pulseOrb} 7s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
`;

// ── Floating cards ────────────────────────────────────────────────────────────

const FloatingCard = styled(motion.div)<{ $rot: number; $delay: string }>`
  --rot: ${({ $rot }) => $rot}deg;
  position: absolute;
  animation: ${float} 5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
`;

const CardImg = styled.img`
  width: 120px;
  height: auto;
  border-radius: 8px;
  display: block;
  filter: drop-shadow(0 16px 40px rgba(0,0,0,0.28));

  @media (max-width: 600px) {
    width: 80px;
  }
`;

// ── Sparkle decorations ───────────────────────────────────────────────────────

const Sparkle = styled.div<{ $top: string; $left: string; $delay: string; $size: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  color: ${({ theme }) => theme.color.frost.blue};
  opacity: 0;
  animation: ${sparkle} 3s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
  font-size: ${({ $size }) => $size};
  line-height: 1;
`;

// ── Form card (glassmorphism) ─────────────────────────────────────────────────

const GlassCard = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  margin: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[8]}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => `${theme.color.surface.base}e8`};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  box-shadow:
    0 8px 32px rgba(0,0,0,0.12),
    0 2px 8px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.6);

  @media (max-width: 440px) {
    padding: ${({ theme }) => `${theme.space[6]} ${theme.space[5]}`};
    margin: ${({ theme }) => theme.space[4]};
  }
`;

// ── Logo ──────────────────────────────────────────────────────────────────────

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const LogoText = styled.span`
  font-weight: ${({ theme }) => theme.typography.weight.heavy};
  font-size: ${({ theme }) => theme.typography.size.xxxl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.color.frost.teal}  0%,
    ${({ theme }) => theme.color.frost.sky}   25%,
    ${({ theme }) => theme.color.frost.blue}  55%,
    ${({ theme }) => theme.color.aurora.purple} 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  display: inline-block;
`;

const SparkleIcon = styled(motion.span)`
  display: inline-flex;
  color: ${({ theme }) => theme.color.aurora.yellow};
`;

const TaglineBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => `${theme.color.frost.blue}14`};
  border: 1px solid ${({ theme }) => `${theme.color.frost.blue}30`};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.frost.deep};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const TaglineDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.aurora.green};
  flex-shrink: 0;
`;

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.typography.size.xl};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0 0 ${({ theme }) => theme.space[1]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const Subheading = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0 0 ${({ theme }) => theme.space[6]} 0;
`;

// ── Fields ────────────────────────────────────────────────────────────────────

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const Input = styled.input`
  height: 2.75rem;
  padding: 0 ${({ theme }) => theme.space[4]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  outline: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.sm};
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.color.surface.muted};
  color: ${({ theme }) => theme.color.text.primary};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  transition: box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1), background 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &::placeholder { color: ${({ theme }) => theme.color.text.tertiary}; }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
`;

// ── Error ─────────────────────────────────────────────────────────────────────

const ErrorMsg = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.aurora.red};
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

// ── Buttons ───────────────────────────────────────────────────────────────────

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const SignInBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  background: ${({ theme }) => theme.color.frost.blue};
  color: #fff;
  box-shadow: 0 4px 16px ${({ theme }) => `${theme.color.frost.blue}50`};
  transition: background 150ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.frost.deep};
    box-shadow: 0 6px 20px ${({ theme }) => `${theme.color.frost.blue}60`};
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: ${({ theme }) => theme.typography.size.xs};

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.color.surface.border};
  }
`;

const GuestBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.full};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.color.text.primary};
  transition: border-color 150ms cubic-bezier(0.22, 1, 0.36, 1), color 150ms cubic-bezier(0.22, 1, 0.36, 1), background 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => `${theme.color.frost.blue}10`};
  }
`;

const GuestArrow = styled.span`
  display: inline-flex;
  align-items: center;
  transform-origin: left center;
  transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);

  ${GuestBtn}:hover & {
    transform: scaleX(1.5);
  }

  & svg {
    transition: none !important;
    transform: none !important;
  }
`;

// ── Tilt card wrapper (mouse parallax) ────────────────────────────────────────

function TiltCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const transformStyle = useTransform([rotX, rotY], ([rx, ry]) => `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotY.set(((e.clientX - cx) / rect.width) * 14);
    rotX.set(-((e.clientY - cy) / rect.height) * 14);
  };

  const resetTilt = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ ...style, transformStyle: 'preserve-3d', transform: transformStyle }}
      onMouseMove={handleMouse}
      onMouseLeave={resetTilt}
    >
      {children}
    </motion.div>
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+L to reach login
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') navigate('/login');
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password. Please try again.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      {/* Ambient orbs */}
      <Orb $size='600px' $top='-15%' $left='-10%'  $color={`${theme.color.frost.blue}28`}   $delay='0s' />
      <Orb $size='500px' $top='55%'  $left='65%'   $color={`${theme.color.aurora.purple}22`} $delay='2.5s' />
      <Orb $size='400px' $top='30%'  $left='40%'   $color={`${theme.color.frost.teal}18`}    $delay='5s' />
      <Orb $size='300px' $top='70%'  $left='-5%'   $color={`${theme.color.aurora.yellow}15`} $delay='1.5s' />

      {/* Sparkles */}
      {[
        { top: '18%', left: '38%', delay: '0s',   size: '14px' },
        { top: '72%', left: '62%', delay: '1.2s', size: '10px' },
        { top: '42%', left: '82%', delay: '2.4s', size: '12px' },
        { top: '25%', left: '65%', delay: '0.8s', size: '8px'  },
        { top: '85%', left: '35%', delay: '1.8s', size: '11px' },
      ].map((s, i) => (
        <Sparkle key={i} $top={s.top} $left={s.left} $delay={s.delay} $size={s.size}>✦</Sparkle>
      ))}

      {/* Floating cards */}
      {CARDS.map((card, i) => (
        <FloatingCard
          key={card.alt}
          $rot={card.rot}
          $delay={`${i * 0.6}s`}
          style={{ top: card.y, left: card.x, transform: `rotate(${card.rot}deg) scale(${card.scale})` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.55, y: 0 }}
          transition={{ duration: 0.9, delay: card.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <CardImg src={card.src} alt={card.alt} loading='lazy' />
        </FloatingCard>
      ))}

      {/* Glass form */}
      <TiltCard>
        <GlassCard
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <LogoRow>
              <LogoText>POLARDEX</LogoText>
              <SparkleIcon
                onHoverStart={() => setLogoHovered(true)}
                onHoverEnd={() => setLogoHovered(false)}
                animate={logoHovered ? { rotate: [0, -20, 20, -10, 0], scale: 1.3 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <IconSparkles size={20} />
              </SparkleIcon>
            </LogoRow>
          </motion.div>

          <motion.div variants={itemVariants}>
            <TaglineBadge>
              <TaglineDot />
              Pokémon TCG Collection Tracker
            </TaglineBadge>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Heading>Welcome back, Trainer.</Heading>
            <Subheading>Sign in to manage your collection, or explore as a guest.</Subheading>
          </motion.div>

          <motion.form onSubmit={handleSignIn} variants={itemVariants} noValidate>
            <FieldGroup>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                type='email'
                placeholder='trainer@example.com'
                autoComplete='email'
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                autoComplete='current-password'
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                required
              />
            </FieldGroup>

            <AnimatePresence mode='wait'>
              {error && (
                <ErrorMsg
                  key='error'
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </ErrorMsg>
              )}
            </AnimatePresence>

            <ButtonStack>
              <SignInBtn
                type='submit'
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </SignInBtn>

              <Divider>or</Divider>

              <GuestBtn
                type='button'
                onClick={() => {
                  sessionStorage.setItem('polardex_session', 'true');
                  navigate('/');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                Enter as Guest
                <GuestArrow><IconArrowRight size={15} /></GuestArrow>
              </GuestBtn>
            </ButtonStack>
          </motion.form>
        </GlassCard>
      </TiltCard>
    </Page>
  );
}

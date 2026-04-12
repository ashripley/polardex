import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { IconDownload, IconX, IconShare2, IconSquarePlus } from '@tabler/icons-react';

/**
 * The Web-standard `beforeinstallprompt` event isn't typed in lib.dom yet.
 * We narrow what we actually use from it.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'polardex_install_dismissed';

/** Heuristic — true on iPhone/iPad Safari (which never fires beforeinstallprompt). */
function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  // iPad on iOS 13+ presents as Mac; check for touch points to disambiguate.
  const isiPad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const isiPhone = /iPhone|iPod/.test(ua);
  if (!isiPad && !isiPhone) return false;
  // Exclude in-app browsers (FB, Instagram) where Add To Home Screen doesn't work.
  if (/CriOS|FxiOS|EdgiOS|FBAN|FBAV|Instagram/i.test(ua)) return false;
  // Only count actual Safari, not other WebViews
  return /Safari/.test(ua);
}

const Wrap = styled(motion.div)`
  position: fixed;
  bottom: calc(5rem + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
  max-width: 22rem;
  width: calc(100vw - 2rem);
  padding: ${({ theme }) => theme.space[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.xl};
  /* Glassmorphism */
  background: linear-gradient(135deg,
    rgba(46, 52, 64, 0.78) 0%,
    rgba(59, 66, 82, 0.72) 100%);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(136, 192, 208, 0.35);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    bottom: 2rem;
  }
`;

const IosWrap = styled(Wrap)`
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  max-width: 24rem;
`;

const IosHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const IconBubble = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 30%,
    rgba(136, 192, 208, 0.4),
    rgba(129, 161, 193, 0.15));
  border: 1px solid rgba(136, 192, 208, 0.4);
  flex-shrink: 0;
  overflow: hidden;
`;

const IconImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p`
  color: #eceff4;
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  margin: 0 0 2px;
  letter-spacing: 0.01em;
`;

const Subtitle = styled.p`
  color: rgba(236, 239, 244, 0.7);
  font-size: ${({ theme }) => theme.typography.size.xs};
  margin: 0;
  line-height: 1.35;
`;

const InstallBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.color.frost.teal} 0%,
    ${({ theme }) => theme.color.frost.blue} 100%);
  color: #fff;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 14px ${({ theme }) => `${theme.color.frost.blue}55`};
  transition: filter 180ms cubic-bezier(0.22, 1, 0.36, 1);
  &:hover { filter: brightness(1.1); }
`;

const DismissBtn = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 180ms cubic-bezier(0.22, 1, 0.36, 1);
  &:hover { background: rgba(255, 255, 255, 0.16); }
`;

const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  counter-reset: step;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: rgba(236, 239, 244, 0.85);
  line-height: 1.4;
  counter-increment: step;
  &::before {
    content: counter(step);
    flex-shrink: 0;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background: rgba(136, 192, 208, 0.2);
    border: 1px solid rgba(136, 192, 208, 0.45);
    color: ${({ theme }) => theme.color.frost.teal};
    font-weight: ${({ theme }) => theme.typography.weight.bold};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
  }
  svg {
    color: ${({ theme }) => theme.color.frost.teal};
    flex-shrink: 0;
  }
`;

export function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosVisible, setIosVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY) === 'true') return;
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

    // Hide if already installed (works on Android/Chrome AND iOS Safari).
    if (window.matchMedia?.('(display-mode: standalone)').matches) return;
    // iOS Safari uses navigator.standalone instead of display-mode media query.
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) return;

    if (isIosSafari()) {
      // iOS will never fire beforeinstallprompt — show our static instructions.
      // Delayed via motion's transition.delay (no JS setTimeout) so the wait
      // is part of the same animation frame as mount.
      setIosVisible(true);
      return;
    }

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      // Show immediately — the motion transition.delay handles the visual wait.
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem(DISMISSED_KEY, 'true');
    }
    setVisible(false);
    setDeferred(null);
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setIosVisible(false);
  };

  const dismissPersistent = () => {
    // Used by iOS users tapping the X — they made an explicit choice; persist longer.
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIosVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && deferred && (
        <Wrap
          key='pwa-install'
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 2.5 }}
        >
          <IconBubble>
            <IconImg src='/dragonite-192.png' alt='Polardex' />
          </IconBubble>
          <Body>
            <Title>Install Polardex</Title>
            <Subtitle>Add to your home screen for a full-screen experience.</Subtitle>
          </Body>
          <InstallBtn
            onClick={install}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            <IconDownload size={13} stroke={2.5} />
            Install
          </InstallBtn>
          <DismissBtn onClick={dismiss} aria-label='Dismiss'>
            <IconX size={14} stroke={2.5} />
          </DismissBtn>
        </Wrap>
      )}

      {iosVisible && (
        <IosWrap
          key='pwa-install-ios'
          initial={{ opacity: 0, y: 24, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 24, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 3 }}
        >
          <IosHeader>
            <IconBubble>
              <IconImg src='/dragonite-192.png' alt='Polardex' />
            </IconBubble>
            <Body>
              <Title>Install Polardex</Title>
              <Subtitle>Get a full-screen, native-feeling app on your home screen.</Subtitle>
            </Body>
            <DismissBtn onClick={dismissPersistent} aria-label='Dismiss'>
              <IconX size={14} stroke={2.5} />
            </DismissBtn>
          </IosHeader>
          <Steps>
            <Step>
              <span>Tap the&nbsp;</span>
              <IconShare2 size={16} stroke={2} />
              <span>&nbsp;Share button</span>
            </Step>
            <Step>
              <span>Choose&nbsp;</span>
              <IconSquarePlus size={16} stroke={2} />
              <span>&nbsp;Add to Home Screen</span>
            </Step>
            <Step>
              Tap <strong style={{ color: '#88c0d0' }}>Add</strong> to confirm
            </Step>
          </Steps>
        </IosWrap>
      )}
    </AnimatePresence>
  );
}

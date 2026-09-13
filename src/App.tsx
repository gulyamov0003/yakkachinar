import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { LanguageProvider, useI18n } from './i18n/LanguageProvider';
import { UIProvider, useUI } from './context/UIContext';
import { scrollToSection } from './lib/scroll';
import { isMotionForcedOff } from './lib/motion';
import { releasePreloader } from './lib/preloader';
import { SmoothScroll } from './components/SmoothScroll';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { MobileActionBar } from './components/MobileActionBar';
import { ReservationDialog } from './components/ReservationDialog';
import { Hero } from './sections/Hero';
import { Experience } from './sections/Experience';
import { MenuShowcase } from './sections/MenuShowcase';
import { Gallery } from './sections/Gallery';
import { Entertainment } from './sections/Entertainment';
import { Events } from './sections/Events';
import { Reviews } from './sections/Reviews';
import { Instagram } from './sections/Instagram';
import { Location } from './sections/Location';
import { ReservationCTA } from './sections/ReservationCTA';
import { Footer } from './sections/Footer';

function SkipLink() {
  const { t } = useI18n();
  return (
    <a className="skip-link" href="#main">
      {t.a11y.skipToContent}
    </a>
  );
}

/** Honour links such as /#menu — sections only exist after the first render. */
function DeepLink() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target) scrollToSection(target, { focus: false, immediate: true });
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}

/** Lifts the logo preloader from index.html and starts the hero sequence behind it. */
function PreloaderGate() {
  const { setIntroReady } = useUI();
  useEffect(() => releasePreloader(() => setIntroReady(true)), [setIntroReady]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion={isMotionForcedOff() ? 'always' : 'user'}>
        <UIProvider>
          <SmoothScroll />
          <DeepLink />
          <PreloaderGate />
          <SkipLink />
          <Navbar />
          <main id="main" tabIndex={-1}>
            <Hero />
            <Experience />
            <MenuShowcase />
            <Gallery />
            <Entertainment />
            <Events />
            <Reviews />
            <Instagram />
            <Location />
            <ReservationCTA />
          </main>
          <Footer />
          <MobileActionBar />
          <ReservationDialog />
          <CustomCursor />
        </UIProvider>
      </MotionConfig>
    </LanguageProvider>
  );
}

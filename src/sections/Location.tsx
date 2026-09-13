import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/LanguageProvider';
import { restaurant } from '../data/restaurant';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { PremiumButton } from '../components/PremiumButton';
import { CheckIcon, CopyIcon, MapPinIcon } from '../components/Icons';
import './Location.css';

export function Location() {
  const { t, meta } = useI18n();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyPlusCode = async () => {
    try {
      await navigator.clipboard.writeText(`${restaurant.plusCode} Dushanbe`);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be denied; the code stays visible and selectable.
    }
  };

  // Map labels follow the page language — with hl=tg Google shows Tajik place names.
  const mapLanguage = meta.htmlLang;

  return (
    <section id="location" data-nav="location" className="section location" aria-labelledby="location-title">
      <div className="container location__grid">
        <div className="location__info">
          <SectionHeading index="08" eyebrow={t.location.eyebrow} lines={t.location.titleLines} accent={1} id="location-title" />

          <Reveal className="location__place">
            <p className="location__city">{t.location.city}</p>
            <p className="location__country">{t.location.country}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="location__details">
              <div className="location__row">
                <dt>{t.location.plusCodeLabel}</dt>
                <dd>
                  <span className="location__code">{restaurant.plusCode}</span>
                  <button type="button" className="location__copy" onClick={copyPlusCode} aria-label={t.a11y.copyPlusCode}>
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    <span aria-hidden="true">{copied ? t.actions.copied : t.actions.copy}</span>
                  </button>
                  <span className="sr-only" aria-live="polite">
                    {copied ? t.actions.copied : ''}
                  </span>
                  <span className="location__hint">{t.location.plusCodeHint}</span>
                </dd>
              </div>
              <div className="location__row">
                <dt>{t.location.phoneLabel}</dt>
                <dd>
                  <a href={restaurant.phone.href} className="location__link">
                    {restaurant.phone.display}
                  </a>
                </dd>
              </div>
              <div className="location__row">
                <dt>{t.location.hoursLabel}</dt>
                <dd>
                  <span>{t.location.hoursValue}</span>
                  <span className="location__hint">{t.location.hoursNote}</span>
                </dd>
              </div>
              <div className="location__row">
                <dt>{t.instagram.eyebrow}</dt>
                <dd>
                  <a href={restaurant.instagram.url} className="location__link" target="_blank" rel="noopener noreferrer">
                    {restaurant.instagram.handle}
                    <span className="sr-only"> ({t.a11y.newTab})</span>
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.14} className="location__actions">
            <PremiumButton href={restaurant.maps.directionsUrl} external leadingIcon="navigation" icon="external">
              {t.actions.directions}
            </PremiumButton>
            <PremiumButton href={restaurant.phone.href} variant="outline" leadingIcon="phone">
              {t.actions.call}
            </PremiumButton>
          </Reveal>
        </div>

        <Reveal className="location__map-wrap" y={48} amount={0.15}>
          <div className="location__map">
            <iframe
              key={mapLanguage}
              title={t.a11y.mapTitle}
              src={restaurant.maps.embedUrl(mapLanguage)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <span className="location__corner location__corner--tl" aria-hidden="true" />
            <span className="location__corner location__corner--tr" aria-hidden="true" />
            <span className="location__corner location__corner--bl" aria-hidden="true" />
            <span className="location__corner location__corner--br" aria-hidden="true" />
            <div className="location__badge" aria-hidden="true">
              <MapPinIcon size={16} />
              <span>
                {t.location.city} · {restaurant.plusCode}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

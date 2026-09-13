import { useI18n } from '../i18n/LanguageProvider';
import { format } from '../i18n/format';
import { restaurant } from '../data/restaurant';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { Stars } from '../components/Stars';
import { PremiumButton } from '../components/PremiumButton';
import { BrandLogo } from '../components/BrandLogo';
import './Reviews.css';

/** Social proof from verified figures only: Google rating and review count. */
export function Reviews() {
  const { t, lang, formatNumber } = useI18n();
  const formatRating = (value: number) => formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const formatCount = (value: number) => `${formatNumber(Math.round(value))}+`;
  const rating = formatRating(restaurant.rating);

  return (
    <section id="reviews" data-nav="reviews" className="section reviews" aria-labelledby="reviews-title">
      <div className="reviews__seal" aria-hidden="true">
        <BrandLogo className="reviews__seal-logo" sizes="(min-width: 960px) 560px, 90vw" />
      </div>

      <div className="container reviews__inner">
        <SectionHeading index="06" eyebrow={t.reviews.eyebrow} lines={t.reviews.titleLines} accent={1} id="reviews-title" />

        <div className="reviews__stats">
          <Reveal className="reviews__stat reviews__stat--rating" amount={0.4}>
            <Counter value={restaurant.rating} formatter={formatRating} className="reviews__number reviews__number--rating" />
            <div className="reviews__rating-meta">
              <Stars rating={restaurant.rating} label={format(t.a11y.ratingStars, { rating })} />
              <p className="reviews__label">
                {t.reviews.ratingLabel} · {t.reviews.outOf}
              </p>
            </div>
          </Reveal>

          <div className="reviews__divider" aria-hidden="true" />

          <Reveal className="reviews__stat" delay={0.12} amount={0.4}>
            <Counter value={restaurant.reviewCount} formatter={formatCount} className="reviews__number" />
            <p className="reviews__label">{t.reviews.reviewsLabel}</p>
          </Reveal>
        </div>

        <div className="reviews__footer">
          <Reveal>
            <p className="lead">{format(t.reviews.lead, { rating })}</p>
          </Reveal>
          <Reveal delay={0.1} className="reviews__cta">
            <PremiumButton href={restaurant.maps.reviewsUrl} external variant="outline" icon="external">
              {t.actions.readReviews}
            </PremiumButton>
            <p className="reviews__source">{t.reviews.source}</p>
          </Reveal>
        </div>

        {restaurant.reviewQuotes.length > 0 ? (
          <div className="reviews__quotes">
            <h3 className="reviews__quotes-title eyebrow">{t.reviews.quotesTitle}</h3>
            <ul className="reviews__quote-list">
              {restaurant.reviewQuotes.map((quote) => (
                <li key={quote.sourceUrl} className="reviews__quote">
                  <blockquote cite={quote.sourceUrl}>
                    <p className="display">“{quote.text[lang]}”</p>
                  </blockquote>
                  <p className="reviews__quote-author">— {quote.author}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

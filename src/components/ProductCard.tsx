import { Link } from 'wouter';
import { isPurchasable, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { StoreImage } from './StoreImage';

/** The grid view's card: the photo framed with crop marks, name, price and add. */
export function ProductCard({ item, category, headingLevel = 'h3' }: { item: CatalogItem; category?: CatalogCategory; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useI18n();
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-frame bg-surface-raised p-3 shadow-soft ring-1 ring-[color:var(--rule)] has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[color:var(--focus)]">
      <div className="drafted">
        <div className={`frame relative aspect-square bg-surface-quiet ${isPurchasable(item) ? '' : 'grayscale'}`}>
          <StoreImage src={item.imageUrl} alt="" sizes="(min-width: 1024px) 16rem, (min-width: 640px) 30vw, 45vw" maxWidth={640} fallback={<Placeholder />} />
          {item.kind === 'service' && (
            <span className="absolute left-2 top-2 rounded-[var(--radius-control)] bg-[color:var(--fe-blueprint)] px-2 py-0.5 text-xs font-bold text-white">{t('product.service')}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pt-2">
        {category && <p className="text-sm text-ink-soft">{category.name}</p>}
        <Heading className="font-text text-base font-bold leading-snug [font-stretch:100%] text-heading">
          <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        <div className="flex flex-wrap gap-x-3">
          <Availability item={item} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Price item={item} />
          <div className="relative z-10">
            <AddToCart item={item} variant="icon" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="rounded-frame bg-surface-raised p-3 ring-1 ring-[color:var(--rule)]">
      <div className="skeleton aspect-square" />
      <div className="skeleton mt-3 h-3 w-1/3" />
      <div className="skeleton mt-2 h-4 w-3/4" />
      <div className="skeleton mt-4 h-9 w-full" />
    </div>
  );
}

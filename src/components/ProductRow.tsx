import { useState } from 'react';
import { Link } from 'wouter';
import { isPurchasable, maxQuantity, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';
import { StoreImage } from './StoreImage';

/**
 * One line of the dense list: photo, name and department, availability, price,
 * and on wide screens a quantity stepper beside the add button.
 */
export function ProductRow({ item, category, headingLevel = 'h3' }: { item: CatalogItem; category?: CatalogCategory; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const Heading = headingLevel;
  const available = isPurchasable(item);
  return (
    <article className="group relative grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[5rem_minmax(0,1fr)_auto] lg:grid-cols-[5rem_minmax(0,1fr)_9.5rem_auto]">
      <div className={`frame row-span-2 aspect-square bg-surface-quiet sm:row-span-1 ${available ? '' : 'grayscale'}`}>
        <StoreImage src={item.imageUrl} alt="" sizes="5rem" maxWidth={240} fallback={<Placeholder />} />
      </div>
      <div className="min-w-0">
        {category && <p className="text-sm text-ink-soft">{category.name}</p>}
        <Heading className="font-text text-base font-bold leading-snug [font-stretch:100%] text-heading">
          <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
          {item.kind === 'service' && <span className="text-sm font-semibold text-accent-text">{t('product.service')}</span>}
          <Availability item={item} />
        </div>
      </div>
      <div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:justify-end lg:contents">
        <div className="lg:text-right">
          <Price item={item} />
        </div>
        <div className="relative z-10 flex items-center gap-2 lg:justify-end">
          {available && (
            <span className="hidden lg:inline-flex">
              <QuantityStepper value={quantity} max={maxQuantity(item)} onChange={setQuantity} label={item.name} size="sm" />
            </span>
          )}
          <AddToCart item={item} quantity={available ? quantity : 1} variant="compact" />
        </div>
      </div>
    </article>
  );
}

export function ProductRowSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-[4.25rem_1fr] items-center gap-4 py-3.5 sm:grid-cols-[5rem_1fr_auto]">
      <div className="skeleton aspect-square" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-4 w-2/3" />
      </div>
      <div className="skeleton hidden h-10 w-32 sm:block" />
    </div>
  );
}

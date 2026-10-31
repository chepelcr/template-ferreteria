import { ShoppingCart } from 'lucide-react';
import { announce, isPurchasable, useCart, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';

export const BASKET_EVENT = 'tsuru:basket-added';

/** Adds the item and tells the header to tighten the cart; sold-out items cannot be added. */
export function AddToCart({
  item,
  quantity = 1,
  variant = 'full',
  tone = 'accent',
  className = '',
}: {
  item: CatalogItem;
  quantity?: number;
  variant?: 'full' | 'compact' | 'icon';
  tone?: 'accent' | 'quiet';
  className?: string;
}) {
  const { t, langOf } = useI18n();
  const add = useCart((s) => s.add);
  const available = isPurchasable(item);

  const onAdd = () => {
    const added = add(item, quantity);
    if (added <= 0) {
      announce(t('product.limit'));
      return;
    }
    const message = t('product.added', { name: item.name });
    announce(added < quantity ? `${message}. ${t('product.limit')}` : message);
    window.dispatchEvent(new CustomEvent(BASKET_EVENT));
  };

  if (!available) {
    return (
      <button type="button" disabled className={`btn btn-quiet ${variant === 'icon' ? 'px-3 text-sm' : ''} ${className}`}>
        {t('product.soldOut')}
      </button>
    );
  }

  // In rows and cards the button is short; its accessible name still names the item.
  const short = variant !== 'full';
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={short ? t('product.addNamed', { name: item.name }) : undefined}
      title={variant === 'icon' ? t('product.addNamed', { name: item.name }) : undefined}
      className={`btn ${tone === 'quiet' ? 'btn-quiet' : 'btn-accent'} ${variant === 'compact' ? 'px-4 text-sm' : ''} ${variant === 'icon' ? 'px-3' : ''} ${className}`}
    >
      <ShoppingCart aria-hidden="true" className={`h-4 w-4 ${tone === 'quiet' ? 'text-accent-text' : ''}`} />
      {variant !== 'icon' && <span lang={langOf('product.add')}>{short ? t('product.add.short') : t('product.add')}</span>}
    </button>
  );
}

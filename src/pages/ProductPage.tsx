import { ArrowLeft, Clock } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { catalogHref, paragraphs, usePageMeta, useProductView } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from '@/components/AddToCart';
import { ProductRow } from '@/components/ProductRow';
import { Placeholder } from '@/components/Placeholder';
import { Price } from '@/components/Price';
import { QuantityStepper } from '@/components/QuantityStepper';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, plural } = useI18n();
  const { item, catalog, category, related, max, quantity, setQuantity } = useProductView(id);
  usePageMeta(item?.name, item?.description);

  if (catalog.isLoading) {
    return (
      <div aria-hidden="true" className="page grid gap-12 pt-12 md:grid-cols-12">
        <div className="skeleton aspect-square md:col-span-6" />
        <div className="flex flex-col gap-4 md:col-span-6">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-14 w-3/4" />
          <div className="skeleton h-9 w-36" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (catalog.isError) {
    return (
      <div className="page pt-16">
        <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page pt-16">
        <div className="paper-grid flex flex-col items-start gap-4 rounded-frame bg-surface-raised p-8 ring-1 ring-[color:var(--rule)] md:p-12">
          <h1 className="text-[clamp(2.2rem,5vw,3.25rem)] text-heading">{t('product.notFound.title')}</h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('product.notFound.body')}</p>
          <Link href="/products" className="btn btn-strong">
            {t('product.back')}
          </Link>
        </div>
      </div>
    );
  }

  const text = paragraphs(item.description);
  const stock = item.availability;
  const stockText =
    stock.state === 'sold_out'
      ? t('product.soldOut')
      : stock.state === 'low'
        ? plural('product.low', stock.quantity)
        : stock.state === 'in_stock'
          ? t('product.spec.inStock')
          : null;
  const facts = [
    category && { label: t('product.spec.category'), value: category.name },
    item.kind === 'service' && { label: t('product.spec.type'), value: t('product.service') },
    item.difficulty && { label: t('product.spec.level'), value: item.difficulty },
    stockText && { label: t('product.spec.availability'), value: stockText, alert: stock.state !== 'in_stock' },
  ].filter(Boolean) as Array<{ label: string; value: string; alert?: boolean }>;

  return (
    <>
      <div className="page pt-8">
        <Link href={category ? catalogHref({ category: category.key }) : '/products'} className="inline-flex min-h-tap items-center gap-2 font-medium text-heading hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {category ? category.name : t('product.back')}
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-6">
            <div className="drafted">
              <div className={`frame relative aspect-square bg-surface-raised ring-1 ring-[color:var(--rule)] ${item.availability.state === 'sold_out' ? 'grayscale' : ''}`}>
                <StoreImage src={item.imageUrl} alt={item.name} priority sizes="(min-width: 768px) 36rem, 100vw" maxWidth={1200} fallback={<Placeholder label={t('product.imageMissing')} />} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:col-span-6 md:pt-4">
            <h1 className="text-[clamp(1.9rem,4vw,3rem)] text-heading">{item.name}</h1>
            <Price item={item} size="lg" />
            {item.duration && (
              <p className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-control)] bg-[color:var(--fe-blueprint)] px-3.5 py-2 font-bold text-white">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {t('product.duration', { duration: item.duration })}
              </p>
            )}
            {text.length > 0 && (
              <div className="flex max-w-[58ch] flex-col gap-3 text-lg text-ink-soft">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <dl className="grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 border-y border-rule py-5">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-sm text-ink-soft">{fact.label}</dt>
                    <dd className={`mt-0.5 font-display text-lg ${fact.alert ? 'text-offer' : 'text-heading'}`}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {item.availability.state !== 'sold_out' && <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={item.name} />}
              <AddToCart item={item} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="page pt-24">
          <h2 id="related" className="mb-4 text-[clamp(1.6rem,3.4vw,2.25rem)] text-heading">
            {t('product.related')}
          </h2>
          <ul className="divide-y divide-[color:var(--rule)] border-y border-rule">
            {related.map((r) => (
              <li key={r.id}>
                <ProductRow item={r} category={catalog.categories.find((c) => c.id === r.categoryId)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

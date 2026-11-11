import { Link } from 'wouter';
import { categoriesWithItems, facetsFor, featuredItems, homeContent, LazyScene, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { BoltDrawing } from '@/components/BoltDrawing';
import { CmsIcon } from '@/components/CmsIcon';
import { DepartmentTile } from '@/components/DepartmentTile';
import { SearchForm } from '@/components/Header';
import { Placeholder } from '@/components/Placeholder';
import { ProductRow, ProductRowSkeleton } from '@/components/ProductRow';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

const loadBolt = () => import('@/scenes/bolt');

export default function Home() {
  const { t } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 8);
  const departments = categoriesWithItems(catalog.categories, catalog.items);
  const counts = facetsFor(catalog.items).categories;
  const categoryOf = (id: string | null) => catalog.categories.find((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="on-deep blueprint text-ink-on-deep">
        <div className="page grid items-center gap-x-10 gap-y-10 py-12 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-4">
                <div className="skeleton-deep h-6 w-48" />
                <div className="skeleton-deep h-14 w-full" />
                <div className="skeleton-deep h-14 w-3/4" />
                <div className="skeleton-deep h-5 w-2/3" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                {home.hero.badge && <p className="mb-5 inline-flex rounded-[var(--radius-control)] bg-white/10 px-3 py-1 text-sm font-semibold text-ink-on-deep ring-1 ring-white/25">{home.hero.badge}</p>}
                {home.hero.title && <h1 className="text-[clamp(2.4rem,6vw,4.4rem)]">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mt-5 max-w-[38rem] text-lg text-ink-on-deep-soft">{home.hero.subtitle}</p>}
              </>
            )}
            <SearchForm id="hero-search" tone="deep" className="mt-8 max-w-xl" />
            {!cms.isLoading && !cms.isError && (home.hero.ctaPrimary || home.hero.ctaSecondary) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {home.hero.ctaPrimary && (
                  <Link href="/products" className="btn btn-on-deep">
                    {home.hero.ctaPrimary}
                  </Link>
                )}
                {home.hero.ctaSecondary && (
                  <Link href="/contact" className="btn btn-on-deep">
                    {home.hero.ctaSecondary}
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="relative md:col-span-5">
            <LazyScene
              load={loadBolt}
              className="mx-auto aspect-square w-[min(26rem,82vw)] max-w-full text-ink-on-deep"
              fallback={<BoltDrawing className="h-full w-full" />}
            />
            {home.hero.image && (
              <div className="absolute -bottom-4 right-0 w-[44%] rotate-2 bg-white p-1.5 shadow-lift">
                <div className="aspect-[4/3] overflow-hidden bg-surface-quiet">
                  <StoreImage src={home.hero.image} alt="" priority sizes="12rem" maxWidth={480} fallback={<Placeholder />} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {(departments.length > 0 || catalog.isLoading) && (
        <section aria-labelledby={home.categories.title ? 'home-departments' : undefined} className="page pt-16">
          {(home.categories.title || home.categories.subtitle) && (
            <div className="mb-8 max-w-2xl">
              {home.categories.title && (
                <h2 id="home-departments" className="text-[clamp(1.9rem,4vw,2.75rem)] text-heading">
                  {home.categories.title}
                </h2>
              )}
              {home.categories.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.categories.subtitle}</p>}
            </div>
          )}
          {catalog.isLoading ? (
            <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton aspect-[4/5]" />
              ))}
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              {departments.map((category, index) => (
                <li key={category.id}>
                  <DepartmentTile category={category} count={counts.get(category.id) ?? 0} index={index} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby={home.featured.title ? 'home-featured' : undefined} className="page pt-20">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {home.featured.title && (
              <h2 id="home-featured" className="text-[clamp(1.9rem,4vw,2.75rem)] text-heading">
                {home.featured.title}
              </h2>
            )}
            {home.featured.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.featured.subtitle}</p>}
          </div>
          {catalog.items.length > 0 && (
            <Link href="/products" className="btn btn-quiet">
              {t('catalog.viewAll')}
            </Link>
          )}
        </div>
        {catalog.isLoading ? (
          <div className="divide-y divide-[color:var(--rule)] border-y border-rule">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductRowSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : featured.length === 0 ? (
          <p className="text-lg text-ink-soft">{t('catalog.empty.store')}</p>
        ) : (
          <ul className="divide-y divide-[color:var(--rule)] border-y border-rule">
            {featured.map((item) => (
              <li key={item.id}>
                <ProductRow item={item} category={categoryOf(item.categoryId)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-20">
          <ul className="grid overflow-hidden rounded-frame bg-surface-raised ring-1 ring-[color:var(--rule)] md:grid-cols-3">
            {home.benefits.map((benefit) => (
              <li key={benefit.title} className="flex flex-col gap-3 border-b border-rule p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-control)] bg-[color:var(--fe-blueprint)] text-white">
                    <CmsIcon icon={benefit.icon} className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="min-w-0 font-text text-lg font-bold [font-stretch:100%] text-heading">{benefit.title}</h3>
                </div>
                {benefit.description && <p className="mt-1 text-ink-soft">{benefit.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-20">
          <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14">
            {home.story.image && (
              <div className="drafted md:col-span-5">
                <div className="frame aspect-[4/3] bg-surface-quiet">
                  <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 36vw, 100vw" maxWidth={1100} fallback={<Placeholder />} />
                </div>
              </div>
            )}
            <div className={home.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
              {home.story.title && <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-7">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-20">
          <div className="on-deep blueprint flex flex-col items-start gap-6 rounded-frame p-8 text-ink-on-deep sm:p-10 md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              {home.cta.title && <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)]">{home.cta.title}</h2>}
              {home.cta.description && <p className="mt-3 text-lg text-ink-on-deep-soft">{home.cta.description}</p>}
            </div>
            {home.cta.buttonText && (
              <Link href="/contact" className="btn btn-accent shrink-0">
                {home.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}

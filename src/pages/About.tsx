import { aboutContent, paragraphs, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

export default function About() {
  const { t } = useI18n();
  const cms = useCmsPage('about');
  const about = aboutContent(cms.page);
  usePageMeta(cms.page?.title ?? t('nav.about'), cms.page?.metaDescription);
  const story = paragraphs(about.story.content);

  return (
    <>
      <section className="page grid items-center gap-12 pt-12 md:grid-cols-12 md:pt-20">
        <div className={about.hero.image ? 'md:col-span-7' : 'md:col-span-10'}>
          {cms.isLoading ? (
            <div aria-hidden="true" className="flex flex-col gap-3">
              <div className="skeleton h-14 w-64 max-w-full" />
              <div className="skeleton h-5 w-80 max-w-full" />
            </div>
          ) : cms.isError ? (
            <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
          ) : (
            <>
              <h1 className="text-[clamp(2.4rem,6vw,4rem)] text-heading">{about.hero.title ?? t('nav.about')}</h1>
              {about.hero.subtitle && <p className="mt-6 max-w-xl text-lg text-ink-soft">{about.hero.subtitle}</p>}
            </>
          )}
        </div>
        {about.hero.image && (
          <div className="md:col-span-5">
            <div className="drafted mx-auto w-[min(30rem,88vw)] max-w-full">
              <div className="frame aspect-[4/3] bg-surface-quiet">
                <StoreImage src={about.hero.image} alt="" priority sizes="(min-width: 768px) 30rem, 88vw" maxWidth={1100} fallback={<Placeholder />} />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="page">
        {(about.story.title || story.length > 0) && (
          <section className="grid gap-12 pt-24 md:grid-cols-12 md:items-center">
            <div className={about.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
              {about.story.title && <h2 className="text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{about.story.title}</h2>}
              <div className="mt-5 flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            {about.story.image && (
              <div className="frame aspect-[4/3] bg-surface-quiet md:col-span-5">
                <StoreImage src={about.story.image} alt="" sizes="(min-width: 768px) 35vw, 100vw" maxWidth={960} fallback={<Placeholder />} />
              </div>
            )}
          </section>
        )}

        {about.values.items.length > 0 && (
          <section className="pt-24">
            {about.values.title && <h2 className="mb-10 text-[clamp(2.1rem,4.5vw,3.25rem)] text-heading">{about.values.title}</h2>}
            <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
              {about.values.items.map((value) => (
                <li key={value.title} className="flex flex-col gap-3 rounded-frame bg-surface-raised p-7 ring-1 ring-[color:var(--rule)]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-control)] bg-[color:var(--fe-blueprint)] text-white shrink-0">
                      <CmsIcon icon={value.icon} className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="font-text text-lg font-bold [font-stretch:100%] text-heading min-w-0">{value.title}</h3>
                  </div>
                  {value.description && <p className="text-ink-soft">{value.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

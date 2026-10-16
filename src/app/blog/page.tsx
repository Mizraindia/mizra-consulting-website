import { pageMetadata } from '@/lib/metadata';

// Holding page until the first real article exists (owner decision, 16 October 2026).
// Keep it out of the menus and the sitemap, and hidden from search engines (noindex).
export const metadata = pageMetadata({
  path: '/blog',
  noindex: true,
  title: 'Resources',
  description: 'Resources are coming.',
});

export default function BlogPage() {
  return (
    // At least one screen tall (like <main>), so no empty white band shows before the footer.
    <section className="flex min-h-screen items-center bg-mz-ink py-24 text-mz-cream sm:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8">
        <h1 className="font-display text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[44px] lg:text-[52px]">
          Resources are coming.
        </h1>
      </div>
    </section>
  );
}

// Shared layout for the privacy policy and terms pages.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="pt-16 pb-20">
      <div className="container-custom max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-10">Last updated {updated}</p>
        <div className="space-y-8 text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p+p]:mt-3 [&_a]:underline [&_a:hover]:text-primary-900">
          {children}
        </div>
      </div>
    </article>
  );
}

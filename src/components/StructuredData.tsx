interface StructuredDataProps {
  data: Record<string, unknown>;
}

// Search-engine data (JSON-LD), written straight into the server HTML.
// The old version used next/script, which never put the data on the page and
// stopped the rest of the page's JavaScript from starting.
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

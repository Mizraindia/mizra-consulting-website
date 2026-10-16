import ServicePage from '@/components/ServicePage';
import { ZOHO } from '@/content/services/zoho';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/zoho',
  title: ZOHO.metaTitle,
  description: ZOHO.metaDescription,
});

export default function ZohoPage() {
  return <ServicePage content={ZOHO} />;
}
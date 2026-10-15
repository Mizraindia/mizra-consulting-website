import ServicePage from '@/components/ServicePage';
import { SALESFORCE } from '@/content/services/salesforce';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/salesforce',
  title: SALESFORCE.metaTitle,
  description: SALESFORCE.metaDescription,
});

export default function SalesforcePage() {
  return <ServicePage content={SALESFORCE} />;
}

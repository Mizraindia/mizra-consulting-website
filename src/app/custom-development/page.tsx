import ServicePage from '@/components/ServicePage';
import { CUSTOM_DEVELOPMENT } from '@/content/services/custom-development';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/custom-development',
  title: CUSTOM_DEVELOPMENT.metaTitle,
  description: CUSTOM_DEVELOPMENT.metaDescription,
});

export default function CustomDevelopmentPage() {
  return <ServicePage content={CUSTOM_DEVELOPMENT} />;
}
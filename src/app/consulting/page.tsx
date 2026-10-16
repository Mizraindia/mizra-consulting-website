import ServicePage from '@/components/ServicePage';
import { CONSULTING } from '@/content/services/consulting';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/consulting',
  title: CONSULTING.metaTitle,
  description: CONSULTING.metaDescription,
});

export default function ConsultingPage() {
  return <ServicePage content={CONSULTING} />;
}
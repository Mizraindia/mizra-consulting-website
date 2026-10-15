import { pageMetadata } from '@/lib/metadata';
import ClassInterestForm from '@/components/ClassInterestForm';

// Holding page while the new master-class portal is built (revamp Phase C).
// The old Corporate Readiness Program and its Razorpay payment link were retired in Phase A.

export const metadata = pageMetadata({
  path: '/student-portal',
  title: 'Master Classes Are Coming',
  description:
    'Live online master classes from Mizra Consulting in product management, product ownership, HR and more. $10 per class. Leave your email to hear when registration opens.',
});

export default function StudentPortalPage() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container-custom max-w-2xl text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-primary-900 font-medium mb-6">
          Mizra master classes
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Master classes are coming
        </h1>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Live online classes in product management, product ownership, HR and more, taught by a
          practising product owner. Each class is $10. Leave your email and we&apos;ll tell you as
          soon as dates are open for registration.
        </p>
        <div className="mt-10">
          <ClassInterestForm />
        </div>
      </div>
    </section>
  );
}

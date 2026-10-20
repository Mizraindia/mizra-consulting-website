import ClassInterestForm from '@/components/ClassInterestForm';

// The "Master classes are coming" holding page, shown while registration is switched off
// (CLASS_REGISTRATION_OPEN is not "true").
export default function MasterClassesComing() {
  return (
    <section className="pt-16 pb-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="container-custom max-w-2xl text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-900 font-medium mb-6">
          Mizra master classes
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Master classes are coming
        </h1>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Live online classes on product, CRM, careers and the tools of modern work, taught by
          practising professionals. Classes are free for now. Leave your email and we&apos;ll tell you as
          soon as dates are open for registration.
        </p>
        <div className="mt-10">
          <ClassInterestForm />
        </div>
      </div>
    </section>
  );
}

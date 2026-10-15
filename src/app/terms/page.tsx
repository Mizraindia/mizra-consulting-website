import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/metadata';
import { COMPANY } from '@/lib/site';

// DRAFT written from the owner's workbook answers (10-Privacy-and-Terms).
// Kept out of search results (noindex) until a lawyer has reviewed it.
export const metadata = pageMetadata({
  path: '/terms',
  title: 'Terms',
  description: 'How Mizra Consulting handles scope, payment, ownership and confidentiality on projects.',
  noindex: true,
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms" updated="15 October 2026">
      <p>
        These terms describe how {COMPANY.legalName} (&ldquo;we&rdquo;) works with clients on
        projects. If a project has its own written agreement, that agreement applies wherever it
        differs from these terms.
      </p>

      <section>
        <h2>Scope and changes</h2>
        <p>
          The scope of every project is written down and approved by you before work starts. If
          anything needs to change, we write down the change and its effect on time and cost, and we
          only do it after you approve it.
        </p>
      </section>

      <section>
        <h2>Payment</h2>
        <p>
          For fixed-price projects, 30 percent is paid to start and the rest at agreed milestones.
          Monthly plans are billed at the start of each month.
        </p>
      </section>

      <section>
        <h2>Ownership</h2>
        <p>
          You own what we build for you once it has been paid for, including the code, data and
          configuration. Documentation and full admin access are handed over at the end of the
          project, after final payment.
        </p>
      </section>

      <section>
        <h2>After launch</h2>
        <p>
          We fix bugs free of charge for 30 days after launch. After that, ongoing help is available
          on a support plan.
        </p>
      </section>

      <section>
        <h2>Confidentiality</h2>
        <p>
          We treat all client data as confidential and will sign a non-disclosure agreement on
          request.
        </p>
      </section>

      <section>
        <h2>Liability and cancellation</h2>
        <p>
          Our liability for a project is limited to the fees paid for that project. If you cancel a
          project, you pay for the work done up to that point.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms of use for the Newton Global School website, covering acceptable use, admissions information, intellectual property and liability.",
};

const LAST_UPDATED = "2026-07-01";

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-xl text-text md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-text">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfUsePage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        subtitle="The terms that apply when you browse this website or use our online forms."
        breadcrumbs={[{ label: "Terms of Use" }]}
      />

      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-text-muted">
              Last updated: {formatDate(LAST_UPDATED)}
            </p>
            <p className="mt-4 text-base leading-relaxed text-text">
              This website is operated by {site.name} (&quot;the School&quot;,
              &quot;we&quot;, &quot;us&quot;) from our head office in Jaipur,
              on behalf of all our campuses. By browsing this website or
              submitting any of its forms, you agree to the terms below.
            </p>

            <LegalSection title="Acceptance of these terms">
              <p>
                Please read these terms together with our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                . If you do not agree with any part of them, please do not use
                this website. Continued use of the website after changes are
                posted constitutes acceptance of the revised terms.
              </p>
            </LegalSection>

            <LegalSection title="Use of this website">
              <p>You agree that you will not:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Submit false or misleading information through our inquiry,
                  contact or career forms.
                </li>
                <li>
                  Use the website in a way that disrupts its availability for
                  other visitors.
                </li>
                <li>
                  Attempt to gain unauthorised access to any part of the
                  website or its underlying systems.
                </li>
                <li>
                  Reproduce or redistribute website content for commercial
                  purposes without our written permission.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="Admissions information">
              <p>
                Admissions content on this website — including grades open,
                key dates and process steps — is provided for general guidance
                only. Submitting an inquiry form does not reserve a seat or
                constitute an offer of admission. Admission is governed by the
                registration process, seat availability, age criteria and
                applicable education board norms, and dates may be revised by
                the School with notice.
              </p>
            </LegalSection>

            <LegalSection title="Intellectual property">
              <p>
                The School name, crest, text, photographs and other materials
                on this website are the property of {site.name} or are used
                with permission. You may view, download and print pages for
                personal, non-commercial use. Any other use, including
                reproduction of the crest or campus photographs, requires our
                prior written consent.
              </p>
            </LegalSection>

            <LegalSection title="Form submissions">
              <p>
                Information submitted through our forms is handled in
                accordance with our Privacy Policy. Forms are reviewed during
                office hours ({site.headOffice.officeHours}) and are not
                monitored around the clock — for anything urgent, please call
                the campus office directly rather than using a form.
              </p>
            </LegalSection>

            <LegalSection title="Third-party links">
              <p>
                Links to external services, such as map directions and our
                social media pages, are provided for convenience. Those
                services are operated by third parties, and we are not
                responsible for their content, availability or privacy
                practices.
              </p>
            </LegalSection>

            <LegalSection title="Accuracy of information">
              <p>
                We make reasonable efforts to keep this website accurate and
                up to date, but calendars, notices, fees and other details may
                change during the academic year. Where information on this
                website differs from an official circular issued by a campus,
                the official circular prevails.
              </p>
            </LegalSection>

            <LegalSection title="Limitation of liability">
              <p>
                This website is provided on an &quot;as is&quot; basis. To the
                extent permitted by law, the School accepts no liability for
                loss arising from interruptions to the website, from reliance
                on information that has since changed, or from third-party
                services linked from these pages.
              </p>
            </LegalSection>

            <LegalSection title="Governing law">
              <p>
                These terms are governed by the laws of India. Any dispute
                arising from the use of this website is subject to the
                exclusive jurisdiction of the courts at Jaipur, Rajasthan.
              </p>
            </LegalSection>

            <LegalSection title="Changes to these terms">
              <p>
                We may update these terms from time to time. The current
                version will always be available on this page, with the date
                of the latest revision shown at the top.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="max-w-3xl">
            <h2 className="text-xl text-text md:text-2xl">
              Questions about these terms?
            </h2>
            <p className="mt-3 text-base text-text">
              Our head office team will be happy to help.
            </p>
            <address className="mt-5 space-y-1 text-base not-italic text-text">
              <p className="font-semibold">{site.name} — Head Office</p>
              <p>{site.headOffice.address}</p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${site.headOffice.phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {site.headOffice.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${site.headOffice.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {site.headOffice.email}
                </a>
              </p>
            </address>
          </div>
        </div>
      </section>
    </>
  );
}

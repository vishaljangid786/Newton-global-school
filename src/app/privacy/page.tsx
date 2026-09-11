import type { Metadata } from "next";
import type { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Newton Global School collects, uses and protects the information families share with us through our website, forms and campus offices.",
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we collect, use and protect the information families share with us."
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-text-muted">
              Last updated: {formatDate(LAST_UPDATED)}
            </p>
            <p className="mt-4 text-base leading-relaxed text-text">
              {site.name} (&quot;the School&quot;, &quot;we&quot;,
              &quot;us&quot;) respects the trust that parents, students, staff
              and applicants place in us. This policy explains what personal
              information we collect through this website and our campus
              offices, why we collect it, and the choices available to you.
            </p>

            <LegalSection title="Scope of this policy">
              <p>
                This policy applies to information collected through this
                website — including our admission inquiry, contact and career
                application forms — and to information you share with the
                school office in person, by phone or by email.
              </p>
            </LegalSection>

            <LegalSection title="Information we collect">
              <p>Depending on how you interact with us, we may collect:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Admission inquiries:</strong> the student&apos;s
                  name, the grade applied for, the parent or guardian&apos;s
                  name, phone number, email address and preferred campus.
                </li>
                <li>
                  <strong>Contact messages:</strong> your name, contact
                  details, the campus you wish to reach and the content of
                  your message.
                </li>
                <li>
                  <strong>Career applications:</strong> your name, contact
                  details, the position and campus you are applying for, and
                  any details you include in your application or resume.
                </li>
                <li>
                  <strong>Campus visits:</strong> appointment details recorded
                  when you book a school tour or meet our admissions team.
                </li>
                <li>
                  <strong>Website usage:</strong> basic, aggregated statistics
                  such as which pages are visited. We do not run third-party
                  advertising trackers on this website.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="How we use your information">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>To respond to your inquiries and messages.</li>
                <li>
                  To process admission registrations, schedule interactions
                  and communicate decisions.
                </li>
                <li>
                  To share information you have asked for, such as admission
                  dates, notices and event updates.
                </li>
                <li>To assess and respond to employment applications.</li>
                <li>
                  To meet our reporting obligations to education boards and
                  authorities where required by law.
                </li>
                <li>To improve our website, forms and admission process.</li>
              </ul>
            </LegalSection>

            <LegalSection title="How we share information">
              <p>
                We do not sell personal information, and we do not share it
                with advertisers. Information is shared only with the campus
                concerned and our head office team, with education boards and
                government authorities where the law requires it, and with
                service providers — such as transport and examination partners
                — who work under confidentiality obligations.
              </p>
            </LegalSection>

            <LegalSection title="Photographs and student work">
              <p>
                Photographs of school life, student achievements and events
                may appear in our gallery, news posts and notice boards. We
                seek written consent from parents at the time of admission
                before featuring an identifiable student, and every image is
                reviewed before publication. Parents may ask the campus office
                to withdraw an image at any time.
              </p>
            </LegalSection>

            <LegalSection title="Cookies and locally stored data">
              <p>
                Our website stores a single preference in your browser: the
                campus you last visited, so we can bring you back to the right
                campus pages. You can clear this at any time through your
                browser settings. We do not use advertising cookies.
              </p>
            </LegalSection>

            <LegalSection title="Data retention and security">
              <p>
                Admission and student records are retained for the periods
                required by the education board and applicable law.
                Unsuccessful admission inquiries and job applications are
                retained for one academic year and then deleted. Access to
                personal information is restricted to authorised staff who
                need it for their role.
              </p>
            </LegalSection>

            <LegalSection title="Your rights">
              <p>You may write to us at any time to:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Request a copy of the information we hold about you.</li>
                <li>Ask us to correct information that is inaccurate.</li>
                <li>
                  Withdraw consent for photographs or non-essential
                  communications.
                </li>
                <li>
                  Request deletion of information where the law permits us to
                  delete it.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title={"Children's privacy"}>
              <p>
                This website is intended to be used by parents and guardians.
                Our online forms should be completed by an adult; we do not
                knowingly collect information directly from children through
                this website.
              </p>
            </LegalSection>

            <LegalSection title="Changes to this policy">
              <p>
                We may update this policy from time to time. Changes will be
                posted on this page with a revised &quot;last updated&quot;
                date, and significant changes will be communicated to parents
                through our usual school channels.
              </p>
            </LegalSection>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="max-w-3xl">
            <h2 className="text-xl text-text md:text-2xl">
              Questions about this policy?
            </h2>
            <p className="mt-3 text-base text-text">
              Write to our head office and we will respond during office
              hours.
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
              <p className="text-text-muted">{site.headOffice.officeHours}</p>
            </address>
          </div>
        </div>
      </section>
    </>
  );
}

import {
  CONTAINER,
  type Img,
  PhotoBackdrop,
  rich,
  STRONG,
  Wave,
} from "@/components/site/school-kit";
import InquiryForm from "@/components/forms/InquiryForm";
import Reveal from "@/components/ui/Reveal";

/**
 * The closing call-to-action band, with the enquiry form printed in it rather
 * than a button pointing at one.
 *
 * Every page used to end with "Book a Campus Visit" or "Enquire Now" linking
 * to another page; a parent who was ready to ask had to load a second page and
 * find the form again. The form is short enough to sit here instead.
 *
 * One rule this component cannot enforce on its own: a page must never carry
 * two forms. Pages that already have one — Contact, Registration Form,
 * Careers, and the branch contact and admissions pages — keep theirs and do
 * not use this band.
 *
 * Every submission lands in the same `enquiries` table, so they all reach
 * Admin → Enquiries however the visitor got here.
 */
export default function EnquiryBand({
  image,
  h2,
  body,
  /** Colour of the wave that meets the section above — match its background. */
  waveClass = "text-bg",
  formTitle = "Enquire Now / Book a Visit",
  formNote = "Fill this in and our admissions team will call you back.",
  id = "enquiry",
}: {
  image: Img;
  h2: string;
  body?: string;
  waveClass?: string;
  formTitle?: string;
  formNote?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden bg-[#001344] pb-16 pt-20 text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28"
    >
      <Wave className={`z-20 ${waveClass}`} />
      {/* The copy lives in the left column and the form sits on its own white
          card, so the campus can come further up here than on a band whose
          text runs the full width. Not pinned: this band is the one people
          actually fill in, and a parallax moving behind a form they are typing
          into is a distraction rather than an effect. */}
      <PhotoBackdrop img={image} strength="sheer" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.24),transparent_70%)]"
      />

      <div
        className={`relative ${CONTAINER} grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16`}
      >
        <Reveal>
          <span
            aria-hidden="true"
            className="block h-[3px] w-16 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mt-6 max-w-2xl text-[1.5rem] leading-[1.2] text-white sm:text-[1.75rem] md:text-[2rem]">
            {rich(h2, STRONG.headingDark)}
          </h2>
          {body ? (
            <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-[#c2cfe4] md:text-base">
              {rich(body, STRONG.dark)}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={120}>
          {/* The form keeps its own light surface: the shared field styles are
              built for a white card, not for navy. */}
          {/* Capped and compact: at full width beside the heading the form
              was taller than the copy it belongs to and dominated the band. */}
          <div className="ml-auto w-full max-w-xl rounded-[1.25rem] border border-hairline bg-surface p-5 text-text shadow-frame sm:p-6">
            <h3 className="text-[0.9375rem] leading-[1.3] text-ink">
              {formTitle}
            </h3>
            <p className="mt-1 text-[0.75rem] leading-[1.6] text-text-muted">
              {formNote}
            </p>
            <div className="mt-4">
              <InquiryForm compact />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

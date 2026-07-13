import type { Metadata } from "next";
import ButtonLink from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you were looking for could not be found. Head back to the Newton Global School homepage, browse our campuses or contact us.",
};

/** Root 404 — design.md §4.10: centered large "404", friendly line, buttons. */
export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center bg-bg px-4 py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p
          aria-hidden="true"
          className="font-heading text-[6rem] font-bold leading-none text-primary md:text-[8rem]"
        >
          404
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-5 h-1 w-16 rounded-pill bg-accent"
        />
        <h1 className="mt-5 text-[1.75rem] md:text-[2.5rem]">
          Page not found
        </h1>
        <p className="mt-3 text-base text-text-muted">
          This page seems to be on holiday. It may have moved, or the link may
          be out of date — but the rest of the school is very much in session.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/branches" variant="outline">
            Explore Our Campuses
          </ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

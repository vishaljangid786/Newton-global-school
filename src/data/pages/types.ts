/**
 * Shape shared by the four class-stage tabs of "Newton Global School.docx"
 * (Nursery, Primary, Secondary, Senior Secondary). Every string carries the
 * document's own wording, with `**…**` marking the phrases it bolds.
 */
export interface StageCopy {
  slug: string;
  hero: { h1: string; sub: string; body: string; cta: string };
  overview: { h2: string; body: string[] };
  curriculum: {
    h2: string;
    /** Present on the Nursery and Primary tabs only. */
    lede?: string;
    items: string[];
    closing: string;
  };
  whyStage: { h2: string; body: string[] };
  /** Senior Secondary only — the stream-selection section. */
  streams?: { h2: string; body: string[] };
  facilities: { h2: string; items: string[] };
  teaching: { h2: string; body: string[] };
  faq: { h2: string; items: { q: string; a: string }[] };
  admissionCta: { h2: string; body: string; button: string };
  /**
   * The document's "Internal Linking Note" suggestions, verbatim. The bold run
   * inside each is the clickable part; the wrapping quotation marks in the
   * source delimit the suggestion and are not rendered.
   */
  links: string[];
}

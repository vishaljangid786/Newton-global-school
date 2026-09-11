import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CONTAINER_FLUID,
  Icon,
  type Img,
  PhotoBackdrop,
  SECTION,
  Wave,
} from "@/components/site/school-kit";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ReadingProgress from "@/components/site/ReadingProgress";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { getPublishedBlogBySlug, getPublishedBlogs } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* Posts come from the blog_posts table, so never cache this page. */
export const dynamic = "force-dynamic";

/**
 * The banner wash. Deliberately NOT the post's own cover: a cover is often a
 * text-heavy graphic, and blown up behind the title its wording bleeds
 * through and reads as a mistake. A plain campus photo stays in the
 * background where a background belongs.
 */
const BANNER: Img = {
  src: "/images/school/campus-front.webp",
  w: 1600,
  h: 900,
  alt: "The Newton Global School building seen from the driveway",
};

/** Used when a post carries no uploaded cover of its own. */
const FALLBACK: Img = {
  src: "/images/school/library-students.webp",
  w: 1200,
  h: 1600,
  alt: "Pupils reading at the tables in the school library",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) notFound();

  /* Legacy plain-text posts (no HTML tags) get their paragraphs wrapped;
     rich-text posts are already sanitised HTML stored by the editor. */
  const isHtml = /<[a-z][\s\S]*>/i.test(post.body);
  const bodyHtml = isHtml
    ? post.body
    : post.body
        .split(/\n{2,}/)
        .map((p) => `<p>${p.trim()}</p>`)
        .join("");

  /*
   * Long guides need a way in. Every <h2> in the stored HTML gets a stable id
   * so the contents list can link to it — done here rather than in the editor
   * so older posts gain it too.
   */
  const sections: { id: string; label: string }[] = [];
  const withAnchors = bodyHtml.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g,
    (_match, attrs: string | undefined, inner: string) => {
      const label = inner.replace(/<[^>]+>/g, "").trim();
      const id =
        label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 60) || `section-${sections.length + 1}`;
      sections.push({ id, label });
      return `<h2 id="${id}"${attrs ?? ""}>${inner}</h2>`;
    }
  );

  const cover: Img = post.cover_image_url
    ? { src: post.cover_image_url, w: 1600, h: 900, alt: post.title }
    : FALLBACK;

  /*
   * The excerpt is very often the opening paragraph trimmed to length — which
   * is exactly what the current post does — and printing both back to back
   * reads as a bug. Compare the two openings and only show the standfirst when
   * it actually says something the first paragraph does not.
   */
  const normalise = (value: string) =>
    value.replace(/<[^>]+>/g, " ").replace(/[^a-z0-9]+/gi, " ").trim().toLowerCase();
  const bodyOpening = normalise(bodyHtml).slice(0, 90);
  const standfirst =
    post.excerpt && !bodyOpening.startsWith(normalise(post.excerpt).slice(0, 90))
      ? post.excerpt
      : null;

  const published = post.published_at ? formatDate(post.published_at) : null;
  const words = post.body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  const more = (await getPublishedBlogs())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <ReadingProgress targetId="post-body" />

      {/* ——— Banner: the cover photo behind a navy wash ——— */}
      {/* The header is sticky and overlays this band, so the top padding has
          to clear it before the breadcrumbs start — otherwise the trail and
          the title sit tucked under the nav. */}
      <section className="relative flex flex-col justify-end overflow-hidden bg-[#001344] pb-16 pt-[calc(var(--header-h)+3.5rem)] text-white sm:pb-20 sm:pt-[calc(var(--header-h)+5rem)] lg:pt-[calc(var(--header-h)+6.5rem)]">
        <Wave className="z-20 text-bg" />
        <PhotoBackdrop img={BANNER} />
        <div className={`relative ${CONTAINER_FLUID} max-w-3xl`}>
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
            className="mb-5"
            tone="onDark"
          />
          <span aria-hidden="true" className="block h-[3px] w-16 rounded-pill bg-[#d6a53f]" />
          <h1 className="mt-6 text-[clamp(1.75rem,1.2rem+2.1vw,3rem)] leading-[1.15] text-white">
            {post.title}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-[#c2cfe4]">
            <span className="flex items-center gap-1.5">
              <Icon name="faculty" className="h-3.5 w-3.5 text-[#d6a53f]" />
              {post.author_name}
            </span>
            {published ? (
              <span className="flex items-center gap-1.5">
                <Icon name="calendar" className="h-3.5 w-3.5 text-[#d6a53f]" />
                {published}
              </span>
            ) : null}
            <span className="flex items-center gap-1.5">
              <Icon name="book" className="h-3.5 w-3.5 text-[#d6a53f]" />
              {minutes} min read
            </span>
          </p>
        </div>
      </section>

      {/* ——— The cover, lifted over the seam ——— */}
      <div className={`${CONTAINER_FLUID} max-w-4xl`}>
        <Reveal>
          <div className="relative -mt-8 aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] shadow-frame sm:-mt-12">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(max-width: 1024px) 92vw, 56rem"
              priority
              className="img-skeleton object-cover"
            />
          </div>
        </Reveal>
      </div>

      {/* ——— Body, with a contents rail beside it on wide screens ——— */}
      <section className={`bg-bg ${SECTION} !pt-10 sm:!pt-12`}>
        <div className={`${CONTAINER_FLUID} max-w-6xl`}>
          <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            {sections.length > 2 ? (
              <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
                <Link
                  href="/blog"
                  className="group/back mb-7 inline-flex items-center gap-2 text-[0.8125rem] font-bold text-[#87661f]"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/back:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/back:translate-x-0"
                  >
                    ←
                  </span>
                  All blogs
                </Link>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]">
                  On this page
                </p>
                <nav aria-label="On this page" className="mt-4">
                  <ol className="space-y-2.5 border-l border-hairline">
                    {sections.map((entry) => (
                      <li key={entry.id}>
                        <a
                          href={`#${entry.id}`}
                          className="-ml-px block border-l-2 border-transparent pl-3 text-[0.8125rem] leading-[1.5] text-text-muted transition-colors hover:border-[#a8802f] hover:text-[#154a8a]"
                        >
                          {entry.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            ) : (
              <div className="hidden lg:block" />
            )}

            <div className="min-w-0 max-w-3xl">
          {standfirst ? (
            <Reveal>
              <p className="border-l-2 border-[#a8802f] pl-5 text-[1.125rem] leading-[1.75] text-ink">
                {standfirst}
              </p>
            </Reveal>
          ) : null}
          <Reveal>
            <div
              id="post-body"
              className="admin-prose mt-10 text-[1.0625rem] leading-[1.85] text-text [&_h2]:scroll-mt-[calc(var(--header-h)+1.5rem)] [&_h3]:scroll-mt-[calc(var(--header-h)+1.5rem)]"
              dangerouslySetInnerHTML={{ __html: withAnchors }}
            />
          </Reveal>


            </div>
          </div>
        </div>
      </section>

      {/* ——— More posts ——— */}
      {more.length > 0 ? (
        <section className={`border-t border-hairline bg-bg-alt ${SECTION} !py-14`}>
          <div className={`${CONTAINER_FLUID} max-w-5xl`}>
            <Reveal>
              <h2 className="text-center font-heading text-[1.25rem] font-bold text-ink">
                More from the blog
              </h2>
            </Reveal>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item, index) => (
                <li key={item.slug}>
                  <Reveal delay={index * 90} className="h-full">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-hairline bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={item.cover_image_url ?? FALLBACK.src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 20rem"
                          className="img-skeleton object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </span>
                      <span className="flex flex-1 flex-col p-5">
                        <span className="font-heading text-[0.9375rem] font-bold leading-snug text-ink transition-colors group-hover:text-[#154a8a]">
                          {item.title}
                        </span>
                        <span className="mt-2 line-clamp-3 text-[0.875rem] leading-[1.7] text-text-muted">
                          {item.excerpt}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ——— The form the CTA above points at ——— */}
      <EnquiryBand
        image={FALLBACK}
        h2={`Have a question about admission at **${site.name}**?`}
        body={`Leave your details and our admissions team will call you back.`}
        waveClass="text-bg"
      />
    </>
  );
}

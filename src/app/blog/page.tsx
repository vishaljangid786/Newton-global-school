import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/ui/BlogCard";
import {
  CONTAINER,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { getPublishedBlogs } from "@/lib/blog";
import { onlineSchoolArticle } from "@/data/pages/online-school";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and updates from Newton Global School, Sangteda, Kotputli.",
};

/* Reads published posts from the DB; falls back to an empty list when offline. */
export const dynamic = "force-dynamic";

const IMG = {
  heroBanner: {
    src: "/images/school/library-students.webp",
    w: 1200,
    h: 1600,
    alt: "Pupils reading at the tables in the school library",
  },
  article: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
} as const satisfies Record<string, Img>;

/*
 * The document's last tab is a full article. It lives at its own route as a
 * static page, so it is listed here by hand — the DB grid below carries
 * whatever the admin publishes.
 */
const plain = (s: string) => s.replace(/\*\*/g, "");
const heading = onlineSchoolArticle.find((b) => b.kind === "h1");
const opening = onlineSchoolArticle.find((b) => b.kind === "p");

const DOC_ARTICLE = {
  href: "/blog/is-online-school-valid-in-india",
  title: heading && "text" in heading ? plain(heading.text) : "",
  excerpt: opening && "text" in opening ? `${plain(opening.text).slice(0, 210)}…` : "",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Blog" }]}
        h1={`From the Newton Blog`}
        sub={`Guides and Updates for Parents in Sangteda and Kotputli`}
        body={`Longer reads on the questions families ask us most — written by the school, not lifted from anywhere else.`}
      />

      <section className={`bg-bg ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Featured" title={`Latest Article`} align="center" />
          </Reveal>

          <Reveal delay={110}>
            <Link
              href={DOC_ARTICLE.href}
              className="group mx-auto mt-10 grid max-w-5xl overflow-hidden rounded-[1.5rem] border border-hairline bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover md:grid-cols-2 lg:mt-12"
            >
              <span className="relative block aspect-[16/10] overflow-hidden md:aspect-auto md:h-full">
                <Image
                  src={IMG.article.src}
                  alt={IMG.article.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </span>
              <span className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <span className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]">
                  Guide for Parents
                </span>
                <span className="mt-3 font-heading text-[clamp(1.1rem,1rem+0.5vw,1.5rem)] font-bold leading-snug text-ink transition-colors group-hover:text-[#154a8a]">
                  {DOC_ARTICLE.title}
                </span>
                <span className="mt-4 text-[0.9375rem] leading-[1.85] text-text-muted">
                  {DOC_ARTICLE.excerpt}
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-[#87661f]">
                  Read the full guide
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </span>
            </Link>
          </Reveal>

          {posts.length > 0 ? (
            <>
              <Reveal className="mt-16 lg:mt-20">
                <SectionTitle eyebrow="More Posts" title={`From Our Teachers`} align="center" />
              </Reveal>
              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CONTAINER,
  type Img,
  PageHero,
  SECTION,
  SectionTitle,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { getPublishedBlogs } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and updates from Newton Global School, Sangteda, Kotputli.",
};

/* Posts come from the blog_posts table, so never cache this page. */
export const dynamic = "force-dynamic";

const IMG = {
  heroBanner: {
    src: "/images/school/library-students.webp",
    w: 1200,
    h: 1600,
    alt: "Pupils reading at the tables in the school library",
  },
  card: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
} as const satisfies Record<string, Img>;

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
            <SectionTitle eyebrow="Latest Posts" title={`From Our Desk`} align="center" />
          </Reveal>

          {posts.length === 0 ? (
            <Reveal>
              <p className="mx-auto mt-10 max-w-md rounded-[1.25rem] border border-hairline bg-surface px-6 py-12 text-center text-sm text-text-muted shadow-card">
                No posts have been published yet. Please check back soon.
              </p>
            </Reveal>
          ) : (
            <ul className="mx-auto mt-10 grid max-w-5xl gap-6 lg:mt-12 md:grid-cols-2">
              {posts.map((post, index) => (
                <li key={post.slug}>
                  <Reveal delay={(index % 2) * 110} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-hairline bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={post.cover_image_url ?? IMG.card.src}
                          alt={post.cover_image_url ? post.title : IMG.card.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="img-skeleton object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      </span>
                      <span className="flex flex-1 flex-col p-6 sm:p-7">
                        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]">
                          {post.published_at ? formatDate(post.published_at) : "Newton Global School"}
                        </span>
                        <span className="mt-3 font-heading text-[1.0625rem] font-bold leading-snug text-ink transition-colors group-hover:text-[#154a8a]">
                          {post.title}
                        </span>
                        <span className="mt-3 flex-1 text-[0.9375rem] leading-[1.8] text-text-muted">
                          {post.excerpt}
                        </span>
                        <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-bold text-[#87661f]">
                          Read more
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

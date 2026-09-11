import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CARD,
  CONTAINER,
  Cover,
  Wave,
  GoldLink,
  Icon,
  type IconName,
  type Img,
  Photo,
  PhotoBackdrop,
  HEAD_GAP,
  rich,
  SECTION,
  SectionTitle,
  splitRunIn,
  STAGE_COLOURS,
  STRONG,
  TINTS,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import HomeHero, { type HighlightChip } from "@/components/site/HomeHero";
import Reveal from "@/components/ui/Reveal";
import { getUpcomingEvents } from "@/data/events";
import { getAllNotices } from "@/data/notices";
import { formatDate } from "@/lib/format";
import { facultyPortraits, facultyPromise } from "@/data/pages/faculty";
import {
  achievementAreas,
  achievements as ACHIEVEMENTS,
  hasRealStats,
  resultImages,
  resultStats,
} from "@/data/pages/results";
import BlogCard from "@/components/ui/BlogCard";
import TestimonialSlider from "@/components/ui/TestimonialSlider";
import { getTestimonialFeed } from "@/lib/testimonials-store";
import { getMergedGalleryItems } from "@/lib/gallery-store";
import { getPublishedBlogs } from "@/lib/blog";

export const metadata: Metadata = {
  description:
    "Nurturing Young Minds at Sangteda, Kotputli with Quality RBSE Education",
};
/* ———————————————————————————————————————————————————————————————
 * Page copy — transcribed verbatim from "Newton Global School.docx"
 * (Home Page tab). `**…**` marks the phrases the document bolds; every
 * other character — hyphens, em dashes, punctuation, casing — is exactly
 * as written in the source. Do not reword.
 * ——————————————————————————————————————————————————————————————— */

/* §1 Banner Section (Hero) */
const HERO = {
  h1: `Newton Global School - **Best School in Kotputli**`,
  sub: `Nurturing Young Minds at Sangteda, Kotputli with Quality **RBSE** Education`,
  body: `Welcome to Newton Global School, recognized as one of the **best schools in Kotputli** for quality, values-based education. As a trusted **English Medium School in Kotputli**, we are committed to building strong academic foundations and confident personalities in every child. Located in Sangteda on **Babera Road**, **Newton Global School Kotputli** proudly follows the **RBSE** curriculum with a focus on holistic learning.`,
  cta: `Apply for Admission 2026-27`,
};

/** §1 — floating highlights beside the banner figure. Each line is the
    document's own, taken from Why Choose Us and Facilities. */
const HERO_CHIPS: readonly HighlightChip[] = [
  {
    icon: "book",
    label: "RBSE Curriculum",
    detail:
      "Structured learning with practical understanding, from Nursery to Class 12.",
    place: "left-0 top-[14%]",
  },
  {
    icon: "shield",
    label: "Safe Campus",
    detail: "CCTV monitoring across the campus and trained staff for child safety.",
    place: "right-0 top-[44%]",
  },
  {
    icon: "bus",
    label: "Bus Service",
    detail:
      "Reliable transport across Kotputli, Sangteda and nearby areas around NH8.",
    place: "left-[4%] bottom-[24%]",
  },
];

/* §2 About School Section */
const ABOUT = {
  /* The document has no button here; the label just names its destination. */
  cta: `Read More About Us →`,
  h2: `About Newton Global School - A **Top School in Kotputli**`,
  body: `Newton Global School is widely regarded as one of the **best schools in Sangteda**, Kotputli, committed to giving every child a safe, encouraging, and disciplined environment to grow. As a **RBSE School in Kotputli**, we blend traditional values with modern teaching methods to prepare students for both academics and life. Parents across the region trust us as a **best RBSE school in Kotputli** because of our consistent focus on discipline, care, and results. Our experienced teachers and caring staff work together to make sure every child feels supported, whether it's their first day in Nursery or their final year at our **Senior Secondary School in Kotputli**.`,
};

/* §3 Why Choose Us Section */
const WHY_CHOOSE_US: Array<{ icon: IconName; text: string }> = [
  {
    icon: "faculty",
    text: `**Experienced & Caring Faculty** - Teachers who know every child by name, not just roll number`,
  },
  {
    icon: "book",
    text: `**RBSE Curriculum with Modern Teaching** - Structured learning with practical understanding, making us a preferred **RBSE School in Kotputli**`,
  },
  {
    icon: "shield",
    text: `**Safe & Secure Campus** - CCTV monitoring and trained staff for child safety`,
  },
  {
    icon: "target",
    text: `**Individual Attention** - Small class sizes so no student is left behind`,
  },
  {
    icon: "chart",
    text: `**Strong Academic Results** - Consistent performance in board exams year after year, one reason we're seen as the **best school in Kotputli**`,
  },
  {
    icon: "pin",
    text: `**Convenient Location** - Easily accessible via **NH8 Kotputli**, right in the heart of Sangteda`,
  },
];

const WHY_CHOOSE_US_H2 = `Why Parents Choose Us as the **Best School near Sangteda**`;

/* §4 Academic Programs Section */
const PROGRAMS_H2 = `Academic Programs - From Nursery to **Senior Secondary School in Kotputli**`;
const PROGRAMS_LEDE = `We offer complete schooling under one roof, following the **RBSE** syllabus at every level, so your child's educational journey stays consistent and stress-free at Newton Global School.`;
const PROGRAMS = [
  `**Pre-Primary (Nursery to KG)** - Play-based learning to build curiosity and basic skills`,
  `**Primary School (Class 1-5)** - Strong foundation in language, math, and science`,
  `**Middle & Secondary (Class 6-10)** - Subject-wise focused teaching as per **RBSE** pattern, guided by our **best RBSE school in Kotputli** approach`,
  `**Senior Secondary (Class 11-12)** - Stream selection guidance with exam-focused preparation for **Senior Secondary School in Kotputli** students`,
];

/* §5 Facilities Section */
const FACILITIES_H2 = `Facilities at Newton Global School - A **Best English Medium School in Kotputli**`;
/** Six of the document's twelve; the Facilities page carries all of them. */
const HOME_FACILITY_COUNT = 6;

const FACILITIES_LEDE = `Newton Global School offers well-planned infrastructure and facilities that support every child's academic, physical, and personal growth.`;
const FACILITIES: Array<{ icon: IconName; text: string }> = [
  {
    icon: "classroom",
    text: `**Well-Equipped Classrooms** - Clean, spacious, and ventilated learning spaces`,
  },
  {
    icon: "flask",
    text: `**Science & Computer Labs** - Hands-on learning beyond textbooks`,
  },
  {
    icon: "library",
    text: `**Library & Reading Room** - A quiet corner to build reading habits from an early age`,
  },
  {
    icon: "trophy",
    text: `**Sports Ground** - Space for physical activities and annual sports events`,
  },
  {
    icon: "bus",
    text: `**Safe Transport Facility** - Reliable school bus service across Kotputli, Sangteda, and nearby areas around **NH8 Kotputli**`,
  },
  {
    icon: "monitor",
    text: `**Smart Classrooms** - Technology-supported teaching for better understanding`,
  },
  {
    icon: "cctv",
    text: `**CCTV Surveillance** - Complete campus monitoring for student safety`,
  },
  {
    icon: "droplet",
    text: `**Clean Drinking Water (RO System)** - Health-safe water facility across campus`,
  },
  {
    icon: "medical",
    text: `**First Aid & Medical Room** - On-campus support for basic health emergencies`,
  },
  {
    icon: "music",
    text: `**Music & Art Room** - Dedicated space to nurture creativity and talent`,
  },
  {
    icon: "yoga",
    text: `**Yoga & Physical Training** - Regular sessions for fitness and discipline`,
  },
  {
    icon: "leaf",
    text: `**Green & Safe Campus** - A clean, eco-friendly environment for young learners`,
  },
];

/** Counted off the list rather than written out, so the two cannot disagree. */
const FACILITIES_CTA = `See All ${FACILITIES.length} Facilities →`;

/* §6 Achievements/Results Section — copy and figures live in
   src/data/pages/results.ts, shared with the /results page. */

/* §7 Gallery Preview Section */
const GALLERY = {
  h2: `Glimpses of Life at Newton Global School`,
  body: `A quick look at our campus, classrooms, and everyday moments of learning and fun at **Newton Global School Kotputli**.`,
  cta: `View Full Gallery →`,
};

/* §8 Testimonials Section — the two quotes the document prints live on in
   src/data/testimonials-seed.ts, and are shown only until Admin →
   Testimonials has something published. */
const TESTIMONIALS = {
  h2: `What Parents Say About Us`,
  lede: `Hear directly from the families who trust Newton Global School as the **best school in Sangteda** for their children's education.`,
};

/* Latest Blogs — the document has no blog section; these three lines are
   authored, and every post below comes from Admin → Blogs. */
const BLOGS = {
  h2: `Latest Articles & Blogs`,
  body: `Admission guidance, exam tips and school updates, written by the Newton Global School team.`,
  cta: `Read All Blogs →`,
};

/* §9 News & Events Section */
const NEWS = {
  h2: `Latest News & Events at Newton Global School`,
  body: `Stay updated with admission dates, school events, and important announcements from Kotputli's **best school**.`,
  /* Not in the document; the label just names where the button goes. */
  cta: `View All News & Events →`,
};

/* §10 Admission CTA Section */
const ADMISSION = {
  h2: `**School Admission in Kotputli** - Now Open for 2026-27`,
  body: `Give your child the right start with Newton Global School. **School Admission in Kotputli** is now open for Nursery to **Senior Secondary School in Kotputli** classes. Book a campus visit today and see why we are considered among the **best schools in Kotputli**.`,
  cta: `Enquire Now / Book a Visit`,
};

/* §11 Location/Map Section */
const LOCATION = {
  h2: `Visit Us - **School in Sangteda**, Kotputli`,
  body: `Newton Global School is conveniently located in Sangteda, near **NH8 Kotputli**, on **Babera Road**. As one of the well-known **schools near Sangteda**, we welcome parents to visit our campus and experience our learning environment firsthand.`,
  /*
   * "(Google Map embed here)" — rendered as a live Google Maps embed below.
   *
   * Deliberately an address with no school name in it. A different Newton
   * Global School is listed at Udaipuria Mod, Chomu, Jaipur 303804, and
   * including the name made Google match that business and drop the pin ~90km
   * away in Chomu. This campus is not listed on Maps, so the query geocodes
   * the road and PIN instead, which puts the map on the right place.
   */
  mapQuery: `Sangteda, Babera Road, NH-8, Kotputli, Rajasthan 303108`,
};

/* §12 FAQ Section */
const FAQ_H2 = `Frequently Asked Questions`;
const FAQS = [
  {
    q: `Q1: Is Newton Global School affiliated with RBSE?`,
    a: `Yes, Newton Global School is a **RBSE affiliated school in Sangteda, Kotputli**, following the state board curriculum for all classes, making us a trusted **RBSE School in Kotputli**.`,
  },
  {
    q: `Q2: What classes does the school offer?`,
    a: `We offer complete schooling from Nursery to Senior Secondary (Class 12), making us one of the complete **Senior Secondary Schools near Kotputli**.`,
  },
  {
    q: `Q3: How can I apply for admission?`,
    a: `You can visit our campus or fill the online enquiry form **admission open in Newton Global School Kotputli** for the 2026-27 session.`,
  },
  {
    q: `Q4: Does the school provide transport facility?`,
    a: `Yes, we provide safe transport covering **school near NH8 Kotputli** and nearby areas, including **school on Babera Road Kotputli**.`,
  },
  {
    q: `Q5: Is the medium of instruction English?`,
    a: `Yes, Newton Global School is a **Best English medium school in Kotputli Rajasthan**, focused on building strong communication skills in students, and is regarded as a **Best senior secondary school near NH8 Kotputli**.`,
  },
];
/**
 * CC0 sample photography — public domain, no attribution required.
 * Source list in public/images/school/CREDITS.md. Swap the files for the
 * school's own photos later; the keys and crops stay the same.
 */
const IMG = {
  aboutInsetBooks: {
    src: "/images/school/classroom-teaching.webp",
    w: 1600,
    h: 1200,
    alt: "A teacher leading a lesson in a full classroom",
  },
  aboutMainGate: {
    src: "/images/school/campus-front.webp",

    w: 1600,

    h: 900,

    alt: "The Newton Global School building seen from the driveway",
  },
  achievementsBg: {
    src: "/images/school/assembly-hall.webp",
    w: 1600,
    h: 900,
    alt: "Pupils gathered in the school assembly hall",
  },
  /** §3 — the campus behind the "Why Choose Us" band. Its own frame rather
      than a reuse of campus-grounds, which already carries the Location and
      Facilities bands — the same picture three times down one page reads as
      running out of photographs. */
  whyChooseUsBg: {
    src: "/images/school/why-choose-us-campus.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School campus with its buses on the driveway",
  },
  ctaCampus: {
    src: "/images/school/campus-side-buses.webp",

    w: 1600,

    h: 1200,

    alt: "Newton Global School buses parked beside the campus building",
  },
  facilityBus: {
    src: "/images/school/students-boarding-bus.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils lining up to board the school bus",
  },
  facilityGreen: {
    src: "/images/school/campus-grounds.webp",

    w: 1600,

    h: 900,

    alt: "The school building across its green grounds",
  },
  facilityMedical: {
    src: "/images/school/drinking-water-ro.webp",
    w: 1200,
    h: 1600,
    alt: "The RO drinking water station on campus",
  },
  facilityScience: {
    src: "/images/school/science-experiment.webp",
    w: 1200,
    h: 1600,
    alt: "Pupils carrying out an experiment in the science lab",
  },
  faqLibrary: {
    src: "/images/school/library.webp",

    w: 1600,

    h: 1200,

    alt: "The school library with its reading tables and shelves",
  },
  galleryDrawing: {
    src: "/images/school/kindergarten-room.webp",

    w: 1600,

    h: 1200,

    alt: "The pre-primary activity room with its play equipment",
  },
  galleryMusic: {
    src: "/images/school/assembly-address.webp",
    w: 1200,
    h: 1600,
    alt: "A member of staff addressing pupils in the assembly hall",
  },
  galleryPaint: {
    src: "/images/school/activity-room.webp",

    w: 1200,

    h: 1600,

    alt: "The pre-primary room set up for play-based learning",
  },
  galleryPlayground: {
    src: "/images/school/playground.webp",

    w: 1600,

    h: 1200,

    alt: "The school playground with its swings and climbing frame",
  },
  galleryRunning: {
    src: "/images/school/library-reading-group.webp",
    w: 1200,
    h: 1600,
    alt: "A group of pupils reading together in the library",
  },
  gallerySwing: {
    src: "/images/school/science-microscope.webp",
    w: 1200,
    h: 1600,
    alt: "A pupil examining a slide under the microscope",
  },
  heroCampus: {
    src: "/images/school/campus-front.webp",

    w: 1600,

    h: 900,

    alt: "The Newton Global School building seen from the driveway",
  },
  locationCampus: {
    src: "/images/school/campus-grounds.webp",

    w: 1600,

    h: 900,

    alt: "The school building across its green grounds",
  },
  newsAbcChalkboard: {
    src: "/images/school/classroom-teaching.webp",
    w: 1600,
    h: 1200,
    alt: "A teacher leading a lesson in a full classroom",
  },
  newsBackToSchool: {
    src: "/images/school/assembly-hall.webp",
    w: 1600,
    h: 900,
    alt: "Pupils gathered in the school assembly hall",
  },
  newsNeverStopLearning: {
    src: "/images/school/library-students.webp",
    w: 1200,
    h: 1600,
    alt: "Pupils reading at the tables in the school library",
  },
  newsSupplies: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
  programPreprimary: {
    src: "/images/school/kindergarten-room.webp",

    w: 1600,

    h: 1200,

    alt: "The pre-primary activity room with its play equipment",
  },
  programPrimary: {
    src: "/images/school/classroom-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils at their desks during a classroom lesson",
  },
  programSecondary: {
    src: "/images/school/science-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils at the benches in the science laboratory",
  },
  programSenior: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
} as const satisfies Record<string, Img>;

/* ——— Derived / dynamic data ——————————————————————————————————— */

/** §4 — each programme opens its own stage page. */
const PROGRAM_LINKS = [
  "/nursery",
  "/primary",
  "/secondary",
  "/senior-secondary",
];

/** §4 — the four stages carry the same colours as /academics. */
const PROGRAM_COLOURS = [
  STAGE_COLOURS.nursery,
  STAGE_COLOURS.primary,
  STAGE_COLOURS.secondary,
  STAGE_COLOURS["senior-secondary"],
];

/** §4 — one photo per programme, in the document's order. */
const PROGRAM_IMAGES = [
  IMG.programPreprimary,
  IMG.programPrimary,
  IMG.programSecondary,
  IMG.programSenior,
];

/** §5 — campus photo band above the twelve facility tiles. */
const FACILITY_BAND = [
  IMG.facilityScience,
  IMG.facilityBus,
  IMG.facilityGreen,
  IMG.facilityMedical,
];

/**
 * Mosaic geometry only. The photographs themselves come from the database
 * (admin uploads first, then the seed set), so the layout survives whatever
 * the school uploads — it just fills these six slots in order.
 */
const GALLERY_SPANS: Array<{ span: string; wide?: boolean }> = [
  { span: "md:col-start-1 md:row-start-1 md:row-span-2" },
  { span: "md:col-start-2 md:row-start-1" },
  { span: "md:col-start-3 md:row-start-1 md:row-span-2" },
  { span: "md:col-start-2 md:row-start-2" },
  { span: "md:col-span-2 md:col-start-1 md:row-start-3", wide: true },
  { span: "md:col-start-3 md:row-start-3" },
];

/** §9 — "(3-4 dynamic notice/event cards here)": upcoming events + notices. */
const upcomingEvents = getUpcomingEvents().slice(0, 2);
const newsFeed = [
  ...upcomingEvents.map((event) => ({
    id: `event-${event.id}`,
    date: event.date,
    kind: event.category,
    title: event.title,
    excerpt: event.description,
  })),
  ...getAllNotices()
    .slice(0, 4 - upcomingEvents.length)
    .map((notice) => ({
      id: `notice-${notice.id}`,
      date: notice.date,
      kind: "Notice",
      title: notice.title,
      excerpt: notice.excerpt,
    })),
].sort((a, b) => b.date.localeCompare(a.date));

const NEWS_IMAGES = [
  IMG.newsBackToSchool,
  IMG.newsAbcChalkboard,
  IMG.newsNeverStopLearning,
  IMG.newsSupplies,
];

const faqEntries: AccordionEntry[] = FAQS.map((faq, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{faq.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(faq.a)}</p>,
}));

export default async function HomePage() {
  /* Six is two full slides plus a third to page to; the rest live on
     /testimonials. Falls back to the document's own quotes when the table is
     empty or MySQL is down, so this band is never blank. */
  const testimonials = await getTestimonialFeed({ limit: 6 });

  /* Photographs an admin uploads should reach the home page too, not only
     /gallery. The mosaic below lays out six tiles, and tone-only placeholders
     have no file to show, so those are filtered out first. */
  const galleryTiles = (await getMergedGalleryItems())
    .filter((item) => Boolean(item.imageUrl))
    .slice(0, GALLERY_SPANS.length);

  /* Newest four posts; publishing one in Admin → Blogs revalidates this page. */
  const latestPosts = (await getPublishedBlogs()).slice(0, 4);

  return (
    <>
      {/* ——— 1. Banner Section (doc §1) — coloured ground, figure standing
          on the foot of the section, floating highlights beside it ——— */}
      <HomeHero
        h1={HERO.h1}
        sub={HERO.sub}
        body={HERO.body}
        cta={HERO.cta}
        ctaHref="/registration-form"
        secondaryCta={ADMISSION.cta}
        secondaryHref="/contact"
        cutout={{
          src: "/images/school/hero-student-thumbsup.png",
          w: 640,
          h: 640,
          alt: "Newton Global School pupil in uniform giving a thumbs up",
        }}
        chips={HERO_CHIPS}
      />

      {/* ——— 2. About School (doc §2) — photo cluster with a gold offset frame ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-frame">
                <Photo
                  img={IMG.aboutMainGate}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-8 -right-2 hidden w-36 overflow-hidden rounded-[1.25rem] border-4 border-bg shadow-frame sm:block lg:w-44">
                <Photo
                  img={IMG.aboutInsetBooks}
                  sizes="(max-width: 1024px) 144px, 176px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionTitle eyebrow="About School" title={ABOUT.h2} />
            <p className="mt-5 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(ABOUT.body)}
            </p>
            <GoldLink href="/about" className="mt-7 w-full sm:w-auto">
              {ABOUT.cta}
            </GoldLink>
          </Reveal>
        </div>
      </section>

      {/* ——— 3. Why Choose Us (doc §3) — a navy block, typographic ———
          Six white cards on a light band was the third grid in a row and read
          as filler. This one is a colour block with big numerals instead: no
          boxes, no icons, and the section raises its voice for the first time
          on the page. */}
      <section className={`relative overflow-hidden bg-[#001344] ${SECTION}`}>
        {/* Pinned: the page scrolls over the campus while the six reasons pass
            across it. This band had no photograph at all before — it was flat
            navy, which is what made it look like a placeholder. */}
        <PhotoBackdrop img={IMG.whyChooseUsBg} fixed />
        <Wave className="z-10 text-bg-alt" />
        <Wave flip className="z-10 text-bg" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.16),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow="Why Choose Us"
              title={WHY_CHOOSE_US_H2}
              tone="dark"
              width="max-w-4xl"
            />
          </Reveal>
          <ul className={`${HEAD_GAP} grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3`}>
            {WHY_CHOOSE_US.map((item, index) => (
              <li key={item.icon}>
                <Reveal delay={(index % 3) * 90}>
                  <p
                    aria-hidden="true"
                    className="font-heading text-[2.75rem] font-bold leading-none text-[#d6a53f]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-4 block h-px w-full bg-white/15"
                  />
                  <h3 className="mt-4 text-[1.0625rem] leading-[1.35] text-white">
                    {splitRunIn(item.text).title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.85] text-[#c2cfe4]">
                    {rich(splitRunIn(item.text).body, "font-semibold text-white")}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— 4. Academic Programs (doc §4) — one photo card per stage ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <div>
              <SectionTitle
                eyebrow="Academic Programs"
                title={PROGRAMS_H2}
                width="max-w-3xl"
              />
              <p className="mt-5 max-w-3xl text-[0.9375rem] leading-[1.8] text-text-muted">
                {rich(PROGRAMS_LEDE)}
              </p>
            </div>
          </Reveal>
          <ul className={`${HEAD_GAP} grid gap-5 lg:grid-cols-2 lg:gap-6`}>
            {PROGRAMS.map((program, index) => {
              const colour = PROGRAM_COLOURS[index];
              return (
                <li key={program}>
                  <Reveal delay={index * 90} className="h-full">
                    {/*
                      Horizontal card. The stages carry very different copy
                      lengths (two lines for Pre-Primary, five for Senior
                      Secondary), and a vertical card forced to equal height
                      left the short ones trailing into dead space. Here the
                      photograph stretches to whatever height the row takes,
                      so a taller neighbour grows the image rather than
                      opening a gap under the text.
                    */}
                    <Link
                      href={PROGRAM_LINKS[index]}
                      className={`group flex h-full flex-col overflow-hidden sm:min-h-[13rem] sm:flex-row ${CARD} ${colour.edge}`}
                    >
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
                        <Cover
                          img={PROGRAM_IMAGES[index]}
                          sizes="(max-width: 480px) 92vw, (max-width: 1024px) 40vw, 300px"
                          className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                        <span
                          aria-hidden="true"
                          className={`absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-pill font-heading text-[0.8125rem] font-bold text-white ${colour.band}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h3 className="text-[1.0625rem] leading-[1.35] text-ink">
                          {splitRunIn(program).title}
                        </h3>
                        <p className="mt-2 text-[0.9375rem] leading-[1.75] text-text-muted">
                          {rich(splitRunIn(program).body, "font-semibold text-ink")}
                        </p>
                        <span
                          aria-hidden="true"
                          className={`mt-auto pt-4 text-sm font-bold ${colour.ink}`}
                        >
                          Read more →
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— 5. Facilities (doc §5) — header, photo band, then a card grid ———
          Twelve run-in lines squeezed into two narrow columns beside a sticky
          photo collage: the titles and their descriptions ran together, and at
          13px in a 7-column well there was nothing to separate one facility
          from the next. Full width instead — the photographs get their own
          band across the top, and each facility becomes a card with its title
          as a real heading, so the twelve are scanned rather than waded
          through. */}
      <section
        id="facilities"
        className={`scroll-mt-24 border-y border-hairline bg-bg-alt ${SECTION}`}
      >
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Facilities"
              title={FACILITIES_H2}
              align="center"
              width="max-w-4xl"
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
              {rich(FACILITIES_LEDE)}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className={`${HEAD_GAP} grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4`}>
              {FACILITY_BAND.map((img, index) => (
                <div
                  key={img.src}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-card ${
                    index % 2 ? "lg:translate-y-6" : ""
                  }`}
                >
                  <Cover
                    img={img}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 22vw"
                    className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <ul className={`${HEAD_GAP} grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5`}>
            {FACILITIES.slice(0, HOME_FACILITY_COUNT).map((facility, index) => {
              const tint = TINTS[index % TINTS.length];
              const { title, body } = splitRunIn(facility.text);
              return (
                <li key={facility.icon} className="h-full">
                  <Reveal delay={(index % 3) * 70} className="h-full">
                    <div
                      className={`flex h-full gap-4 rounded-[1.25rem] border border-hairline bg-surface p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${tint.edge}`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem] ${tint.well}`}
                      >
                        <Icon name={facility.icon} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[1rem] leading-[1.35] text-ink">
                          {title}
                        </h3>
                        <p className="mt-1.5 text-[0.875rem] leading-[1.75] text-text-muted">
                          {rich(body, "font-semibold text-ink")}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          {/* The document lists twelve; six is as many as this section can
              carry without becoming the wall it used to be, so the rest are a
              click away on the Facilities page. */}
          <div className="mt-12 text-center">
            <GoldLink href="/facilities" className="w-full sm:w-auto">
              {FACILITIES_CTA}
            </GoldLink>
          </div>
        </div>
      </section>

      {/* ——— 6. Achievements (doc §6) — the page's loud moment ———
          The figures were 2.4rem in glass boxes in the corner of a full-height
          band, which wasted the one place the page is allowed to shout. They
          now run the width at display size, stacked over the copy. */}
      <section className={`relative overflow-hidden bg-[#001344] ${SECTION}`}>
        {/* Was a 18%-opacity photo under a 95% navy wash — two scrims doing
            the same job, and the assembly hall behind it never showed. */}
        <PhotoBackdrop img={IMG.achievementsBg} fixed />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow="Achievements"
              title={ACHIEVEMENTS.h2}
              tone="dark"
              width="max-w-4xl"
            />
            <p className="mt-5 max-w-3xl text-[0.9375rem] leading-[1.85] text-[#aebbd2]">
              {rich(ACHIEVEMENTS.body, STRONG.dark)}
            </p>
          </Reveal>

          {/*
            The figures, but only once they are real. `resultStats` still
            carries the document's own `XX%` / `XX+` placeholders — the school
            has not supplied its board numbers, and inventing a pass percentage
            is not an option. Printing the placeholders was the worse of the
            two failures though: the page's loudest band rendered "XX%" three
            times at 96px, which reads as a half-built site.

            So while the numbers are unset this band carries the four
            achievement areas instead — every line of which is factual — and
            the moment real figures land in src/data/pages/results.ts the
            display stats come back on their own.
          */}
          <Reveal delay={120}>
            {hasRealStats ? (
              <>
                <p className={`eyebrow ${HEAD_GAP} text-[#d6a53f]`}>
                  {ACHIEVEMENTS.statsLabel}
                </p>
                <dl className="mt-8 grid gap-y-12 sm:grid-cols-3 sm:gap-x-10">
                  {resultStats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`flex flex-col-reverse ${
                        index > 0 ? "sm:border-l sm:border-white/12 sm:pl-10" : ""
                      }`}
                    >
                      <dt className="mt-4 max-w-[16rem] text-[0.875rem] leading-[1.6] text-[#aebbd2]">
                        {rich(stat.label, STRONG.dark)}
                      </dt>
                      <dd className="font-heading text-[clamp(3.25rem,2rem+4.5vw,6rem)] font-bold leading-[0.9] tracking-tight text-white">
                        {stat.value.slice(0, -1)}
                        <span className="text-[#d6a53f]">
                          {stat.value.slice(-1)}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <ul className={`${HEAD_GAP} grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5`}>
                {achievementAreas.map((area) => (
                  <li
                    key={area.title}
                    className="flex h-full flex-col rounded-[1.25rem] border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm transition duration-300 hover:border-[#d6a53f]/45 hover:bg-white/[0.1] motion-reduce:transition-none"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-[#d6a53f] text-[#001344]">
                      <Icon name={area.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-[1rem] leading-[1.35] text-white">
                      {area.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-[1.75] text-[#aebbd2]">
                      {rich(area.body, STRONG.dark)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={200}>
            {/* Our own students, so the figures above have faces beside them. */}
            <ul className={`${HEAD_GAP} grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4`}>
              {resultImages.map((img, index) => (
                <li
                  key={img.src}
                  className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] ring-1 ring-white/15 ${
                    index % 2 ? "lg:translate-y-6" : ""
                  }`}
                >
                  <Cover
                    img={img}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 22vw"
                  />
                </li>
              ))}
            </ul>

            <div className="mt-10 lg:mt-12">
              <GoldLink href="/results" className="w-full sm:w-auto">
                {ACHIEVEMENTS.cta}
              </GoldLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— 7. News & Events (doc §9) ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <div>
              <SectionTitle
                eyebrow="News & Events"
                title={NEWS.h2}
                width="max-w-3xl"
              />
              <p className="mt-5 max-w-3xl text-[0.9375rem] leading-[1.8] text-text-muted">
                {rich(NEWS.body)}
              </p>
            </div>
          </Reveal>
          <ul className={`${HEAD_GAP} grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6`}>
            {newsFeed.map((item, index) => (
              <li key={item.id}>
                <Reveal delay={(index % 4) * 90} className="h-full">
                  <Link
                    href="/news"
                    className={`group flex h-full flex-col overflow-hidden ${CARD} hover:border-[#a8802f]/45`}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Cover
                        img={NEWS_IMAGES[index % NEWS_IMAGES.length]}
                        sizes="(max-width: 480px) 92vw, (max-width: 1024px) 46vw, 280px"
                        className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-pill bg-[#d99a34] bg-[image:linear-gradient(135deg,#d6a53f,#a8802f)] px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-[#001344]">
                        <Icon name="calendar" className="h-3.5 w-3.5" />
                        {item.kind}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <time
                        dateTime={item.date}
                        className="text-xs font-semibold text-[#87661f]"
                      >
                        {formatDate(item.date)}
                      </time>
                      <h3 className="mt-2 font-heading text-[1.0625rem] font-semibold leading-snug text-ink transition-colors group-hover:text-[#87661f]">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 text-[0.875rem] leading-[1.75] text-text-muted">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <GoldLink href="/news" className="w-full sm:w-auto">
              {NEWS.cta}
            </GoldLink>
          </div>
        </div>
      </section>

      {/*
        * ——— 8. Our Teachers (not in the document) ———
        * The document has no faculty section; the school asked for one here,
        * after News & Events. Every word in it is still the document's own —
        * the "Why Choose Us" line about the teachers.
        */}
      <section className={`relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-pill bg-[#faf4e8] opacity-80 blur-3xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16`}
        >
          <Reveal>
            <p className="eyebrow flex items-center gap-2.5 text-[#87661f]">
              <span
                aria-hidden="true"
                className="h-[3px] w-7 rounded-pill bg-[#a8802f]"
              />
              Our Teachers
            </p>
            {/* An h2, so this section carries a heading like every other one
                on the page — and picks up the Sora display face with it. */}
            <h2 className="mt-5 max-w-xl text-[clamp(1.25rem,1rem+0.85vw,1.9rem)] leading-[1.3]">
              {rich(facultyPromise, "font-bold text-[#154a8a]")}
            </h2>
            <Link
              href="/faculty"
              className="group/team mt-8 inline-flex items-center gap-2.5 rounded-pill border border-[#a8802f]/35 bg-surface px-5 py-2.5 text-[0.9375rem] font-bold text-[#87661f] shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-[#a8802f] hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Meet our teachers
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/team:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/team:translate-x-0"
              >
                →
              </span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            {/*
              * The staff photographs are all the same half-body pose against
              * the same wall, and they are already 3:4 — so a 3:4 frame crops
              * nothing and the face ends up a small shape in a lot of empty
              * wall. Every head sits between 31% and 55% of its frame, so a
              * square tile scaled in about the centre lands on head-and-
              * shoulders — the only part of these pictures worth showing.
              * A dropped middle column breaks the grid up, and the tail tile
              * carries the count so the link to the full team is part of the
              * picture rather than an afterthought.
              */}
            <ul className="grid grid-cols-3 gap-3 sm:gap-4 sm:pb-8">
              {facultyPortraits.slice(0, 5).map((person, index) => (
                <li
                  key={person.src}
                  className={index % 3 === 1 ? "sm:translate-y-8" : ""}
                >
                  <div className="group relative aspect-square overflow-hidden rounded-[1.25rem] bg-bg shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <Image
                      src={person.src}
                      alt={person.alt}
                      fill
                      sizes="(max-width: 640px) 40vw, (max-width: 1024px) 36vw, 20vw"
                      className="img-skeleton scale-[1.3] object-cover object-center transition-transform duration-700 group-hover:scale-[1.37] motion-reduce:transition-none motion-reduce:group-hover:scale-[1.3]"
                    />
                  </div>
                </li>
              ))}

              <li>
                <Link
                  href="/faculty"
                  className="group/more flex aspect-square flex-col items-center justify-center gap-1 rounded-[1.25rem] border border-[#a8802f]/30 bg-[#faf4e8] text-center shadow-card transition duration-300 hover:-translate-y-1 hover:border-[#a8802f] hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span className="font-heading text-[clamp(1.375rem,1.1rem+0.8vw,1.875rem)] font-semibold leading-none text-[#87661f]">
                    +{facultyPortraits.length - 5}
                  </span>
                  <span className="eyebrow mt-1 text-[0.6875rem] text-[#87661f]">
                    More
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-2 text-[#a8802f] transition-transform duration-300 group-hover/more:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover/more:translate-x-0"
                  >
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ——— 9. Latest Blogs (not in the document) — straight from Admin → Blogs ———
          Publishing or unpublishing a post revalidates this page, so the
          strip keeps itself current with no code change. Hidden entirely
          while nothing is published rather than showing an empty rail. */}
      {latestPosts.length > 0 ? (
        <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
          <div className={CONTAINER}>
            <Reveal>
              <SectionTitle eyebrow="Blog" title={BLOGS.h2} align="center" />
              <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
                {rich(BLOGS.body)}
              </p>
            </Reveal>
            {/* Flex rather than a 4-column grid: the school may have one post
                or twenty, and a grid leaves a lone card stranded against three
                empty columns. Wrapping and centring reads correctly at every
                count. */}
            <ul className={`${HEAD_GAP} flex flex-wrap justify-center gap-5 lg:gap-6`}>
              {latestPosts.map((post, index) => (
                <li
                  key={post.slug}
                  className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-1.125rem)]"
                >
                  <Reveal delay={(index % 4) * 80} className="h-full">
                    <BlogCard post={post} />
                  </Reveal>
                </li>
              ))}
            </ul>
            <div className="mt-10 text-center">
              <GoldLink href="/blog" className="w-full sm:w-auto">
                {BLOGS.cta}
              </GoldLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* ——— 10. Gallery Preview (doc §7) — photo mosaic ———
          Hidden outright when there is nothing to show, the way the blog strip
          is. It used to render regardless: heading, button, and a 500px hole
          where six photographs should have been, any time the gallery table
          came back empty. src/data/gallery.ts now keeps a six-photo floor, so
          this guard is the second line of defence rather than the first. */}
      {galleryTiles.length > 0 ? (
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Gallery" title={GALLERY.h2} align="center" />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
              {rich(GALLERY.body)}
            </p>
          </Reveal>
          <div className={`${HEAD_GAP} grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:grid-rows-[repeat(3,10rem)] lg:grid-rows-[repeat(3,12.5rem)] xl:grid-rows-[repeat(3,14rem)]`}>
            {galleryTiles.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 70}
                className={GALLERY_SPANS[index].span}
              >
                <div className="group relative h-full min-h-[9rem] overflow-hidden rounded-[1.25rem] shadow-card">
                  <Image
                    src={item.imageUrl as string}
                    alt={item.caption}
                    fill
                    sizes={
                      GALLERY_SPANS[index].wide
                        ? "(max-width: 768px) 46vw, 780px"
                        : "(max-width: 768px) 46vw, 400px"
                    }
                    className="img-skeleton object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-0 ring-[#d6a53f] transition-all duration-300 group-hover:ring-[3px]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <GoldLink href="/gallery" className="w-full sm:w-auto">
              {GALLERY.cta}
            </GoldLink>
          </div>
        </div>
      </section>
      ) : null}

      {/* ——— 11. Admission CTA (doc §10) — the enquiry form itself ———
          The document ends this section with "CTA Button: Enquire Now / Book a
          Visit". A button only moved the visitor one click further from the
          thing it asks for, so the form is printed in place — the same band
          every other page now closes with. */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={ADMISSION.h2}
        body={ADMISSION.body}
        formTitle={ADMISSION.cta}
      />

      {/* ——— 12. Testimonials (doc §8) — two quotes in view, sliding ———
          Every quote is managed in Admin → Testimonials; publishing one there
          replaces the document's seed pair on the next request. */}
      <section
        className={`relative overflow-hidden border-y border-[#a8802f]/20 bg-[#faf4e8] ${SECTION}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-1/4 h-72 w-72 rounded-pill bg-[#a8802f]/10 blur-3xl"
        />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow="Testimonials"
              title={TESTIMONIALS.h2}
              align="center"
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
              {rich(TESTIMONIALS.lede)}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <TestimonialSlider
              items={testimonials}
              className="mt-12 lg:mt-14"
            />
          </Reveal>

        </div>
      </section>

      {/* ——— 13. Location / Map (doc §11) ——— */}
      <section id="location" className={`border-b border-hairline bg-bg-alt ${SECTION}`}>
        <div
          className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-12 lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <SectionTitle eyebrow="Location" title={LOCATION.h2} />
            <p className="mt-5 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(LOCATION.body)}
            </p>
            <div className="mt-7 overflow-hidden rounded-[1.25rem] shadow-card">
              <Photo
                img={IMG.locationCampus}
                sizes="(max-width: 1024px) 92vw, 440px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-frame">
              <div className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/3]">
                <iframe
                  title="Google Map — Newton Global School, Sangteda, Babera Road, Kotputli"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    LOCATION.mapQuery,
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— 14. FAQs (doc §12) ———
          The heading spans the section rather than sitting in the left column,
          so the questions line up with the top of the photograph instead of
          starting level with the heading and leaving the image trailing. */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="FAQ" title={FAQ_H2} />
          </Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
            <Reveal className="lg:col-span-5">
              <div className="relative hidden lg:block">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 h-full w-full rounded-[1.5rem] border-2 border-[#a8802f]/45"
                />
                <div className="relative overflow-hidden rounded-[1.5rem] shadow-frame">
                  <Photo
                    img={IMG.faqLibrary}
                    sizes="440px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={110} className="lg:col-span-7">
              <Accordion items={faqEntries} defaultOpenId="faq-1" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

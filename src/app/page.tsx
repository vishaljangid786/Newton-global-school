import type { Metadata } from "next";
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
  PageHero,
  Photo,
  rich,
  SECTION,
  SectionTitle,
  STAGE_COLOURS,
  STRONG,
  TINTS,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { getUpcomingEvents } from "@/data/events";
import { getAllNotices } from "@/data/notices";
import { formatDate } from "@/lib/format";

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
  sub: ` **RBSE** Education`,
  body: `Welcome to Newton Global School, recognized as one of the **best schools in Kotputli** for quality, values-based education. As a trusted **English Medium School in Kotputli**, we are committed to building strong academic foundations and confident personalities in every child. Located in Sangteda on **Babera Road**, **Newton Global School Kotputli** proudly follows the **RBSE** curriculum with a focus on holistic learning.`,
  cta: `Apply for Admission 2026-27`,
};

/* §2 About School Section */
const ABOUT = {
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

/* §6 Achievements/Results Section */
const ACHIEVEMENTS = {
  h2: `Our Achievements - Proud Moments of the **Best School in Kotputli**`,
  body: `Every year, our students make us proud with their performance in **RBSE** board exams and various co-curricular activities. From academic toppers to sports champions, Newton Global School continues to nurture talent in every field and strengthen its position as a **top school in Kotputli**.`,
  statsLabel: `Stat Highlights:`,
  stats: [
    { value: `XX%`, label: `Pass Result in Last **RBSE** Board Exams` },
    { value: `XX+`, label: `Students Scoring Distinction` },
    { value: `XX+`, label: `Years of Educational Excellence in Kotputli` },
  ],
};

/* §7 Gallery Preview Section */
const GALLERY = {
  h2: `Glimpses of Life at Newton Global School`,
  body: `A quick look at our campus, classrooms, and everyday moments of learning and fun at **Newton Global School Kotputli**.`,
  cta: `View Full Gallery →`,
};

/* §8 Testimonials Section */
const TESTIMONIALS = {
  h2: `What Parents Say About Us`,
  lede: `Hear directly from the families who trust Newton Global School as the **best school in Sangteda** for their children's education.`,
  quotes: [
    {
      quote: `"Newton Global School has been a wonderful choice for my daughter. As a leading **English medium school in Kotputli**, the teachers are supportive and the environment feels like a second home."`,
      attribution: `- Parent, Kotputli`,
    },
    {
      quote: `"We chose this **RBSE School in Kotputli** because of its discipline and caring teachers. Our son has grown so much in confidence."`,
      attribution: `- Parent, Sangteda`,
    },
  ],
};

/* §9 News & Events Section */
const NEWS = {
  h2: `Latest News & Events at Newton Global School`,
  body: `Stay updated with admission dates, school events, and important announcements from Kotputli's **best school**.`,
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
  /* "(Google Map embed here)" — rendered as a live Google Maps embed below. */
  mapQuery: `Newton Global School, Sangteda, Babera Road, Kotputli, Rajasthan`,
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
 * Source list in public/images/home/CREDITS.md. Swap the files for the
 * school's own photos later; the keys and crops stay the same.
 */
const IMG = {
  aboutInsetBooks: {
    src: "/images/home/about-inset-books.webp",
    w: 540,
    h: 540,
    alt: "Girl in school uniform writing at her desk",
  },
  aboutMainGate: {
    src: "/images/home/about-main-gate.webp",
    w: 853,
    h: 640,
    alt: "Young pupils in school uniform outside the school",
  },
  achieveGraduate: {
    src: "/images/home/achieve-graduate.webp",
    w: 760,
    h: 570,
    alt: "Smiling graduate in a cap and gown",
  },
  achievementsBg: {
    src: "/images/home/achievements-bg.webp",
    w: 960,
    h: 540,
    alt: "School children gathered for a classroom performance",
  },
  ctaCampus: {
    src: "/images/home/campus-family-visit.webp",
    w: 1448,
    h: 1086,
    alt: "Parents with four Newton Global School pupils in uniform outside the campus",
  },
  facilityBus: {
    src: "/images/home/facility-bus.webp",
    w: 760,
    h: 570,
    alt: "Aisle and seats inside a school bus",
  },
  facilityComputerLab: {
    src: "/images/home/smart-class-session.webp",
    w: 1448,
    h: 1086,
    alt: "Children watching a lesson on the smart-class screen",
  },
  facilityGreen: {
    src: "/images/home/facility-green.webp",
    w: 760,
    h: 570,
    alt: "Children tending plants in the school garden",
  },
  facilityLibrary: {
    src: "/images/home/facility-library.webp",
    w: 760,
    h: 570,
    alt: "Classroom reading corner lined with books",
  },
  facilityMedical: {
    src: "/images/home/facility-medical.webp",
    w: 760,
    h: 570,
    alt: "Stethoscope beside a laptop on a white desk",
  },
  facilityScience: {
    src: "/images/home/science-lab-experiment.webp",
    w: 1448,
    h: 1086,
    alt: "Pupils in uniform running a water experiment in the science lab",
  },
  facilitySports: {
    src: "/images/home/facility-sports.webp",
    w: 760,
    h: 570,
    alt: "Football resting on a grass sports field with goalposts",
  },
  faqLibrary: {
    src: "/images/home/faq-library.webp",
    w: 853,
    h: 640,
    alt: "Classroom reading corner lined with books",
  },
  galleryDrawing: {
    src: "/images/home/gallery-drawing.webp",
    w: 900,
    h: 600,
    alt: "Children planting seedlings in the school garden",
  },
  galleryMusic: {
    src: "/images/home/gallery-music.webp",
    w: 900,
    h: 598,
    alt: "Students performing on stage",
  },
  galleryPaint: {
    src: "/images/home/gallery-paint.webp",
    w: 900,
    h: 618,
    alt: "Teacher working with pupils around a classroom table",
  },
  galleryPlayground: {
    src: "/images/home/assembly-activity.webp",
    w: 1448,
    h: 1086,
    alt: "Pupils in two rows taking part in a school hall activity",
  },
  galleryRunning: {
    src: "/images/home/gallery-running.webp",
    w: 900,
    h: 600,
    alt: "Pupils with backpacks walking down a school corridor",
  },
  gallerySwing: {
    src: "/images/home/gallery-swing.webp",
    w: 900,
    h: 600,
    alt: "Children playing together on a classroom mat",
  },
  heroCampus: {
    src: "/images/home/hero-campus.webp",
    w: 960,
    h: 540,
    alt: "Classroom of school children with their hands raised",
  },
  locationCampus: {
    src: "/images/home/location-campus.webp",
    w: 960,
    h: 540,
    alt: "Young pupils in school uniform outside the school",
  },
  newsAbcChalkboard: {
    src: "/images/home/news-abc-chalkboard.webp",
    w: 760,
    h: 428,
    alt: "Letters chalked on a blackboard above a stack of books",
  },
  newsBackToSchool: {
    src: "/images/home/news-back-to-school.webp",
    w: 760,
    h: 428,
    alt: "Light box sign reading Back To School",
  },
  newsNeverStopLearning: {
    src: "/images/home/news-never-stop-learning.webp",
    w: 760,
    h: 428,
    alt: "Letter tiles spelling Never Stop Learning",
  },
  newsSupplies: {
    src: "/images/home/news-supplies.webp",
    w: 760,
    h: 428,
    alt: "Notebook and coloured pencils on a bright background",
  },
  parent1: {
    src: "/images/home/parent-1.webp",
    w: 320,
    h: 320,
    alt: "Parent holding their child close, smiling",
  },
  parent2: {
    src: "/images/home/parent-2.webp",
    w: 320,
    h: 320,
    alt: "Parent with two children, all smiling",
  },
  programPreprimary: {
    src: "/images/home/preprimary-outdoor-play.webp",
    w: 1448,
    h: 1086,
    alt: "Young pupils sitting together on the school's turf play area",
  },
  programPrimary: {
    src: "/images/home/program-primary.webp",
    w: 760,
    h: 570,
    alt: "Smiling pupil in uniform waving from his desk",
  },
  programSecondary: {
    src: "/images/home/secondary-student-portrait.webp",
    w: 1448,
    h: 1086,
    alt: "Newton Global School pupil in uniform standing in the assembly line",
  },
  programSenior: {
    src: "/images/home/program-senior.webp",
    w: 760,
    h: 570,
    alt: "Senior students working on laptops in a lecture hall",
  },
  whyLibrary: {
    src: "/images/home/why-library.webp",
    w: 760,
    h: 570,
    alt: "Primary classroom with a reading corner",
  },
  whySports: {
    src: "/images/home/why-sports.webp",
    w: 760,
    h: 570,
    alt: "Athlete set in the starting blocks on a running track",
  },
  whyWriting: {
    src: "/images/home/why-writing.webp",
    w: 760,
    h: 570,
    alt: "Pupil concentrating on her writing in class",
  },
} as const;

/* ——— Derived / dynamic data ——————————————————————————————————— */

/** §4 — each programme opens its own stage page. */
const PROGRAM_LINKS = [
  "/academics/nursery",
  "/academics/primary",
  "/academics/secondary",
  "/academics/senior-secondary",
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

/** §7 — gallery mosaic tiles, paired with their placement in the grid. */
const GALLERY_TILES: Array<{ img: Img; span: string; wide?: boolean }> = [
  {
    img: IMG.galleryRunning,
    span: "md:col-start-1 md:row-start-1 md:row-span-2",
  },
  { img: IMG.galleryDrawing, span: "md:col-start-2 md:row-start-1" },
  {
    img: IMG.gallerySwing,
    span: "md:col-start-3 md:row-start-1 md:row-span-2",
  },
  { img: IMG.galleryMusic, span: "md:col-start-2 md:row-start-2" },
  {
    img: IMG.galleryPlayground,
    span: "md:col-span-2 md:col-start-1 md:row-start-3",
    wide: true,
  },
  { img: IMG.galleryPaint, span: "md:col-start-3 md:row-start-3" },
];

/** §8 — portrait beside each parent quote. */
const PARENT_IMAGES = [IMG.parent1, IMG.parent2];

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

export default function HomePage() {
  return (
    <>
      {/* ——— §1 Banner Section (Hero) — full-bleed classroom under navy ——— */}
      <PageHero
        image={IMG.heroCampus}
        priority
        h1={HERO.h1}
        sub={HERO.sub}
        body={HERO.body}
        cta={HERO.cta}
        cutout={{
          src: "/images/home/hero-student-thumbsup.png",
          w: 640,
          h: 640,
          alt: "Newton Global School pupil in uniform giving a thumbs up",
          ownBackdrop: true,
        }}
        secondaryCta={ADMISSION.cta}
        secondaryHref="/contact"
      />

      {/* ——— §2 About School Section — photo cluster with a gold offset frame ——— */}
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
          </Reveal>
        </div>
      </section>

      {/* ——— §3 Why Choose Us — a navy block, typographic ———
          Six white cards on a light band was the third grid in a row and read
          as filler. This one is a colour block with big numerals instead: no
          boxes, no icons, and the section raises its voice for the first time
          on the page. */}
      <section className="relative overflow-hidden bg-[#001344] py-16 sm:py-20 lg:py-24">
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
          <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
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
                  <p className="mt-4 text-[0.9375rem] leading-[1.85] text-[#c2cfe4]">
                    {rich(item.text, "font-bold text-white")}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— §4 Academic Programs — one photo card per stage ——— */}
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
          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
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
                        <p className="text-[0.9375rem] leading-[1.75] text-text-muted">
                          {rich(program, STRONG.runIn)}
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

      {/* ——— §5 Facilities — photo collage beside the list ———
          Twelve items in a grid read as a wall however they are styled, and
          a photo band stacked on top of them made the section heavier still.
          The photographs carry the visual weight on one side; the list stays
          quiet on the other and runs two columns so it is scanned, not read. */}
      <section
        id="facilities"
        className={`scroll-mt-24 border-y border-hairline bg-bg-alt ${SECTION}`}
      >
        <div
          className={`${CONTAINER} grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14`}
        >
          <Reveal className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {FACILITY_BAND.map((img, index) => (
                <div
                  key={img.src}
                  className={`relative aspect-square overflow-hidden rounded-[1.25rem] shadow-card ${
                    index % 2 ? "translate-y-5" : ""
                  }`}
                >
                  <Cover
                    img={img}
                    sizes="(max-width: 1024px) 46vw, 260px"
                    className="transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle eyebrow="Facilities" title={FACILITIES_H2} />
              <p className="mt-4 text-[0.9375rem] leading-[1.8] text-text-muted">
                {rich(FACILITIES_LEDE)}
              </p>
            </Reveal>
            <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {FACILITIES.map((facility, index) => {
                const tint = TINTS[index % TINTS.length];
                return (
                  <li key={facility.icon}>
                    <Reveal delay={(index % 2) * 60}>
                      <div className="flex gap-3">
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.5rem] ${tint.well}`}
                        >
                          <Icon
                            name={facility.icon}
                            className="h-[0.9rem] w-[0.9rem]"
                          />
                        </span>
                        <p className="text-[0.8125rem] leading-[1.7] text-text-muted">
                          {rich(facility.text, STRONG.runIn)}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ——— §6 Achievements — the page's loud moment ———
          The figures were 2.4rem in glass boxes in the corner of a full-height
          band, which wasted the one place the page is allowed to shout. They
          now run the width at display size, stacked over the copy. */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-[#001344] py-20 sm:py-24">
        <Cover
          img={IMG.achievementsBg}
          sizes="100vw"
          decorative
          className="opacity-[0.18]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(0,19,68,0.95),rgba(0,19,68,0.8))]"
        />
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

          <Reveal delay={120}>
            <p className="eyebrow mt-14 text-[#d6a53f]">
              {ACHIEVEMENTS.statsLabel}
            </p>
            <dl className="mt-8 grid gap-y-12 sm:grid-cols-3 sm:gap-x-10">
              {ACHIEVEMENTS.stats.map((stat, index) => (
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
          </Reveal>
        </div>
      </section>

      {/* ——— §7 Gallery Preview — photo mosaic ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="Gallery" title={GALLERY.h2} align="center" />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
              {rich(GALLERY.body)}
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:grid-rows-[repeat(3,10rem)] lg:mt-12 lg:grid-rows-[repeat(3,12.5rem)] xl:grid-rows-[repeat(3,14rem)]">
            {GALLERY_TILES.map((tile, index) => (
              <Reveal
                key={tile.img.src}
                delay={index * 70}
                className={tile.span}
              >
                <div className="group relative h-full min-h-[9rem] overflow-hidden rounded-[1.25rem] shadow-card">
                  <Cover
                    img={tile.img}
                    sizes={
                      tile.wide
                        ? "(max-width: 768px) 46vw, 780px"
                        : "(max-width: 768px) 46vw, 400px"
                    }
                    className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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

      {/* ——— §8 Testimonials — pull-quotes, not cards ———
          Two bordered cards sat in the middle of a page already full of
          cards. A parent's words carry further set large and unboxed. */}
      <section
        className={`border-y border-[#a8802f]/20 bg-[#faf4e8] ${SECTION}`}
      >
        <div className={CONTAINER}>
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
          <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-2 lg:gap-16">
            {TESTIMONIALS.quotes.map((item, index) => (
              <Reveal key={item.attribution} delay={index * 110}>
                <figure>
                  <span
                    aria-hidden="true"
                    className="block font-heading text-[3.5rem] font-bold leading-[0.6] text-[#a8802f]/35"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 text-[clamp(1.05rem,0.95rem+0.5vw,1.5rem)] font-medium leading-[1.6] text-ink">
                    {rich(item.quote, "font-bold text-[#87661f]")}
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-3.5 text-sm font-bold text-[#87661f]">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-pill ring-2 ring-[#a8802f]/35">
                      <Cover img={PARENT_IMAGES[index]} sizes="48px" />
                    </span>
                    {item.attribution}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— §9 News & Events Section ——— */}
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
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
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
        </div>
      </section>

      {/* ——— §10 Admission CTA Section — navy band over a campus photo ——— */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 text-center text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg" />
        <Cover
          img={IMG.ctaCampus}
          sizes="100vw"
          decorative
          className="opacity-[0.28]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,19,68,0.95),rgba(0,12,46,0.86))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.24),transparent_70%)]"
        />
        <Reveal className={`relative ${CONTAINER}`}>
          <span
            aria-hidden="true"
            className="mx-auto block h-[3px] w-16 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[1.55rem] leading-[1.2] text-white sm:text-[1.85rem] md:text-[2.25rem]">
            {rich(ADMISSION.h2, STRONG.headingDark)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-[#c2cfe4] md:text-base">
            {rich(ADMISSION.body, STRONG.dark)}
          </p>
          <GoldLink href="/admissions" className="mt-8 w-full sm:w-auto">
            {ADMISSION.cta}
          </GoldLink>
        </Reveal>
      </section>

      {/* ——— §11 Location/Map Section ——— */}
      <section className={`border-b border-hairline bg-bg-alt ${SECTION}`}>
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

      {/* ——— §12 FAQ Section ———
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

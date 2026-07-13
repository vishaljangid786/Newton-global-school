import type { NewsPost } from "./types";

/** News/blog posts (F13). Bodies are plain-text paragraphs. */
export const news: NewsPost[] = [
  {
    slug: "admissions-2026-open",
    title: "Admissions open for 2026-27 across all three campuses",
    date: "2026-07-09",
    branch: "all",
    excerpt:
      "Registrations for the new academic year are now open, with campus tours every Saturday and a simplified three-step online inquiry.",
    body: [
      "Newton Global School has opened admissions for the 2026-27 academic year at its City Center, Green Valley and Riverside campuses. Applications for Nursery to Grade 9 can be started online or at any campus front office.",
      "This year the process has been simplified to three steps: submit an inquiry, visit the campus for an interaction, and confirm the seat with documents. Most families complete the journey within two weeks.",
      "Guided campus tours run every Saturday from 9:00 AM to noon. Parents can meet the principal, walk through classrooms and labs, and speak with our transport and admissions teams in a single visit.",
      "Seats in Nursery, KG and Grade 1 are limited at all campuses, and siblings of current students receive priority in the first admission window closing 31 August.",
    ],
  },
  {
    slug: "riverside-swimming-medals",
    title: "Riverside swimmers bring home 7 medals from the district meet",
    date: "2026-07-02",
    branch: "riverside",
    excerpt:
      "Our youngest campus made the biggest splash at the Jaipur District Aquatics Meet, winning three golds, two silvers and two bronzes.",
    body: [
      "The Riverside Campus swim squad returned from the Jaipur District Aquatics Meet with seven medals — the best haul in the campus's short history.",
      "Aarav Khandelwal of Grade 6 won gold in both the 50m freestyle and 50m backstroke in the under-12 category, while the girls' 4x25m relay team touched first after trailing at the final turn.",
      "Coach Vikram Rathore credited the school's learn-to-swim programme, which puts every child from Grade 1 onward in the pool twice a week. Fifteen of the eighteen squad members learnt to swim at the campus pool.",
      "The medallists will be felicitated at the morning assembly on 20 July, and four swimmers now advance to the state-level meet in September.",
    ],
  },
  {
    slug: "green-valley-eco-award",
    title: "Green Valley Campus wins the District Eco-School Award",
    date: "2026-06-26",
    branch: "green-valley",
    excerpt:
      "The district administration has recognised Green Valley's kitchen garden, rainwater harvesting and zero-plastic canteen with its top green-school honour.",
    body: [
      "Green Valley Campus has been named District Eco-School of the Year by the Jaipur district administration, recognising a decade of student-led environmental work.",
      "The award citation highlighted the campus kitchen garden that supplies its own canteen, a rainwater harvesting system that meets 40 percent of campus water needs, and the transition to a fully zero-plastic canteen last year.",
      "Much of the work is run by the student Eco Club, whose 120 members maintain compost pits, lead segregation audits and mentor two neighbouring schools starting their own gardens.",
      "Principal Arun Mehta accepted the award on behalf of the students. The prize grant will fund a solar study-shed beside the sports field, chosen by a student vote.",
    ],
  },
  {
    slug: "new-robotics-lab-city-center",
    title: "New robotics and AI lab inaugurated at City Center Campus",
    date: "2026-06-10",
    branch: "city-center",
    excerpt:
      "A 1,200 sq ft lab with programmable kits, 3D printers and a mini drone arena brings hands-on robotics to Grades 4-12 from this session.",
    body: [
      "City Center Campus inaugurated its new robotics and AI laboratory on 8 June, converting the senior block's old AV room into a 1,200 square-foot maker space.",
      "The lab is equipped with 30 programmable robotics kits, two 3D printers, a laser cutter and a netted mini arena for drone flying. Sessions are built into the timetable for Grades 4-12, with an open club hour after school.",
      "The curriculum moves from block-based coding in the middle grades to Python and microcontrollers in the senior grades, ending each term with a build challenge judged by parents from the tech industry.",
      "Two teams from the campus have already registered for the National Robotics Olympiad qualifiers to be held in Delhi this November.",
    ],
  },
  {
    slug: "alumni-meet-2026",
    title: "First Newton alumni meet brings 200 graduates back to campus",
    date: "2026-05-30",
    branch: "all",
    excerpt:
      "Graduates from the classes of 2003 to 2025 returned for an evening of campus tours, teacher reunions and the launch of the Newton Alumni Network.",
    body: [
      "Nearly 200 former students walked back through the gates of City Center Campus on 24 May for the first-ever Newton alumni meet, representing every graduating batch from 2003 to 2025.",
      "The evening opened with a tour of the campus — including classrooms many alumni last saw with chalkboards — followed by a reunion tea with retired and serving teachers.",
      "The gathering also launched the Newton Alumni Network, which will run mentorship circles for current senior students, an annual careers fair and a scholarship fund that has already received its first pledges.",
      "The next meet is planned for December at Green Valley Campus, with a cricket match between alumni and staff already confirmed as the headline event.",
    ],
  },
  {
    slug: "cbse-results-2026",
    title: "Newton students shine in CBSE Class 10 and 12 results",
    date: "2026-05-14",
    branch: "all",
    excerpt:
      "A 100 percent pass rate across the group, with 46 students scoring above 95 percent and the school topper reaching 99.2 percent in the humanities stream.",
    body: [
      "Newton Global School has recorded a 100 percent pass rate in the CBSE Class 10 and Class 12 examinations for the seventh consecutive year.",
      "Across the group, 46 students scored above 95 percent aggregate. School topper Ananya Bhatnagar of City Center Campus scored 99.2 percent in the humanities stream, placing among the top scorers in Rajasthan.",
      "In Class 10, Green Valley Campus posted its best-ever results with 31 percent of the batch crossing the 90 percent mark, led by twins Ishaan and Ira Saxena at 97.8 and 97.4 percent respectively.",
      "Principals across campuses credited the results to the mentorship programme that pairs every board-year student with a faculty mentor for weekly check-ins, a practice that began in 2022.",
    ],
  },
];

/** All news posts, newest first. */
export function getAllNews(): NewsPost[] {
  return [...news].sort((a, b) => b.date.localeCompare(a.date));
}

/** Look up a single post by slug; returns undefined when not found. */
export function getNewsBySlug(slug: string): NewsPost | undefined {
  return news.find((post) => post.slug === slug);
}

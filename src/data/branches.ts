import type { Branch, BranchSlug } from "./types";

export const branches: Branch[] = [
  {
    slug: "city-center",
    name: "City Center Campus",
    area: "MG Road, Jaipur",
    address: "24 MG Road, Ashok Nagar, Jaipur, Rajasthan 302001",
    phone: "+91-141-4102010",
    email: "citycenter@sunrise-school.example",
    established: 1998,
    grades: "Nursery – Grade 12",
    principal: {
      name: "Mrs. Kavita Sharma",
      message:
        "A very warm welcome to our founding campus, where the Newton journey began in 1998. Our team believes that every child carries a spark, and our job is to give it air, light and direction. From board-exam toppers to state-level athletes, City Center students learn to work hard and stay kind. I invite you to visit us and experience a school that feels like family.",
    },
    quickFacts: {
      students: 1450,
      campusSize: "4 acres",
    },
    facilities: [
      "Central Library",
      "Physics, Chemistry & Biology Labs",
      "Computer & Robotics Lab",
      "Smart Classrooms",
      "Indoor Sports Complex",
      "800-Seat Auditorium",
      "Cafeteria",
      "Medical Room",
      "GPS-Tracked Transport Fleet",
      "CCTV-Monitored Campus",
    ],
    heroImage: "branch-city-center-hero",
    galleryCategoryKey: "city-center",
  },
  {
    slug: "green-valley",
    name: "Green Valley Campus",
    area: "Vaishali Nagar, Jaipur",
    address: "Plot 7, Green Valley Lane, Vaishali Nagar, Jaipur, Rajasthan 302021",
    phone: "+91-141-4102020",
    email: "greenvalley@sunrise-school.example",
    established: 2007,
    grades: "Nursery – Grade 10",
    principal: {
      name: "Mr. Arun Mehta",
      message:
        "Green Valley was built on a simple idea: children learn best when they have room to run, dig, build and wonder. Our six-acre green campus turns lessons into experiences, from the kitchen garden to the weather station on the terrace. We keep classes small so every teacher truly knows every child. Come walk the campus with us; the trees make a better first impression than any brochure.",
    },
    quickFacts: {
      students: 950,
      campusSize: "6 acres",
    },
    facilities: [
      "Junior & Senior Libraries",
      "Science Discovery Lab",
      "Computer Lab",
      "Kitchen Garden & Eco Club",
      "400m Athletics Track",
      "Football & Cricket Grounds",
      "Music & Dance Studios",
      "Medical Room",
      "GPS-Tracked Transport Fleet",
      "CCTV-Monitored Campus",
    ],
    heroImage: "branch-green-valley-hero",
    galleryCategoryKey: "green-valley",
  },
  {
    slug: "riverside",
    name: "Riverside Campus",
    area: "Jagatpura, Jaipur",
    address: "Survey 41, Riverside Avenue, Jagatpura, Jaipur, Rajasthan 302017",
    phone: "+91-141-4102030",
    email: "riverside@sunrise-school.example",
    established: 2015,
    grades: "Nursery – Grade 8",
    principal: {
      name: "Dr. Meera Iyer",
      message:
        "At Riverside, our youngest campus, we blend the warmth of a neighbourhood school with genuinely modern classrooms. Early readers get a phonics-rich start, and every child swims, paints and codes before Grade 5. We are growing a grade each year, and our first Grade 10 batch will graduate with us in 2028. I would love to show you what a joyful school morning looks like here.",
    },
    quickFacts: {
      students: 620,
      campusSize: "5 acres",
    },
    facilities: [
      "Children's Library & Reading Nooks",
      "STEM & Tinkering Lab",
      "Swimming Pool (Learner & Junior)",
      "Art & Pottery Studio",
      "Play Fields & Adventure Zone",
      "Sensory Garden",
      "Smart Classrooms",
      "Medical Room",
      "GPS-Tracked Transport Fleet",
      "CCTV-Monitored Campus",
    ],
    heroImage: "branch-riverside-hero",
    galleryCategoryKey: "riverside",
  },
];

/** Look up a branch by its URL slug; returns undefined for unknown slugs. */
export function getBranchBySlug(slug: string): Branch | undefined {
  return branches.find((branch) => branch.slug === slug);
}

/** True when the given string is a valid branch slug. */
export function isBranchSlug(slug: string): slug is BranchSlug {
  return branches.some((branch) => branch.slug === slug);
}

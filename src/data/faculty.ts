import type { BranchFaculty, BranchSlug } from "./types";

/**
 * Faculty directory (F6): one principal plus staff per branch.
 * Principal names match the branch records in branches.ts.
 */
const facultyByBranch: Record<BranchSlug, BranchFaculty> = {
  "city-center": {
    principal: {
      name: "Mrs. Kavita Sharma",
      designation: "Principal",
      qualification: "M.Sc. (Physics), B.Ed., 24 years in education",
      department: "Administration",
    },
    staff: [
      {
        name: "Mr. Rajiv Khanna",
        designation: "Vice Principal & Senior Coordinator",
        qualification: "M.A. (English), B.Ed.",
        department: "Administration",
      },
      {
        name: "Mrs. Sunita Agarwal",
        designation: "Head of Mathematics",
        qualification: "M.Sc. (Mathematics), B.Ed.",
        department: "Mathematics",
      },
      {
        name: "Dr. Prakash Joshi",
        designation: "PGT Chemistry",
        qualification: "Ph.D. (Chemistry), B.Ed.",
        department: "Science",
      },
      {
        name: "Ms. Ritu Malhotra",
        designation: "PGT English",
        qualification: "M.A. (English Literature), B.Ed.",
        department: "Languages",
      },
      {
        name: "Mr. Deepak Chaturvedi",
        designation: "TGT Social Science",
        qualification: "M.A. (History), B.Ed.",
        department: "Social Science",
      },
      {
        name: "Mrs. Anjali Saxena",
        designation: "Robotics & Computer Science Lead",
        qualification: "M.C.A.",
        department: "Computer Science",
      },
      {
        name: "Mr. Harish Solanki",
        designation: "Head of Physical Education",
        qualification: "M.P.Ed., NIS Certified Coach",
        department: "Sports",
      },
      {
        name: "Ms. Pooja Vyas",
        designation: "PRT & Grade 2 Coordinator",
        qualification: "B.El.Ed.",
        department: "Primary",
      },
      {
        name: "Mr. Nitin Bhargava",
        designation: "Music & Performing Arts Teacher",
        qualification: "M.A. (Music), Prayag Sangeet Samiti",
        department: "Arts",
      },
    ],
  },
  "green-valley": {
    principal: {
      name: "Mr. Arun Mehta",
      designation: "Principal",
      qualification: "M.A. (Education), M.Phil., 19 years in education",
      department: "Administration",
    },
    staff: [
      {
        name: "Mrs. Shalini Kapoor",
        designation: "Headmistress, Junior Wing",
        qualification: "M.A. (Child Development), B.Ed.",
        department: "Pre-Primary",
      },
      {
        name: "Mr. Sanjay Rawat",
        designation: "TGT Mathematics",
        qualification: "M.Sc. (Mathematics), B.Ed.",
        department: "Mathematics",
      },
      {
        name: "Ms. Farah Qureshi",
        designation: "TGT Science & Eco Club Mentor",
        qualification: "M.Sc. (Botany), B.Ed.",
        department: "Science",
      },
      {
        name: "Mrs. Nisha Tiwari",
        designation: "TGT Hindi",
        qualification: "M.A. (Hindi), B.Ed.",
        department: "Languages",
      },
      {
        name: "Mr. Alok Verma",
        designation: "TGT Social Science",
        qualification: "M.A. (Geography), B.Ed.",
        department: "Social Science",
      },
      {
        name: "Ms. Kirti Jain",
        designation: "Computer Science Teacher",
        qualification: "B.Tech. (CSE)",
        department: "Computer Science",
      },
      {
        name: "Mr. Mahendra Choudhary",
        designation: "Athletics & Cricket Coach",
        qualification: "B.P.Ed., BCCI Level-1 Coach",
        department: "Sports",
      },
      {
        name: "Mrs. Rekha Nagar",
        designation: "PRT & Reading Programme Lead",
        qualification: "B.El.Ed., Jolly Phonics Certified",
        department: "Primary",
      },
      {
        name: "Ms. Tanvi Kulkarni",
        designation: "Dance & Drama Teacher",
        qualification: "M.P.A. (Kathak)",
        department: "Arts",
      },
    ],
  },
  riverside: {
    principal: {
      name: "Dr. Meera Iyer",
      designation: "Principal",
      qualification: "Ph.D. (Early Childhood Education), M.Ed., 16 years in education",
      department: "Administration",
    },
    staff: [
      {
        name: "Mrs. Divya Menon",
        designation: "Coordinator, Early Years",
        qualification: "M.A. (ECCE), Montessori Diploma",
        department: "Pre-Primary",
      },
      {
        name: "Mr. Kunal Shekhawat",
        designation: "TGT Mathematics",
        qualification: "M.Sc. (Mathematics), B.Ed.",
        department: "Mathematics",
      },
      {
        name: "Ms. Ipsita Roy",
        designation: "Science & STEM Lab Teacher",
        qualification: "M.Sc. (Physics), B.Ed.",
        department: "Science",
      },
      {
        name: "Mrs. Lakshmi Nair",
        designation: "PRT English & Phonics Specialist",
        qualification: "M.A. (English), CELTA",
        department: "Languages",
      },
      {
        name: "Mr. Aditya Purohit",
        designation: "TGT Social Science",
        qualification: "M.A. (Political Science), B.Ed.",
        department: "Social Science",
      },
      {
        name: "Ms. Sneha Bhandari",
        designation: "Computer & Coding Teacher",
        qualification: "M.C.A.",
        department: "Computer Science",
      },
      {
        name: "Mr. Vikram Rathore",
        designation: "Swimming & PE Coach",
        qualification: "B.P.Ed., Swimming Federation Certified",
        department: "Sports",
      },
      {
        name: "Mrs. Asha Gupta",
        designation: "PRT & Grade 1 Class Teacher",
        qualification: "B.El.Ed.",
        department: "Primary",
      },
      {
        name: "Mr. Joseph D'Souza",
        designation: "Art & Pottery Teacher",
        qualification: "B.F.A. (Applied Arts)",
        department: "Arts",
      },
    ],
  },
};

/** Principal + staff directory for one branch. */
export function getFacultyForBranch(slug: BranchSlug): BranchFaculty {
  return facultyByBranch[slug];
}

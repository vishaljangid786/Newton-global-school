// Seed the initial admin users. Run after applying db/schema.sql:
//   npm run db:seed
//
// Reads DB + SEED_* settings from .env.local (via @next/env). Safe to re-run:
// existing users (matched by email) are left untouched.

import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import nextEnv from "@next/env";
import mysql from "mysql2/promise";

nextEnv.loadEnvConfig(process.cwd());

const scrypt = promisify(scryptCb);

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

async function upsertUser(conn, { email, password, name, role, branchSlug }) {
  const [existing] = await conn.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existing.length > 0) {
    console.log(`  • ${email} already exists — skipped`);
    return;
  }
  const passwordHash = await hashPassword(password);
  await conn.execute(
    `INSERT INTO users (email, password_hash, name, role, branch_slug)
     VALUES (?, ?, ?, ?, ?)`,
    [email, passwordHash, name, role, branchSlug]
  );
  console.log(`  ✓ created ${role}: ${email}  (password: ${password})`);
}

// The three founding campuses, seeded into the DB so they are fully editable
// and deletable like any other branch (INSERT IGNORE — never clobbers edits).
const BUILTIN_BRANCHES = [
  {
    slug: "city-center",
    name: "City Center Campus",
    area: "MG Road, Jaipur",
    address: "24 MG Road, Ashok Nagar, Jaipur, Rajasthan 302001",
    phone: "+91-141-4102010",
    email: "citycenter@newton-school.example",
    established: 1998,
    grades: "Nursery – Grade 12",
    principal_name: "Mrs. Kavita Sharma",
    principal_message:
      "A very warm welcome to our founding campus, where the Newton journey began in 1998. Our team believes that every child carries a spark, and our job is to give it air, light and direction. From board-exam toppers to state-level athletes, City Center students learn to work hard and stay kind. I invite you to visit us and experience a school that feels like family.",
    students: 1450,
    campus_size: "4 acres",
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
    hero_tone: "primary",
  },
  {
    slug: "green-valley",
    name: "Green Valley Campus",
    area: "Vaishali Nagar, Jaipur",
    address: "Plot 7, Green Valley Lane, Vaishali Nagar, Jaipur, Rajasthan 302021",
    phone: "+91-141-4102020",
    email: "greenvalley@newton-school.example",
    established: 2007,
    grades: "Nursery – Grade 10",
    principal_name: "Mr. Arun Mehta",
    principal_message:
      "Green Valley was built on a simple idea: children learn best when they have room to run, dig, build and wonder. Our six-acre green campus turns lessons into experiences, from the kitchen garden to the weather station on the terrace. We keep classes small so every teacher truly knows every child. Come walk the campus with us; the trees make a better first impression than any brochure.",
    students: 950,
    campus_size: "6 acres",
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
    hero_tone: "forest",
  },
  {
    slug: "riverside",
    name: "Riverside Campus",
    area: "Jagatpura, Jaipur",
    address: "Survey 41, Riverside Avenue, Jagatpura, Jaipur, Rajasthan 302017",
    phone: "+91-141-4102030",
    email: "riverside@newton-school.example",
    established: 2015,
    grades: "Nursery – Grade 8",
    principal_name: "Dr. Meera Iyer",
    principal_message:
      "At Riverside, our youngest campus, we blend the warmth of a neighbourhood school with genuinely modern classrooms. Early readers get a phonics-rich start, and every child swims, paints and codes before Grade 5. We are growing a grade each year, and our first Grade 10 batch will graduate with us in 2028. I would love to show you what a joyful school morning looks like here.",
    students: 620,
    campus_size: "5 acres",
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
    hero_tone: "dusk",
  },
];

async function seedBranches(conn) {
  console.log("Seeding built-in branches…");
  for (const b of BUILTIN_BRANCHES) {
    const [res] = await conn.execute(
      `INSERT IGNORE INTO branches
         (slug, name, area, address, phone, email, established, grades,
          principal_name, principal_message, students, campus_size, facilities,
          hero_tone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [
        b.slug,
        b.name,
        b.area,
        b.address,
        b.phone,
        b.email,
        b.established,
        b.grades,
        b.principal_name,
        b.principal_message,
        b.students,
        b.campus_size,
        JSON.stringify(b.facilities),
        b.hero_tone,
      ]
    );
    console.log(
      res.affectedRows > 0
        ? `  ✓ seeded ${b.slug}`
        : `  • ${b.slug} already present — skipped`
    );
  }
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "sunrise_school",
  });

  console.log("Seeding admin users…");

  await upsertUser(conn, {
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@sunrise-school.example",
    password: process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!",
    name: process.env.SEED_ADMIN_NAME ?? "Head Office Admin",
    role: "super_admin",
    branchSlug: null,
  });

  if (process.env.SEED_BRANCH_ADMIN_EMAIL) {
    await upsertUser(conn, {
      email: process.env.SEED_BRANCH_ADMIN_EMAIL,
      password: process.env.SEED_BRANCH_ADMIN_PASSWORD ?? "ChangeMe123!",
      name: process.env.SEED_BRANCH_ADMIN_NAME ?? "Branch Admin",
      role: "branch_admin",
      branchSlug: process.env.SEED_BRANCH_ADMIN_SLUG ?? "city-center",
    });
  }

  await seedBranches(conn);

  await conn.end();
  console.log("Done. Change these passwords after first login.");
}

main().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});

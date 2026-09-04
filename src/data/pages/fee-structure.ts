/**
 * Verbatim copy from "Newton Global School.docx" — Fee Structure tab.
 * Machine-generated from the document; `**…**` marks its bold runs.
 */
export const feeStructure = {
  hero: {
    h1: `**Fee Structure in Kotputli** - Newton Global School`,
    sub: `Transparent, Affordable Education for Every Family in Sangteda and Kotputli`,
    body: `One of the most common questions parents ask us is about **School Fees in Kotputli** and we believe in being upfront about it. At Newton Global School, our goal is to keep quality education accessible, which is why our **fee structure in Kotputli** is designed to be fair and transparent for every family in Sangteda and Kotputli.`,
    cta: `Contact Us for Fee Details`,
  },
  overview: {
    h2: `Our Approach to Fees`,
    body: [
      `We know school fees are a major factor for every family, and we don't believe in hidden charges or last-minute surprises. The **Newton Global School Fee Structure** is built around one simple principle: parents should know exactly what they're paying for.`,
      `Many families searching for **Best affordable school fees in Kotputli Rajasthan** find that our approach stands out, we review our fees each academic session to make sure they stay fair, while still allowing us to maintain the quality of teaching, infrastructure, and facilities your child deserves.`,
    ],
  },
  included: {
    h2: `What Our Fees Generally Cover`,
    lede: `While exact figures vary by class, here's a general idea of what's typically included as part of our **Fee Details for Nursery to Class 12 Kotputli**:`,
    items: [
      `**Tuition Fees** - Core academic instruction across all subjects`,
      `**Study Material Access** - Classroom resources and basic learning material`,
      `**Facility Usage** - Library, computer lab, and science lab access`,
      `**Examination Fees** - Internal assessments and term examinations`,
      `**Basic Co-Curricular Activities** - Sports and activity sessions during school hours`,
    ],
    closing: `Charges like transport, uniforms, and books are usually handled separately, and our team will explain this clearly during your **School Fee Enquiry Sangteda**.`,
  },
  byClass: {
    h2: `Fees by Class - Nursery to Senior Secondary`,
    body: [
      `Since **Fees in Sangteda** vary depending on the class and stream your child is joining, we prefer to share exact numbers directly rather than publishing a generic figure that might not apply to your child's specific situation. Our admission team can walk you through the complete **Fee Structure in Kotputli** for the class you're interested in whether that's Nursery, Primary, Secondary, or Senior Secondary.`,
      `This also means you get accurate, up-to-date figures for the current academic session, rather than outdated numbers that may have changed.`,
    ],
  },
  payment: {
    h2: `How Fee Payment Works`,
    lede: `We aim to keep the payment process simple and convenient for parents:`,
    items: [
      `**Payment Frequency** - Fees can typically be paid on a monthly, quarterly, or annual basis (our team will confirm current options)`,
      `**Payment Modes** - Cash, bank transfer, or other convenient methods accepted at the school office`,
      `**Receipts** - A proper receipt is issued for every payment made, so you always have a record`,
    ],
    closing: `If you're comparing us with other schools and searching for **School fees Kotputli**, we're happy to walk you through our full payment structure so there are no surprises later. Families near the highway often reach out to us as a **School fee structure near NH8 Kotputli**, and our team is always ready to guide them.`,
  },
  faq: {
    h2: `Frequently Asked Questions About Fees`,
    items: [
      {
        q: `Q1: What is the Newton Global School Fee Structure?`,
        a: `The **Newton Global School Fee Structure** covers tuition, access to facilities like the library and labs, and examination charges. Exact amounts vary by class our admission team can share the current figures during your enquiry.`,
      },
      {
        q: `Q2: How much does Newton Global School fee cost?`,
        a: `Since **how much does Newton Global School fee cost** depends on the class your child is joining, we recommend contacting our admission office directly for the most accurate and current figures.`,
      },
      {
        q: `Q3: Are transport and uniform charges included in the fees?`,
        a: `No, transport and uniform costs are usually handled separately from the core tuition fee. Our team will explain these additional charges clearly during your fee enquiry.`,
      },
      {
        q: `Q4: Is Newton Global School considered to have affordable fees in Kotputli?`,
        a: `Yes, we're known among local families for offering **affordable school fees in Kotputli**, without compromising on the quality of teaching and facilities.`,
      },
      {
        q: `Q5: How can I get exact fee details for my child's class?`,
        a: `Simply reach out for a **Fee enquiry Sangteda Kotputli** via call or WhatsApp, mention your child's class, and our admission team will share the complete, up-to-date fee breakdown with you.`,
      },
    ],
  },
  cta: {
    h2: `Get Your Child's Exact Fee Details Today`,
    body: `Every family's situation is a little different, and we'd rather give you accurate numbers than a generic figure. Reach out for a quick **School fees Kotputli** enquiry over a call or WhatsApp — and get complete clarity before you decide.`,
    buttons: [`Call Now`, `WhatsApp Enquiry`],
  },
  links: [
    `"Curious how to apply? See our **Admission Process →**"`,
    `"Wondering if your child is eligible? Check our **Eligibility Criteria →**"`,
    `"Explore our academic programs: **Nursery | Primary | Secondary | Senior Secondary →**"`,
  ],
} as const;

/**
 * The fee page in table form.
 *
 * `amount` is deliberately empty on every row. The document publishes no
 * figures at all — it says in as many words that the school "prefer[s] to
 * share exact numbers directly rather than publishing a generic figure" — and
 * a school's fees are something parents budget around, so inventing them here
 * would be worse than leaving the column honest. Fill each `amount` in when
 * the school approves its figures for the session; the table renders whatever
 * is written here and falls back to "Shared on enquiry" while it is blank.
 */
export const feeTable = {
  head: ["Class", "What the fee covers", "Annual fee (2026-27)"] as const,
  rows: [
    {
      cls: `Pre-Primary (Nursery to KG)`,
      covers: `Tuition, classroom material, activity sessions`,
      amount: ``,
    },
    {
      cls: `Primary (Class 1-5)`,
      covers: `Tuition, library and lab access, term examinations`,
      amount: ``,
    },
    {
      cls: `Middle & Secondary (Class 6-10)`,
      covers: `Tuition, science and computer lab access, term examinations`,
      amount: ``,
    },
    {
      cls: `Senior Secondary (Class 11-12)`,
      covers: `Tuition by stream, lab access, board practical support`,
      amount: ``,
    },
  ],
  /** Charges the document lists as handled separately from the core fee. */
  separate: {
    head: ["Charged separately", "Notes"] as const,
    rows: [
      { item: `Transport`, note: `Depends on the route and distance from campus` },
      { item: `Uniform`, note: `Purchased once at the start of the session` },
      { item: `Books & stationery`, note: `Billed at actual cost` },
    ],
  },
} as const;

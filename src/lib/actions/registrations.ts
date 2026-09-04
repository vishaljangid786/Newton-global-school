"use server";

import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { isValidBranchRef } from "@/lib/branches-store";
import { LIMITS, checkEmail, checkPhone, checkText, collect } from "@/lib/validate";

export interface RegistrationInput {
  studentName: string;
  dateOfBirth: string;
  gender: string;
  classApplied: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  previousSchool: string;
  branch: string;
  message: string;
}

const GENDERS = ["male", "female", "other"] as const;

/**
 * Public submission from the registration form. Everything is validated here
 * as well as in the browser — the client checks are for the visitor's benefit
 * and cannot be relied on.
 */
export async function submitRegistration(
  input: RegistrationInput
): Promise<void> {
  const checked = collect({
    studentName: checkText(input.studentName, {
      label: "Student's name",
      max: LIMITS.personName,
      required: true,
    }),
    classApplied: checkText(input.classApplied, {
      label: "Class applying for",
      max: LIMITS.grade,
      required: true,
    }),
    fatherName: checkText(input.fatherName, {
      label: "Father's name",
      max: LIMITS.personName,
      required: true,
    }),
    motherName: checkText(input.motherName, {
      label: "Mother's name",
      max: LIMITS.personName,
    }),
    phone: checkPhone(input.phone, { required: true }),
    email: checkEmail(input.email),
    address: checkText(input.address, { label: "Address", max: LIMITS.address }),
    previousSchool: checkText(input.previousSchool, {
      label: "Previous school",
      max: LIMITS.school,
    }),
    message: checkText(input.message, { label: "Message", max: LIMITS.message }),
    branch: checkText(input.branch, { label: "Campus", max: LIMITS.branchRef }),
    dateOfBirth: checkText(input.dateOfBirth, { label: "Date of birth", max: 10 }),
    gender: checkText(input.gender, { label: "Gender", max: 10 }),
  });
  if ("error" in checked) throw new Error(checked.error);
  const v = checked.values;

  const dob = v.dateOfBirth || null;
  const gender = v.gender ? v.gender.toLowerCase() : null;
  const branch = v.branch || "all";

  if (gender && !GENDERS.includes(gender as (typeof GENDERS)[number])) {
    throw new Error("Please select a valid option for gender.");
  }
  if (dob && Number.isNaN(Date.parse(dob))) {
    throw new Error("Please enter a valid date of birth.");
  }
  if (branch !== "all" && !(await isValidBranchRef(branch))) {
    throw new Error("Please select a valid campus.");
  }

  try {
    await mutate(
      `INSERT INTO registrations
         (student_name, date_of_birth, gender, class_applied, father_name,
          mother_name, phone, email, address, previous_school, branch_slug,
          message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        v.studentName,
        dob,
        gender,
        v.classApplied,
        v.fatherName,
        v.motherName,
        v.phone,
        v.email,
        v.address,
        v.previousSchool,
        branch,
        v.message || null,
      ]
    );
  } catch {
    throw new Error(
      "We couldn't submit your registration right now. Please try again shortly."
    );
  }

  revalidatePath("/admin/submissions");
}

/* ————————————————— Admin actions ————————————————— */

const STATUSES = ["new", "contacted", "closed"] as const;
type Status = (typeof STATUSES)[number];

export async function updateRegistrationStatus(
  id: number,
  status: string
): Promise<void> {
  await authorizeAction();
  if (!STATUSES.includes(status as Status)) {
    throw new Error("Invalid status.");
  }
  await mutate("UPDATE registrations SET status = ? WHERE id = ?", [status, id]);
  revalidatePath("/admin/submissions");
}

/**
 * Types for a job application entity, converted from the Base44 JSON schema.
 * Keep field names as in the source to minimize refactors.
 */

export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "accepted"
  | "withdrawn";

export type WorkType = "Remote" | "On-site";

export type JobType = "full-time" | "part-time" | "contract" | "freelance" | "internship";

export type Priority = "low" | "medium" | "high";

export type Location =
  | "Tel Aviv"
  | "Jerusalem"
  | "Haifa"
  | "Ramat Gan"
  | "Petah Tikva"
  | "Herzliya"
  | "Netanya"
  | "Ashdod"
  | "Ashkelon"
  | "Beer Sheva"
  | "Eilat"
  | "Rishon LeZion"
  | "Holon"
  | "Bat Yam"
  | "Rehovot"
  | "Modiin"
  | "Kfar Saba"
  | "Ra'anana"
  | "Givatayim"
  | "Other";

export interface Activity {
  /** ISO datetime string */
  date: string;
  type: string;
  description?: string;
}

export interface JobApplication {
  /** required */
  company: string;
  /** required */
  position: string;

  /** multi-selects */
  role?: string[];
  source?: string[];

  status?: ApplicationStatus;        // default: "applied"
  applied_date?: string;             // ISO date string (YYYY-MM-DD)
  location?: Location;
  work_type?: WorkType;
  job_type?: JobType;                // default: "full-time"
  salary_range?: string;
  job_url?: string;
  follow_up_date?: string;           // ISO date string (YYYY-MM-DD)
  notes?: string;
  contact_person?: string;
  contact_email?: string;
  priority?: Priority;               // default: "medium"

  activities?: Activity[];
}

/** Helper to create an empty JobApplication with schema defaults */
export function createEmptyJobApplication(
  company = "",
  position = ""
): JobApplication {
  return {
    company,
    position,
    role: [],
    source: [],
    status: "applied",
    job_type: "full-time",
    priority: "medium",
    activities: [],
  };
}

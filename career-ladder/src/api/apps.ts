/**
 * Local "API" for Job Applications using localStorage.
 * Key: "career-ladder.apps"
 */
export type JobApplication = {
  id: string;
  company: string;
  position: string;
  role?: string[];              // slugs
  source?: string[];            // slugs
  status?: "applied"|"interviewing"|"offer"|"rejected"|"accepted"|"withdrawn";
  applied_date?: string;        // yyyy-mm-dd
  location?: string;
  work_type?: "Remote" | "On-site";
  job_type?: "full-time"|"part-time"|"contract"|"freelance"|"internship";
  salary_range?: string;
  job_url?: string;
  follow_up_date?: string;      // yyyy-mm-dd
  notes?: string;
  contact_person?: string;
  contact_email?: string;
  priority?: "low"|"medium"|"high";
  created_at: string;
  updated_at: string;
};

const KEY = "career-ladder.apps";

function readAll(): JobApplication[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as JobApplication[]; } catch { return []; }
}
function writeAll(items: JobApplication[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export async function listApps(): Promise<JobApplication[]> {
  await new Promise(r => setTimeout(r, 50));
  return readAll().sort((a,b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function createApp(data: Partial<JobApplication>): Promise<JobApplication> {
  const now = new Date().toISOString();
  const item: JobApplication = {
    id: crypto.randomUUID(),
    company: data.company || "",
    position: data.position || "",
    role: data.role ?? [],
    source: data.source ?? [],
    status: (data.status as any) || "applied",
    applied_date: data.applied_date,
    location: data.location,
    work_type: data.work_type as any,
    job_type: (data.job_type as any) || "full-time",
    salary_range: data.salary_range,
    job_url: data.job_url,
    follow_up_date: data.follow_up_date,
    notes: data.notes,
    contact_person: data.contact_person,
    contact_email: data.contact_email,
    priority: (data.priority as any) || "medium",
    created_at: now,
    updated_at: now,
  };
  const all = readAll();
  all.unshift(item);
  writeAll(all);
  return item;
}

export async function updateApp(id: string, data: Partial<JobApplication>): Promise<JobApplication> {
  const all = readAll();
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) throw new Error("Not found");
  const merged = { ...all[idx], ...data, updated_at: new Date().toISOString() };
  all[idx] = merged;
  writeAll(all);
  return merged;
}

export async function deleteApp(id: string): Promise<void> {
  const all = readAll().filter(a => a.id !== id);
  writeAll(all);
}

export function seedIfEmpty() {
  const exists = readAll();
  if (exists.length) return;
  const today = new Date().toISOString().slice(0,10);
  writeAll([
    {
      id: crypto.randomUUID(),
      company: "Viber (Rakuten)",
      position: "Product Designer",
      role: ["product-designer"],
      source: ["linkedin"],
      status: "applied",
      applied_date: today,
      location: "Ramat Gan",
      work_type: "Hybrid" as any, // ignored in UI if not supported
      job_type: "full-time",
      salary_range: "—",
      job_url: "https://www.viber.com/",
      follow_up_date: today,
      notes: "Submitted general application.",
      contact_person: "HR Team",
      contact_email: "jobs@viber.com",
      priority: "high",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
}

import type { JobApplication } from "@/entities/JobApplication";

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

const mockUser = { id: "u_1", full_name: "Dekel Sharabany", email: "dekel@example.com" };

let mockApps: (JobApplication & { id: string; created_date?: string })[] = [
  { id: "a1", company: "Viber", position: "Product Designer", status: "applied", job_type: "full-time", priority: "medium" },
  { id: "a2", company: "Healthee", position: "UX/UI Designer", status: "interviewing", job_type: "full-time", priority: "high", follow_up_date: new Date(Date.now() + 86400000).toISOString().slice(0,10) },
  { id: "a3", company: "EdSpire", position: "Product Designer", status: "offer", job_type: "full-time", priority: "high" },
];

type WorkspaceOption = {
  id: string;
  label: string;
  slug: string;
  origin: "seed" | "user" | "detected";
  usage: number;
  domain?: string | null;
};

type WorkspaceSetting = {
  id: string;
  setting_key: "custom_sources" | "custom_roles" | string;
  options: WorkspaceOption[];
};

let mockSettings: WorkspaceSetting[] = [];

export const base44 = {
  auth: {
    async me() {
      return delay(mockUser);
    },
  },
  entities: {
    JobApplication: {
      async list(_order: string = "-created_date") {
        return delay([...mockApps]);
      },
      async update(id: string, data: Partial<JobApplication>) {
        mockApps = mockApps.map(a => (a.id === id ? { ...a, ...data } : a));
        return delay({ ok: true });
      },
      async delete(id: string) {
        mockApps = mockApps.filter(a => a.id !== id);
        return delay({ ok: true });
      },
      async create(data: Partial<JobApplication>) {
        const newApp: JobApplication & { id: string; created_date?: string } = {
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
          activities: data.activities ?? [],
          created_date: new Date().toISOString(),
        };
        mockApps.unshift(newApp);
        return delay(newApp);
      },
    },
    WorkspaceSettings: {
      async list() {
        return delay([...mockSettings]);
      },
      async create(data: Partial<WorkspaceSetting>) {
        const newSetting: WorkspaceSetting = {
          id: crypto.randomUUID(),
          setting_key: data.setting_key || "",
          options: data.options || [],
        };
        mockSettings.push(newSetting);
        return delay(newSetting);
      },
      async update(id: string, data: Partial<WorkspaceSetting>) {
        mockSettings = mockSettings.map(s => (s.id === id ? { ...s, ...data } : s));
        return delay({ ok: true });
      },
      async delete(id: string) {
        mockSettings = mockSettings.filter(s => s.id !== id);
        return delay({ ok: true });
      },
    },
  },
};
export default base44;

import { base44 } from "@/api/base44Client";

// Type definitions
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

// Default seeds
const SEED_SOURCES = [
  "LinkedIn",
  "Facebook",
  "Drushim IL",
  "All Jobs",
  "Indeed",
  "JobNet",
  "JobMaster",
  "Yad2 Jobs",
  "Other",
];

const SEED_ROLES = [
  "UI/UX Designer",
  "UX Designer",
  "Product Designer",
  "UI Designer",
  "Motion Designer",
  "Graphic Designer",
  "Visual Designer",
  "Interaction Designer",
  "Other",
];

// Helpers
const normalizeSlug = (text: string) => {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
};

const createOption = (
  label: string,
  origin: WorkspaceOption["origin"] = "seed",
  usage = 0,
  domain: string | null = null
): WorkspaceOption => ({
  id: crypto.randomUUID(),
  label: label.trim(),
  slug: normalizeSlug(label),
  origin,
  usage,
  domain: domain ?? null,
});

// Initialize settings (sources + roles)
export const initializeTaxonomies = async (): Promise<{
  sources: WorkspaceOption[];
  roles: WorkspaceOption[];
}> => {
  try {
    const settings: WorkspaceSetting[] = await base44.entities.WorkspaceSettings.list();

    let sourcesSettings = settings.find((s) => s.setting_key === "custom_sources");
    let rolesSettings = settings.find((s) => s.setting_key === "custom_roles");

    if (!sourcesSettings) {
      sourcesSettings = await base44.entities.WorkspaceSettings.create({
        setting_key: "custom_sources",
        options: SEED_SOURCES.map((s) => createOption(s, "seed")),
      });
    }

    if (!rolesSettings) {
      rolesSettings = await base44.entities.WorkspaceSettings.create({
        setting_key: "custom_roles",
        options: SEED_ROLES.map((r) => createOption(r, "seed")),
      });
    }

    return {
      sources: sourcesSettings.options || [],
      roles: rolesSettings.options || [],
    };
  } catch (error) {
    console.error("Error initializing taxonomies:", error);
    return {
      sources: SEED_SOURCES.map((s) => createOption(s, "seed")),
      roles: SEED_ROLES.map((r) => createOption(r, "seed")),
    };
  }
};

// Add new custom option
export const addCustomOption = async (
  settingKey: "custom_sources" | "custom_roles" | string,
  label: string,
  origin: WorkspaceOption["origin"] = "user",
  domain: string | null = null
): Promise<WorkspaceOption> => {
  const slug = normalizeSlug(label);

  const settings: WorkspaceSetting[] = await base44.entities.WorkspaceSettings.list();
  let setting = settings.find((s) => s.setting_key === settingKey);

  if (!setting) {
    setting = await base44.entities.WorkspaceSettings.create({
      setting_key: settingKey,
      options: [],
    });
  }

  const exists = setting.options.find((opt) => opt.slug === slug);
  if (exists) return exists;

  const newOption = createOption(label, origin, 0, domain);
  const updatedOptions = [...setting.options, newOption];

  await base44.entities.WorkspaceSettings.update(setting.id, {
    options: updatedOptions,
  });

  return newOption;
};

// Migrate legacy roleType field to new role[]
export const migrateLegacyRoleType = async (application: any) => {
  if (application.roleType && typeof application.roleType === "string" && !application.role) {
    const legacyValue = application.roleType;
    const slug = normalizeSlug(legacyValue);

    await addCustomOption("custom_roles", legacyValue, "user");

    return {
      ...application,
      role: [slug],
      roleType: undefined,
    };
  }

  return application;
};

// Update usage count for options
export const updateOptionUsage = async (
  settingKey: "custom_sources" | "custom_roles" | string,
  slugs: string[],
  increment = true
) => {
  const settings: WorkspaceSetting[] = await base44.entities.WorkspaceSettings.list();
  const setting = settings.find((s) => s.setting_key === settingKey);

  if (!setting) return;

  const updatedOptions = setting.options.map((opt) => {
    if (slugs.includes(opt.slug)) {
      return {
        ...opt,
        usage: Math.max(0, opt.usage + (increment ? 1 : -1)),
      };
    }
    return opt;
  });

  await base44.entities.WorkspaceSettings.update(setting.id, {
    options: updatedOptions,
  });
};

// Detect job source by URL
export const detectSourceFromURL = (url?: string | null): string | null => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");

    const domainMap: Record<string, string> = {
      "linkedin.com": "LinkedIn",
      "facebook.com": "Facebook",
      "drushim.co.il": "Drushim IL",
      "alljobs.co.il": "All Jobs",
      "indeed.com": "Indeed",
      "jobnet.co.il": "JobNet",
      "jobmaster.co.il": "JobMaster",
      "yad2.co.il": "Yad2 Jobs",
    };

    return domainMap[domain] || null;
  } catch {
    return null;
  }
};
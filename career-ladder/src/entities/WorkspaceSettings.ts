/**
 * Types for workspace settings entity, converted from the Base44 JSON schema.
 * Keep field names as in the source to minimize refactors.
 */

export type SettingKey =
  | "custom_sources"
  | "custom_roles"
  | "custom_statuses"
  | "custom_work_types"
  | string; // allow future keys

export type OptionOrigin = "seed" | "user" | "detected";

export interface WorkspaceOption {
  id?: string;
  label?: string;
  slug?: string;
  origin?: OptionOrigin;
  usage?: number;
  domain?: string;
}

export interface WorkspaceSettings {
  /** required */
  setting_key: SettingKey;
  /** optional array of options */
  options?: WorkspaceOption[];
}

/** Utility: create a settings object with an empty options array */
export function createWorkspaceSettings(
  key: SettingKey,
  options: WorkspaceOption[] = []
): WorkspaceSettings {
  return { setting_key: key, options };
}

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

import { initializeTaxonomies, addCustomOption, detectSourceFromURL, migrateLegacyRoleType } from "@/components/utils/taxonomyManager";

export default function ApplicationForm({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData = {},
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: any;
}) {
  const [formData, setFormData] = useState<any>({
    company: (initialData as any).company || "",
    position: (initialData as any).position || "",
    role: (initialData as any).role || [],
    source: (initialData as any).source || [],
    status: (initialData as any).status || "applied",
    applied_date:
      (initialData as any).applied_date || new Date().toISOString().split("T")[0],
    location: (initialData as any).location || "",
    work_type: (initialData as any).work_type || "",
    job_type: (initialData as any).job_type || "full-time",
    salary_range: (initialData as any).salary_range || "",
    job_url: (initialData as any).job_url || "",
    follow_up_date: (initialData as any).follow_up_date || "",
    notes: (initialData as any).notes || "",
    contact_person: (initialData as any).contact_person || "",
    contact_email: (initialData as any).contact_email || "",
    priority: (initialData as any).priority || "medium",
  });

  const { data: taxonomies, refetch: refetchTaxonomies } = useQuery({
    queryKey: ["taxonomies"],
    queryFn: initializeTaxonomies,
    initialData: { sources: [], roles: [] },
  });

  useEffect(() => {
    const migrateData = async () => {
      if ((initialData as any).roleType && typeof (initialData as any).roleType === "string" && !(initialData as any).role) {
        const migrated = await migrateLegacyRoleType(initialData);
        setFormData((prev: any) => ({
          ...prev,
          role: migrated.role || [],
        }));
        await refetchTaxonomies();
      }
    };
    migrateData();
  }, [initialData, refetchTaxonomies]);

  useEffect(() => {
    if (formData.job_url && formData.source.length === 0) {
      const detected = detectSourceFromURL(formData.job_url);
      if (detected) {
        const detectedOption = (taxonomies as any).sources.find((s: any) => s.label === detected);
        if (detectedOption) {
          setFormData((prev: any) => ({ ...prev, source: [detectedOption.slug] }));
        }
      }
    }
  }, [formData.job_url, (taxonomies as any)?.sources]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // legacy add handlers removed (now using native selects + inline add buttons)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange("company", (e.target as HTMLInputElement).value)}
            placeholder="e.g., Google"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleChange("position", (e.target as HTMLInputElement).value)}
            placeholder="e.g., Senior Product Designer"
            required
          />
        </div>

        {/* Role Type */}
        <div className="space-y-2">
          <Label htmlFor="role">Role Type</Label>

          {/* Multi select (native) */}
          <select
            id="role"
            multiple
            className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm focus:outline-none"
            value={formData.role}
            onChange={(e) => {
              const selected = Array.from((e.target as HTMLSelectElement).selectedOptions).map((o) => (o as HTMLOptionElement).value);
              handleChange("role", selected);
            }}
          >
            {(taxonomies as any).roles.map((opt: any) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Add custom role */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom role (e.g., UX Researcher)"
              value={formData.__newRole || ""}
              onChange={(e) => handleChange("__newRole", (e.target as HTMLInputElement).value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const label = ((formData.__newRole || "") as string).trim();
                if (!label) return;
                const newOpt = await addCustomOption("custom_roles", label, "user");
                await refetchTaxonomies();
                handleChange("__newRole", "");
                handleChange("role", Array.from(new Set([...(formData.role || []), newOpt.slug])));
              }}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Source */}
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>

          {/* Multi select (native) */}
          <select
            id="source"
            multiple
            className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm focus:outline-none"
            value={formData.source}
            onChange={(e) => {
              const selected = Array.from((e.target as HTMLSelectElement).selectedOptions).map((o) => (o as HTMLOptionElement).value);
              handleChange("source", selected);
            }}
          >
            {(taxonomies as any).sources.map((opt: any) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Add custom source */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom source (e.g., Company Careers)"
              value={formData.__newSource || ""}
              onChange={(e) => handleChange("__newSource", (e.target as HTMLInputElement).value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const label = ((formData.__newSource || "") as string).trim();
                if (!label) return;
                const domain = formData.job_url ? detectSourceFromURL(formData.job_url) : null;
                const origin: "detected" | "user" = domain ? "detected" : "user";
                const newOpt = await addCustomOption("custom_sources", label, origin, domain || null);
                await refetchTaxonomies();
                handleChange("__newSource", "");
                handleChange("source", Array.from(new Set([...(formData.source || []), newOpt.slug])));
              }}
            >
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="applied_date">Applied Date</Label>
          <Input
            id="applied_date"
            type="date"
            value={formData.applied_date}
            onChange={(e) => handleChange("applied_date", (e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Tel Aviv","Jerusalem","Haifa","Ramat Gan","Petah Tikva","Herzliya","Netanya","Ashdod","Ashkelon","Beer Sheva","Eilat","Rishon LeZion","Holon","Bat Yam","Rehovot","Modiin","Kfar Saba","Ra'anana","Givatayim","Other"
              ].map((loc) => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="work_type">Work Type</Label>
          <Select value={formData.work_type} onValueChange={(value) => handleChange("work_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="On-site">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_type">Job Type</Label>
          <Select value={formData.job_type} onValueChange={(value) => handleChange("job_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_range">Salary Range</Label>
          <Input
            id="salary_range"
            value={formData.salary_range}
            onChange={(e) => handleChange("salary_range", (e.target as HTMLInputElement).value)}
            placeholder="e.g., $120k - $150k"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="job_url">Job Posting URL</Label>
          <Input
            id="job_url"
            type="url"
            value={formData.job_url}
            onChange={(e) => handleChange("job_url", (e.target as HTMLInputElement).value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person}
            onChange={(e) => handleChange("contact_person", (e.target as HTMLInputElement).value)}
            placeholder="Recruiter or hiring manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleChange("contact_email", (e.target as HTMLInputElement).value)}
            placeholder="contact@company.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="follow_up_date">Follow-up Date</Label>
          <Input
            id="follow_up_date"
            type="date"
            value={formData.follow_up_date}
            onChange={(e) => handleChange("follow_up_date", (e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", (e.target as HTMLTextAreaElement).value)}
            placeholder="Add any relevant notes about this application..."
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
        >
          {isSubmitting ? "Saving..." : "Save Application"}
        </Button>
      </div>
    </form>
  );
}

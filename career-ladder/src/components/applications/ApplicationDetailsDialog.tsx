import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Mail,
  User,
  Edit,
  Trash2,
  Briefcase,
  Home,
  Clock,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";

import ApplicationForm from "./ApplicationForm";
import { initializeTaxonomies } from "@/components/utils/taxonomyManager";

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700 border-blue-200",
  interviewing: "bg-purple-100 text-purple-700 border-purple-200",
  offer: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-gray-100 text-gray-700 border-gray-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  withdrawn: "bg-orange-100 text-orange-700 border-orange-200",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const DataField = ({
  icon: Icon,
  label,
  value,
  href,
  isEmail,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value?: string;
  href?: string;
  isEmail?: boolean;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        {href ? (
          <a
            href={isEmail ? `mailto:${value}` : value}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            className="font-medium text-indigo-600 hover:text-indigo-700 break-words"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-gray-900 break-words">{value}</p>
        )}
      </div>
    </div>
  );
};

export default function ApplicationDetailsDialog({
  application,
  onClose,
  onUpdate,
  onDelete,
}: {
  application: any;
  onClose: () => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: taxonomies } = useQuery({
    queryKey: ["taxonomies"],
    queryFn: initializeTaxonomies,
    initialData: { sources: [], roles: [] },
  });

  const handleUpdate = (data: any) => {
    onUpdate(data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const getRoleLabels = (slugs?: string[]) => {
    if (!slugs || !Array.isArray(slugs)) return null;
    return slugs
      .map((slug) => (taxonomies as any).roles.find((r: any) => r.slug === slug)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const getSourceLabels = (slugs?: string[]) => {
    if (!slugs || !Array.isArray(slugs)) return null;
    return slugs
      .map((slug) => (taxonomies as any).sources.find((s: any) => s.slug === slug)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const hasStatusInfo =
    application.status || application.applied_date || application.follow_up_date;
  const hasRoleInfo =
    (application.role?.length ?? 0) > 0 || application.work_type || application.job_type;
  const hasCompensation = application.salary_range;
  const hasContacts = application.contact_person || application.contact_email;
  const hasLinks = application.job_url;
  const hasNotes = application.notes;
  const hasLocation = application.location;
  const hasSource = (application.source?.length ?? 0) > 0;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">{application.company}</DialogTitle>
                  <p className="text-gray-600 mt-1">{application.position}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className={statusColors[application.status] || ""}>
                      {application.status}
                    </Badge>
                    {application.priority && (
                      <Badge variant="secondary" className={priorityColors[application.priority] || ""}>
                        {application.priority} priority
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {isEditing ? (
            <div className="mt-6">
              <ApplicationForm
                initialData={application}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                {hasNotes && <TabsTrigger value="notes">Notes</TabsTrigger>}
              </TabsList>

              <TabsContent value="details" className="space-y-6 mt-6">
                {hasStatusInfo && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Status & Dates
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 pl-6">
                      {application.applied_date && (
                        <DataField
                          icon={Calendar}
                          label="Applied Date"
                          value={format(new Date(application.applied_date), "MMMM d, yyyy")}
                        />
                      )}
                      {application.follow_up_date && (
                        <DataField
                          icon={Clock}
                          label="Follow-up Date"
                          value={format(new Date(application.follow_up_date), "MMMM d, yyyy")}
                        />
                      )}
                    </div>
                  </div>
                )}

                {(hasRoleInfo || hasLocation || hasSource) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Role & Work Type
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 pl-6">
                      {(application.role?.length ?? 0) > 0 && (
                        <DataField icon={Briefcase} label="Role Type" value={getRoleLabels(application.role) || undefined} />
                      )}
                      {application.job_type && (
                        <DataField icon={Briefcase} label="Job Type" value={application.job_type} />
                      )}
                      {application.work_type && (
                        <DataField icon={Home} label="Work Type" value={application.work_type} />
                      )}
                      {application.location && (
                        <DataField icon={MapPin} label="Location" value={application.location} />
                      )}
                      {(application.source?.length ?? 0) > 0 && (
                        <DataField icon={Users} label="Source" value={getSourceLabels(application.source) || undefined} />
                      )}
                    </div>
                  </div>
                )}

                {hasCompensation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-indigo-600" />
                      Compensation
                    </h3>
                    <div className="pl-6">
                      <DataField icon={DollarSign} label="Salary Range" value={application.salary_range} />
                    </div>
                  </div>
                )}

                {hasContacts && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      Contacts
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 pl-6">
                      {application.contact_person && (
                        <DataField icon={User} label="Contact Person" value={application.contact_person} />
                      )}
                      {application.contact_email && (
                        <DataField
                          icon={Mail}
                          label="Contact Email"
                          value={application.contact_email}
                          href={application.contact_email}
                          isEmail
                        />
                      )}
                    </div>
                  </div>
                )}

                {hasLinks && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-indigo-600" />
                      Links
                    </h3>
                    <div className="pl-6">
                      <DataField
                        icon={ExternalLink}
                        label="Job Posting"
                        value={application.job_url}
                        href={application.job_url}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {hasNotes && (
                <TabsContent value="notes" className="mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application for {application.company}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export interface Company {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  description?: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  roleType: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  links?: {
    jobPosting?: string;
    companyWebsite?: string;
    linkedin?: string;
  };
  notes?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  location?: string;
  remote?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview_scheduled' | 'interviewed' | 'offer_received' | 'rejected';
  notes?: string;
  followUpDate?: string;
}

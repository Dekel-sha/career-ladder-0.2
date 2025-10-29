import { create } from 'zustand';
import type { Job, Company } from '@/entities/job';
import seedData from '@/data/seed.json';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface JobsState {
  jobs: Job[];
  companies: Company[];
  isLoading: boolean;
  error: string | null;
}

interface JobsActions {
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsByStatus: (status: Job['status']) => Job[];
  getJobsByRoleType: (roleType: string) => Job[];
  loadJobs: () => Promise<void>;
}

type JobsStore = JobsState & JobsActions;

// Generate a simple UUID-like ID
const generateId = () => {
  return 'job-' + Math.random().toString(36).substr(2, 9);
};

// Load jobs from Supabase or fallback to seed data
const loadJobsFromSource = async (): Promise<{ jobs: Job[]; companies: Company[] }> => {
  if (isSupabaseConfigured) {
    try {
      console.log('Loading data from Supabase...');
      
      // Load companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');
      
      if (companiesError) {
        console.error('Error loading companies:', companiesError);
        throw companiesError;
      }
      
      // Load jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*');
      
      if (jobsError) {
        console.error('Error loading jobs:', jobsError);
        throw jobsError;
      }
      
      return {
        jobs: (jobsData as Job[]) || [],
        companies: (companiesData as Company[]) || [],
      };
    } catch (error) {
      console.error('Failed to load from Supabase, falling back to seed data:', error);
      return {
        jobs: seedData.jobs as Job[],
        companies: seedData.companies as Company[],
      };
    }
  } else {
    console.log('Supabase not configured, using seed data...');
    return {
      jobs: seedData.jobs as Job[],
      companies: seedData.companies as Company[],
    };
  }
};

export const useJobsStore = create<JobsStore>((set, get) => ({
  // Initial state
  jobs: [],
  companies: [],
  isLoading: true,
  error: null,

  // Actions
  addJob: async (jobData) => {
    const now = new Date().toISOString();
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('jobs')
          .insert([newJob]);
        
        if (error) {
          console.error('Error adding job to Supabase:', error);
          set({ error: error.message });
          return;
        }
      } catch (error) {
        console.error('Failed to add job to Supabase:', error);
        set({ error: 'Failed to save job' });
        return;
      }
    }
    
    set((state) => ({
      jobs: [...state.jobs, newJob],
    }));
  },

  updateJob: async (id, updates) => {
    const updatedJob = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('jobs')
          .update(updatedJob)
          .eq('id', id);
        
        if (error) {
          console.error('Error updating job in Supabase:', error);
          set({ error: error.message });
          return;
        }
      } catch (error) {
        console.error('Failed to update job in Supabase:', error);
        set({ error: 'Failed to update job' });
        return;
      }
    }
    
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updatedJob } : job
      ),
    }));
  },

  deleteJob: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('jobs')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.error('Error deleting job from Supabase:', error);
          set({ error: error.message });
          return;
        }
      } catch (error) {
        console.error('Failed to delete job from Supabase:', error);
        set({ error: 'Failed to delete job' });
        return;
      }
    }
    
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    }));
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id);
  },

  getJobsByStatus: (status) => {
    return get().jobs.filter((job) => job.status === status);
  },

  getJobsByRoleType: (roleType) => {
    return get().jobs.filter((job) => job.roleType === roleType);
  },

  loadJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { jobs, companies } = await loadJobsFromSource();
      set({ jobs, companies, isLoading: false });
    } catch (error) {
      console.error('Failed to load jobs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false 
      });
    }
  },
}));

// Selector hook for easier usage
export const useJobs = () => {
  const store = useJobsStore();
  return {
    jobs: store.jobs,
    companies: store.companies,
    isLoading: store.isLoading,
    error: store.error,
    addJob: store.addJob,
    updateJob: store.updateJob,
    deleteJob: store.deleteJob,
    getJobById: store.getJobById,
    getJobsByStatus: store.getJobsByStatus,
    getJobsByRoleType: store.getJobsByRoleType,
    loadJobs: store.loadJobs,
  };
};

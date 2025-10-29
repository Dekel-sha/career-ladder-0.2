import { useEffect } from 'react';
import { useJobs } from '@/store/jobs';
import { Briefcase, Send, Calendar, Award, TrendingUp, BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { jobs, getJobsByStatus, isLoading, error, loadJobs } = useJobs();

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Calculate statistics
  const totalJobs = jobs.length;
  const appliedJobs = getJobsByStatus('applied').length;
  const interviewJobs = getJobsByStatus('interview').length;
  const offerJobs = getJobsByStatus('offer').length;
  const rejectedJobs = getJobsByStatus('rejected').length;

  // Calculate success rate
  const successRate = totalJobs > 0 ? Math.round((offerJobs / totalJobs) * 100) : 0;

  const statsCards = [
    {
      title: 'Total Jobs',
      value: totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Applied',
      value: appliedJobs,
      icon: Send,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Interviews',
      value: interviewJobs,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Offers',
      value: offerJobs,
      icon: Award,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Analytics</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground opacity-70">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Analytics</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading analytics: {error}</p>
          <button 
            onClick={loadJobs}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Analytics</h1>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-card border border-token rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-foreground opacity-70">{card.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground opacity-70">
                  {card.title === 'Offers' ? `${successRate}% success rate` : 'Active applications'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-token rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Application Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">Applied</span>
              <span className="font-medium text-foreground">{appliedJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">Interview Stage</span>
              <span className="font-medium text-foreground">{interviewJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">Offers Received</span>
              <span className="font-medium text-foreground">{offerJobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">Rejected</span>
              <span className="font-medium text-foreground">{rejectedJobs}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-token rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Success Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground opacity-70">Success Rate</span>
                <span className="font-medium text-foreground">{successRate}%</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-foreground opacity-70">Interview Rate</span>
                <span className="font-medium text-foreground">
                  {totalJobs > 0 ? Math.round((interviewJobs / totalJobs) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-surface rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalJobs > 0 ? (interviewJobs / totalJobs) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-token rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-foreground opacity-70">
                {offerJobs > 0 ? `${offerJobs} offer${offerJobs > 1 ? 's' : ''} received` : 'No offers yet'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-foreground opacity-70">
                {appliedJobs} active applications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-foreground opacity-70">
                {interviewJobs} interview{interviewJobs !== 1 ? 's' : ''} scheduled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-card border border-token rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-surface rounded-lg">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Application Trends</h2>
        </div>
        
        <div className="h-64 bg-surface rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-foreground opacity-30 mx-auto mb-4" />
            <p className="text-foreground opacity-50 font-medium">Chart Placeholder</p>
            <p className="text-sm text-foreground opacity-40 mt-2">
              Application trends and analytics will be displayed here
            </p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-sm text-foreground opacity-70">Monthly Applications</p>
            <p className="text-lg font-semibold text-foreground">Coming Soon</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-sm text-foreground opacity-70">Response Time</p>
            <p className="text-lg font-semibold text-foreground">Coming Soon</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-sm text-foreground opacity-70">Company Analysis</p>
            <p className="text-lg font-semibold text-foreground">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

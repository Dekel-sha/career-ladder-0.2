import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Monitor, Download, Upload, Database, Bot } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System Preference';
      default:
        return 'System Preference';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>
      
      <div className="space-y-8">
        {/* Theme Section */}
        <section className="bg-card border border-token rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface rounded-lg">
              {getThemeIcon()}
            </div>
            <h2 className="text-xl font-semibold text-foreground">Theme</h2>
          </div>
          <p className="text-sm text-foreground opacity-70 mb-4">
            Choose your preferred color scheme for the application.
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{getThemeLabel()}</p>
              <p className="text-sm text-foreground opacity-70">
                {theme === 'system' ? 'Follows your system preference' : `Uses ${theme} theme`}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {getThemeIcon()}
              <span>Change Theme</span>
            </button>
          </div>
        </section>

        {/* Data Section */}
        <section className="bg-card border border-token rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface rounded-lg">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Data Management</h2>
          </div>
          <p className="text-sm text-foreground opacity-70 mb-6">
            Import and export your job application data in CSV format.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Export Data</h3>
              <p className="text-sm text-foreground opacity-70">
                Download all your job applications and company data as a CSV file.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary hover:text-white transition-colors rounded-lg text-foreground">
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Import Data</h3>
              <p className="text-sm text-foreground opacity-70">
                Upload a CSV file to import job applications and company data.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary hover:text-white transition-colors rounded-lg text-foreground">
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </button>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="bg-card border border-token rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface rounded-lg">
              <Bot className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
          </div>
          <p className="text-sm text-foreground opacity-70 mb-6">
            Connect external services to enhance your job application workflow.
          </p>
          
          <div className="space-y-4">
            {/* Supabase Integration */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Supabase</h3>
                  <p className="text-sm text-foreground opacity-70">
                    Sync your data with Supabase for backup and collaboration
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Connect
              </button>
            </div>
            
            {/* Gemini Integration */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Gemini AI</h3>
                  <p className="text-sm text-foreground opacity-70">
                    Get AI-powered insights and suggestions for your applications
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Connect
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

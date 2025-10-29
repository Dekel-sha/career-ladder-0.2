import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Briefcase, Plus, BarChart3, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnimatePresence } from "framer-motion";
import FloatingAgentButton from "@/components/agent/FloatingAgentButton";
import AgentChatWindow from "@/components/agent/AgentChatWindow";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "All Applications",
    url: createPageUrl("Applications"),
    icon: Briefcase,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

const LadderIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <line x1="6" y1="3" x2="6" y2="21"></line>
    <line x1="18" y1="3" x2="18" y2="21"></line>
    <line x1="6" y1="7" x2="18" y2="7"></line>
    <line x1="6" y1="11" x2="18" y2="11"></line>
    <line x1="6" y1="15" x2="18" y2="15"></line>
    <line x1="6" y1="19" x2="18" y2="19"></line>
  </svg>
);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agentChatOpen, setAgentChatOpen] = useState(false);
  const [agentName, setAgentName] = useState(() => {
    return localStorage.getItem('agentName') || "Logic";
  });

  // Helper to convert hex to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  // Initialize theme
  useEffect(() => {
    const themeColor = localStorage.getItem('themeColor') || '#6366f1';
    const themeMode = localStorage.getItem('themeMode') || 'system'; // Changed default to 'system'
    const logoColorMatch = localStorage.getItem('logoColorMatch');
    const logoColorEnabled = logoColorMatch !== null ? JSON.parse(logoColorMatch) : true;

    // Apply theme color as CSS variable
    document.documentElement.style.setProperty('--theme-color', themeColor);
    const rgb = hexToRgb(themeColor);
    if (rgb) {
        document.documentElement.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Apply logo color
    if (logoColorEnabled) {
      document.documentElement.style.setProperty('--logo-color', themeColor);
    } else {
      // Default to primary text color if logo color match is disabled
      document.documentElement.style.setProperty('--logo-color', 'var(--color-text-primary)'); 
    }

    // Apply theme mode
    const applyTheme = (mode) => {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (mode === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    };

    applyTheme(themeMode);

    // Listen for system theme changes when in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          const activeElement = document.activeElement;
          const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
          );
          
          if (!isInputFocused) {
            e.preventDefault();
            setSidebarOpen(prev => !prev);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const SidebarContent_Component = () => (
    <>
      <div className="border-b border-custom p-6">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 min-w-[40px] min-h-[40px] bg-gradient-to-br from-[var(--theme-color)] to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 transition-colors duration-300">
              <LadderIcon className="w-6 h-6 text-white" style={{ color: 'var(--logo-color, white)' }} />
            </div>
            <div>
              <h2 className="font-bold text-primary text-lg">Career Ladder</h2>
              <p className="text-xs text-secondary">Job Tracker</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 min-w-[40px] min-h-[40px] bg-gradient-to-br from-[var(--theme-color)] to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300">
              <LadderIcon className="w-6 h-6 text-white" style={{ color: 'var(--logo-color, white)' }} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="mb-4">
            {sidebarOpen ? (
              <Link to="/add" className="block" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-gradient-to-r from-[var(--theme-color)] to-purple-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                  <Plus className="w-5 h-5" />
                  New Application
                </button>
              </Link>
            ) : (
              <div className="flex justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/add" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-10 h-10 bg-gradient-to-r from-[var(--theme-color)] to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                      </button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Add new application
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {sidebarOpen ? (
                  <Link
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 hover-theme transition-all duration-200 rounded-xl ${
                      location.pathname === item.url ? 'bg-[var(--color-accent-hover)] font-medium' : ''
                    }`}
                    style={{
                      color: location.pathname === item.url ? 'var(--theme-color)' : 'var(--color-text-secondary)'
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-center p-3 hover-theme transition-all duration-200 rounded-xl ${
                          location.pathname === item.url ? 'bg-[var(--color-accent-hover)] font-medium' : ''
                        }`}
                        style={{
                          color: location.pathname === item.url ? 'var(--theme-color)' : 'var(--color-text-secondary)'
                        }}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-custom">
          {sidebarOpen ? (
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="w-full justify-start hover-theme transition-all duration-200"
              style={{ color: 'var(--theme-color)' }}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Collapse
            </Button>
          ) : (
            <div className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                    className="w-10 h-10 p-0 hover-theme transition-all duration-200"
                    style={{ color: 'var(--theme-color)' }}
                    aria-label="Expand sidebar"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Expand sidebar
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen flex w-full bg-surface transition-colors duration-300">
        <style>{`
          :root {
            --theme-color: #6366f1; /* Tailwind purple-600 */
            --theme-color-rgb: 99, 102, 241; /* RGB values for theme-color */
            --logo-color: white; /* Default logo color (can be overridden) */

            /* Light mode base colors (RGB values for flexibility) */
            --bg-base-rgb: 249, 250, 251; /* gray-50 */
            --fg-base-rgb: 255, 255, 255; /* white */
            --text-primary-base-rgb: 17, 24, 39; /* gray-900 */
            --text-secondary-base-rgb: 107, 114, 128; /* gray-500 */
            --border-base-rgb: 229, 231, 235; /* gray-200 */
            
            /* Semantic CSS variables */
            --color-background: rgb(var(--bg-base-rgb));
            --color-card: rgb(var(--fg-base-rgb));
            --color-text-primary: rgb(var(--text-primary-base-rgb));
            --color-text-secondary: rgb(var(--text-secondary-base-rgb));
            --color-border: rgb(var(--border-base-rgb));
            --color-accent-hover: rgba(var(--theme-color-rgb), 0.1); /* 10% opacity of theme-color */
          }

          .dark {
            /* Dark mode base colors (RGB values) */
            --bg-base-rgb: 17, 24, 39; /* gray-900 */
            --fg-base-rgb: 31, 41, 55; /* gray-800 */
            --text-primary-base-rgb: 249, 250, 251; /* gray-100 */
            --text-secondary-base-rgb: 156, 163, 175; /* gray-400 */
            --border-base-rgb: 55, 65, 81; /* gray-700 */

            /* Semantic CSS variables (override for dark mode) */
            --color-background: rgb(var(--bg-base-rgb));
            --color-card: rgb(var(--fg-base-rgb));
            --color-text-primary: rgb(var(--text-primary-base-rgb));
            --color-text-secondary: rgb(var(--text-secondary-base-rgb));
            --color-border: rgb(var(--border-base-rgb));
          }

          /* Utility classes mapped to semantic CSS variables */
          .bg-surface { background-color: var(--color-background); }
          .bg-card { background-color: var(--color-card); }
          /* Specific class for header background with transparency */
          .bg-card\\/80 { 
            background-color: rgb(var(--fg-base-rgb) / 0.8);
          }
          .text-primary { color: var(--color-text-primary); }
          .text-secondary { color: var(--color-text-secondary); }
          .border-custom { border-color: var(--color-border); }
          .hover-theme:hover { background-color: var(--color-accent-hover); }
        `}</style>
        
        {/* Desktop Sidebar */}
        <aside 
          className={`hidden md:flex flex-col border-r border-custom bg-card transition-all duration-300 ${
            sidebarOpen ? 'w-[280px]' : 'w-[76px]'
          }`}
          aria-expanded={sidebarOpen}
        >
          <SidebarContent_Component />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[80vw] max-w-[320px] p-0 bg-card">
            <div className="h-full flex flex-col">
              <SidebarContent_Component />
            </div>
          </SheetContent>
        </Sheet>

        <main className="flex-1 flex flex-col">
          <header className="bg-card/80 backdrop-blur-sm border-b border-custom px-4 md:px-6 py-4 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--theme-color)] to-purple-600 rounded-lg flex items-center justify-center">
                  <LadderIcon className="w-5 h-5 text-white" style={{ color: 'var(--logo-color, white)' }} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--theme-color)] to-purple-600 bg-clip-text text-transparent">
                  Career Ladder
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>

        <FloatingAgentButton 
          isOpen={agentChatOpen}
          onClick={() => setAgentChatOpen(!agentChatOpen)}
          agentName={agentName}
        />

        <AnimatePresence>
          {agentChatOpen && (
            <AgentChatWindow 
              isOpen={agentChatOpen}
              agentName={agentName}
            />
          )}
        </AnimatePresence>

        <Toaster position="top-right" />
      </div>
    </TooltipProvider>
  );
}



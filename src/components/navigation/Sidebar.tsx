import React, { useState } from 'react';
import {
  Home,
  Info,
  BookOpen,
  Phone,
  Target,
  TrendingUp,
  PlusCircle,
  MessageCircle,
  Play,
  X,
  ChevronRight,
  Sparkles,
  Zap,
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onShowTutorial: (toolId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
  isOpen,
  onClose,
  onShowTutorial
}) => {
  const { isAuthenticated } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('tools');

  const navigationItems = [
    { id: 'new-home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'about', label: 'About Us', icon: <Info className="w-5 h-5" /> },
    { id: 'tutorials', label: 'Tutorials', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-5 h-5" /> },
  ];

  const aiTools = [
    {
      id: 'optimizer',
      label: 'Resume Optimizer',
      icon: <Target className="w-5 h-5" />,
      description: 'AI-powered resume optimization',
      requiresAuth: false
    },
    {
      id: 'score-checker',
      label: 'ATS Score Checker',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Check your resume score',
      requiresAuth: true
    },
    {
      id: 'guided-builder',
      label: 'Guided Builder',
      icon: <PlusCircle className="w-5 h-5" />,
      description: 'Build resume step-by-step',
      requiresAuth: true
    },
    {
      id: 'linkedin-generator',
      label: 'LinkedIn Messages',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Generate connection messages',
      requiresAuth: true
    }
  ];

  const handlePageChange = (pageId: string) => {
    onPageChange(pageId);
    onClose();
  };

  const handleTutorialClick = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onShowTutorial(toolId);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-dark-200 border-r border-dark-400 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:z-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-400">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://res.cloudinary.com/dlkovvlud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1751536902/a-modern-logo-design-featuring-primoboos_XhhkS8E_Q5iOwxbAXB4CqQ_HnpCsJn4S1yrhb826jmMDw_nmycqj.jpg"
                alt="PrimoBoost AI Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-gradient-neon">PrimoBoost AI</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-dark-600 hover:text-neon-400 hover:bg-dark-300 rounded-lg transition-colors min-w-touch min-h-touch"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-full overflow-y-auto pb-20">
          {/* Main Navigation */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-dark-600 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group ${
                    currentPage === item.id
                      ? 'bg-dark-300 text-neon-400 border-l-2 border-neon-400'
                      : 'text-dark-700 hover:text-neon-400 hover:bg-dark-300'
                  }`}
                >
                  <div className={`transition-colors ${
                    currentPage === item.id ? 'text-neon-400' : 'text-dark-600 group-hover:text-neon-400'
                  }`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* AI Tools Section */}
          <div className="px-6 pb-6">
            <button
              onClick={() => toggleSection('tools')}
              className="w-full flex items-center justify-between text-sm font-semibold text-dark-600 uppercase tracking-wider mb-4 hover:text-neon-400 transition-colors"
            >
              <span>AI Tools</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                expandedSection === 'tools' ? 'rotate-90' : ''
              }`} />
            </button>
            
            {expandedSection === 'tools' && (
              <div className="space-y-2">
                {aiTools.map((tool) => (
                  <div key={tool.id} className="group">
                    <button
                      onClick={() => handlePageChange(tool.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === tool.id
                          ? 'bg-gradient-to-r from-neon-400/10 to-electric-400/10 text-neon-400 border border-neon-400/30'
                          : 'text-dark-700 hover:text-neon-400 hover:bg-dark-300'
                      } ${!isAuthenticated && tool.requiresAuth ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`transition-colors ${
                          currentPage === tool.id ? 'text-neon-400' : 'text-dark-600 group-hover:text-neon-400'
                        }`}>
                          {tool.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{tool.label}</div>
                          <div className="text-xs text-dark-600 group-hover:text-dark-700">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                      
                      {/* Tutorial Button */}
                      <button
                        onClick={(e) => handleTutorialClick(tool.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-dark-600 hover:text-electric-400 hover:bg-dark-400 rounded-lg transition-all duration-200 min-w-touch min-h-touch"
                        title={`Watch ${tool.label} tutorial`}
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Section - User Status */}
          {isAuthenticated && (
            <div className="mt-auto p-6 border-t border-dark-400">
              <div className="bg-gradient-to-r from-neon-400/10 to-electric-400/10 rounded-lg p-4 border border-neon-400/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-400 to-electric-400 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-dark-100" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-dark-800">Pro User</div>
                    <div className="text-xs text-dark-600">All tools unlocked</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
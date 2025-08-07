import React, { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Star,
  Users,
  Zap,
  Award,
  Crown,
  MessageCircle,
  Check,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
// Assuming these imports exist in the user's project
// import { paymentService } from '../../services/paymentService';

// Mocking the imported functions and types for a self-contained example.
// In a real application, these would be external.
const paymentService = {
  // A mock service for payment-related functions
};

// Define the type for a feature object for clarity and type-safety
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  requiresAuth: boolean;
}

interface HomePageProps {
  onPageChange: (page: string) => void;
  isAuthenticated: boolean;
  onShowAuth: () => void;
  onShowSubscriptionPlans: () => void;
  userSubscription: any; // New prop for user's subscription status
}

export const HomePage: React.FC<HomePageProps> = ({
  onPageChange,
  isAuthenticated,
  onShowAuth,
  onShowSubscriptionPlans,
  userSubscription // Destructure new prop
}) => {
  const [showOptimizationDropdown, setShowOptimizationDropdown] = React.useState(false);
  const [showPlanDetails, setShowPlanDetails] = React.useState(false); // New state for the dropdown

  // Helper function to get plan icon based on icon string
  const getPlanIcon = (iconType: string) => {
    switch (iconType) {
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'rocket': return <Award className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  // Helper function to check if a feature is available based on subscription
  const isFeatureAvailable = (featureId: string) => {
    if (!isAuthenticated) return false; // Must be authenticated to check subscription
    if (!userSubscription) return false; // No active subscription

    switch (featureId) {
      case 'optimizer':
        return userSubscription.optimizationsTotal > userSubscription.optimizationsUsed;
      case 'score-checker':
        return userSubscription.scoreChecksTotal > userSubscription.scoreChecksUsed;
      case 'guided-builder':
        return userSubscription.guidedBuildsTotal > userSubscription.guidedBuildsUsed;
      case 'linkedin-generator':
        return userSubscription.linkedinMessagesTotal > userSubscription.linkedinMessagesUsed;
      default:
        return false;
    }
  };

  const handleFeatureClick = (feature: Feature) => {
    console.log('Feature clicked:', feature.id);
    console.log('Feature requiresAuth:', feature.requiresAuth);
    console.log('User isAuthenticated:', isAuthenticated);

    // If not authenticated, prompt to sign in first
    if (!isAuthenticated && feature.requiresAuth) {
      onShowAuth();
      return;
    }

    if (isAuthenticated) {
      console.log('User is authenticated. Navigating to page.');
      onPageChange(feature.id);
    }
    
    if (feature.id === 'optimizer') {
      onPageChange(feature.id);
    }
  };


  const features: Feature[] = [
    {
      id: 'optimizer',
      title: 'JD-Based Optimizer',
      description: 'Upload your resume and a job description to get a perfectly tailored resume.',
      icon: <Target className="w-6 h-6" />,
      requiresAuth: false
    },
    {
      id: 'score-checker',
      title: 'Resume Score Check',
      description: 'Get an instant ATS score with detailed analysis and improvement suggestions.',
      icon: <TrendingUp className="w-6 h-6" />,
      requiresAuth: true
    },
    {
      id: 'guided-builder',
      title: 'Guided Resume Builder',
      description: 'Create a professional resume from scratch with our step-by-step AI-powered builder.',
      icon: <PlusCircle className="w-6 h-6" />,
      requiresAuth: true
    },
    
    {
      id: 'linkedin-generator',
      title: 'LinkedIn Message Generator',
      description: 'Generate personalized messages for connection requests and cold outreach.',
      icon: <MessageCircle className="w-6 h-6" />,
      requiresAuth: true
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Resumes Created', icon: <FileText className="w-5 h-5" /> },
    { number: '95%', label: 'Success Rate', icon: <TrendingUp className="w-5 h-5" /> },
    { number: '4.9/5', label: 'User Rating', icon: <Star className="w-5 h-5" /> },
    { number: '24/7', label: 'AI Support', icon: <Sparkles className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-100 font-inter">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-400/5 to-electric-400/5"></div>
        <div className="relative container-responsive py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-xl mr-4">
                <img
                  src="https://res.cloudinary.com/dlkovvlud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1751536902/a-modern-logo-design-featuring-primoboos_XhhkS8E_Q5iOwxbAXB4CqQ_HnpCsJn4S1yrhb826jmMDw_nmycqj.jpg"
                  alt="PrimoBoost AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-900">
                  PrimoBoost AI
                </h1>
                <p className="text-sm sm:text-base text-dark-600">Resume Intelligence</p>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-dark-900 mb-6 leading-tight">
              Your Dream Job Starts with a
              <span className="block text-gradient-neon">
                Perfect Resume
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-dark-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              Choose your path to success. Whether you're building from scratch, optimizing for specific jobs, or just want to check your current resume score - we've got you covered.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="card-neon p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-r from-neon-400 to-electric-400 text-dark-100 p-2 sm:p-3 rounded-full glow-neon">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-dark-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-dark-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section - Now with a consolidated frame */}
      <div className="container-responsive py-12 sm:py-16 bg-dark-200">
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-4 text-center">
            Choose Your Resume Journey
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            let remainingCount: number | null = null;
            if (isAuthenticated && userSubscription) {
              switch (feature.id) {
                case 'optimizer':
                  remainingCount = userSubscription.optimizationsTotal - userSubscription.optimizationsUsed;
                  break;
                case 'score-checker':
                  remainingCount = userSubscription.scoreChecksTotal - userSubscription.scoreChecksUsed;
                  break;
                case 'guided-builder':
                  remainingCount = userSubscription.guidedBuildsTotal - userSubscription.guidedBuildsUsed;
                  break;
                case 'linkedin-generator':
                  remainingCount = userSubscription.linkedinMessagesTotal - userSubscription.linkedinMessagesUsed;
                  break;
                default:
                  remainingCount = null;
              }
            }

            return (
              <button
                key={feature.id}
                onClick={() => handleFeatureClick(feature)} // Pass the full feature object
                className={`card-hover p-6 flex flex-col items-start sm:flex-row sm:items-center justify-between transition-all duration-300 bg-gradient-to-br from-dark-300 to-dark-400 border border-dark-500 shadow-lg hover:shadow-xl group rounded-2xl hover:border-neon-400/50 ${feature.requiresAuth && !isAuthenticated ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-neon-400/20 rounded-xl p-3 group-hover:bg-neon-400 group-hover:text-dark-100 transition-all duration-300 shadow-sm flex-shrink-0 group-hover:scale-110 text-neon-400">
                    {React.cloneElement(feature.icon, { className: "w-8 h-8" })}
                  </div>
                  <div>
                    <span className="text-lg font-bold text-dark-900">{feature.title}</span>
                    <p className="text-sm text-dark-700">{feature.description}</p>
                    {isAuthenticated && userSubscription && remainingCount !== null && remainingCount > 0 && (
                      <p className="text-xs font-medium text-electric-400 mt-1">
                        {remainingCount} remaining
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className={`w-6 h-6 text-dark-600 group-hover:text-neon-400 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0 ${feature.requiresAuth && !isAuthenticated ? 'opacity-50' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimalist Plans Section */}
      {isAuthenticated && (
        <div className="bg-dark-200 py-16">
          <div className="container-responsive">
            {/* New Dropdown for User's Plan Status */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative inline-block text-left w-full">
                <button
                  onClick={() => setShowPlanDetails(!showPlanDetails)}
                  className="w-full bg-dark-300 text-dark-800 font-semibold py-3 px-6 rounded-xl flex items-center justify-between shadow-sm hover:bg-dark-400 transition-colors border border-dark-400"
                >
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 text-neon-400 mr-2" />
                    {userSubscription ? (
                      <span>
                        Optimizations Left:{' '}
                        <span className="font-bold">
                          {userSubscription.optimizationsTotal - userSubscription.optimizationsUsed}
                        </span>
                      </span>
                    ) : (
                      <span>No Active Plan. Upgrade to use all features.</span>
                    )}
                  </span>
                  {showPlanDetails ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                </button>
                {showPlanDetails && (
                  <div className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-dark-300 shadow-lg ring-1 ring-dark-400 ring-opacity-50 focus:outline-none border border-dark-400">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {userSubscription ? (
                        <>
                          <div className="block px-4 py-2 text-sm text-dark-700">
                            <p className="font-semibold text-dark-900">{userSubscription.name} Plan</p>
                            <p className="text-xs text-dark-600">Details for your current subscription.</p>
                          </div>
                          <hr className="my-1 border-dark-400" />
                          <div className="px-4 py-2 text-sm text-dark-700 space-y-1">
                            <div className="flex justify-between items-center">
                              <span>Optimizations:</span>
                              <span className="font-medium text-neon-400">{userSubscription.optimizationsTotal - userSubscription.optimizationsUsed} / {userSubscription.optimizationsTotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Score Checks:</span>
                              <span className="font-medium text-electric-400">{userSubscription.scoreChecksTotal - userSubscription.scoreChecksUsed} / {userSubscription.scoreChecksTotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Guided Builds:</span>
                              <span className="font-medium text-purple-400">{userSubscription.guidedBuildsTotal - userSubscription.guidedBuildsUsed} / {userSubscription.guidedBuildsTotal}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="block px-4 py-2 text-sm text-dark-700">
                          You currently don't have an active subscription.
                        </div>
                      )}
                      <div className="p-4 border-t border-dark-400">
                        <button
                          onClick={onShowSubscriptionPlans}
                          className="w-full btn-primary py-2"
                        >
                          {userSubscription ? 'Upgrade Plan' : 'Choose Your Plan'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            
            <div className="text-center mt-12">
              <button
                onClick={onShowSubscriptionPlans}
                className="btn-primary px-8 py-3 glow-neon"
              >
                View All Plans & Add-ons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Features Teaser */}
      <div className="bg-gradient-to-r from-dark-200 via-dark-300 to-dark-400 py-16 px-4 sm:px-0">
        <div className="container-responsive text-left">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-gradient-purple">
              Powered by Advanced AI Technology
            </h3>
            <p className="text-lg text-dark-700 mb-8">
              Our intelligent system understands ATS requirements, job market trends, and recruiter preferences to give you the competitive edge.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-neon-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-neon">
                  <Zap className="w-8 h-8 text-neon-400" />
                </div>
                <h4 className="font-semibold mb-3 text-lg text-neon-400">AI-Powered Analysis</h4>
                <p className="text-dark-700 leading-relaxed">Advanced algorithms analyze and optimize your resume</p>
              </div>
              
              <div className="text-center">
                <div className="bg-electric-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-electric">
                  <Award className="w-8 h-8 text-electric-400" />
                </div>
                <h4 className="font-semibold mb-3 text-lg text-electric-400">ATS Optimization</h4>
                <p className="text-dark-700 leading-relaxed">Ensure your resume passes all screening systems</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-purple">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="font-semibold mb-3 text-lg text-purple-400">Expert Approved</h4>
                <p className="text-dark-700 leading-relaxed">Formats trusted by recruiters worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
    </div>
  );
};
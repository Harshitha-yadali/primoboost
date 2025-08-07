// src/App.tsx
import React, { useState, useEffect } from 'react';
import { X, LogIn, LogOut, User, Wallet } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/navigation/Sidebar';
import ResumeOptimizer from './components/ResumeOptimizer';
import { HomePage } from './components/pages/HomePage';
import { GuidedResumeBuilder } from './components/GuidedResumeBuilder';
import { ResumeScoreChecker } from './components/ResumeScoreChecker';
import { LinkedInMessageGenerator } from './components/LinkedInMessageGenerator';
import { AboutUs } from './components/pages/AboutUs';
import { Contact } from './components/pages/Contact';
import { Tutorials } from './components/pages/Tutorials';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileManagement } from './components/UserProfileManagement';
import { SubscriptionPlans } from './components/payment/SubscriptionPlans';
import { paymentService } from './services/paymentService';
import { AlertModal } from './components/AlertModal'; // Import AlertModal

function App() {
  const { isAuthenticated, user, markProfilePromptSeen, isLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState('new-home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileManagement, setShowProfileManagement] = useState(false);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileViewMode, setProfileViewMode] = useState<'profile' | 'wallet'>('profile');
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialTool, setCurrentTutorialTool] = useState<string>('');

  // New state for AlertModal
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [alertActionText, setAlertActionText] = useState<string | undefined>(undefined);
  const [alertActionCallback, setAlertActionCallback] = useState<(() => void) | undefined>(undefined);
  
  // NEW state for AuthModal's initial view
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup' | 'forgot-password' | 'success' | 'postSignupPrompt'>('login');
  
  // NEW: State to track if we're in the post-signup profile flow
  const [isPostSignupProfileFlow, setIsPostSignupProfileFlow] = useState(false);

  // NEW: State for refreshing wallet balance in UserProfileManagement
  const [walletRefreshKey, setWalletRefreshKey] = useState(0);

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const logoImage = "https://res.cloudinary.com/dlkovvlud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1751536902/a-modern-logo-design-featuring-primoboos_XhhkS8E_Q5iOwxbAXB4CqQ_HnpCsJn4S1yrhb826jmMDw_nmycqj.jpg";

  const handlePageChange = (page: string) => {
    if (page === 'menu') {
      handleMobileMenuToggle();
    } else if (page === 'profile') {
      handleShowProfile();
      setShowMobileMenu(false);
    } else {
      setCurrentPage(page);
      setShowMobileMenu(false);
    }
  };

  const handleShowAuth = () => {
    console.log('handleShowAuth called in App.tsx');
    setShowAuthModal(true);
    setAuthModalInitialView('login');
    console.log('showAuthModal set to true');
    setShowMobileMenu(false);
  };

  const handleShowTutorial = (toolId: string) => {
    setCurrentTutorialTool(toolId);
    setShowTutorial(true);
    setShowMobileMenu(false);
  };

  // UPDATED: handleShowProfile now takes an optional `isPostSignup` flag
  const handleShowProfile = (mode: 'profile' | 'wallet' = 'profile', isPostSignup: boolean = false) => {
    setProfileViewMode(mode);
    setShowProfileManagement(true);
    setShowMobileMenu(false);
    setIsPostSignupProfileFlow(isPostSignup); // Set the new state
    console.log('App.tsx: handleShowProfile called. showProfileManagement set to true.');
  };

  // REMOVED handleProfileCompleted function entirely
  // const handleProfileCompleted = async () => {
  //   setShowProfileManagement(false);
  //   setCurrentPage('new-home');
  //   setSuccessMessage('Profile updated successfully!');
  //   setShowSuccessNotification(true);
  //   setTimeout(() => {
  //     setShowSuccessNotification(false);
  //     setSuccessMessage('');
  //   }, 3000);
    
  //   if (isPostSignupProfileFlow) {
  //     console.log('App.tsx: Post-signup profile flow detected. Closing AuthModal.');
  //     setShowAuthModal(false);
  //     setIsPostSignupProfileFlow(false);
  //   }
    
  //   if (user) {
  //     await markProfilePromptSeen();
  //   }
  // };

  const handleNavigateHome = () => {
    setCurrentPage('new-home');
  };

  const handleShowSubscriptionPlans = () => {
    setShowSubscriptionPlans(true);
  };

  const handleSubscriptionSuccess = async () => {
    setShowSubscriptionPlans(false);
    setSuccessMessage('Subscription activated successfully!');
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      setSuccessMessage('');
    }, 3000);
    await fetchSubscription();
    setWalletRefreshKey(prev => prev + 1); // Trigger wallet refresh
  };

  const fetchSubscription = async () => {
    if (isAuthenticated && user) {
      const sub = await paymentService.getUserSubscription(user.id);
      setUserSubscription(sub);
    } else {
      setUserSubscription(null);
    }
  };

  const refreshUserSubscription = async () => {
    if (isAuthenticated && user) {
      console.log('App.tsx: Refreshing user subscription...');
      const sub = await paymentService.getUserSubscription(user.id);
      setUserSubscription(sub);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user]);

  const handleShowAlert = (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionText?: string,
    onAction?: () => void
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertActionText(actionText);
    setAlertActionCallback(() => {
      if (onAction) onAction();
      setShowAlertModal(false);
    });
    setShowAlertModal(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('App.tsx useEffect: isAuthenticated:', isAuthenticated, 'user:', user?.id, 'hasSeenProfilePrompt:', user?.hasSeenProfilePrompt, 'isLoadingAuth:', isLoading);
    if (isLoading) {
      console.log('App.tsx useEffect: AuthContext is still loading, deferring AuthModal logic.');
      return;
    }
    if (isAuthenticated && user) {
      if (user.hasSeenProfilePrompt === undefined) {
        console.log('App.tsx useEffect: user.hasSeenProfilePrompt is undefined, waiting for full profile load.');
        return;
      }
      if (user.hasSeenProfilePrompt === false) {
        console.log('App.tsx useEffect: User authenticated and profile incomplete, opening AuthModal to prompt.');
        setAuthModalInitialView('postSignupPrompt');
        setShowAuthModal(true);
      } else {
        console.log('App.tsx useEffect: User authenticated and profile complete, ensuring AuthModal is closed.');
        setShowAuthModal(false);
        setAuthModalInitialView('login');
      }
    } else {
      console.log('App.tsx useEffect: User not authenticated, ensuring AuthModal is closed.');
      setShowAuthModal(false);
      setAuthModalInitialView('login');
    }
  }, [isAuthenticated, user, user?.hasSeenProfilePrompt, isLoading]);

  const renderCurrentPage = (isAuthenticatedProp: boolean) => {
    const homePageProps = {
      onPageChange: setCurrentPage,
      isAuthenticated: isAuthenticatedProp,
      onShowAuth: handleShowAuth,
      onShowSubscriptionPlans: handleShowSubscriptionPlans,
      userSubscription: userSubscription,
      onShowAlert: handleShowAlert
    };
    switch (currentPage) {
      case 'new-home':
        return <HomePage {...homePageProps} />;
      case 'guided-builder':
        return <GuidedResumeBuilder
          onNavigateBack={() => setCurrentPage('new-home')}
          userSubscription={userSubscription}
          onShowSubscriptionPlans={handleShowSubscriptionPlans}
          onShowAlert={handleShowAlert}
          refreshUserSubscription={refreshUserSubscription}
        />;
      case 'score-checker':
        return <ResumeScoreChecker
          onNavigateBack={() => setCurrentPage('new-home')}
          isAuthenticated={isAuthenticatedProp}
          onShowAuth={handleShowAuth}
          userSubscription={userSubscription}
          onShowSubscriptionPlans={handleShowSubscriptionPlans}
          onShowAlert={handleShowAlert}
          refreshUserSubscription={refreshUserSubscription}
        />;
      case 'optimizer':
        return (
          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <ResumeOptimizer
              isAuthenticated={isAuthenticatedProp}
              onShowAuth={handleShowAuth}
              onShowProfile={handleShowProfile}
              onNavigateBack={handleNavigateHome}
              onShowSubscriptionPlans={handleShowSubscriptionPlans}
              onShowAlert={handleShowAlert}
             userSubscription={userSubscription}
              refreshUserSubscription={refreshUserSubscription}
            />
          </main>
        );
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      case 'tutorials':
        return <Tutorials />;
      case 'linkedin-generator':
        return <LinkedInMessageGenerator
          onNavigateBack={() => setCurrentPage('new-home')}
          isAuthenticated={isAuthenticatedProp}
          onShowAuth={handleShowAuth}
          userSubscription={userSubscription}
          onShowSubscriptionPlans={handleShowSubscriptionPlans}
          onShowAlert={handleShowAlert}
          refreshUserSubscription={refreshUserSubscription}
        />;
      default:
        return <HomePage {...homePageProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 pb-safe-bottom safe-area flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onShowTutorial={handleShowTutorial}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <Header
          onMobileMenuToggle={handleMobileMenuToggle}
          showMobileMenu={showMobileMenu}
          onShowProfile={handleShowProfile}
        />

        {/* Page Content */}
        <main className="flex-1">
          {showTutorial ? (
            <Tutorials
              toolId={currentTutorialTool}
              onClose={() => setShowTutorial(false)}
              isFullPage={true}
            />
          ) : (
            renderCurrentPage(isAuthenticated)
          )}
        </main>
      </div>

      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 bg-gradient-to-r from-neon-400 to-electric-400 text-dark-100 rounded-lg shadow-lg glow-neon animate-fade-in-down">
          {successMessage}
        </div>
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthModalInitialView('login'); // Reset to default view on close
          console.log('AuthModal closed, showAuthModal set to false');
        }}
        onProfileFillRequest={() => handleShowProfile('profile', true)} // Pass true for isPostSignup
        initialView={authModalInitialView}
        onPromptDismissed={() => {
          if (user) {
            markProfilePromptSeen();
          }
          setShowAuthModal(false);
          setAuthModalInitialView('login'); // Reset to default view on dismiss
        }}
      />
      <UserProfileManagement
        isOpen={showProfileManagement}
        onClose={() => setShowProfileManagement(false)}
        viewMode={profileViewMode}
        walletRefreshKey={walletRefreshKey} // Pass walletRefreshKey
        setWalletRefreshKey={setWalletRefreshKey} // Pass setWalletRefreshKey
      />
      {showSubscriptionPlans && (
        <SubscriptionPlans
          isOpen={showSubscriptionPlans}
          onNavigateBack={() => setShowSubscriptionPlans(false)}
          onSubscriptionSuccess={handleSubscriptionSuccess}
          onShowAlert={handleShowAlert} 
        />
      )}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        actionText={alertActionText}
        onAction={alertActionCallback}
      />
    </div>
  );
}
export default App;


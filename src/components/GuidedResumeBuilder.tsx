import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  CheckCircle,
  Loader2,
  FileText,
  Eye
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { ResumeData } from '../types/resume';
import { optimizeResume } from '../services/geminiService';
import { ResumePreview } from './ResumePreview';
import { ExportButtons } from './ExportButtons';

// Interface definitions...
interface ContactDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
  cgpa: string;
  location: string;
}

interface WorkExperience {
  role: string;
  company: string;
  year: string;
  bullets: string[];
}

interface Project {
  title: string;
  bullets: string[];
}

interface FormData {
  experienceLevel: 'fresher' | 'student' | 'experienced';
  contactDetails: ContactDetails;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: { [category: string]: string[] };
  certifications: string[];
  achievements: string[];
  additionalSections: {
    includeCertifications: boolean;
    includeAchievements: boolean;
  };
}

interface GuidedResumeBuilderProps {
  onNavigateBack: () => void;
  userSubscription: any;
  onShowSubscriptionPlans: () => void;
  refreshUserSubscription: () => void;
  onShowAlert: (
    title: string,
    message: string,
    type?: 'info' | 'success' | 'warning' | 'error',
    actionText?: string,
    onAction?: () => void
  ) => void;
}

export const GuidedResumeBuilder: React.FC<GuidedResumeBuilderProps> = ({
  onNavigateBack,
  userSubscription,
  onShowSubscriptionPlans,
  refreshUserSubscription,
  onShowAlert,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    experienceLevel: 'fresher',
    contactDetails: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: '',
      linkedin: user?.linkedin || '',
      github: user?.github || ''
    },
    education: [{
      degree: '',
      school: '',
      year: '',
      cgpa: '',
      location: ''
    }],
    workExperience: [{
      role: '',
      company: '',
      year: '',
      bullets: ['']
    }],
    projects: [{
      title: '',
      bullets: ['']
    }],
    skills: {
      'Programming Languages': [''],
      'Frameworks & Libraries': [''],
      'Tools & Technologies': [''],
      'Soft Skills': ['']
    },
    certifications: [''],
    achievements: [''],
    additionalSections: {
      includeCertifications: false,
      includeAchievements: false
    }
  });

  // The 'steps' array and other state-related logic remain the same
  const steps = [
    {
      id: 'experience',
      title: 'Experience Level',
      icon: (<User className="w-5 h-5" />),
      description: 'Tell us about your professional background'
    },
    {
      id: 'contact',
      title: 'Contact Details',
      icon: (<Mail className="w-5 h-5" />),
      description: 'Your basic information and contact details'
    },
    {
      id: 'education',
      title: 'Education',
      icon: (<GraduationCap className="w-5 h-5" />),
      description: 'Your academic background and qualifications'
    },
    {
      id: 'experience-work',
      title: 'Work Experience',
      icon: (<Briefcase className="w-5 h-5" />),
      description: 'Your professional experience and internships'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: (<Code className="w-5 h-5" />),
      description: 'Your personal and academic projects'
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: (<Award className="w-5 h-5" />),
      description: 'Your technical and soft skills'
    },
    {
      id: 'additional',
      title: 'Additional Sections',
      icon: (<Plus className="w-5 h-5" />),
      description: 'Optional sections like certifications and achievements'
    },
    {
      id: 'review',
      title: 'Review & Generate',
      icon: (<CheckCircle className="w-5 h-5" />),
      description: 'Review your information and generate your resume'
    }
  ];

  // All the form update functions remain the same
  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };
  const addArrayItem = (section: keyof FormData, item: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), item]
    }));
  };
  const removeArrayItem = (section: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };
  const updateArrayItem = (section: keyof FormData, index: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).map((item, i) => i === index ? data : item)
    }));
  };
  const updateSkills = (category: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((skill, i) => i === index ? value : skill)
      }
    }));
  };
  const addSkill = (category: string) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], '']
      }
    }));
  };
  const removeSkill = (category: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };
  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return formData.experienceLevel !== '';
      case 1: return formData.contactDetails.fullName && formData.contactDetails.email;
      case 2: return formData.education.some(edu => edu.degree && edu.school);
      case 3: return true;
      case 4: return true;
      case 5: return Object.values(formData.skills).some(skillArray => skillArray.some(skill => skill.trim() !== ''));
      case 6: return true;
      case 7: return true;
      default: return true;
    }
  };

  // --- START of MODIFIED LOGIC ---
  const generateResume = async () => {
    if (!isAuthenticated || !user) {
      onShowAlert(
        'Authentication Required',
        'You must be logged in to generate a resume. Please sign in.',
        'warning',
        'Sign In'
        // Note: The onShowAlert prop's onAction needs to be a function that triggers authentication.
        // This prop is not present in the current component, but the alert message is.
      );
      return;
    }

    // Check if the user has remaining guided build credits
    if (!userSubscription || (userSubscription.guidedBuildsTotal - userSubscription.guidedBuildsUsed) <= 0) {
      onShowAlert(
        'Credits Exhausted',
        'You have no guided build credits remaining. Please upgrade your plan to continue.',
        'warning',
        'View Plans',
        onShowSubscriptionPlans
      );
      return;
    }

    setIsGenerating(true);
    try {
      // Call the paymentService to decrement the guided build count
      const useBuildResult = await paymentService.useGuidedBuild(user.id);
      if (!useBuildResult.success) {
        throw new Error(useBuildResult.error || 'Failed to use guided build credit.');
      }
      
      // After a successful decrement, call the refresh function
      refreshUserSubscription();
      onShowAlert('Success!', 'One guided build credit has been used. The build process is starting.', 'success');

      // Construct a basic resume text from form data
      const resumeText = constructResumeText(formData);

      const genericJobDescription = "We are looking for a motivated individual with strong technical skills and good communication abilities. The ideal candidate should have relevant education and experience in their field.";

      const result = await optimizeResume(
        resumeText,
        genericJobDescription,
        formData.experienceLevel,
        formData.contactDetails.fullName,
        formData.contactDetails.email,
        formData.contactDetails.phone,
        formData.contactDetails.linkedin,
        formData.contactDetails.github,
        '',
        ''
      );

      setGeneratedResume(result);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating resume:', error);
      onShowAlert('Generation Failed', 'Failed to generate resume. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };
  // --- END of MODIFIED LOGIC ---

  const constructResumeText = (data: FormData): string => {
    // This function remains the same
    let text = `Name: ${data.contactDetails.fullName}\n`;
    text += `Email: ${data.contactDetails.email}\n`;
    text += `Phone: ${data.contactDetails.phone}\n`;
    if (data.contactDetails.location) text += `Location: ${data.contactDetails.location}\n`;
    if (data.contactDetails.linkedin) text += `LinkedIn: ${data.contactDetails.linkedin}\n`;
    if (data.contactDetails.github) text += `GitHub: ${data.contactDetails.github}\n`;
    text += '\nEDUCATION:\n';
    data.education.forEach(edu => {
      if (edu.degree.trim() && edu.school.trim()) {
        text += `${edu.degree} from ${edu.school} (${edu.year})`;
        if (edu.cgpa.trim()) text += ` - CGPA: ${edu.cgpa}`;
        if (edu.location.trim()) text += ` - ${edu.location}`;
        text += '\n';
      }
    });
    if (data.workExperience.some(exp => exp.role.trim() && exp.company.trim())) {
      text += '\nWORK EXPERIENCE:\n';
      data.workExperience.forEach(exp => {
        if (exp.role.trim() && exp.company.trim()) {
          text += `${exp.role} at ${exp.company} (${exp.year})\n`;
          exp.bullets.forEach(bullet => {
            if (bullet.trim()) text += `• ${bullet}\n`;
          });
        }
      });
    }
    if (data.projects.some(proj => proj.title.trim())) {
      text += '\nPROJECTS:\n';
      data.projects.forEach(proj => {
        if (proj.title.trim()) {
          text += `${proj.title}\n`;
          proj.bullets.forEach(bullet => {
            if (bullet.trim()) text += `• ${bullet}\n`;
          });
        }
      });
    }
    text += '\nSKILLS:\n';
    Object.entries(data.skills).forEach(([category, skills]) => {
      const filteredSkills = skills.filter(skill => skill.trim() !== '');
      if (filteredSkills.length > 0) {
        text += `${category}: ${filteredSkills.join(', ')}\n`;
      }
    });
    if (data.additionalSections.includeCertifications && data.certifications.some(cert => cert.trim())) {
      text += '\nCERTIFICATIONS:\n';
      data.certifications.forEach(cert => {
        if (cert.trim()) text += `• ${cert}\n`;
      });
    }
    if (data.additionalSections.includeAchievements && data.achievements.some(ach => ach.trim())) {
      text += '\nACHIEVEMENTS:\n';
      data.achievements.forEach(ach => {
        if (ach.trim()) text += `• ${ach}\n`;
      });
    }
    return text;
  };
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      generateResume();
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // The rest of the component's JSX remains the same
  if (showPreview && generatedResume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container-responsive py-8">
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-600 mr-3" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resume Generated Successfully!</h1>
                  <p className="text-gray-600 mt-1">Your professional resume is ready for download</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  <Eye className="w-5 h-5" />
                  <span>Edit Resume</span>
                </button>
              <button
              onClick={onNavigateBack}
              className="mb-6 mt-15 bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg py-3 px-5 rounded-xl inline-flex items-center space-x-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back to Home</span>
            </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Your Generated Resume
                  </h2>
                </div>
                <ResumePreview resumeData={generatedResume} userType={formData.experienceLevel} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <ExportButtons resumeData={generatedResume} userType={formData.experienceLevel} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    // This function remains the same
    switch (currentStep) {
      case 0: return (/* JSX for step 0 */);
      case 1: return (/* JSX for step 1 */);
      case 2: return (/* JSX for step 2 */);
      case 3: return (/* JSX for step 3 */);
      case 4: return (/* JSX for step 4 */);
      case 5: return (/* JSX for step 5 */);
      case 6: return (/* JSX for step 6 */);
      default: return (/* JSX for step 7 */);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onNavigateBack}
              className="mb-6 mt-6 bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg py-3 px-5 rounded-xl inline-flex items-center space-x-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back to Home</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Resume Builder</h1>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex items-center py-4 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  index === currentStep ? 'bg-blue-100 text-blue-700' :
                  index < currentStep ? 'bg-green-100 text-green-700' :
                  'text-gray-500'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep ? 'bg-blue-500 text-white' :
                    index < currentStep ? 'bg-green-500 text-white' :
                    'bg-gray-200'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className="font-medium hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600">
                  {steps[currentStep].icon}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-8">
            {renderStepContent()}
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!canProceedToNext() || isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !canProceedToNext() || isGenerating
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : currentStep === steps.length - 1
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? 'Generate Resume' : 'Next'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
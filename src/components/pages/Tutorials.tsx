import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Award,
  Search,
  Filter,
  Calendar,
  Bell,
  X
} from 'lucide-react';

interface TutorialsProps {
  toolId?: string;
  onClose?: () => void;
  isFullPage?: boolean;
}

export const Tutorials: React.FC<TutorialsProps> = ({ toolId, onClose, isFullPage = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOverlay, setShowOverlay] = useState(!toolId); // Show overlay only if no specific tool

  // Tool-specific tutorials
  const toolTutorials = {
    'optimizer': {
      title: 'Resume Optimizer Tutorial',
      description: 'Learn how to optimize your resume for specific job descriptions',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
      duration: '8:45'
    },
    'score-checker': {
      title: 'ATS Score Checker Tutorial',
      description: 'Understand how to check and improve your resume ATS score',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
      duration: '6:30'
    },
    'guided-builder': {
      title: 'Guided Resume Builder Tutorial',
      description: 'Step-by-step guide to building a professional resume',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
      duration: '12:15'
    },
    'linkedin-generator': {
      title: 'LinkedIn Message Generator Tutorial',
      description: 'Create compelling LinkedIn messages for networking',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video
      duration: '5:20'
    }
  };

  // If showing a specific tool tutorial in full page mode
  if (isFullPage && toolId && toolTutorials[toolId as keyof typeof toolTutorials]) {
    const tutorial = toolTutorials[toolId as keyof typeof toolTutorials];
    
    return (
      <div className="fixed inset-0 bg-dark-100 z-50 flex flex-col">
        {/* Full Page Tutorial Header */}
        <div className="bg-dark-200 border-b border-dark-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-neon-400 to-electric-400 w-12 h-12 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-dark-100" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-900">{tutorial.title}</h1>
                <p className="text-dark-600">{tutorial.description}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-dark-600 hover:text-neon-400 hover:bg-dark-300 rounded-lg transition-colors min-w-touch min-h-touch"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl shadow-2xl"
                src={tutorial.videoUrl}
                title={tutorial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-dark-300 rounded-lg px-4 py-2">
                <Clock className="w-4 h-4 text-neon-400" />
                <span className="text-dark-800">{tutorial.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'All Tutorials', count: 1 },
    { id: 'getting-started', name: 'Getting Started', count: 1 }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with PrimoBoost AI',
      description: 'Learn the basics of uploading your resume and getting your first optimization.',
      duration: '5:30',
      difficulty: 'Beginner',
      category: 'getting-started',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: '12.5K',
      rating: 4.9,
      videoUrl: '#',
      isPopular: true
    }
  ];

  const guides = [
    {
      title: 'Complete Resume Optimization Guide',
      description: 'A comprehensive 50-page guide covering everything from basics to advanced techniques.',
      type: 'PDF Guide',
      pages: 50,
      downloads: '25K+',
      icon: <FileText className="w-6 h-6" />
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 relative">
      {/* Main Content with Blur Effect */}
      <div className={showOverlay ? "filter blur-sm" : ""}>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-dark-200 to-dark-300 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20 sm:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-neon-400 to-electric-400 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg glow-neon">
                <Video className="w-10 h-10 text-dark-100" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn & Master
                <span className="block text-gradient-neon">
                  Resume Optimization
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-dark-700 mb-8 leading-relaxed">
                Watch our tutorial video to learn how to create the perfect resume and land your dream job.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-neon-400/10 backdrop-blur-sm px-6 py-3 rounded-full border border-neon-400/20">
                  <span className="text-lg font-semibold text-neon-400">🎥 Video Tutorial</span>
                </div>
                <div className="bg-electric-400/10 backdrop-blur-sm px-6 py-3 rounded-full border border-electric-400/20">
                  <span className="text-lg font-semibold text-electric-400">📚 Free Resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Tutorial */}
        <div className="py-20 bg-dark-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Video Tutorial</h2>
                <p className="text-xl text-dark-700">Learn how to use PrimoBoost AI to optimize your resume</p>
              </div>

              <div className="bg-dark-300 rounded-2xl shadow-lg border border-dark-400 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <div className="w-full h-0 pb-[56.25%] relative bg-dark-400">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-neon-400/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 glow-neon">
                          <Play className="w-10 h-10 text-neon-400 ml-1" />
                        </div>
                        <p className="text-dark-700 font-medium">Click to play tutorial video</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="bg-neon-400/20 text-neon-400 px-3 py-1 rounded-full text-xs font-medium">
                        Beginner
                      </span>
                      <span className="text-dark-600 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        5:30
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-electric-400">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-dark-800 font-medium">4.9</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-dark-900 mb-3">
                    Getting Started with PrimoBoost AI
                  </h3>
                  <p className="text-dark-700 mb-6 leading-relaxed">
                    In this comprehensive tutorial, you'll learn how to upload your resume, optimize it for specific job descriptions, and export it in various formats. We'll cover all the essential features of PrimoBoost AI to help you create a resume that stands out to both ATS systems and human recruiters.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-neon-400/20 px-4 py-2 rounded-lg text-neon-400 text-sm font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      12.5K views
                    </div>
                    <div className="bg-purple-400/20 px-4 py-2 rounded-lg text-purple-400 text-sm font-medium flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Beginner friendly
                    </div>
                    <div className="bg-electric-400/20 px-4 py-2 rounded-lg text-electric-400 text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Updated for 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Resources */}
        <div className="py-20 bg-dark-300">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Free Resources</h2>
                <p className="text-xl text-dark-700">Download our comprehensive guide</p>
              </div>

              <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
                {guides.map((guide, index) => (
                  <div key={index} className="group">
                    <div className="card-neon rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-8">
                      <div className="text-center">
                        <div className="bg-gradient-to-br from-neon-400/20 to-electric-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-neon-400">
                          {guide.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-dark-900 mb-3">{guide.title}</h3>
                        <p className="text-dark-700 mb-6 leading-relaxed">{guide.description}</p>
                        
                        <div className="flex justify-center space-x-6 mb-6 text-sm text-dark-600">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{guide.pages} pages</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{guide.downloads}</span>
                          </div>
                        </div>
                        
                        <button className="w-full btn-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 glow-neon">
                          <Download className="w-5 h-5" />
                          <span>Download Free</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="py-20 bg-dark-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 mb-4">Recommended Learning Path</h2>
                <p className="text-xl text-dark-700">Follow this structured path for best results</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Start with Basics',
                    description: 'Learn how to upload your resume and understand the optimization process',
                    duration: '15 minutes',
                    icon: <Lightbulb className="w-6 h-6" />
                  },
                  {
                    step: 2,
                    title: 'Master ATS Optimization',
                    description: 'Understand how ATS systems work and optimize your resume accordingly',
                    duration: '30 minutes',
                    icon: <Target className="w-6 h-6" />
                  },
                  {
                    step: 3,
                    title: 'Advanced Techniques',
                    description: 'Learn keyword optimization, formatting, and industry-specific tips',
                    duration: '45 minutes',
                    icon: <Zap className="w-6 h-6" />
                  },
                  {
                    step: 4,
                    title: 'Practice & Perfect',
                    description: 'Apply your knowledge and create multiple optimized versions',
                    duration: '60 minutes',
                    icon: <Award className="w-6 h-6" />
                  }
                ].map((item, index) => (
                  <div key={index} className="group">
                    <div className="card-neon rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-6">
                        <div className="bg-gradient-to-r from-neon-400 to-electric-400 w-12 h-12 rounded-full flex items-center justify-center text-dark-100 font-bold text-lg flex-shrink-0">
                          {item.step}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-neon-400">
                              {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-dark-900">{item.title}</h3>
                            <span className="bg-neon-400/20 text-neon-400 px-3 py-1 rounded-full text-sm font-medium">
                              {item.duration}
                            </span>
                          </div>
                          <p className="text-dark-700">{item.description}</p>
                        </div>
                        
                        <ArrowRight className="w-6 h-6 text-dark-600 group-hover:text-neon-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-dark-300 to-dark-400 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-dark-900">Ready to Start Learning?</h2>
              <p className="text-xl text-dark-700 mb-8">
                Join thousands of professionals who have transformed their careers with our tutorials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary font-bold py-4 px-8 rounded-2xl transition-colors duration-300 glow-neon transform hover:scale-105">
                  Start Learning Now
                </button>
                <button className="btn-neon font-bold py-4 px-8 rounded-2xl transition-colors duration-300">
                  Download Free Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Soon Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-3xl shadow-2xl max-w-md w-full mx-auto text-center p-8 border border-dark-400 relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowOverlay(false)}
              className="absolute top-4 right-4 text-dark-600 hover:text-neon-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Icon */}
            <div className="bg-gradient-to-br from-neon-400/20 to-electric-400/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg glow-neon">
              <Calendar className="w-10 h-10 text-neon-400" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-4">
              Tutorials Coming Soon!
            </h2>
            
            {/* Description */}
            <p className="text-dark-700 mb-6 leading-relaxed">
              We're working hard to create comprehensive video tutorials for you. Our team is preparing high-quality content to help you master resume optimization.
            </p>
            
            {/* Features List */}
            <div className="bg-gradient-to-r from-neon-400/10 to-electric-400/10 rounded-2xl p-4 mb-6 border border-neon-400/20">
              <div className="text-left space-y-2">
                <div className="flex items-center text-sm text-dark-700">
                  <CheckCircle className="w-4 h-4 text-neon-400 mr-2 flex-shrink-0" />
                  <span>Step-by-step video guides</span>
                </div>
                <div className="flex items-center text-sm text-dark-700">
                  <CheckCircle className="w-4 h-4 text-neon-400 mr-2 flex-shrink-0" />
                  <span>ATS optimization techniques</span>
                </div>
                <div className="flex items-center text-sm text-dark-700">
                  <CheckCircle className="w-4 h-4 text-neon-400 mr-2 flex-shrink-0" />
                  <span>Industry-specific tips</span>
                </div>
                <div className="flex items-center text-sm text-dark-700">
                  <CheckCircle className="w-4 h-4 text-neon-400 mr-2 flex-shrink-0" />
                  <span>Real-world examples</span>
                </div>
              </div>
            </div>
            
            {/* Notification Button */}
            <button className="w-full btn-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 glow-neon transform hover:scale-105 mb-4">
              <Bell className="w-5 h-5" />
              <span>Notify Me When Ready</span>
            </button>
            
            {/* Timeline */}
            <div className="text-sm text-dark-600">
              <span className="font-medium">Expected Launch:</span> Coming Soon
            </div>
            
            {/* Close hint */}
            <div className="mt-6 pt-4 border-t border-dark-400">
              <p className="text-xs text-dark-600">
                Click the X or outside this box to explore other features
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
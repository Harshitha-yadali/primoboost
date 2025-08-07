// src/components/pages/PricingPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  Star,
  Zap,
  Crown,
  Clock,
  ArrowLeft,
  Tag,
  Sparkles,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  Timer,
  Target,
  Rocket,
  Briefcase,
  Infinity,
  CheckCircle,
  AlertCircle,
  Wrench,
  Gift,
  Plus,
} from 'lucide-react';
import { SubscriptionPlan } from '../../types/payment';
import { paymentService } from '../../services/paymentService';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface PricingPageProps {
  onNavigateBack: () => void;
  onSubscriptionSuccess: () => void;
  onShowAlert: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', actionText?: string, onAction?: () => void) => void;
}

type AddOn = {
  id: string;
  name: string;
  price: number;
};

type AppliedCoupon = {
  code: string;
  discount: number; // In paise
  finalAmount: number; // In paise
};

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigateBack,
  onSubscriptionSuccess,
  onShowAlert,
}) => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('career_boost_plus');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(2);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [useWalletBalance, setUseWalletBalance] = useState<boolean>(false);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(true);
  const [showAddOns, setShowAddOns] = useState<boolean>(false);
  const [selectedAddOns, setSelectedAddOns] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState<'plans' | 'payment'>('plans');
  const carouselRef = useRef<HTMLDivElement>(null);

  const plans: SubscriptionPlan[] = paymentService.getPlans();
  const addOns: AddOn[] = paymentService.getAddOns();

  const allPlansWithAddOnOption = [
    ...plans,
    {
      id: 'addon_only_purchase',
      name: '🛒 Add-ons Only',
      price: 0,
      duration: 'One-time Purchase',
      optimizations: 0,
      scoreChecks: 0,
      linkedinMessages: 0,
      guidedBuilds: 0,
      tag: 'Buy individual features',
      tagColor: 'text-gray-800 bg-gray-100',
      gradient: 'from-gray-500 to-gray-700',
      icon: 'gift',
      features: [
        '✅ Purchase only what you need',
        '✅ No monthly commitment',
        '✅ Credits never expire',
        '✅ Mix and match features'
      ],
      popular: false
    },
  ];

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user) return;
    setLoadingWallet(true);
    try {
      const { data: transactions, error } = await supabase
        .from('wallet_transactions')
        .select('amount, status')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching wallet balance:', error);
        return;
      }
      const completed = (transactions || []).filter((t: any) => t.status === 'completed');
      const balance = completed.reduce((sum: number, tr: any) => sum + parseFloat(tr.amount), 0) * 100;
      setWalletBalance(Math.max(0, balance));
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const getPlanIcon = (iconType: string) => {
    switch (iconType) {
      case 'crown':
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'zap':
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'rocket':
        return <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'target':
        return <Target className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'check_circle':
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'gift':
        return <Gift className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'infinity':
        return <Infinity className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Star className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allPlansWithAddOnOption.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allPlansWithAddOnOption.length) % allPlansWithAddOnOption.length);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    const result = await paymentService.applyCoupon(selectedPlan, couponCode.trim(), user?.id || null);
    if (result.couponApplied) {
      setAppliedCoupon({
        code: result.couponApplied,
        discount: result.discountAmount,
        finalAmount: result.finalAmount,
      });
      setCouponError('');
      onShowAlert('Coupon Applied!', `Coupon "${result.couponApplied}" applied successfully. You saved ₹${(result.discount / 100).toFixed(2)}!`, 'success');
    } else {
      setCouponError(result.error || 'Invalid coupon code or not applicable to selected plan');
      setAppliedCoupon(null);
      onShowAlert('Coupon Error', result.error || 'Invalid coupon code or not applicable to selected plan', 'warning');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const selectedPlanData = allPlansWithAddOnOption.find((p) => p.id === selectedPlan);

  const addOnsTotal = Object.entries(selectedAddOns).reduce((total, [addOnId, qty]) => {
    const addOn = paymentService.getAddOnById(addOnId);
    return total + (addOn ? addOn.price * 100 * qty : 0);
  }, 0);

  let planPrice = (selectedPlanData?.price || 0) * 100;
  if (appliedCoupon) {
    planPrice = appliedCoupon.finalAmount;
  }

  const walletDeduction = useWalletBalance ? Math.min(walletBalance, planPrice) : 0;
  const finalPlanPrice = Math.max(0, planPrice - walletDeduction);
  const grandTotal = finalPlanPrice + addOnsTotal;

  const handlePayment = async () => {
    if (!user || !selectedPlanData) return;
    setIsProcessing(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session || !session.access_token) {
        console.error('No active session found for payment:', sessionError);
        onShowAlert('Authentication Required', 'Please log in to complete your purchase.', 'error');
        setIsProcessing(false);
        return;
      }

      const accessToken = session.access_token;

      if (grandTotal === 0) {
        const result = await paymentService.processFreeSubscription(
          selectedPlan,
          user.id,
          appliedCoupon ? appliedCoupon.code : undefined,
          addOnsTotal,
          selectedAddOns,
          selectedPlanData.price * 100,
          walletDeduction
        );
        if (result.success) {
          await fetchWalletBalance();
          onSubscriptionSuccess();
          onShowAlert('Subscription Activated!', 'Your free plan has been activated successfully.', 'success');
        } else {
          console.error(result.error || 'Failed to activate free plan.');
          onShowAlert('Activation Failed', result.error || 'Failed to activate free plan.', 'error');
        }
      } else {
        const paymentData = {
          planId: selectedPlan,
          amount: grandTotal,
          currency: 'INR',
        };
        const result = await paymentService.processPayment(
          paymentData,
          user.email,
          user.name,
          accessToken,
          appliedCoupon ? appliedCoupon.code : undefined,
          walletDeduction,
          addOnsTotal,
          selectedAddOns
        );
        if (result.success) {
          await fetchWalletBalance();
          onSubscriptionSuccess();
          onShowAlert('Payment Successful!', 'Your subscription has been activated.', 'success');
        } else {
          console.error(result.error || 'Payment failed.');
          onShowAlert('Payment Failed', result.error || 'Payment processing failed. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Payment process error:', error);
      onShowAlert('Payment Error', error instanceof Error ? error.message : 'An unexpected error occurred during payment.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddOnQuantityChange = (addOnId: string, quantity: number) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addOnId]: Math.max(0, quantity),
    }));
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackToPlans = () => {
    setCurrentStep('plans');
  };

  return (
    <div className="min-h-screen bg-dark-100 text-dark-900">
      {/* Header */}
      <div className="bg-dark-200 border-b border-dark-400 sticky top-0 z-40">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onNavigateBack}
              className="flex items-center space-x-2 text-dark-700 hover:text-neon-400 transition-colors min-h-touch"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back to Home</span>
            </button>

            <h1 className="text-xl font-bold text-dark-900">
              {currentStep === 'plans' ? 'Choose Your Plan' : 'Complete Payment'}
            </h1>

            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Step 1: Plan Selection */}
      {currentStep === 'plans' && (
        <div className="container-responsive py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-neon-400 to-electric-400 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg glow-neon">
              <Sparkles className="w-10 h-10 text-dark-100" />
            </div>
            <h1 className="text-4xl font-bold text-dark-900 mb-4">
              🏆 Ultimate Resume & Job Prep Plans
            </h1>
            <p className="text-xl text-dark-700 mb-6">
              AI-powered resume optimization with secure payment
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="block md:hidden mb-8">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <div
                  ref={carouselRef}
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {allPlansWithAddOnOption.map((plan, index) => (
                    <div key={plan.id} className="w-full flex-shrink-0 px-4">
                      <div
                        className={`relative rounded-3xl border-2 transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'border-neon-400 shadow-2xl shadow-neon-400/20 ring-4 ring-neon-400/20'
                            : 'border-dark-400'
                        } ${plan.popular ? 'ring-2 ring-electric-400 ring-offset-4 ring-offset-dark-100' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-electric-400 to-neon-400 text-dark-100 px-6 py-2 rounded-full text-xs font-bold shadow-lg">
                              🏆 Most Popular
                            </span>
                          </div>
                        )}
                        <div className="p-6 bg-dark-200">
                          <div className="text-center mb-6">
                            <div
                              className={`bg-gradient-to-r ${plan.gradient || 'from-neon-400 to-electric-400'} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}
                            >
                              {getPlanIcon(plan.icon || '')}
                            </div>
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
                                plan.tagColor || 'text-neon-400 bg-neon-400/10 border-neon-400/30'
                              }`}
                            >
                              {plan.tag}
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-2">{plan.name}</h3>
                            <div className="text-center mb-4">
                              <span className="text-3xl font-bold text-dark-900">
                                ₹{plan.price}
                              </span>
                              <span className="text-dark-600 ml-1 text-base">
                                /{plan.duration.toLowerCase()}
                              </span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-dark-300 to-dark-400 rounded-2xl p-4 text-center mb-6">
                            <div className="text-2xl font-bold text-neon-400">{plan.optimizations}</div>
                            <div className="text-sm text-dark-600">Resume Credits</div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            {plan.features.slice(0, 4).map((feature: string, fi: number) => (
                              <li key={fi} className="flex items-start">
                                <Check className="w-5 h-5 text-electric-400 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-dark-700 text-sm break-words">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-base min-h-touch ${
                              selectedPlan === plan.id
                                ? `bg-gradient-to-r ${plan.gradient || 'from-neon-400 to-electric-400'} text-dark-100 shadow-lg transform scale-105 glow-neon`
                                : 'bg-dark-300 text-dark-700 hover:bg-dark-400'
                            }`}
                          >
                            {selectedPlan === plan.id ? (
                              <span className="flex items-center justify-center">
                                <Check className="w-5 h-5 mr-2" />
                                Selected
                              </span>
                            ) : (
                              'Select Plan'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-dark-300/90 hover:bg-dark-400 text-dark-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10 min-w-touch min-h-touch"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-dark-300/90 hover:bg-dark-400 text-dark-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10 min-w-touch min-h-touch"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {allPlansWithAddOnOption.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedPlan === plan.id
                    ? 'border-neon-400 shadow-2xl shadow-neon-400/20 ring-4 ring-neon-400/20'
                    : 'border-dark-400 hover:border-neon-400/50 hover:shadow-xl'
                } ${plan.popular ? 'ring-2 ring-electric-400 ring-offset-4 ring-offset-dark-100' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center bg-gradient-to-r from-electric-400 to-neon-400 text-dark-100 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      <span className="mr-1">🏆</span> Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6 bg-dark-200">
                  <div className="text-center mb-6">
                    <div
                      className={`bg-gradient-to-r ${plan.gradient || 'from-neon-400 to-electric-400'} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}
                    >
                      {getPlanIcon(plan.icon || '')}
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
                        plan.tagColor || 'text-neon-400 bg-neon-400/10 border-neon-400/30'
                      }`}
                    >
                      {plan.tag}
                    </div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2 break-words">{plan.name}</h3>
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-dark-900">₹{plan.price}</span>
                      <span className="text-dark-600 ml-1 text-base">
                        /{plan.duration.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-dark-300 to-dark-400 rounded-2xl p-4 text-center mb-6">
                    <div className="text-2xl font-bold text-neon-400">{plan.optimizations}</div>
                    <div className="text-sm text-dark-600">Resume Credits</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.slice(0, 4).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-electric-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-dark-700 text-sm break-words">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-base min-h-touch ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.gradient || 'from-neon-400 to-electric-400'} text-dark-100 shadow-lg transform scale-105 glow-neon`
                        : 'bg-dark-300 text-dark-700 hover:bg-dark-400'
                    }`}
                  >
                    {selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2" />
                        Selected
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="bg-dark-200 rounded-2xl p-6 mb-8 border border-dark-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-dark-900 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-electric-400" />
                🛒 Add-Ons (Optional)
              </h3>
              <button
                onClick={() => setShowAddOns(!showAddOns)}
                className="text-neon-400 hover:text-electric-400 font-medium text-sm"
              >
                {showAddOns ? 'Hide' : 'Show'} Add-ons
              </button>
            </div>
            {showAddOns && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className="bg-dark-300 rounded-lg p-4 border border-dark-400 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-dark-900 text-sm">{addOn.name}</h4>
                        <p className="text-neon-400 font-semibold">₹{addOn.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleAddOnQuantityChange(addOn.id, (selectedAddOns[addOn.id] || 0) - 1)
                          }
                          className="w-8 h-8 bg-dark-400 hover:bg-dark-500 rounded-full flex items-center justify-center text-dark-800"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-dark-900">{selectedAddOns[addOn.id] || 0}</span>
                        <button
                          onClick={() =>
                            handleAddOnQuantityChange(addOn.id, (selectedAddOns[addOn.id] || 0) + 1)
                          }
                          className="w-8 h-8 bg-neon-400 hover:bg-neon-500 text-dark-100 rounded-full flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedPlanData}
              className="bg-gradient-to-r from-neon-400 to-electric-400 hover:from-neon-500 hover:to-electric-500 text-dark-100 font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 glow-neon min-h-touch"
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-6 h-6" />
                <span>Continue to Payment</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {currentStep === 'payment' && (
        <div className="container-responsive py-8">
          <div className="max-w-2xl mx-auto">
            {/* Payment Summary */}
            <div className="bg-dark-200 rounded-2xl p-6 mb-6 border border-dark-400">
              <h3 className="text-xl font-semibold text-dark-900 mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-neon-400" />
                Payment Summary
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between items-center">
                  <span className="text-dark-700">Selected Plan:</span>
                  <span className="font-semibold text-dark-900 break-words text-right">{selectedPlanData?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-700">Credits:</span>
                  <span className="font-semibold text-dark-900">{selectedPlanData?.optimizations} Resume Credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-700">Duration:</span>
                  <span className="font-semibold text-dark-900">{selectedPlanData?.duration}</span>
                </div>

                <div className="border-t border-dark-400 pt-3 mt-3">
                  {!appliedCoupon ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 input-base"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="btn-secondary"
                      >
                        Apply Coupon
                      </button>
                    </div>
                  ) : (
                    <div className="bg-electric-400/10 border border-electric-400/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-electric-400 mr-2" />
                          <span className="text-electric-400 font-medium text-sm">
                            Coupon "{appliedCoupon.code}" applied
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-electric-400 hover:text-neon-400 text-sm underline"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-electric-400 text-sm mt-1">
                        You saved ₹{(appliedCoupon.discount / 100).toFixed(2)}!
                      </div>
                    </div>
                  )}
                  {couponError && (
                    <div className="text-red-400 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {couponError}
                    </div>
                  )}
                </div>

                <div className="border-t border-dark-400 pt-3 mt-3">
                  {!loadingWallet && walletBalance > 0 && (
                    <div className={`mb-3 p-3 rounded-lg ${selectedPlan === 'addon_only_purchase' ? 'bg-dark-400 border-dark-500' : 'bg-electric-400/10 border-electric-400/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${selectedPlan === 'addon_only_purchase' ? 'text-dark-600' : 'text-electric-400'}`}>Use Wallet Balance</span>
                        <button
                          onClick={() => setUseWalletBalance(!useWalletBalance)}
                          disabled={selectedPlan === 'addon_only_purchase'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            useWalletBalance && selectedPlan !== 'addon_only_purchase' ? 'bg-electric-400' : 'bg-dark-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              useWalletBalance && selectedPlan !== 'addon_only_purchase' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {selectedPlan !== 'addon_only_purchase' && (
                        <div className="text-sm text-electric-400">
                          Available: ₹{(walletBalance / 100).toFixed(2)}
                          {useWalletBalance && (
                            <span className="block mt-1">Using: ₹{(walletDeduction / 100).toFixed(2)}</span>
                          )}
                        </div>
                      )}
                      {selectedPlan === 'addon_only_purchase' && (
                        <div className="text-sm text-dark-600 flex items-center mt-2">
                          <Info className="w-4 h-4 mr-2" />
                          <span>Wallet balance cannot be used for add-on only purchases.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-dark-600 mb-2">
                      <span>Original Price:</span>
                      <span className="line-through">₹{selectedPlanData?.price}</span>
                    </div>
                  )}
                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-electric-400 mb-2">
                      <span>Discount:</span>
                      <span>-₹{(appliedCoupon.discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {useWalletBalance && walletDeduction > 0 && (
                    <div className="flex justify-between items-center text-sm text-neon-400 mb-2">
                      <span>Wallet Balance Applied:</span>
                      <span>-₹{(walletDeduction / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-dark-900">Total Amount:</span>
                    <span className="text-neon-400">₹{(grandTotal / 100).toFixed(2)}</span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div className="text-sm text-dark-600 mt-2">
                      Plan: ₹{(finalPlanPrice / 100).toFixed(2)} + Add-ons: ₹{(addOnsTotal / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBackToPlans}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Plans</span>
              </button>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 min-h-touch ${
                  isProcessing
                    ? 'bg-dark-400 cursor-not-allowed text-dark-600'
                    : 'bg-gradient-to-r from-neon-400 to-electric-400 hover:from-neon-500 hover:to-electric-500 text-dark-100 shadow-xl hover:shadow-2xl transform hover:scale-105 glow-neon'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-dark-600 border-t-transparent" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>
                      {grandTotal === 0 ? 'Get Free Plan' : `Pay ₹${(grandTotal / 100).toFixed(2)} - Start Optimizing`}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-dark-600 text-sm mt-4 flex items-center justify-center">
              <Info className="w-4 h-4 mr-1" />
              <span>Secure payment powered by Razorpay • 256-bit SSL encryption</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
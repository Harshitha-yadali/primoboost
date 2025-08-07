import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Gift,
  Copy,
  CheckCircle,
  Users,
  Wallet,
  TrendingUp,
  Star,
  Share2,
  ExternalLink,
  CreditCard,
  Banknote,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface ReferralPageProps {
  onNavigateBack: () => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ onNavigateBack }) => {
  const { user } = useAuth();
  const [copySuccess, setCopySuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pendingEarnings, setPendingEarnings] = useState<number>(0);
  const [totalReferrals, setTotalReferrals] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch wallet balance
      const { data: transactions, error } = await supabase
        .from('wallet_transactions')
        .select('amount, status, type')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching wallet data:', error);
        return;
      }

      const completed = (transactions || []).filter((t: any) => t.status === 'completed');
      const balance = completed.reduce((sum: number, tr: any) => sum + parseFloat(tr.amount), 0);
      setWalletBalance(Math.max(0, balance));

      const pending = (transactions || []).filter((t: any) => t.status === 'pending' && parseFloat(t.amount) > 0);
      const pendingAmount = pending.reduce((sum: number, tr: any) => sum + parseFloat(tr.amount), 0);
      setPendingEarnings(pendingAmount);

      // Count referrals
      const referralTransactions = (transactions || []).filter((t: any) => t.type === 'referral');
      setTotalReferrals(referralTransactions.length);

    } catch (err) {
      console.error('Error fetching referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = async () => {
    if (user?.referralCode) {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy referral code:', err);
        const textArea = document.createElement('textarea');
        textArea.value = user.referralCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const shareReferralCode = async () => {
    if (navigator.share && user?.referralCode) {
      try {
        await navigator.share({
          title: 'Join PrimoBoost AI with my referral code',
          text: `Use my referral code "${user.referralCode}" to get ₹10 bonus when you sign up for PrimoBoost AI!`,
          url: `https://primoboostai.in?ref=${user.referralCode}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-dark-400 border-t-neon-400 mx-auto mb-4"></div>
          <p className="text-dark-700">Loading referral data...</p>
        </div>
      </div>
    );
  }

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

            <h1 className="text-xl font-bold text-dark-900">Referral Program</h1>

            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-400 to-neon-400 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg glow-purple">
            <Gift className="w-10 h-10 text-dark-100" />
          </div>
          <h1 className="text-4xl font-bold text-dark-900 mb-4">
            Earn with Every <span className="text-gradient-purple">Referral</span>
          </h1>
          <p className="text-xl text-dark-700 max-w-2xl mx-auto">
            Share PrimoBoost AI with friends and earn 10% commission on every purchase they make!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-neon p-6 text-center">
            <div className="bg-gradient-to-r from-electric-400 to-neon-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-dark-100" />
            </div>
            <div className="text-3xl font-bold text-neon-400 mb-2">₹{walletBalance.toFixed(2)}</div>
            <div className="text-dark-600">Current Balance</div>
          </div>

          <div className="card-neon p-6 text-center">
            <div className="bg-gradient-to-r from-purple-400 to-electric-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-dark-100" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">₹{pendingEarnings.toFixed(2)}</div>
            <div className="text-dark-600">Pending Earnings</div>
          </div>

          <div className="card-neon p-6 text-center">
            <div className="bg-gradient-to-r from-neon-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-dark-100" />
            </div>
            <div className="text-3xl font-bold text-neon-400 mb-2">{totalReferrals}</div>
            <div className="text-dark-600">Total Referrals</div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="card-neon p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-900 mb-6">Your Referral Code</h2>
            
            <div className="bg-dark-300 border border-dark-400 rounded-2xl p-6 mb-6 inline-block">
              <div className="text-3xl font-bold text-neon-400 tracking-wider mb-2">
                {user?.referralCode || 'Loading...'}
              </div>
              <div className="text-sm text-dark-600">Share this code with friends</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <button
                onClick={handleCopyReferralCode}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all min-h-touch ${
                  copySuccess
                    ? 'bg-electric-400 text-dark-100'
                    : 'btn-primary glow-neon'
                }`}
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
              
              {navigator.share && (
                <button
                  onClick={shareReferralCode}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="card-neon p-8 mb-12">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-neon-400 to-electric-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">Share Your Code</h3>
              <p className="text-dark-700">Share your unique referral code with friends and colleagues</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-electric-400 to-purple-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">They Sign Up</h3>
              <p className="text-dark-700">Your friends get ₹10 bonus when they use your code</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-400 to-neon-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">You Earn 10%</h3>
              <p className="text-dark-700">Earn 10% commission on every purchase they make</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="card-neon p-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">Referral Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-electric-400/20 p-3 rounded-full">
                <Star className="w-6 h-6 text-electric-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Instant Rewards</h3>
                <p className="text-dark-700">Earn commission immediately when your referral makes a purchase</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-neon-400/20 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-neon-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Easy Withdrawal</h3>
                <p className="text-dark-700">Withdraw your earnings via UPI or bank transfer</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-400/20 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Limits</h3>
                <p className="text-dark-700">Refer unlimited friends and earn from all their purchases</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-electric-400/20 p-3 rounded-full">
                <Banknote className="w-6 h-6 text-electric-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Lifetime Earnings</h3>
                <p className="text-dark-700">Earn from every purchase your referrals make, forever</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { MessageSquare, Eye, Clock, ArrowRight, Settings, Download, Plus, AlertCircle } from 'lucide-react';

interface Review {
  id?: string;
  _id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  status: 'pending' | 'approved';
  avatarColor: string;
  createdAt: string;
}

interface Analytics {
  hits: number;
  sessionsCount: number;
  engagementSeconds: number;
  referrers: { [key: string]: number };
  dailyHits: { date: string; count: number }[];
}

export const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null); // Track toggled review ID

  // Route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchData = async () => {
    try {
      const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };

      // Get reviews
      const reviewsRes = await fetch(`${API_URL}/reviews/all`, { headers });
      if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);

      // Get analytics
      const analyticsRes = await fetch(`${API_URL}/analytics`, { headers });
      if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sync dashboard metrics');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleToggleStatus = async (id: string, currentStatus: 'approved' | 'pending') => {
    setIsProcessing(id);
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    try {
      const res = await fetch(`${API_URL}/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update review status');
      
      // Update local state
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalReviewsDbCount = reviews.length;
  const totalReviewsDisplay = totalReviewsDbCount.toLocaleString();
  const profileHitsDisplay = analytics ? (analytics.hits / 1000).toFixed(1) + 'k' : '0k';
  
  // Format average engagement
  let avgEngagementDisplay = "0m 0s";
  if (analytics && analytics.sessionsCount > 0) {
    const totalSecs = analytics.engagementSeconds;
    const sessionCount = analytics.sessionsCount;
    const avgSecs = Math.round(totalSecs / sessionCount);
    const mins = Math.floor(avgSecs / 60);
    const secs = avgSecs % 60;
    avgEngagementDisplay = `${mins}m ${secs}s`;
  }

  const referrerData = analytics?.referrers || {};
  const totalReferrerHits = Object.values(referrerData).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="mx-auto max-w-7xl px-6 text-left">
        
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-neutral-900 md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-neutral-500 max-w-xl">
            Welcome back, Monica. Manage your visitor feedback and monitor engagement levels across your portfolio.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl mb-8 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Metrics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Reviews Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Total Reviews
              </span>
              <span className="block font-display text-3xl font-extrabold text-neutral-800 mt-2">
                {totalReviewsDisplay}
              </span>
              <span className="block text-xs text-neutral-400 font-semibold mt-1">
                <span className="text-neutral-500 font-medium">Total submitted</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-primary-500">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>

          {/* Profile Hits Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Profile Hits
              </span>
              <span className="block font-display text-3xl font-extrabold text-neutral-800 mt-2">
                {profileHitsDisplay}
              </span>
              <span className="block text-xs text-primary-500 font-semibold mt-1">
                +{analytics ? (analytics.hits % 1000).toLocaleString() : '0'} <span className="text-neutral-400 font-medium">new visitors</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Average Engagement Card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Avg. Engagement
              </span>
              <span className="block font-display text-3xl font-extrabold text-neutral-800 mt-2">
                {avgEngagementDisplay}
              </span>
              <span className="block text-xs text-neutral-400 font-semibold mt-1">
                <span className="text-neutral-500 font-medium">Average time per session</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Dashboard Content split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Recent Reviews moderation list */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-100 shadow-xs overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-neutral-800">
                Recent Reviews
              </h2>
              <button className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Moderation List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-100 text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="pb-4">User</th>
                    <th className="pb-4">Review</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm">
                  {reviews.length > 0 ? (
                    reviews.slice(0, 10).map((rev) => (
                      <tr key={rev._id} className="align-middle">
                        {/* User Details */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                              style={{ backgroundColor: rev.avatarColor }}
                            >
                              {rev.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-800">{rev.name}</div>
                              <div className="text-[10px] text-neutral-400">{new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </div>
                        </td>

                        {/* Review Content */}
                        <td className="py-4 pr-4 max-w-xs truncate text-neutral-500">
                          {rev.message}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              rev.status === 'approved'
                                ? 'bg-purple-50 text-primary-500 border border-primary-100'
                                : 'bg-neutral-50 text-neutral-500 border border-neutral-200'
                            }`}
                          >
                            {rev.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </td>

                        {/* Toggle switch action */}
                        <td className="py-4 text-right">
                          <button
                            disabled={isProcessing === rev._id}
                            onClick={() => handleToggleStatus(rev._id, rev.status)}
                            className="focus:outline-hidden inline-flex relative items-center cursor-pointer group disabled:opacity-50"
                          >
                            <div
                              className={`w-10 h-5.5 rounded-full border border-neutral-200 transition-colors duration-200 ${
                                rev.status === 'approved' ? 'bg-primary-500' : 'bg-neutral-200'
                              }`}
                            ></div>
                            <div
                              className={`absolute w-4.5 h-4.5 rounded-full bg-white transition-transform duration-200 shadow-xs border border-neutral-200 ${
                                rev.status === 'approved' ? 'translate-x-5' : 'translate-x-0.5'
                              }`}
                            ></div>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-400">
                        No reviews submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right Column: Engagement graph, Quick actions, Top Referrers */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Engagement Traffic Chart */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs text-left">
              <h3 className="font-display font-bold text-neutral-800 text-sm">
                Engagement
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 mb-6">Traffic over the last 7 days</p>

              {/* Custom SVG/HTML Bar Chart */}
              <div className="flex items-end justify-between h-32 px-2 mt-4 relative border-b border-neutral-100">
                {(analytics?.dailyHits && analytics.dailyHits.length > 0 ? analytics.dailyHits : []).map((day, i) => {
                  const maxCount = Math.max(...(analytics?.dailyHits.map(d => d.count) || [1]));
                  const heightPercent = maxCount > 0 ? Math.max(10, Math.min(90, (day.count / maxCount) * 90)) : 10;
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 group">
                      <div className="absolute bottom-full mb-1 bg-neutral-800 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                        {day.count} hits
                      </div>
                      <div
                        className="w-4.5 bg-primary-100 group-hover:bg-primary-500 rounded-t-md transition-colors cursor-pointer"
                        style={{ height: `${heightPercent}px` }}
                      ></div>
                      <span className="text-[10px] text-neutral-400 mt-2 font-medium">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs text-left">
              <h3 className="font-display font-bold text-neutral-800 text-sm mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors font-semibold text-xs text-left">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Portfolio Project</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f1f5f9] text-neutral-700 hover:bg-neutral-200 transition-colors font-semibold text-xs text-left"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Dashboard Settings</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f1f5f9] text-neutral-700 hover:bg-neutral-200 transition-colors font-semibold text-xs text-left">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export Review Data</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Top Referrers */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs text-left">
              <h3 className="font-display font-bold text-neutral-800 text-sm mb-4">
                Top Referrers
              </h3>

              <div className="space-y-4">
                {Object.entries(referrerData).map(([name, hits]) => {
                  const percent = totalReferrerHits > 0 ? Math.round((hits / totalReferrerHits) * 100) : hits;
                  return (
                    <div key={name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span>{name}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

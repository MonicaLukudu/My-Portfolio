import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_URL } from '../context/AuthContext';
import { ArrowRight, Star, FileText, MessageSquare } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '../components/Icons';

interface Review {
  id?: string;
  _id?: string;
  name: string;
  message: string;
  rating: number;
  avatarColor: string;
  createdAt: string;
}

export const Home: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Record page hit
    fetch(`${API_URL}/analytics/hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrer: document.referrer || 'Direct' })
    }).catch(err => console.error("Error recording page hit:", err));

    // Fetch approved reviews
    fetch(`${API_URL}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));

    // Fetch settings
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const linkedinUrl = settings?.linkedin || "https://www.linkedin.com/in/monica-lukudu-842002303/";
  const githubUrl = settings?.github || "https://github.com/monicalukudu";
  const bioText = settings?.bio || "A Software Engineer and Solutions Architect dedicated to building scalable, high-performance systems with human-centric design. Leveraging precision engineering and cutting-edge technologies to solve complex digital challenges.";
  const cvLink = settings?.cvUrl || "#";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center">
          
          {/* Left Text */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full bg-primary-100/50 px-3 py-1 text-xs font-semibold text-primary-600 tracking-wider uppercase mb-6"
            >
              Soft-Tech Precision
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
            >
              Architecting the <span className="text-gradient">Future</span> of Software
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl"
            >
              {bioText}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-600 hover:shadow-lg transition-all gap-2"
              >
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <a
                href={cvLink}
                download
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Download CV</span>
              </a>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-95 bg-white rounded-3xl p-4 shadow-xl border border-neutral-100"
            >
              <div className="aspect-4/5 w-full overflow-hidden rounded-2xl bg-neutral-100">
                <img
                  src="/profile.jpeg"
                  alt="Monica David Lukudu"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-neutral-800">
                    {settings?.name || "Monica David"}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {settings?.title || "Lead Architect"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary-300"></span>
                  <span className="h-2 w-2 rounded-full bg-primary-400"></span>
                  <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Connect & Collaborate Cards */}
      <section className="bg-white border-y border-neutral-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-2xl font-bold text-neutral-800 text-center mb-10">
            Connect & Collaborate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* LinkedIn Card */}
            <motion.a
              whileHover={{ y: -4 }}
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 rounded-2xl bg-[#f8fafc] border border-neutral-100 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <LinkedInIcon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-neutral-800">LinkedIn</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">Professional network & insights</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
            </motion.a>

            {/* GitHub Card */}
            <motion.a
              whileHover={{ y: -4 }}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 rounded-2xl bg-[#faf5ff] border border-neutral-100 hover:border-primary-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <GitHubIcon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-neutral-800">GitHub</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">Open source & contributions</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
            </motion.a>

          </div>
        </div>
      </section>

      {/* Visitor Reflections Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-extrabold text-neutral-900">
            Visitor Reflections
          </h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            See what others are saying about our collaborations and my architectural approach.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-100 text-primary-600 px-5 py-2.5 text-sm font-semibold hover:bg-primary-200 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Leave a Review</span>
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviews.length > 0 ? (
            reviews.slice(0, 4).map((review, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={review.id || review._id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-neutral-100 shadow-xs text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm"
                        style={{ backgroundColor: review.avatarColor || '#7c3aed' }}
                      >
                        {review.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-neutral-800 text-sm">
                          {review.name}
                        </h4>
                        <p className="text-xs text-neutral-400">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed italic">
                    "{review.message}"
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200 text-neutral-400">
              No approved reviews yet. Be the first to leave one on the Contact page!
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

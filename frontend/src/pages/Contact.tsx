import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../context/AuthContext';
import { Send, Mail, MapPin, Star, Sparkles, MessageSquare, CheckCircle } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from '../components/Icons';

export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  
  // Message Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // List of guestbook reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [showGuestbook, setShowGuestbook] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Error loading settings:", err));

    fetch(`${API_URL}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error loading reviews:", err));
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Send to Formspree
    fetch('https://formspree.io/f/meebnjbj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })
      .then(res => {
        if (res.ok) {
          setFormSubmitted(true);
          setName('');
          setEmail('');
          setMessage('');
          setTimeout(() => setFormSubmitted(false), 5000);
        }
      })
      .catch(err => console.error("Error sending message:", err));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewMessage) return;

    fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: reviewName,
        email: reviewEmail,
        message: reviewMessage,
        rating: reviewRating
      })
    })
      .then(res => res.json())
      .then(() => {
        setReviewSubmitted(true);
        setReviewName('');
        setReviewEmail('');
        setReviewMessage('');
        setReviewRating(5);
        setTimeout(() => {
          setReviewSubmitted(false);
          setShowReviewForm(false);
        }, 4000);
      })
      .catch(err => console.error("Error submitting review:", err));
  };

  const linkedinUrl = settings?.linkedin || "https://www.linkedin.com/in/monica-lukudu-842002303/";
  const githubUrl = settings?.github || "https://github.com/monicalukudu";
  const emailAddress = settings?.email || "monicalukudu@gmail.com";
  const locationText = settings?.location || "Kigali, Rwanda";

  return (
    <div className="min-h-screen bg-[#fafafa] py-16">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Let's Connect Heading */}
        <section className="text-left max-w-3xl mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl"
          >
            Let's connect.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-neutral-600 leading-relaxed"
          >
            I'm currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, my inbox is always open.
          </motion.p>
        </section>

        {/* Form and info grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Form & Feedback card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs text-left">
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Monica Lukudu"
                      className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@softtech.com"
                      className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project or just say hi..."
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-600 transition-all gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {formSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 text-sm font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Message sent successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>

            {/* Leave a Review / Feedback card */}
            <div className="border-2 border-primary-200 bg-[#faf5ff] rounded-3xl p-6 text-left">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-500">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-neutral-800 text-lg">Leave a Review</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Worked with me before? I'd love to hear your feedback on our collaboration.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        setShowReviewForm(!showReviewForm);
                        setShowGuestbook(false);
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-primary-500 text-white px-4 py-2 text-xs font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Submit Feedback
                    </button>
                    <button
                      onClick={() => {
                        setShowGuestbook(!showGuestbook);
                        setShowReviewForm(false);
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 px-4 py-2 text-xs font-semibold hover:bg-neutral-50 transition-colors"
                    >
                      {showGuestbook ? 'Hide Guestbook' : 'View Guestbook'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Guestbook Reviews List */}
              <AnimatePresence>
                {showGuestbook && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-6 pt-6 border-t border-neutral-200/60 space-y-4"
                  >
                    <h4 className="font-display font-bold text-neutral-700 text-sm mb-4">Guestbook Reflections</h4>
                    <div className="max-h-87.5 overflow-y-auto space-y-4 pr-2">
                      {reviews.length > 0 ? (
                        reviews.map((rev) => (
                          <div key={rev._id || rev.id} className="p-4 rounded-xl bg-white border border-neutral-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-7 w-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                                  style={{ backgroundColor: rev.avatarColor }}
                                >
                                  {rev.name[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold text-neutral-700">{rev.name}</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed italic">"{rev.message}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-neutral-400 py-6 text-center">No feedback yet. Submit yours above!</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsible Submit Feedback Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-6 pt-6 border-t border-neutral-200/60"
                  >
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <h4 className="font-display font-bold text-neutral-700 text-sm flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary-500" />
                        <span>Share Your Experience</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                        />
                        <input
                          type="email"
                          required
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          placeholder="Your Email"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-500 uppercase">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-hidden"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200 hover:text-amber-200'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        required
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        placeholder="Write your brief reflection..."
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-hidden transition-colors resize-none"
                      />

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-lg bg-primary-500 text-white px-4 py-2 text-xs font-semibold hover:bg-primary-600 transition-colors"
                        >
                          Submit Reflection
                        </button>
                        
                        <AnimatePresence>
                          {reviewSubmitted && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-emerald-600 font-semibold"
                            >
                              Thank you! Submitted for admin approval.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* Right Column: Professional Network & Location card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Professional Networks */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs text-left">
              <h3 className="font-display font-bold text-neutral-800 text-lg mb-6">
                Professional Network
              </h3>

              <div className="space-y-6">
                {/* LinkedIn link */}
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <LinkedInIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      LinkedIn
                    </span>
                    <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-500 transition-colors">
                      /monica-lukudu
                    </span>
                  </div>
                </a>

                {/* GitHub link */}
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-neutral-100">
                    <GitHubIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      GitHub
                    </span>
                    <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-500 transition-colors">
                      @monicalukudu
                    </span>
                  </div>
                </a>

                {/* Email address */}
                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-100">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Direct Email
                    </span>
                    <span className="text-sm font-semibold text-neutral-700 group-hover:text-primary-500 transition-colors">
                      {emailAddress}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Office Workspace / Location image card */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 w-full border border-neutral-100 group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
                alt="Office in Kigali"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 text-left text-white">
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>Based In</span>
                </span>
                <span className="font-display font-bold text-xl block leading-tight">
                  {locationText}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

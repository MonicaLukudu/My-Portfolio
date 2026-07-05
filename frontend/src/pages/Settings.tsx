import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, User, MapPin, Link2, CheckCircle, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { isAuthenticated, isLoading, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Route protection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_URL}/settings`)
        .then(res => res.json())
        .then(data => {
          setName(data.name || '');
          setTitle(data.title || '');
          setBio(data.bio || '');
          setLocation(data.location || '');
          setEmail(data.email || '');
          setLinkedin(data.linkedin || '');
          setGithub(data.github || '');
          setCvUrl(data.cvUrl || '');
        })
        .catch(err => console.error("Error fetching settings:", err));
    }
  }, [isAuthenticated]);

  const handleCvUpload = async () => {
    if (!cvFile) {
      alert('Please choose a CV file first.');
      return;
    }

    setUploadingCv(true);
    const formData = new FormData();
    formData.append('cv', cvFile);

    try {
      const res = await fetch(`${API_URL}/settings/upload-cv`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders()
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.cvUrl) {
        setCvUrl(data.cvUrl);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Error uploading CV');
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          title,
          bio,
          location,
          email,
          linkedin,
          github,
          cvUrl
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err) {
      alert("Error saving settings data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12">
      <div className="mx-auto max-w-4xl px-6 text-left">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-neutral-900 md:text-4xl">
            Portfolio Settings
          </h1>
          <p className="mt-2 text-neutral-500">
            Customize the profile data and links presented to visitors on the frontend site.
          </p>
        </div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-neutral-100 shadow-xl p-8"
        >
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* Identity Settings */}
            <div>
              <h3 className="font-display font-bold text-neutral-800 text-base border-b border-neutral-100 pb-3 mb-6 flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-primary-500" />
                <span>Profile Details</span>
              </h3>

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
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Biography / Summary
                </label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors resize-none"
                />
              </div>
            </div>

            {/* Location & Contact details */}
            <div>
              <h3 className="font-display font-bold text-neutral-800 text-base border-b border-neutral-100 pb-3 mb-6 flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary-500" />
                <span>Location & Contact</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Location Label
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    Public Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Social & Resume links */}
            <div>
              <h3 className="font-display font-bold text-neutral-800 text-base border-b border-neutral-100 pb-3 mb-6 flex items-center gap-2">
                <Link2 className="h-4.5 w-4.5 text-primary-500" />
                <span>Links & Assets</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-[#f8fafc] px-4 py-3 text-sm text-neutral-800 focus:border-primary-500 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Upload CV / Resume
                </label>
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-[#f8fafc] p-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600"
                  />
                  <button
                    type="button"
                    onClick={handleCvUpload}
                    disabled={uploadingCv || !cvFile}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploadingCv ? 'Uploading...' : 'Upload CV'}</span>
                  </button>
                  {cvUrl && (
                    <p className="mt-3 text-sm text-neutral-600">
                      Current CV: <a href={`${API_URL}${cvUrl}`} target="_blank" rel="noreferrer" className="text-primary-600 underline">Open file</a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions & Submit */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-8 mt-12">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-primary-600 transition-all gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>

              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-600 text-sm font-medium"
                  >
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span>Portfolio settings updated!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </form>
        </motion.div>

      </div>
    </div>
  );
};

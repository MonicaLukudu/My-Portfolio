import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_URL } from '../context/AuthContext';
import { Download, MessageSquare, Terminal, Server, Wrench, Users, Brain, Zap, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Error loading settings:", err));
  }, []);

  const cvLink = settings?.cvUrl || "#";
  const nameText = settings?.name || "Monica David Lukudu";
  const bioText = settings?.bio || "A dedicated Software Engineering graduate from ULK with a passion for building elegant, user-centric solutions. Blending technical precision with creative problem-solving to deliver high-quality digital experiences.";
  const locationText = settings?.location || "Kigali, Rwanda";

  const proficiencies = [
    {
      title: 'Frontend',
      icon: <Terminal className="h-6 w-6 text-purple-600" />,
      bgIcon: 'bg-purple-50',
      skills: ['React.js & Next.js', 'Tailwind CSS', 'TypeScript', 'Responsive Design']
    },
    {
      title: 'Backend',
      icon: <Server className="h-6 w-6 text-blue-600" />,
      bgIcon: 'bg-blue-50',
      skills: ['Node.js & Express', 'MongoDB', 'RESTful APIs', 'Authentication']
    },
    {
      title: 'Tools',
      icon: <Wrench className="h-6 w-6 text-indigo-600" />,
      bgIcon: 'bg-indigo-50',
      skills: ['Git & GitHub', 'Vercel', 'Figma', 'Stitch']
    }
  ];

  const timelineItems = [
    {
      role: 'Software Engineer Intern',
      company: 'THE GYM',
      location: 'RWANDA',
      period: '2025 - PRESENT',
      description: 'Actively contributing to full-stack development projects. Collaborating with cross-functional teams to architect and deploy scalable web applications while maintaining clean code standards.',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      role: 'BSc in Software Engineering',
      company: 'ULK (KIGALI INDEPENDENT UNIVERSITY)',
      location: 'KIGALI, RWANDA',
      period: 'EXPECTED DEC 2027',
      description: 'Focusing on algorithmic complexity, system design, and modern software paradigms. Building a strong foundation in computer science principles and practical engineering skills.',
      tags: ['Data Structures', 'Database Systems', 'Software Architecture']
    }
  ];

  const humanApproach = [
    { name: 'COLLABORATION', icon: <Users className="h-5 w-5 text-purple-500" /> },
    { name: 'CRITICAL THINKING', icon: <Brain className="h-5 w-5 text-purple-500" /> },
    { name: 'ADAPTABILITY', icon: <Zap className="h-5 w-5 text-purple-500" /> },
    { name: 'COMMUNICATION', icon: <Heart className="h-5 w-5 text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] py-16">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Software Engineer Profile */}
        <section className="bg-white rounded-3xl p-8 md:p-12 border border-neutral-100 shadow-xs mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Avatar / Profile picture */}
            <div className="relative shrink-0 w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
              <img
                src="/profile.jpeg"
                alt={nameText}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";
                }}
              />
            </div>

            {/* Resume Bio */}
            <div className="text-left flex-1">
              <h1 className="text-3xl font-extrabold text-neutral-900 md:text-4xl lg:text-5xl">
                Software Engineer
              </h1>
              <p className="text-sm text-primary-500 font-semibold mt-2 tracking-wide uppercase">
                {settings?.title || "Lead Architect"} &bull; {locationText}
              </p>
              
              <p className="mt-6 text-neutral-600 leading-relaxed text-base md:text-lg">
                {bioText}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={cvLink}
                  download
                  className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CV</span>
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Let's Talk</span>
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Technical Proficiency cards */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-neutral-900">
              Technical Proficiency
            </h2>
            <div className="mt-2 h-1 w-12 bg-primary-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {proficiencies.map((group, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={group.title}
                className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-xs text-left"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${group.bgIcon} mb-6`}>
                  {group.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-neutral-800 mb-4">
                  {group.title}
                </h3>
                <ul className="space-y-3">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-neutral-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-400"></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Career Journey timeline */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-extrabold text-neutral-900">
              Career Journey
            </h2>
            <div className="mt-2 h-1 w-12 bg-primary-300 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2"></div>

            <div className="space-y-12">
              {timelineItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className="relative flex flex-col md:flex-row items-stretch">
                    
                    {/* Circle Node indicator */}
                    <div className="absolute left-4 md:left-1/2 top-6 h-4 w-4 rounded-full border-4 border-white bg-primary-400 -translate-x-1/2 z-10 shadow-xs"></div>

                    {/* Left box (visible on md screens only for even indexes) */}
                    <div className="w-full md:w-1/2 pr-0 md:pr-12 pl-12 md:pl-0 text-left md:text-right flex items-center justify-end">
                      {isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs w-full"
                        >
                          <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{item.period}</span>
                          <h3 className="font-display text-lg font-bold text-neutral-800 mt-1">{item.role}</h3>
                          <p className="text-xs text-neutral-500 font-semibold uppercase">{item.company} &bull; {item.location}</p>
                          <p className="text-sm text-neutral-600 mt-3 leading-relaxed text-left md:text-right">{item.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4 justify-start md:justify-end">
                            {item.tags.map(t => (
                              <span key={t} className="text-xs px-2.5 py-1 bg-neutral-100 rounded-md text-neutral-600 font-medium">{t}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Spacer/Middle space */}
                    <div className="hidden md:block w-0"></div>

                    {/* Right box (visible on md screens for odd indexes, always visible on mobile) */}
                    <div className="w-full md:w-1/2 pl-12 pr-0 flex items-center justify-start">
                      {!isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs w-full text-left"
                        >
                          <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{item.period}</span>
                          <h3 className="font-display text-lg font-bold text-neutral-800 mt-1">{item.role}</h3>
                          <p className="text-xs text-neutral-500 font-semibold uppercase">{item.company} &bull; {item.location}</p>
                          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.tags.map(t => (
                              <span key={t} className="text-xs px-2.5 py-1 bg-neutral-100 rounded-md text-neutral-600 font-medium">{t}</span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Mobile layout container (since mobile has left circle aligned but we need to show both on mobile) */}
                      <div className="md:hidden w-full">
                        {isEven && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs w-full text-left"
                          >
                            <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{item.period}</span>
                            <h3 className="font-display text-lg font-bold text-neutral-800 mt-1">{item.role}</h3>
                            <p className="text-xs text-neutral-500 font-semibold uppercase">{item.company} &bull; {item.location}</p>
                            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {item.tags.map(t => (
                                <span key={t} className="text-xs px-2.5 py-1 bg-neutral-100 rounded-md text-neutral-600 font-medium">{t}</span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Human-Centric Approach cards */}
        <section className="mb-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-neutral-900">
              Human-Centric Approach
            </h2>
            <div className="mt-2 h-1 w-12 bg-primary-300 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {humanApproach.map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                key={item.name}
                className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-100 rounded-2xl shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 mb-3">
                  {item.icon}
                </div>
                <span className="font-display text-xs font-bold text-neutral-700 tracking-wider text-center">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

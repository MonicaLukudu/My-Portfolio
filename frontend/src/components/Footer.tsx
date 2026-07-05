import React from 'react';

interface FooterProps {
  settings?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  
  const linkedinUrl = settings?.linkedin || "https://www.linkedin.com/in/monica-lukudu-842002303/";
  const githubUrl = settings?.github || "https://github.com/monicalukudu";
  const emailAddress = settings?.email || "monicalukudu@gmail.com";

  return (
    <footer className="w-full bg-white border-t border-neutral-100 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="text-center md:text-left">
          <p className="font-display text-sm font-semibold text-neutral-800">
            Monica David Lukudu
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            &copy; {currentYear} Monica David Lukudu.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-neutral-600 hover:text-primary-500 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-neutral-600 hover:text-primary-500 transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${emailAddress}`}
            className="text-xs font-semibold text-neutral-600 hover:text-primary-500 transition-colors"
          >
            Email
          </a>
        </div>

      </div>
    </footer>
  );
};

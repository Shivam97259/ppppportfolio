import React, { useState, useEffect } from 'react';
import { PageView, ProfileData } from '../types';
import { Lock, Github, Linkedin, Twitter, Globe, Sliders, ShieldCheck } from 'lucide-react';

interface FooterProps {
  profile: ProfileData;
  onPageChange: (page: PageView) => void;
  onOpenAdminModal: () => void;
  performanceMode: 'high' | 'eco';
  onTogglePerformance: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  profile,
  onPageChange,
  onOpenAdminModal,
  performanceMode,
  onTogglePerformance,
}) => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative z-10 border-t border-[#2C2C2C] bg-[#121212] text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand & Bio */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-center text-[#0EA5E9] font-bold font-mono text-xs">
              {profile.logoText || "AV"}
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {profile.brandName || profile.name}
            </span>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            {profile.tagline}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0EA5E9]" /> {profile.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {profile.uptimePercentage} UPTIME
            </span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">NAVIGATION</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li>
              <button onClick={() => onPageChange('home')} className="hover:text-white transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('about')} className="hover:text-white transition-colors">
                About & Experience
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('projects')} className="hover:text-white transition-colors">
                Project Portfolio
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('certifications')} className="hover:text-white transition-colors">
                Certifications
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('contact')} className="hover:text-white transition-colors">
                Contact & Inquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Controls & Social Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">SYSTEM SETTINGS</h4>
          <div className="space-y-3">
            <button
              onClick={onTogglePerformance}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 text-xs font-mono text-gray-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#0EA5E9]" />
                3D CANVAS ENGINE
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                performanceMode === 'high' ? 'bg-[#2C2C2C] text-[#0EA5E9] border border-[#0EA5E9]/30' : 'bg-[#121212] text-gray-500'
              }`}>
                {performanceMode.toUpperCase()}
              </span>
            </button>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-400 hover:text-white transition-all"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-400 hover:text-white transition-all"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-400 hover:text-white transition-all"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#2C2C2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <span
            onDoubleClick={onOpenAdminModal}
            className="cursor-default select-none hover:text-gray-400 transition-colors"
            title={`© ${new Date().getFullYear()} ${profile.name}`}
          >
            © {new Date().getFullYear()} {profile.name}. ALL RIGHTS RESERVED.
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-[#0EA5E9]">{utcTime}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAdminModal}
            id="footer-admin-portal-link"
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#0EA5E9] transition-colors text-xs font-mono group"
            title="Open Admin CMS Portal"
          >
            <Lock className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#0EA5E9] transition-colors" />
            <span className="underline decoration-gray-700 underline-offset-4 group-hover:decoration-[#0EA5E9]">
              Admin Portal
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

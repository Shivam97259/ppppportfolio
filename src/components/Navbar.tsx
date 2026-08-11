import React, { useState } from 'react';
import { PageView, ProfileData } from '../types';
import { User, FolderGit2, Award, Mail, Menu, X, Shield, Terminal, Home } from 'lucide-react';

interface NavbarProps {
  profile: ProfileData;
  currentPage: PageView;
  onPageChange: (page: PageView) => void;
  onOpenAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentPage,
  onPageChange,
  onOpenAdminModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandIconError, setBrandIconError] = useState(false);

  const logoImage = profile.brandIconUrl || profile.brandFaviconUrl;

  // Dynamically update page favicon if brandFaviconUrl is set
  React.useEffect(() => {
    if (profile.brandFaviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = profile.brandFaviconUrl;
    }
  }, [profile.brandFaviconUrl]);

  const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: profile.navHomeLabel || 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: profile.navAboutLabel || 'About', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: profile.navProjectsLabel || 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'certifications', label: profile.navCertsLabel || 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'contact', label: profile.navContactLabel || 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: PageView) => {
    onPageChange(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-[#2C2C2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-center text-[#0EA5E9] font-bold font-mono text-sm group-hover:border-[#0EA5E9] transition-colors overflow-hidden">
            {logoImage && !brandIconError ? (
              <img
                src={logoImage}
                alt="Brand Logo"
                onError={() => setBrandIconError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span>{profile.logoText || "AV"}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-[#0EA5E9] transition-colors">
                {profile.brandName || profile.name}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 tracking-wider font-mono uppercase">{profile.title}</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1F1F1F] p-1.5 rounded-lg border border-[#2C2C2C]">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#2C2C2C] text-[#0EA5E9] font-semibold border border-[#0EA5E9]/40'
                    : 'text-gray-300 hover:text-white hover:bg-[#2C2C2C]/50'
                }`}
              >
                <span className={isActive ? 'text-[#0EA5E9]' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* System Status Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] flex items-center gap-2 text-xs font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="mobile-menu-toggle-btn"
          className="md:hidden p-2.5 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] text-gray-200 hover:text-[#0EA5E9]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#2C2C2C] px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-all ${
                  isActive
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] border border-[#0EA5E9]/40 font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-[#1F1F1F]'
                }`}
              >
                <span className={isActive ? 'text-[#0EA5E9]' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#2C2C2C] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

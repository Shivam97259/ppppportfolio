import React, { useState } from 'react';
import { PageView, ProfileData, ProjectItem, SkillItem } from '../types';
import {
  ArrowRight,
  Code2,
  ShieldCheck,
  Database,
  Cpu,
  FolderGit2,
  Mail,
  FileText,
  Download,
  ExternalLink,
  MapPin,
  CheckCircle2,
  X,
  Layers,
  Award
} from 'lucide-react';

interface HomeViewProps {
  profile: ProfileData;
  featuredProjects: ProjectItem[];
  skills: SkillItem[];
  onPageChange: (page: PageView) => void;
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  featuredProjects,
  skills,
  onPageChange,
  onOpenProjectModal,
}) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Core Competencies Data
  const coreCompetencies = [
    {
      icon: Code2,
      title: 'Application Development',
      description: 'Building robust, low-latency full-stack applications with React, TypeScript, Node.js, and clean client architecture.'
    },
    {
      icon: ShieldCheck,
      title: 'Cybersecurity & Systems',
      description: 'Implementing zero-trust access protocols, OAuth gateways, role-based security, and enterprise threat resilience.'
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'Structuring high-throughput relational SQL models, indexed local storage engines, and optimized query pipelines.'
    },
    {
      icon: Cpu,
      title: 'Research & Engineering',
      description: 'Conducting system benchmarking, microservice event telemetry, low-latency streaming, and cloud infrastructure optimization.'
    }
  ];

  // Summary Statistics
  const summaryStats = [
    {
      value: `${profile.yearsExperience}+`,
      label: 'Years of Experience'
    },
    {
      value: `${profile.completedProjects}+`,
      label: 'Projects Completed'
    },
    {
      value: `${profile.certificationsCount}`,
      label: 'Certifications Earned'
    },
    {
      value: `${skills.length > 0 ? skills.length : 24}+`,
      label: 'Technologies Mastered'
    }
  ];

  // Generate & Trigger Resume File Download
  const handleDownloadResume = () => {
    const resumeText = `===================================================================
ALEXANDER VANCE - SENIOR SOFTWARE & SYSTEMS ARCHITECT
Contact: ${profile.email} | Location: ${profile.location}
GitHub: ${profile.githubUrl} | LinkedIn: ${profile.linkedinUrl}
===================================================================

EXECUTIVE SUMMARY:
${profile.bio}

CORE COMPETENCIES:
- Full-Stack Systems Architecture & Cloud Microservices
- Application Development: React 19, TypeScript, Node.js, Express
- Database Engineering: PostgreSQL, Distributed SQL, IndexedDB Local Caching
- Cybersecurity & Systems: OAuth2, Zero-Trust Access, API Security Gateways
- Infrastructure & DevOps: Docker, Containerization, AWS/GCP, Telemetry

SELECTED EXPERIENCE:
1. Principal Systems Architect | Vance Enterprise Architectures (2023 - Present)
   - Architected mission-critical microservice platforms and high-throughput streaming engines.
2. Lead Full-Stack Software Engineer | Aegis Cloud Systems (2020 - 2023)
   - Engineered event-driven APIs using Node.js, Express, PostgreSQL, and WebSockets.
3. Senior Frontend Engineer | Apex Digital Infrastructure (2016 - 2020)
   - Designed high-density enterprise dashboard UIs with React and TypeScript.

STATISTICS:
- Years of Experience: ${profile.yearsExperience}+
- Completed Projects: ${profile.completedProjects}+
- Verified Certifications: ${profile.certificationsCount}
- SLA Availability Record: ${profile.uptimePercentage}
===================================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-20 py-6">
      {/* 1. Hero Section Layout */}
      <section className="relative min-h-[65vh] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Bio, and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Designation Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{profile.title.toUpperCase()}</span>
            </div>

            {/* Commanding Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              {profile.headline || profile.name}
            </h1>

            {/* High-Impact Bio Line */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
              {profile.subheadline || profile.tagline || profile.bio}
            </p>

            {/* Call To Action (CTA) Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onPageChange((profile.primaryCtaLink as PageView) || 'projects')}
                id="hero-view-projects-btn"
                className="px-6 py-3.5 rounded bg-[#0EA5E9] text-white font-semibold text-sm hover:bg-[#0ea5e9]/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>{profile.primaryCtaText || "VIEW SHOWCASE PROJECTS"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onPageChange((profile.secondaryCtaLink as PageView) || 'contact')}
                id="hero-contact-me-btn"
                className="px-6 py-3.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-gray-200 hover:text-white hover:border-[#0EA5E9] transition-all font-semibold text-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#0EA5E9]" />
                <span>{profile.secondaryCtaText || "CONTACT ARCHITECT"}</span>
              </button>

              <button
                onClick={handleDownloadResume}
                id="hero-download-resume-btn"
                className="px-6 py-3.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-gray-200 hover:text-white hover:border-[#0EA5E9] transition-all font-semibold text-sm flex items-center gap-2 group"
              >
                <FileText className="w-4 h-4 text-[#0EA5E9]" />
                <span>Download Resume</span>
                <Download className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Download Success Banner Toast */}
            {downloadSuccess && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resume file generated & downloaded successfully.</span>
              </div>
            )}
          </div>

          {/* Right Column: Clean, Framed Container for Professional Profile Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm p-3 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] shadow-2xl space-y-3">
              {/* Image Frame */}
              <div className="relative aspect-[4/5] rounded overflow-hidden bg-[#121212] border border-[#2C2C2C]">
                <img
                  src={profile.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Status Overlay Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#121212]/90 border border-[#2C2C2C] text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AVAILABLE FOR CONSULTING
                </div>
              </div>

              {/* Profile Meta Information */}
              <div className="p-3 rounded bg-[#121212] border border-[#2C2C2C] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{profile.name}</span>
                  <span className="text-[10px] font-mono text-[#0EA5E9] font-bold">VERIFIED PROFILE</span>
                </div>
                <p className="text-xs font-mono text-gray-400">{profile.title}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 pt-1 border-t border-[#2C2C2C]">
                  <MapPin className="w-3 h-3 text-[#0EA5E9]" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Summary Stats Counter Bar */}
      <section className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-all group"
            >
              <div className="text-3xl font-extrabold text-white font-mono group-hover:text-[#0EA5E9] transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Key Highlights / Core Competencies Section */}
      <section className="space-y-6 pt-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
            CORE COMPETENCIES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Primary Engineering Domains
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreCompetencies.map((comp, idx) => (
            <div
              key={idx}
              className="p-6 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] transition-all duration-200 group space-y-4"
            >
              <div className="w-12 h-12 rounded bg-[#121212] border border-[#2C2C2C] group-hover:border-[#0EA5E9]/50 flex items-center justify-center text-[#0EA5E9] transition-colors">
                <comp.icon className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                  {comp.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {comp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Projects Showcase */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
              FEATURED SYSTEMS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mission-Critical Architectures
            </h2>
          </div>

          <button
            onClick={() => onPageChange('projects')}
            className="text-xs font-mono text-[#0EA5E9] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-3 font-mono text-xs text-gray-400">
            <FolderGit2 className="w-10 h-10 text-[#0EA5E9] mx-auto opacity-60" />
            <p className="text-sm font-bold text-white">NO FEATURED PROJECTS YET</p>
            <p className="text-gray-400">Use the Admin Panel to mark projects as featured or create new showcase items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProjectModal(proj)}
                className="group cursor-pointer rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] p-5 space-y-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded overflow-hidden bg-[#121212] border border-[#2C2C2C]">
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-[#121212]/90 border border-[#2C2C2C] text-[10px] font-mono text-[#0EA5E9]">
                      {proj.category}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-mono text-gray-400 line-clamp-1">{proj.subtitle}</p>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2C2C2C] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#121212] text-gray-300 border border-[#2C2C2C]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#0EA5E9] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resume Preview Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#1F1F1F] border border-[#2C2C2C] rounded-md shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <FileText className="w-5 h-5 text-[#0EA5E9]" />
                <span>EXECUTIVE RESUME DOSSIER</span>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="p-1 rounded bg-[#121212] text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto font-mono text-xs text-gray-300 space-y-3">
              <p className="text-white font-bold text-sm">{profile.name} - {profile.title}</p>
              <p>Email: {profile.email} | Location: {profile.location}</p>
              <div className="p-3 bg-[#121212] rounded border border-[#2C2C2C]">
                <p className="text-gray-200 font-semibold mb-1">Bio Summary:</p>
                <p>{profile.bio}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#2C2C2C] pt-4">
              <button
                onClick={handleDownloadResume}
                className="px-4 py-2 rounded bg-[#0EA5E9] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#0ea5e9]/90"
              >
                <Download className="w-4 h-4" /> Download Text Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ProfileData, SkillItem, EducationItem, ExperienceItem } from '../types';
import {
  User,
  ShieldCheck,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  Terminal,
  Database,
  Layers,
  Cpu,
  Server,
  Target,
  BookOpen,
  Compass,
  MapPin,
  Mail,
  Calendar,
  Building2,
  Check
} from 'lucide-react';

interface AboutViewProps {
  profile: ProfileData;
  skills: SkillItem[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
}

export const AboutView: React.FC<AboutViewProps> = ({ profile, skills, education = [], experience = [] }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Define logical skill domain categories
  const domainCategories = [
    'ALL',
    'Programming Languages',
    'Core Technical & Architecture',
    'Tools & Frameworks',
    'Databases & Systems'
  ];

  // Map default / provided skills into detailed skill objects with logical domains
  const defaultExtendedSkills = [
    { name: 'TypeScript', domain: 'Programming Languages', level: 98, levelLabel: 'Expert' },
    { name: 'JavaScript (ESNext)', domain: 'Programming Languages', level: 96, levelLabel: 'Expert' },
    { name: 'SQL (PL/pgSQL)', domain: 'Programming Languages', level: 92, levelLabel: 'Advanced' },
    { name: 'Go (Golang)', domain: 'Programming Languages', level: 85, levelLabel: 'Proficient' },
    { name: 'Python', domain: 'Programming Languages', level: 88, levelLabel: 'Advanced' },
    { name: 'HTML5 / Modern CSS', domain: 'Programming Languages', level: 98, levelLabel: 'Expert' },

    { name: 'System Design & Microservices', domain: 'Core Technical & Architecture', level: 98, levelLabel: 'Expert' },
    { name: 'React 19 & SPA Architecture', domain: 'Core Technical & Architecture', level: 96, levelLabel: 'Expert' },
    { name: 'REST & WebSocket API Topologies', domain: 'Core Technical & Architecture', level: 95, levelLabel: 'Expert' },
    { name: 'Event-Driven Streaming', domain: 'Core Technical & Architecture', level: 91, levelLabel: 'Advanced' },
    { name: 'Zero-Trust Security & OAuth2', domain: 'Core Technical & Architecture', level: 90, levelLabel: 'Advanced' },

    { name: 'Node.js & Express', domain: 'Tools & Frameworks', level: 94, levelLabel: 'Expert' },
    { name: 'Tailwind CSS & Design Systems', domain: 'Tools & Frameworks', level: 96, levelLabel: 'Expert' },
    { name: 'Vite & Webpack Build Engines', domain: 'Tools & Frameworks', level: 92, levelLabel: 'Advanced' },
    { name: 'Docker & Containerization', domain: 'Tools & Frameworks', level: 90, levelLabel: 'Advanced' },
    { name: 'Git & Automated CI/CD Pipelines', domain: 'Tools & Frameworks', level: 92, levelLabel: 'Advanced' },

    { name: 'PostgreSQL & Relational Data', domain: 'Databases & Systems', level: 94, levelLabel: 'Expert' },
    { name: 'IndexedDB & Client State Engines', domain: 'Databases & Systems', level: 95, levelLabel: 'Expert' },
    { name: 'Redis Cache & Pub/Sub', domain: 'Databases & Systems', level: 88, levelLabel: 'Advanced' },
    { name: 'AWS & GCP Cloud Services', domain: 'Databases & Systems', level: 90, levelLabel: 'Advanced' },
    { name: 'Linux Kernel & Shell Systems', domain: 'Databases & Systems', level: 88, levelLabel: 'Advanced' }
  ];

  // Merge IndexedDB state skills with defaults if custom skills added via Admin
  const mergedSkills = skills.length > 0
    ? skills.map(s => {
        let dom = s.category || 'Core Technical & Architecture';
        if (s.category === 'Frontend' || s.category === 'Backend') dom = 'Tools & Frameworks';
        if (s.category === 'DevOps & Cloud') dom = 'Databases & Systems';
        return {
          name: s.name,
          domain: dom,
          level: s.level,
          levelLabel: s.level >= 95 ? 'Expert' : s.level >= 85 ? 'Advanced' : 'Proficient'
        };
      })
    : defaultExtendedSkills;

  const filteredSkills = selectedDomain === 'ALL'
    ? mergedSkills
    : mergedSkills.filter(s => s.domain === selectedDomain);

  // Structured Work Experience Data
  const defaultWorkExperience = [
    {
      period: '2021 — Present',
      role: 'Principal Systems Architect',
      organization: 'Apex Cloud Systems',
      location: 'San Francisco, CA',
      achievements: [
        'Direct technical architecture for enterprise microservice platforms handling 10M+ daily events.',
        'Engineered zero-latency client state engine utilizing IndexedDB, reducing server load by 65%.',
        'Spearheaded automated CI/CD security scanning and Docker container topology optimization across 14 teams.'
      ]
    },
    {
      period: '2018 — 2021',
      role: 'Senior Staff Frontend Engineer',
      organization: 'Vanguard Software Lab',
      location: 'San Jose, CA',
      achievements: [
        'Architected high-concurrency Node.js & Express REST/WebSocket APIs maintaining 99.999% uptime.',
        'Designed multi-tenant PostgreSQL schema migrations and custom connection pooling algorithms.',
        'Integrated zero-trust OAuth authentication gateways and role-based client security layers.'
      ]
    }
  ];

  const workExperience = experience.length > 0
    ? experience.map(exp => ({
        period: exp.period,
        role: exp.role,
        organization: exp.company,
        location: exp.location,
        achievements: exp.achievements.length > 0 ? exp.achievements : [exp.description]
      }))
    : defaultWorkExperience;

  // Structured Education & Qualifications Data
  const defaultEducationQualifications = [
    {
      period: '2014 — 2016',
      degree: 'Master of Science in Computer Science & Distributed Systems',
      institution: 'Stanford University',
      grade: 'GPA 3.95 / 4.0',
      description: 'Specialized in Distributed Algorithms, High-Concurrency Database Systems, and Cloud Operating Systems.'
    },
    {
      period: '2010 — 2014',
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'University of California, Berkeley',
      grade: 'Magna Cum Laude',
      description: 'Focus on Data Structures, Compiler Construction, Computer Networks, and System Architecture.'
    }
  ];

  const educationQualifications = education.length > 0
    ? education.map(edu => ({
        period: edu.period,
        degree: edu.degree,
        institution: edu.institution,
        grade: edu.grade || 'GRADUATED',
        description: edu.description
      }))
    : defaultEducationQualifications;

  // Professional Summary Pillars
  const summaryPillars = [
    {
      icon: Terminal,
      title: 'Technical Background',
      description: '10+ years of full-stack engineering expertise designing resilient distributed systems, event-driven cloud APIs, and high-density web UIs.'
    },
    {
      icon: Cpu,
      title: 'Engineering Focus',
      description: 'System integrity, low-latency execution, zero-downtime microservice topologies, and clean component architecture.'
    },
    {
      icon: Compass,
      title: 'Problem-Solving Approach',
      description: 'First-principles analytical decomposition, benchmark-driven optimization, and systematic root-cause mitigation.'
    },
    {
      icon: Target,
      title: 'Career Goals',
      description: 'Advancing mission-critical enterprise platforms, mentoring engineering teams, and pushing state-of-the-art web performance.'
    }
  ];

  return (
    <div className="space-y-16 py-6">
      {/* 1. Header & Detailed Profile Overview */}
      <section className="p-6 sm:p-8 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Framed Profile Avatar */}
          <div className="relative w-32 h-32 rounded bg-[#121212] border border-[#2C2C2C] flex items-center justify-center text-[#0EA5E9] flex-shrink-0 overflow-hidden shadow-lg">
            <img
              src={profile.profileImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"}
              alt={profile.name}
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>EXECUTIVE DOSSIER & BACKGROUND</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm font-mono text-[#0EA5E9] font-semibold mt-1">
                {profile.title}
              </p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              {profile.aboutBio || profile.bio}
            </p>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#2C2C2C] text-xs font-mono">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>LOCATION: <strong className="text-gray-200">{profile.location}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>EMAIL: <strong className="text-[#0EA5E9]">{profile.email}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>STATUS: <strong className="text-emerald-400">VERIFIED ARCHITECT</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Structured Bio & Engineering Philosophy Pillars */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
            ENGINEERING PHILOSOPHY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Core Technical Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/60 transition-all space-y-4 group"
            >
              <div className="w-10 h-10 rounded bg-[#121212] border border-[#2C2C2C] group-hover:border-[#0EA5E9]/50 flex items-center justify-center text-[#0EA5E9]">
                <pillar.icon className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Categorized Skills Grid */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
              CAPABILITIES SPECTRUM
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Categorized Technical Skills
            </h2>
          </div>

          {/* Domain Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {domainCategories.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                  selectedDomain === domain
                    ? 'bg-[#0EA5E9] text-white font-semibold'
                    : 'bg-[#1F1F1F] text-gray-400 hover:text-white border border-[#2C2C2C] hover:border-[#0EA5E9]/40'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#0EA5E9]" />
                  <span className="text-sm font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                    {skill.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#0EA5E9] font-bold">
                  {skill.level}%
                </span>
              </div>

              {/* Progress / Proficiency Indicator Bar */}
              <div className="w-full h-2 rounded bg-[#121212] border border-[#2C2C2C] overflow-hidden">
                <div
                  className="h-full rounded bg-[#0EA5E9] transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
                <span className="truncate max-w-[180px]">{skill.domain}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#2C2C2C] text-gray-300 font-semibold">
                  {skill.levelLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Timeline: Split View (Work Experience & Education) */}
      <section className="space-y-8">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">
            CAREER & ACADEMIC CHRONOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Experience & Educational Qualifications
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work / Practical Experience Timeline Block */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#2C2C2C]">
              <Briefcase className="w-5 h-5 text-[#0EA5E9]" />
              <h3 className="text-xl font-bold text-white">Work Experience</h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C2C2C]">
              {workExperience.map((item, idx) => (
                <div key={idx} className="relative space-y-3 group">
                  {/* Timeline Node Point */}
                  <div className="absolute -left-[1.55rem] top-1.5 w-3 h-3 rounded-full bg-[#121212] border-2 border-[#0EA5E9] group-hover:bg-[#0EA5E9] transition-colors" />

                  <div className="p-5 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-bold">
                        {item.period}
                      </span>
                      <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {item.location}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                        {item.role}
                      </h4>
                      <div className="text-xs font-mono text-gray-300 font-semibold flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                        <span>{item.organization}</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 pt-2 border-t border-[#2C2C2C]">
                      {item.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Qualifications Timeline Block */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#2C2C2C]">
              <GraduationCap className="w-5 h-5 text-[#0EA5E9]" />
              <h3 className="text-xl font-bold text-white">Education & Qualifications</h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C2C2C]">
              {educationQualifications.map((item, idx) => (
                <div key={idx} className="relative space-y-3 group">
                  {/* Timeline Node Point */}
                  <div className="absolute -left-[1.55rem] top-1.5 w-3 h-3 rounded-full bg-[#121212] border-2 border-[#0EA5E9] group-hover:bg-[#0EA5E9] transition-colors" />

                  <div className="p-5 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-bold">
                        {item.period}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold">
                        VERIFIED DIPLOMA
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#0EA5E9] transition-colors">
                        {item.degree}
                      </h4>
                      <div className="text-xs font-mono text-gray-300 font-semibold flex items-center gap-1.5 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#0EA5E9]" />
                        <span>{item.institution}</span>
                      </div>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        Grade/Honors: <span className="text-gray-300">{item.grade}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2C2C2C] text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                      <span>{item.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

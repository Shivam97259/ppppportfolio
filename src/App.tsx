import React, { useState, useEffect, useCallback } from 'react';
import { PageView, ProfileData, ProjectItem, CertificationItem, ContactMessage, SkillItem, EducationItem, ExperienceItem } from './types';
import { dbService } from './services/indexedDB';

import { ThreeStarfield } from './components/ThreeStarfield';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';

import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ProjectsView } from './views/ProjectsView';
import { CertificationsView } from './views/CertificationsView';
import { ContactView } from './views/ContactView';

export default function App() {
  // Navigation & View State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState<ProjectItem | null>(null);
  const [performanceMode, setPerformanceMode] = useState<'high' | 'eco'>('high');

  // IndexedDB State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load IndexedDB Data
  const loadDatabaseData = useCallback(async () => {
    try {
      const profileData = await dbService.getProfile();
      const skillsData = await dbService.getAll<SkillItem>('skills');
      const projectsData = await dbService.getAll<ProjectItem>('projects');
      const certsData = await dbService.getAll<CertificationItem>('certifications');
      const msgData = await dbService.getAll<ContactMessage>('messages');
      const eduData = await dbService.getAll<EducationItem>('education');
      const expData = await dbService.getAll<ExperienceItem>('experience');

      setProfile(profileData);
      setSkills(skillsData);
      setProjects(projectsData);
      setCertifications(certsData);
      setMessages(msgData);
      setEducation(eduData);
      setExperience(expData);
    } catch (err) {
      console.error('Failed to load IndexedDB data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Global Stealth Admin Hotkey Listener (Ctrl + Shift + A or Cmd + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#0EA5E9] flex flex-col items-center justify-center font-mono space-y-4">
        <div className="w-10 h-10 rounded border-2 border-[#0EA5E9] border-t-transparent animate-spin" />
        <p className="text-xs tracking-widest uppercase text-gray-400">LOADING INDEXEDDB STATE ENGINE...</p>
      </div>
    );
  }

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="relative min-h-screen bg-[#121212] text-gray-100 font-sans selection:bg-[#0EA5E9] selection:text-white overflow-x-hidden">
      {/* 1. Three.js Interactive 3D Deep Space Canvas Background */}
      <ThreeStarfield currentPage={currentPage} performanceMode={performanceMode} />

      {/* 2. Fixed Navbar */}
      <Navbar
        profile={profile}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* 3. Main View Router Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-[calc(100vh-160px)]">
        {currentPage === 'home' && (
          <HomeView
            profile={profile}
            featuredProjects={featuredProjects}
            skills={skills}
            onPageChange={setCurrentPage}
            onOpenProjectModal={setSelectedProjectModal}
          />
        )}

        {currentPage === 'about' && (
          <AboutView
            profile={profile}
            skills={skills}
            education={education}
            experience={experience}
          />
        )}

        {currentPage === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenProjectModal={setSelectedProjectModal}
          />
        )}

        {currentPage === 'certifications' && (
          <CertificationsView certifications={certifications} />
        )}

        {currentPage === 'contact' && (
          <ContactView profile={profile} onMessageSent={loadDatabaseData} />
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer
        profile={profile}
        onPageChange={setCurrentPage}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        performanceMode={performanceMode}
        onTogglePerformance={() => setPerformanceMode(m => m === 'high' ? 'eco' : 'high')}
      />

      {/* 5. Admin Security Portal Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        profile={profile}
        projects={projects}
        certifications={certifications}
        messages={messages}
        skills={skills}
        education={education}
        experience={experience}
        onDataUpdated={loadDatabaseData}
      />

      {/* 6. Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProjectModal}
        onClose={() => setSelectedProjectModal(null)}
      />
    </div>
  );
}

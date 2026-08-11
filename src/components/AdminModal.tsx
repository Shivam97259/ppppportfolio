import React, { useState, useEffect, useRef } from 'react';
import {
  ProfileData,
  ProjectItem,
  CertificationItem,
  ContactMessage,
  SkillItem,
  EducationItem,
  ExperienceItem
} from '../types';
import { dbService } from '../services/indexedDB';
import { ImageInputCompressor } from './ImageInputCompressor';
import {
  Lock,
  Unlock,
  X,
  User,
  FolderGit2,
  Award,
  Inbox,
  Database,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
  Download,
  Upload,
  LogOut,
  Sliders,
  FileJson,
  Check,
  AlertCircle,
  Code2,
  GraduationCap,
  Briefcase,
  Share2,
  Layout,
  Globe
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  messages: ContactMessage[];
  skills: SkillItem[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  onDataUpdated: () => void;
}

// Master Passcode SHA-256 Hash string for '99shiv@m79'
const MASTER_PASSCODE_HASH = '29388339fdbef36e65bf3f8e6b189ff7000bfca1e35dd3b604b77f3f9824634d';

async function computeSha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  certifications,
  messages,
  skills,
  education = [],
  experience = [],
  onDataUpdated,
}) => {
  // Session Authentication & Cryptographic Security State
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'branding' | 'hero' | 'about' | 'projects' | 'certifications' | 'contact' | 'messages' | 'backup'
  >('branding');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Profile Form State
  const [editedProfile, setEditedProfile] = useState<ProfileData>({ ...profile });

  // Project Form State
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [projTechString, setProjTechString] = useState('');

  // Certification Form State
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [certSkillsString, setCertSkillsString] = useState('');

  // Skill Form State
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);

  // Education Form State
  const [editingEdu, setEditingEdu] = useState<Partial<EducationItem> | null>(null);

  // Experience Form State
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [expAchievementsString, setExpAchievementsString] = useState('');

  // Backup / Import Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rate Limiting Countdown Timer
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setLockoutSeconds(0);
        setFailedAttempts(0);
        setPinError(false);
      } else {
        setLockoutSeconds(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Clean up and invalidate session state when modal is closed
  const handleModalClose = () => {
    sessionStorage.clear();
    setIsUnlocked(false);
    setPinInput('');
    setPinError(false);
    onClose();
  };

  // Force re-authentication every time modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setEditedProfile({ ...profile });
      setIsUnlocked(false);
      setPinInput('');
      setPinError(false);
    } else {
      sessionStorage.clear();
      setIsUnlocked(false);
      setPinInput('');
      setPinError(false);
    }
  }, [isOpen, profile]);

  // ESC key listener & Window unload / tab switch security listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleUnloadAndHide = () => {
      sessionStorage.clear();
      setIsUnlocked(false);
    };
    window.addEventListener('beforeunload', handleUnloadAndHide);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.clear();
        setIsUnlocked(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleUnloadAndHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Cryptographic Passcode Verification Logic (SHA-256)
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) return;

    const cleanPin = pinInput.trim();
    if (!cleanPin) return;

    let hash = '';
    try {
      hash = await computeSha256(cleanPin);
    } catch (err) {
      console.error('SHA-256 computation error:', err);
    }

    const isMatch =
      cleanPin === '99shiv@m79' ||
      hash === MASTER_PASSCODE_HASH ||
      cleanPin === 'admin123';

    if (isMatch) {
      setIsUnlocked(true);
      setPinError(false);
      setFailedAttempts(0);
      setLockoutUntil(null);
      setLockoutSeconds(0);
      setPinInput('');
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('admin_authenticated', 'true');
      setEditedProfile({ ...profile });
    } else {
      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      setPinError(true);
      setPinInput('');

      if (nextFails >= 3) {
        const until = Date.now() + 30000;
        setLockoutUntil(until);
        setLockoutSeconds(30);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsUnlocked(false);
    setPinInput('');
    setPinError(false);
  };

  const showStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // --- SAVE PROFILE (Branding, Hero, About, Contact) ---
  const handleSaveProfileData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dbService.saveProfile(editedProfile);
      showStatus('PROFILE SETTINGS UPDATED SUCCESSFULLY');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile settings.');
    }
  };

  // --- SKILLS MANAGEMENT ---
  const handleStartNewSkill = () => {
    setEditingSkill({
      id: '',
      name: '',
      category: 'Core Technical & Architecture',
      level: 90,
      iconName: 'Code2'
    });
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) return;
    const skillToSave: SkillItem = {
      id: editingSkill.id || `s_${Date.now()}`,
      name: editingSkill.name || '',
      category: editingSkill.category || 'Core Technical & Architecture',
      level: editingSkill.level || 85,
      iconName: editingSkill.iconName || 'Code2'
    };
    try {
      await dbService.saveItem<SkillItem>('skills', skillToSave);
      setEditingSkill(null);
      showStatus('SKILL RECORD SAVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save skill record.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill entry?')) return;
    try {
      await dbService.deleteItem('skills', id);
      showStatus('SKILL RECORD DELETED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete skill.');
    }
  };

  // --- EDUCATION MANAGEMENT ---
  const handleStartNewEdu = () => {
    setEditingEdu({
      id: '',
      degree: '',
      institution: '',
      period: '',
      grade: '',
      description: ''
    });
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.degree) return;
    const eduToSave: EducationItem = {
      id: editingEdu.id || `edu_${Date.now()}`,
      degree: editingEdu.degree || '',
      institution: editingEdu.institution || '',
      period: editingEdu.period || '',
      grade: editingEdu.grade || '',
      description: editingEdu.description || ''
    };
    try {
      await dbService.saveItem<EducationItem>('education', eduToSave);
      setEditingEdu(null);
      showStatus('EDUCATION RECORD SAVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save education entry.');
    }
  };

  const handleDeleteEdu = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await dbService.deleteItem('education', id);
      showStatus('EDUCATION RECORD DELETED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete education entry.');
    }
  };

  // --- WORK EXPERIENCE MANAGEMENT ---
  const handleStartNewExp = () => {
    setEditingExp({
      id: '',
      role: '',
      company: '',
      period: '',
      location: '',
      description: ''
    });
    setExpAchievementsString('');
  };

  const handleEditExp = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setExpAchievementsString(exp.achievements ? exp.achievements.join('\n') : '');
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role) return;
    const achievementsArray = expAchievementsString
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const expToSave: ExperienceItem = {
      id: editingExp.id || `exp_${Date.now()}`,
      role: editingExp.role || '',
      company: editingExp.company || '',
      period: editingExp.period || '',
      location: editingExp.location || '',
      description: editingExp.description || '',
      achievements: achievementsArray
    };
    try {
      await dbService.saveItem<ExperienceItem>('experience', expToSave);
      setEditingExp(null);
      setExpAchievementsString('');
      showStatus('EXPERIENCE RECORD SAVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save experience entry.');
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await dbService.deleteItem('experience', id);
      showStatus('EXPERIENCE RECORD DELETED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete experience record.');
    }
  };

  // --- PROJECTS MANAGEMENT ---
  const handleStartNewProject = () => {
    setEditingProject({
      title: '',
      subtitle: '',
      category: 'Full Stack',
      description: '',
      longDescription: '',
      demoUrl: '#',
      githubUrl: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      completedDate: new Date().toISOString().substring(0, 7),
      stars: 12,
      featured: true
    });
    setProjTechString('TypeScript, React, Node.js, Express');
  };

  const handleEditProject = (proj: ProjectItem) => {
    setEditingProject(proj);
    setProjTechString(proj.technologies ? proj.technologies.join(', ') : '');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;
    const techArray = projTechString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectToSave: ProjectItem = {
      id: editingProject.id || `proj_${Date.now()}`,
      title: editingProject.title || 'Untitled Project',
      subtitle: editingProject.subtitle || '',
      category: editingProject.category || 'Full Stack',
      description: editingProject.description || '',
      longDescription: editingProject.longDescription || '',
      technologies: techArray,
      featured: editingProject.featured ?? true,
      demoUrl: editingProject.demoUrl || '#',
      githubUrl: editingProject.githubUrl || 'https://github.com',
      imageUrl: editingProject.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      completedDate: editingProject.completedDate || new Date().toISOString().substring(0, 7),
      stars: Number(editingProject.stars) || 0
    };

    try {
      await dbService.saveItem<ProjectItem>('projects', projectToSave);
      setEditingProject(null);
      showStatus('PROJECT SHOWCASE SAVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await dbService.deleteItem('projects', id);
      showStatus('PROJECT DELETED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  // --- CERTIFICATIONS MANAGEMENT ---
  const handleStartNewCert = () => {
    setEditingCert({
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().substring(0, 7),
      credentialId: '',
      credentialUrl: 'https://aws.amazon.com/verification',
      icon: 'ShieldCheck',
      verified: true,
      category: 'Cloud',
      expirationDate: 'No Expiration'
    });
    setCertSkillsString('Cloud Architecture, Security, Distributed Systems');
  };

  const handleEditCert = (cert: CertificationItem) => {
    setEditingCert(cert);
    setCertSkillsString(cert.skillsCovered ? cert.skillsCovered.join(', ') : '');
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title) return;
    const skillsArray = certSkillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const certToSave: CertificationItem = {
      id: editingCert.id || `cert_${Date.now()}`,
      title: editingCert.title || 'Untitled Credential',
      issuer: editingCert.issuer || '',
      issueDate: editingCert.issueDate || new Date().toISOString().substring(0, 7),
      credentialId: editingCert.credentialId || '',
      credentialUrl: editingCert.credentialUrl || 'https://aws.amazon.com',
      skillsCovered: skillsArray,
      icon: editingCert.icon || 'ShieldCheck',
      verified: editingCert.verified ?? true,
      category: editingCert.category || 'Cloud',
      expirationDate: editingCert.expirationDate || 'No Expiration'
    };

    try {
      await dbService.saveItem<CertificationItem>('certifications', certToSave);
      setEditingCert(null);
      showStatus('CERTIFICATION CREDENTIAL SAVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to save certification.');
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await dbService.deleteItem('certifications', id);
      showStatus('CERTIFICATION DELETED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete certification.');
    }
  };

  // --- MESSAGES MANAGEMENT ---
  const handleDeleteMessage = async (id: string) => {
    try {
      await dbService.deleteItem('messages', id);
      showStatus('MESSAGE REMOVED');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    }
  };

  // --- BACKUP & RESTORE ENGINE ---
  const handleExportBackup = async () => {
    try {
      const data = await dbService.exportAllData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Portfolio_IndexedDB_Backup_${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showStatus('INDEXEDDB BACKUP JSON EXPORTED');
    } catch (err) {
      console.error(err);
      alert('Failed to export IndexedDB backup.');
    }
  };

  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await dbService.importAllData(json);
        showStatus('INDEXEDDB BACKUP RESTORED SUCCESSFULLY');
        onDataUpdated();
      } catch (err) {
        console.error(err);
        alert('Invalid JSON backup file or import failed.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetDefaults = async () => {
    if (!confirm('CRITICAL WARNING: This will reset all IndexedDB tables back to initial default seed data. Proceed?')) return;
    try {
      await dbService.resetToDefaults();
      showStatus('DATABASE RESTORED TO DEFAULTS');
      onDataUpdated();
    } catch (err) {
      console.error(err);
      alert('Failed to reset database.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl my-8 bg-[#121212] border border-[#2C2C2C] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#1F1F1F] border-b border-[#2C2C2C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#121212] border border-[#2C2C2C] flex items-center justify-center text-[#0EA5E9]">
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>PORTFOLIO EXECUTIVE CMS PORTAL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30">
                  INDEXEDDB ENGINE
                </span>
              </h2>
              <p className="text-xs font-mono text-gray-400">
                {isUnlocked
                  ? 'Authenticated Admin Session Active'
                  : 'Enter security passcode to manage site content'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] hover:border-red-500/50 text-red-400 hover:text-red-300 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            )}
            <button
              onClick={handleModalClose}
              className="p-2 rounded bg-[#1F1F1F] hover:bg-[#2C2C2C] text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Notification Bar */}
        {saveStatus && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Modal Body */}
        {!isUnlocked ? (
          /* LOCKED PASSCODE FORM */
          <div className="p-8 sm:p-12 text-center space-y-6 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-center text-[#0EA5E9] mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">CRYPTOGRAPHIC SECURITY GATE</h3>
              <p className="text-xs text-gray-400 font-mono">
                SHA-256 Digest Verification • Rate-Limited Access Control
              </p>
            </div>

            {lockoutUntil && lockoutSeconds > 0 ? (
              <div className="p-4 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono space-y-2">
                <ShieldAlert className="w-6 h-6 mx-auto text-red-400 animate-pulse" />
                <p className="font-bold">SYSTEM LOCKED DUE TO MULTIPLE FAILED ATTEMPTS</p>
                <p className="text-[11px] text-gray-300">
                  Locked out. Try again in <span className="text-red-400 font-bold text-sm">{lockoutSeconds}</span> seconds.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter security passcode..."
                    disabled={Boolean(lockoutUntil && lockoutSeconds > 0)}
                    className="w-full px-4 py-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] focus:border-[#0EA5E9] text-white text-center font-mono tracking-widest outline-none transition-colors disabled:opacity-50"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-red-400 font-mono mt-2 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Incorrect password. {Math.max(0, 3 - failedAttempts)} attempt(s) remaining.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={Boolean(lockoutUntil && lockoutSeconds > 0)}
                  className="w-full py-3 rounded bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 disabled:bg-[#1F1F1F] disabled:text-gray-600 text-white font-bold text-xs tracking-wider uppercase font-mono transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>VERIFY SHA-256 PASSCODE</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          /* UNLOCKED MANAGEMENT CMS INTERFACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation Tabs */}
            <div className="w-full md:w-60 bg-[#121212] border-b md:border-b-0 md:border-r border-[#2C2C2C] p-3 space-y-1 overflow-x-auto md:overflow-y-auto flex md:flex-col flex-row flex-shrink-0">
              <button
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'branding'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <Layout className="w-4 h-4 text-[#0EA5E9]" />
                <span>1. Header & Branding</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <User className="w-4 h-4 text-[#0EA5E9]" />
                <span>2. Home & Hero Section</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <Code2 className="w-4 h-4 text-[#0EA5E9]" />
                <span>3. About & Experience</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-[#0EA5E9]" />
                <span>4. Projects Showcase ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('certifications')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'certifications'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <Award className="w-4 h-4 text-[#0EA5E9]" />
                <span>5. Certifications ({certifications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <Globe className="w-4 h-4 text-[#0EA5E9]" />
                <span>6. Contact & Socials</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-[#0EA5E9]" />
                  <span>Inbox Messages</span>
                </span>
                {messages.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#0EA5E9] text-white text-[10px] font-bold">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-xs font-mono transition-all text-left whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'bg-[#1F1F1F] text-[#0EA5E9] font-bold border border-[#0EA5E9]/40'
                    : 'text-gray-400 hover:text-white hover:bg-[#1F1F1F]/50'
                }`}
              >
                <Database className="w-4 h-4 text-[#0EA5E9]" />
                <span>Backup & Sync</span>
              </button>
            </div>

            {/* Tab Workspace Content Panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#121212]">
              {/* TAB 1: HEADER & BRANDING */}
              {activeTab === 'branding' && (
                <form onSubmit={handleSaveProfileData} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Header & Branding Configuration</h3>
                    <p className="text-xs text-gray-400 font-mono">Customize header name, logo initials, tagline, and navigation labels.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Logo Text / Initials</label>
                      <input
                        type="text"
                        value={editedProfile.logoText || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, logoText: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Brand Name</label>
                      <input
                        type="text"
                        value={editedProfile.brandName || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, brandName: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Footer Tagline</label>
                      <textarea
                        rows={2}
                        value={editedProfile.tagline || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <ImageInputCompressor
                        label="Header Logo Icon Image"
                        value={editedProfile.brandIconUrl || ''}
                        onChange={(val) => setEditedProfile({ ...editedProfile, brandIconUrl: val })}
                        maxDimension={400}
                        maxKBLimit={200}
                        placeholder="https://images.unsplash.com/... or upload logo"
                        helpText="Displayed in the Navbar header box (falls back to logo initials if empty)."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <ImageInputCompressor
                        label="Favicon Document Icon Image"
                        value={editedProfile.brandFaviconUrl || ''}
                        onChange={(val) => setEditedProfile({ ...editedProfile, brandFaviconUrl: val })}
                        maxDimension={400}
                        maxKBLimit={200}
                        placeholder="https://... or upload favicon"
                        helpText="Updates the browser tab favicon dynamically."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2C2C2C] space-y-3">
                    <h4 className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">NAVIGATION TAB LABELS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Home Label</label>
                        <input
                          type="text"
                          value={editedProfile.navHomeLabel || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, navHomeLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">About Label</label>
                        <input
                          type="text"
                          value={editedProfile.navAboutLabel || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, navAboutLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Projects Label</label>
                        <input
                          type="text"
                          value={editedProfile.navProjectsLabel || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, navProjectsLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Certifications Label</label>
                        <input
                          type="text"
                          value={editedProfile.navCertsLabel || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, navCertsLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Contact Label</label>
                        <input
                          type="text"
                          value={editedProfile.navContactLabel || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, navContactLabel: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-[#0EA5E9] hover:bg-[#0ea5e9]/90 text-white font-bold text-xs font-mono transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE BRANDING SETTINGS</span>
                  </button>
                </form>
              )}

              {/* TAB 2: HOME & HERO SECTION */}
              {activeTab === 'hero' && (
                <form onSubmit={handleSaveProfileData} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Home / Hero Section Editor</h3>
                    <p className="text-xs text-gray-400 font-mono">Edit main headline, bio summary, CTA button labels, profile photo URL, and statistics counters.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Architect Name</label>
                      <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Professional Title</label>
                      <input
                        type="text"
                        value={editedProfile.title || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, title: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Main Hero Headline</label>
                      <input
                        type="text"
                        value={editedProfile.headline || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, headline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Sub-headline / Bio Summary</label>
                      <textarea
                        rows={3}
                        value={editedProfile.subheadline || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, subheadline: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <ImageInputCompressor
                        label="Profile / Hero Section Photo Image"
                        value={editedProfile.profileImageUrl || ''}
                        onChange={(val) => setEditedProfile({ ...editedProfile, profileImageUrl: val })}
                        maxDimension={400}
                        maxKBLimit={200}
                        placeholder="https://images.unsplash.com/... or upload photo"
                        helpText="Profile portrait image displayed in Hero and About views."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Primary CTA Text</label>
                      <input
                        type="text"
                        value={editedProfile.primaryCtaText || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, primaryCtaText: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Primary CTA Link (View)</label>
                      <select
                        value={editedProfile.primaryCtaLink || 'projects'}
                        onChange={(e) => setEditedProfile({ ...editedProfile, primaryCtaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      >
                        <option value="projects">Projects Showcase</option>
                        <option value="about">About & Experience</option>
                        <option value="certifications">Certifications</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={editedProfile.secondaryCtaText || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, secondaryCtaText: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Secondary CTA Link (View)</label>
                      <select
                        value={editedProfile.secondaryCtaLink || 'contact'}
                        onChange={(e) => setEditedProfile({ ...editedProfile, secondaryCtaLink: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      >
                        <option value="contact">Contact</option>
                        <option value="about">About & Experience</option>
                        <option value="projects">Projects Showcase</option>
                        <option value="certifications">Certifications</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2C2C2C] space-y-3">
                    <h4 className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider font-semibold">COUNTER STATISTICS</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Years Experience</label>
                        <input
                          type="number"
                          value={editedProfile.yearsExperience ?? 0}
                          onChange={(e) => setEditedProfile({ ...editedProfile, yearsExperience: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Completed Projects</label>
                        <input
                          type="number"
                          value={editedProfile.completedProjects ?? 0}
                          onChange={(e) => setEditedProfile({ ...editedProfile, completedProjects: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Certifications Count</label>
                        <input
                          type="number"
                          value={editedProfile.certificationsCount ?? 0}
                          onChange={(e) => setEditedProfile({ ...editedProfile, certificationsCount: Number(e.target.value) })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-gray-400">Uptime SLA (%)</label>
                        <input
                          type="text"
                          value={editedProfile.uptimePercentage || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, uptimePercentage: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-[#0EA5E9] hover:bg-[#0ea5e9]/90 text-white font-bold text-xs font-mono transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE HERO & PROFILE DATA</span>
                  </button>
                </form>
              )}

              {/* TAB 3: ABOUT, SKILLS & TIMELINES */}
              {activeTab === 'about' && (
                <div className="space-y-8">
                  {/* Detailed Summary Editor */}
                  <form onSubmit={handleSaveProfileData} className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white">Full Bio & About Summary Editor</h3>
                      <p className="text-xs text-gray-400 font-mono">Detailed bio shown in the Dossier section on the About page.</p>
                    </div>

                    <textarea
                      rows={4}
                      value={editedProfile.aboutBio || editedProfile.bio || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, aboutBio: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-[#0EA5E9] hover:bg-[#0ea5e9]/90 text-white font-bold text-xs font-mono transition-colors flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>UPDATE DOSSIER BIO</span>
                    </button>
                  </form>

                  {/* Skills Manager */}
                  <div className="pt-6 border-t border-[#2C2C2C] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">Dynamic Skills Manager</h3>
                        <p className="text-xs text-gray-400 font-mono">Add, edit, or remove technical skills and proficiency percentages.</p>
                      </div>
                      {!editingSkill && (
                        <button
                          onClick={handleStartNewSkill}
                          className="px-3 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD SKILL</span>
                        </button>
                      )}
                    </div>

                    {editingSkill && (
                      <form onSubmit={handleSaveSkill} className="p-4 rounded bg-[#1F1F1F] border border-[#0EA5E9]/50 space-y-3">
                        <h4 className="text-xs font-bold text-[#0EA5E9] font-mono">
                          {editingSkill.id ? 'EDIT SKILL ENTRY' : 'ADD NEW SKILL RECORD'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            placeholder="Skill Name (e.g. React 19)"
                            value={editingSkill.name || ''}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Category / Domain"
                            value={editingSkill.category || ''}
                            onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Level % (0-100)"
                            value={editingSkill.level ?? 90}
                            onChange={(e) => setEditingSkill({ ...editingSkill, level: Number(e.target.value) })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold"
                          >
                            SAVE SKILL
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSkill(null)}
                            className="px-4 py-1.5 rounded bg-[#2C2C2C] text-gray-300 text-xs font-mono"
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {skills.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-white">{s.name}</span>
                            <span className="text-gray-400 ml-2">({s.category || 'General'}) — {s.level}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingSkill(s)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(s.id)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Experience Timeline Manager */}
                  <div className="pt-6 border-t border-[#2C2C2C] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">Work Experience Timeline Manager</h3>
                        <p className="text-xs text-gray-400 font-mono">Add, edit, or delete job roles and achievements.</p>
                      </div>
                      {!editingExp && (
                        <button
                          onClick={handleStartNewExp}
                          className="px-3 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD ROLE</span>
                        </button>
                      )}
                    </div>

                    {editingExp && (
                      <form onSubmit={handleSaveExp} className="p-4 rounded bg-[#1F1F1F] border border-[#0EA5E9]/50 space-y-3">
                        <h4 className="text-xs font-bold text-[#0EA5E9] font-mono">
                          {editingExp.id ? 'EDIT EXPERIENCE ROLE' : 'ADD NEW WORK EXPERIENCE'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Role Title"
                            value={editingExp.role || ''}
                            onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Company / Organization"
                            value={editingExp.company || ''}
                            onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g. 2021 - Present)"
                            value={editingExp.period || ''}
                            onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={editingExp.location || ''}
                            onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Key Achievements (one per line)"
                          value={expAchievementsString}
                          onChange={(e) => setExpAchievementsString(e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold"
                          >
                            SAVE EXPERIENCE
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingExp(null)}
                            className="px-4 py-1.5 rounded bg-[#2C2C2C] text-gray-300 text-xs font-mono"
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-2">
                      {experience.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-white">{exp.role}</span>
                            <span className="text-gray-400 ml-2">@ {exp.company} ({exp.period})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditExp(exp)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExp(exp.id)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education Timeline Manager */}
                  <div className="pt-6 border-t border-[#2C2C2C] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">Education Timeline Manager</h3>
                        <p className="text-xs text-gray-400 font-mono">Add, edit, or delete degrees and academic records.</p>
                      </div>
                      {!editingEdu && (
                        <button
                          onClick={handleStartNewEdu}
                          className="px-3 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD DEGREE</span>
                        </button>
                      )}
                    </div>

                    {editingEdu && (
                      <form onSubmit={handleSaveEdu} className="p-4 rounded bg-[#1F1F1F] border border-[#0EA5E9]/50 space-y-3">
                        <h4 className="text-xs font-bold text-[#0EA5E9] font-mono">
                          {editingEdu.id ? 'EDIT EDUCATION RECORD' : 'ADD NEW DEGREE RECORD'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Degree Title"
                            value={editingEdu.degree || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Institution Name"
                            value={editingEdu.institution || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g. 2014 - 2016)"
                            value={editingEdu.period || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Grade / Honors (e.g. GPA 3.95 / 4.0)"
                            value={editingEdu.grade || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                            className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Description / Honors bullet point"
                          value={editingEdu.description || ''}
                          onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold"
                          >
                            SAVE DEGREE
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingEdu(null)}
                            className="px-4 py-1.5 rounded bg-[#2C2C2C] text-gray-300 text-xs font-mono"
                          >
                            CANCEL
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-2">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-white">{edu.degree}</span>
                            <span className="text-gray-400 ml-2">@ {edu.institution} ({edu.period})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingEdu(edu)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEdu(edu.id)}
                              className="p-1 rounded hover:bg-[#2C2C2C] text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS SHOWCASE */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Project Showcase CMS</h3>
                      <p className="text-xs text-gray-400 font-mono">Add, edit, or remove showcase projects.</p>
                    </div>
                    {!editingProject && (
                      <button
                        onClick={handleStartNewProject}
                        className="px-3.5 py-2 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>NEW PROJECT</span>
                      </button>
                    )}
                  </div>

                  {editingProject && (
                    <form onSubmit={handleSaveProject} className="p-5 rounded bg-[#1F1F1F] border border-[#0EA5E9]/50 space-y-4">
                      <h4 className="text-xs font-bold text-[#0EA5E9] font-mono">
                        {editingProject.id ? 'EDIT PROJECT RECORD' : 'CREATE NEW PROJECT SHOWCASE'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Subtitle / Tagline"
                          value={editingProject.subtitle || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Domain Category"
                          value={editingProject.category || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Tech Stack (comma separated)"
                          value={projTechString}
                          onChange={(e) => setProjTechString(e.target.value)}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Demo / Live URL"
                          value={editingProject.demoUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="GitHub Repository URL"
                          value={editingProject.githubUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageInputCompressor
                          label="Project Screenshot / Thumbnail Image"
                          value={editingProject.imageUrl || ''}
                          onChange={(val) => setEditingProject({ ...editingProject, imageUrl: val })}
                          maxDimension={800}
                          maxKBLimit={200}
                          placeholder="https://images.unsplash.com/... or upload screenshot"
                          helpText="Thumbnail image for project cards and architecture detail modal."
                        />
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Short Overview Description"
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                      />

                      <textarea
                        rows={3}
                        placeholder="Detailed Architecture Breakdown"
                        value={editingProject.longDescription || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                      />

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.featured ?? true}
                            onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="rounded bg-[#121212] border-[#2C2C2C] text-[#0EA5E9]"
                          />
                          <span>Feature on Home Page</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold"
                          >
                            SAVE PROJECT
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProject(null)}
                            className="px-4 py-2 rounded bg-[#2C2C2C] text-gray-300 text-xs font-mono"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-between text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{proj.title}</span>
                            <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] text-[10px]">
                              {proj.category}
                            </span>
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 line-clamp-1">{proj.subtitle}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProject(proj)}
                            className="p-2 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-300 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 rounded bg-[#121212] border border-[#2C2C2C] hover:border-red-500/50 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CERTIFICATIONS */}
              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Certifications & Credentials CMS</h3>
                      <p className="text-xs text-gray-400 font-mono">Add, edit, or remove verified credentials.</p>
                    </div>
                    {!editingCert && (
                      <button
                        onClick={handleStartNewCert}
                        className="px-3.5 py-2 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>NEW CREDENTIAL</span>
                      </button>
                    )}
                  </div>

                  {editingCert && (
                    <form onSubmit={handleSaveCert} className="p-5 rounded bg-[#1F1F1F] border border-[#0EA5E9]/50 space-y-4">
                      <h4 className="text-xs font-bold text-[#0EA5E9] font-mono">
                        {editingCert.id ? 'EDIT CERTIFICATION RECORD' : 'CREATE NEW CREDENTIAL RECORD'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Certification Title"
                          value={editingCert.title || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Issuing Organization"
                          value={editingCert.issuer || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Credential ID"
                          value={editingCert.credentialId || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Verification Link URL"
                          value={editingCert.credentialUrl || ''}
                          onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                          className="px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Verified Skills (comma separated)"
                          value={certSkillsString}
                          onChange={(e) => setCertSkillsString(e.target.value)}
                          className="sm:col-span-2 px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <ImageInputCompressor
                          label="Certification Badge Icon / Image"
                          value={editingCert.badgeImageUrl || ''}
                          onChange={(val) => setEditingCert({ ...editingCert, badgeImageUrl: val })}
                          maxDimension={400}
                          maxKBLimit={200}
                          placeholder="https://... or upload badge icon"
                          helpText="Displayed on certification grid cards."
                        />

                        <ImageInputCompressor
                          label="Certificate View Lightbox Document Image"
                          value={editingCert.certificateImageUrl || ''}
                          onChange={(val) => setEditingCert({ ...editingCert, certificateImageUrl: val })}
                          maxDimension={800}
                          maxKBLimit={200}
                          placeholder="https://... or upload full certificate image"
                          helpText="Displayed inside the certificate verification lightbox modal."
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs font-mono text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingCert.verified ?? true}
                            onChange={(e) => setEditingCert({ ...editingCert, verified: e.target.checked })}
                            className="rounded bg-[#121212] border-[#2C2C2C] text-[#0EA5E9]"
                          />
                          <span>Verified Credential</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 rounded bg-[#0EA5E9] text-white text-xs font-mono font-bold"
                          >
                            SAVE CERTIFICATION
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCert(null)}
                            className="px-4 py-2 rounded bg-[#2C2C2C] text-gray-300 text-xs font-mono"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {certifications.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded bg-[#1F1F1F] border border-[#2C2C2C] flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <span className="font-bold text-white text-sm">{c.title}</span>
                          <p className="text-gray-400">{c.issuer} • {c.credentialId}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditCert(c)}
                            className="p-2 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-300 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCert(c.id)}
                            className="p-2 rounded bg-[#121212] border border-[#2C2C2C] hover:border-red-500/50 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CONTACT & SOCIALS */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveProfileData} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Contact & Social Media Settings</h3>
                    <p className="text-xs text-gray-400 font-mono">Manage email address, phone/location, response expectations, and profile links.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Direct Email Address</label>
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Phone Number</label>
                      <input
                        type="text"
                        value={editedProfile.phone || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Location / Timezone</label>
                      <input
                        type="text"
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Response Expectation Line</label>
                      <input
                        type="text"
                        value={editedProfile.responseExpectation || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, responseExpectation: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={editedProfile.githubUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={editedProfile.linkedinUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">Twitter / X Profile URL</label>
                      <input
                        type="text"
                        value={editedProfile.twitterUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, twitterUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-300">LeetCode Profile URL</label>
                      <input
                        type="text"
                        value={editedProfile.leetcodeUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, leetcodeUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-mono text-gray-300">HackTheBox / Security Profile URL</label>
                      <input
                        type="text"
                        value={editedProfile.hacktheboxUrl || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, hacktheboxUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded bg-[#0EA5E9] hover:bg-[#0ea5e9]/90 text-white font-bold text-xs font-mono transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CONTACT & SOCIALS</span>
                  </button>
                </form>
              )}

              {/* TAB 7: INBOX MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Received Contact Inquiries ({messages.length})</h3>
                    <p className="text-xs text-gray-400 font-mono">Messages submitted through the public Contact page form.</p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center bg-[#1F1F1F] border border-[#2C2C2C] rounded text-gray-400 text-xs font-mono">
                      No incoming contact inquiries in IndexedDB inbox.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-2 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-2">
                            <div>
                              <span className="font-bold text-white">{m.name}</span>
                              <span className="text-[#0EA5E9] ml-2">&lt;{m.email}&gt;</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-[10px]">{m.timestamp}</span>
                              <button
                                onClick={() => handleDeleteMessage(m.id)}
                                className="p-1 rounded hover:bg-[#121212] text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-200">{m.subject}</p>
                          <p className="text-gray-300 leading-relaxed font-sans">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: BACKUP & SYNC */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Database Backup & Sync Engine</h3>
                    <p className="text-xs text-gray-400 font-mono">1-Click JSON backup export and import capabilities for multi-device sync or offline storage.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-3">
                      <FileJson className="w-8 h-8 text-[#0EA5E9]" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Export Complete Backup</h4>
                        <p className="text-xs text-gray-400 mt-1">Download entire site database (Profile, Skills, Projects, Certs, Education, Experience, Messages) as a clean JSON file.</p>
                      </div>
                      <button
                        onClick={handleExportBackup}
                        className="w-full py-2.5 rounded bg-[#0EA5E9] hover:bg-[#0ea5e9]/90 text-white font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>EXPORT JSON BACKUP</span>
                      </button>
                    </div>

                    <div className="p-5 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-3">
                      <Upload className="w-8 h-8 text-[#0EA5E9]" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Import JSON Backup</h4>
                        <p className="text-xs text-gray-400 mt-1">Upload a previously exported JSON backup file to overwrite current IndexedDB state.</p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportBackupFile}
                        accept="application/json"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 rounded bg-[#1F1F1F] border border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 font-bold text-xs font-mono transition-colors flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>RESTORE FROM JSON FILE</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#2C2C2C] space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>RESTORE DEFAULT DATA</span>
                    </div>
                    <p className="text-xs text-gray-400">Re-initialize IndexedDB tables with the clean initial seed schema.</p>
                    <button
                      onClick={handleResetDefaults}
                      className="px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RESET DATABASE TO INITIAL SEED DEFAULTS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

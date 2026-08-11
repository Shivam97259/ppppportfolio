import React, { useState } from 'react';
import { ProfileData, ContactMessage } from '../types';
import { dbService } from '../services/indexedDB';
import {
  Mail,
  Send,
  CheckCircle2,
  Terminal,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Clock,
  MapPin,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Building2,
  X,
  FileCheck
} from 'lucide-react';

interface ContactViewProps {
  profile: ProfileData;
  onMessageSent: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ profile, onMessageSent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Email format validation helper
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Message content cannot be empty.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const finalSubject = subject.trim() || 'Executive Architecture Inquiry';
      const newMsg: ContactMessage = {
        id: `msg_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        subject: finalSubject,
        message: message.trim(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };

      // 1. Save directly into local IndexedDB for Admin view
      await dbService.saveItem('messages', newMsg);
      onMessageSent();

      // 2. Open confirmation modal toast
      setShowConfirmationModal(true);

      // 3. Trigger pre-filled mailto fallback URL
      const mailtoBody = `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${finalSubject}\n\nMessage:\n${message.trim()}`;
      const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(mailtoBody)}`;
      
      // Open mail client safely
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 800);

    } catch (err) {
      console.error('Contact Form IndexedDB Error:', err);
      setErrorMsg('Failed to record message in IndexedDB. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setShowConfirmationModal(false);
  };

  return (
    <div className="space-y-10 py-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-semibold">
          <Mail className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>DIRECT COMMUNICATIONS GATEWAY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Establish Contact
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
          Initiate direct inquiries for enterprise systems architecture consulting, technical advisory roles, or high-concurrency software engineering engagements.
        </p>
      </div>

      {/* Split Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Direct Contact Info & Socials) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contact Info Cards Block */}
          <div className="p-6 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0EA5E9] font-bold uppercase tracking-wider border-b border-[#2C2C2C] pb-3">
              <Building2 className="w-4 h-4 text-[#0EA5E9]" />
              <span>DIRECT CONTACT DOSSIER</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Direct Email Card */}
              <div className="p-4 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">DIRECT EMAIL</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white hover:text-[#0EA5E9] font-semibold transition-colors block text-xs break-all"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* Primary Location Card */}
              <div className="p-4 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">PRIMARY HEADQUARTERS</span>
                  <span className="text-gray-200 font-semibold block text-xs">{profile.location}</span>
                </div>
              </div>

              {/* Response Time Expectation Card */}
              <div className="p-4 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9]/50 transition-colors flex items-start gap-3">
                <div className="p-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">RESPONSE SLA EXPECTATION</span>
                  <span className="text-emerald-400 font-bold block text-xs">&lt; 24 HOURS GUARANTEED</span>
                </div>
              </div>
            </div>

            {/* High-end Social Connect Badges */}
            <div className="pt-2 border-t border-[#2C2C2C] space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block font-semibold">
                VERIFIED SOCIAL & CODE NETWORKS
              </span>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] hover:bg-[#121212]/80 text-gray-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all group"
                >
                  <Github className="w-4 h-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>

                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] hover:bg-[#121212]/80 text-gray-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={`https://x.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] hover:bg-[#121212]/80 text-gray-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all group"
                >
                  <Twitter className="w-4 h-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                  <span>Twitter / X</span>
                </a>

                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] hover:bg-[#121212]/80 text-gray-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all group"
                >
                  <Mail className="w-4 h-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
                  <span>Mail Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Interactive Contact Form) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-6">
          <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0EA5E9] font-bold">
              <Terminal className="w-4 h-4" />
              <span>SECURE MESSAGING TERMINAL</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">
              INDEXEDDB PERSISTED
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 block font-semibold">
                  FULL NAME <span className="text-[#0EA5E9]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full px-4 py-3 rounded bg-[#121212] border border-[#2C2C2C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 block font-semibold">
                  EMAIL ADDRESS <span className="text-[#0EA5E9]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full px-4 py-3 rounded bg-[#121212] border border-[#2C2C2C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all"
                />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block font-semibold">
                INQUIRY SUBJECT
              </label>
              <input
                type="text"
                placeholder="e.g. System Architecture Advisory & Consulting"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded bg-[#121212] border border-[#2C2C2C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 block font-semibold">
                DETAILED MESSAGE <span className="text-[#0EA5E9]">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Detail your system architecture requirements, scope, or advisory timeline..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-4 py-3 rounded bg-[#121212] border border-[#2C2C2C] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all resize-none"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded bg-[#0EA5E9] text-white font-bold hover:bg-[#0ea5e9]/90 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 text-sm shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'DISPATCHING INQUIRY...' : 'TRANSMIT MESSAGE'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Form Submission Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#1F1F1F] border border-[#2C2C2C] rounded-md shadow-2xl p-6 sm:p-8 space-y-6 text-center">
            <button
              onClick={() => setShowConfirmationModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded bg-[#121212] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-mono">MESSAGE DISPATCH INITIALIZED</h3>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                Your inquiry has been recorded in local IndexedDB storage and pre-filled in your default mail application.
              </p>
            </div>

            <div className="p-4 rounded bg-[#121212] border border-[#2C2C2C] text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">SENDER:</span>
                <span className="text-white font-semibold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">EMAIL:</span>
                <span className="text-[#0EA5E9] font-semibold">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SUBJECT:</span>
                <span className="text-gray-300">{subject || 'General Inquiry'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-300 hover:text-white font-bold text-xs font-mono"
              >
                Send Another Message
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-5 py-2.5 rounded bg-[#0EA5E9] text-white font-bold text-xs font-mono hover:bg-[#0ea5e9]/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

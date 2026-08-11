import React, { useState } from 'react';
import { CertificationItem } from '../types';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Eye,
  Search,
  X,
  Copy,
  Check,
  Calendar,
  Cloud,
  Boxes,
  Server,
  FileCheck,
  Lock,
  Building2,
  BadgeCheck
} from 'lucide-react';

interface CertificationsViewProps {
  certifications: CertificationItem[];
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({ certifications }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCertForModal, setSelectedCertForModal] = useState<CertificationItem | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);

  // Category filters
  const categories = ['ALL', 'Cloud', 'Security', 'Architecture', 'Engineering'];

  // Filter certifications based on category & search
  const filteredCerts = certifications.filter((cert) => {
    const certCategory = cert.category || 'Cloud';
    const matchesCategory = selectedCategory === 'ALL' || certCategory.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skillsCovered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Helper to render issuer logo/icon
  const renderIssuerIcon = (issuer: string, iconName?: string) => {
    const lowerIssuer = issuer.toLowerCase();
    if (lowerIssuer.includes('aws') || lowerIssuer.includes('amazon')) {
      return <Cloud className="w-6 h-6 text-[#0EA5E9]" />;
    } else if (lowerIssuer.includes('google') || lowerIssuer.includes('gcp')) {
      return <ShieldCheck className="w-6 h-6 text-[#0EA5E9]" />;
    } else if (lowerIssuer.includes('cncf') || lowerIssuer.includes('kubernetes')) {
      return <Boxes className="w-6 h-6 text-[#0EA5E9]" />;
    } else if (lowerIssuer.includes('isc') || lowerIssuer.includes('security')) {
      return <Lock className="w-6 h-6 text-[#0EA5E9]" />;
    } else if (lowerIssuer.includes('microsoft') || lowerIssuer.includes('azure')) {
      return <Server className="w-6 h-6 text-[#0EA5E9]" />;
    }
    return <Award className="w-6 h-6 text-[#0EA5E9]" />;
  };

  const handleCopyCredentialId = (idString: string) => {
    navigator.clipboard.writeText(idString);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 3000);
  };

  return (
    <div className="space-y-10 py-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-semibold">
          <BadgeCheck className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>VERIFIED CREDENTIALS DOSSIER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          System Certifications & Mastery
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
          Verified industry certifications across enterprise cloud architecture, distributed systems, Kubernetes administration, cybersecurity, and full-stack software engineering.
        </p>
      </div>

      {/* 1. Filter Bar & Search Input */}
      <div className="p-4 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0EA5E9] text-white font-semibold shadow-sm'
                  : 'bg-[#121212] text-gray-400 hover:text-white border border-[#2C2C2C] hover:border-[#0EA5E9]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search credential, skill, or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0EA5E9] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Certification Grid Layout */}
      {certifications.length === 0 ? (
        <div className="p-12 text-center rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-3 font-mono text-xs text-gray-400">
          <Award className="w-10 h-10 text-[#0EA5E9] mx-auto opacity-60" />
          <p className="text-sm font-bold text-white">NO CERTIFICATIONS ADDED YET</p>
          <p className="text-gray-400">Use the Admin Panel to add and manage credential records.</p>
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="p-12 text-center rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-3 font-mono text-xs text-gray-400">
          <p>NO CERTIFICATIONS FOUND MATCHING THE CURRENT SEARCH OR CATEGORY.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] hover:border-[#0EA5E9] font-bold"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="group p-6 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] transition-all duration-200 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Top Header: Issuing Organization Badge/Icon + Issue Date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-[#121212] border border-[#2C2C2C] group-hover:border-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0 transition-colors overflow-hidden">
                      {cert.badgeImageUrl ? (
                        <img
                          src={cert.badgeImageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        renderIssuerIcon(cert.issuer, cert.icon)
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#0EA5E9] uppercase tracking-wider font-bold block">
                        {cert.category || 'Specialization'}
                      </span>
                      <p className="text-xs font-mono text-gray-300 font-semibold">{cert.issuer}</p>
                    </div>
                  </div>

                  {cert.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex-shrink-0">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </div>
                  )}
                </div>

                {/* Title & Credential ID Block */}
                <div>
                  <h3
                    onClick={() => setSelectedCertForModal(cert)}
                    className="text-base font-bold text-white group-hover:text-[#0EA5E9] cursor-pointer transition-colors leading-snug"
                  >
                    {cert.title}
                  </h3>
                </div>

                <div className="p-3 rounded bg-[#121212] border border-[#2C2C2C] text-xs font-mono text-gray-400 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">CREDENTIAL ID:</span>
                    <span className="text-gray-200 font-semibold text-[11px] truncate max-w-[130px]">{cert.credentialId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">ISSUE DATE:</span>
                    <span className="text-gray-200 font-semibold text-[11px]">{cert.issueDate}</span>
                  </div>
                  {cert.expirationDate && (
                    <div className="flex items-center justify-between text-gray-500 pt-1 border-t border-[#2C2C2C]">
                      <span className="text-[10px]">EXPIRES:</span>
                      <span className="text-gray-400 text-[10px]">{cert.expirationDate}</span>
                    </div>
                  )}
                </div>

                {/* Skills Verified Tags */}
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block mb-1.5 uppercase tracking-wider font-semibold">
                    SKILLS VERIFIED
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cert.skillsCovered.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#121212] text-gray-300 border border-[#2C2C2C] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#0EA5E9]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links Bar */}
              <div className="pt-4 border-t border-[#2C2C2C] flex items-center justify-between gap-2 text-xs font-mono">
                <button
                  onClick={() => setSelectedCertForModal(cert)}
                  className="px-3 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-200 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  <span>View Certificate</span>
                </button>

                <a
                  href={cert.credentialUrl && cert.credentialUrl !== '#' ? cert.credentialUrl : '#'}
                  onClick={(e) => {
                    if (!cert.credentialUrl || cert.credentialUrl === '#') {
                      e.preventDefault();
                      setSelectedCertForModal(cert);
                    }
                  }}
                  target={cert.credentialUrl && cert.credentialUrl !== '#' ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Certificate Lightbox / Preview Modal */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#1F1F1F] border border-[#2C2C2C] rounded-md shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2C2C2C] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">OFFICIAL CERTIFICATE DOSSIER</h3>
                  <p className="text-xs font-mono text-[#0EA5E9]">{selectedCertForModal.issuer}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCertForModal(null)}
                className="p-1.5 rounded bg-[#121212] hover:bg-[#2C2C2C] text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Presentation Document Box */}
            <div className="p-6 rounded bg-[#121212] border-2 border-[#2C2C2C] space-y-6 text-center relative overflow-hidden">
              {/* Background Watermark Badge */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                <ShieldCheck className="w-40 h-40 text-white" />
              </div>

              {/* Optional Certificate Document / Badge Image View */}
              {(selectedCertForModal.certificateImageUrl || selectedCertForModal.badgeImageUrl) && (
                <div className="max-h-64 rounded border border-[#2C2C2C] overflow-hidden bg-black flex items-center justify-center p-2">
                  <img
                    src={selectedCertForModal.certificateImageUrl || selectedCertForModal.badgeImageUrl}
                    alt={selectedCertForModal.title}
                    className="max-h-60 w-auto object-contain mx-auto rounded"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Seal Header */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIALLY VERIFIED CREDENTIAL</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">THIS IS TO CERTIFY THAT</p>
                <h2 className="text-2xl font-extrabold text-white font-mono tracking-tight">ALEXANDER VANCE</h2>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">HAS SUCCESSFULLY MASTERED & COMPLETED</p>
                <h3 className="text-xl font-bold text-[#0EA5E9] pt-1">{selectedCertForModal.title}</h3>
              </div>

              {/* Metadata Dossier Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4 border-t border-[#2C2C2C] font-mono text-xs">
                <div className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase block">ISSUING AUTHORITY:</span>
                  <span className="text-white font-bold">{selectedCertForModal.issuer}</span>
                </div>

                <div className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase block">ISSUE DATE:</span>
                  <span className="text-white font-bold">{selectedCertForModal.issueDate}</span>
                </div>

                <div className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase block">CREDENTIAL ID:</span>
                  <span className="text-emerald-400 font-bold">{selectedCertForModal.credentialId}</span>
                </div>

                <div className="p-3 rounded bg-[#1F1F1F] border border-[#2C2C2C] space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase block">EXPIRATION STATUS:</span>
                  <span className="text-gray-300 font-bold">{selectedCertForModal.expirationDate || 'Active'}</span>
                </div>
              </div>

              {/* Covered Competencies */}
              <div className="text-left space-y-2 pt-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-bold block">
                  VERIFIED COMPETENCIES COVERED:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCertForModal.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-[#1F1F1F] text-gray-200 border border-[#2C2C2C] flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Controls Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2C2C2C] pt-4 text-xs font-mono">
              <button
                onClick={() => handleCopyCredentialId(selectedCertForModal.credentialId)}
                className="px-3.5 py-2 rounded bg-[#121212] border border-[#2C2C2C] hover:border-[#0EA5E9] text-gray-300 hover:text-white font-semibold flex items-center gap-2 transition-colors"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#0EA5E9]" />}
                <span>{copiedId ? 'COPIED TO CLIPBOARD' : 'COPY CREDENTIAL ID'}</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCertForModal(null)}
                  className="px-4 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-gray-300 hover:text-white font-bold"
                >
                  Close Preview
                </button>

                <a
                  href={selectedCertForModal.credentialUrl && selectedCertForModal.credentialUrl !== '#' ? selectedCertForModal.credentialUrl : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded bg-[#0EA5E9] text-white font-bold hover:bg-[#0EA5E9]/90 flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Verify On Issuer Site</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

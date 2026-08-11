import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { X, ExternalLink, Github, Star, Calendar, FolderGit2, CheckCircle2, Code2, Layers } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [imageError, setImageError] = useState(false);

  if (!project) return null;

  const defaultKeyFeatures = [
    'Sub-millisecond high-concurrency event processing architecture.',
    'Client-side state engine backed by indexed storage persistence.',
    'Zero-trust access token isolation and automated rate control.',
    'Responsive dark mode layout styled with Tailwind CSS.'
  ];

  const keyFeatures = project.keyFeatures && project.keyFeatures.length > 0
    ? project.keyFeatures
    : defaultKeyFeatures;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#1F1F1F] border border-[#2C2C2C] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2C2C2C] bg-[#121212] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">{project.title}</h3>
              <p className="text-xs font-mono text-[#0EA5E9] font-semibold">{project.category}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#1F1F1F] hover:bg-[#2C2C2C] text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Thumbnail / Placeholder Frame */}
          <div className="relative aspect-video rounded overflow-hidden bg-[#121212] border border-[#2C2C2C] flex items-center justify-center">
            {!imageError && project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                <Code2 className="w-12 h-12 text-[#0EA5E9]" />
                <span className="text-xs font-mono text-gray-400 font-semibold uppercase">
                  {project.title} ARCHITECTURE
                </span>
              </div>
            )}
          </div>

          {/* Subtitle & Detailed Description */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white">{project.subtitle}</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Features Bullet List */}
          <div className="space-y-3 p-4 rounded bg-[#121212] border border-[#2C2C2C]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#0EA5E9] font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#0EA5E9]" />
              <span>KEY HIGHLIGHTS & ARCHITECTURE</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              {keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* System Technologies */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#0EA5E9] uppercase tracking-wider block font-semibold">
              TECHNOLOGY STACK
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded text-xs font-mono bg-[#121212] text-gray-200 border border-[#2C2C2C] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#2C2C2C] text-xs font-mono text-gray-400">
            <div className="flex items-center gap-4">
              {project.stars > 0 && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" /> {project.stars} Stars
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#0EA5E9]" /> Completed: {project.completedDate}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded bg-[#121212] hover:border-[#0EA5E9] border border-[#2C2C2C] text-gray-200 flex items-center gap-2 transition-colors font-bold"
                >
                  <Github className="w-4 h-4" /> Source Code / GitHub
                </a>
              )}

              <a
                href={project.demoUrl && project.demoUrl !== '#' ? project.demoUrl : '#'}
                target={project.demoUrl && project.demoUrl !== '#' ? '_blank' : '_self'}
                rel="noreferrer"
                className="px-4 py-2 rounded bg-[#0EA5E9] text-white font-bold hover:bg-[#0EA5E9]/90 flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

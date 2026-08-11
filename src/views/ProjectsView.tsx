import React, { useState } from 'react';
import { ProjectItem } from '../types';
import { Search, FolderGit2, ExternalLink, Github, Star, X, Code2, Eye } from 'lucide-react';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onOpenProjectModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // Clean horizontal filter list as requested
  const categories = [
    'All',
    'Web Systems',
    'Security & Tools',
    'Data & AI',
    'Full Stack',
    'Cloud Architecture',
    'AI Integration',
    'Other'
  ];

  // Map category filters flexibly to project categories
  const filteredProjects = projects.filter((p) => {
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else if (selectedCategory === 'Web Systems') {
      matchesCategory = p.category === 'Web Systems' || p.category === 'Full Stack' || p.category === '3D Web';
    } else if (selectedCategory === 'Security & Tools') {
      matchesCategory = p.category === 'Security & Tools' || p.category === 'Cloud Architecture';
    } else if (selectedCategory === 'Data & AI') {
      matchesCategory = p.category === 'Data & AI' || p.category === 'AI Integration';
    } else {
      matchesCategory = p.category === selectedCategory;
    }

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleImageError = (projId: string) => {
    setImageErrorMap((prev) => ({ ...prev, [projId]: true }));
  };

  return (
    <div className="space-y-10 py-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#1F1F1F] border border-[#2C2C2C] text-[#0EA5E9] text-xs font-mono font-semibold">
          <FolderGit2 className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>PORTFOLIO REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Project Showcase & Systems
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
          Explore production-grade enterprise web systems, high-throughput backend APIs, zero-trust security tools, and interactive dashboards dynamically persisted in IndexedDB.
        </p>
      </div>

      {/* 1. Category Filter Bar & Search Input */}
      <div className="p-4 rounded-md bg-[#1F1F1F] border border-[#2C2C2C] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Filter List */}
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
            placeholder="Filter title, tech, or description..."
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

      {/* 2. Dynamic Project Cards & Grid Layout */}
      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-3 font-mono text-xs text-gray-400">
          <FolderGit2 className="w-10 h-10 text-[#0EA5E9] mx-auto opacity-60" />
          <p className="text-sm font-bold text-white">NO PROJECTS ADDED YET</p>
          <p className="text-gray-400">Use the Admin Panel to add and manage project showcase items.</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-md bg-[#1F1F1F] border border-[#2C2C2C] space-y-3 font-mono text-xs text-gray-400">
          <p>NO PROJECTS FOUND MATCHING THE SELECTED CRITERIA.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-[#0EA5E9] hover:border-[#0EA5E9] font-bold"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const hasImageError = imageErrorMap[proj.id] || !proj.imageUrl;

            return (
              <div
                key={proj.id}
                className="group rounded-md bg-[#1F1F1F] border border-[#2C2C2C] hover:border-[#0EA5E9] p-5 space-y-4 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Thumbnail Frame / Fallback Placeholder Container */}
                  <div className="relative aspect-video rounded overflow-hidden bg-[#121212] border border-[#2C2C2C] flex items-center justify-center">
                    {!hasImageError ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        onError={() => handleImageError(proj.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                        <Code2 className="w-10 h-10 text-[#0EA5E9]/60" />
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          {proj.category} FRAME
                        </span>
                      </div>
                    )}

                    {/* Domain Category Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-[#121212]/90 border border-[#2C2C2C] text-[10px] font-mono text-[#0EA5E9] font-semibold backdrop-blur-sm">
                      {proj.category}
                    </div>
                  </div>

                  {/* Title & Stars Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        onClick={() => onOpenProjectModal(proj)}
                        className="text-lg font-bold text-white group-hover:text-[#0EA5E9] cursor-pointer transition-colors"
                      >
                        {proj.title}
                      </h3>
                      {proj.stars > 0 && (
                        <div className="flex items-center gap-1 text-xs font-mono text-amber-400 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{proj.stars}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-mono text-gray-400 mt-0.5 line-clamp-1">
                      {proj.subtitle}
                    </p>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Tech Stack Tags & Action Buttons Footer */}
                <div className="pt-3 border-t border-[#2C2C2C] space-y-3">
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#121212] text-gray-300 border border-[#2C2C2C]"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-500">
                        +{proj.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs font-mono">
                    <button
                      onClick={() => onOpenProjectModal(proj)}
                      className="px-2.5 py-1.5 rounded bg-[#121212] hover:border-[#0EA5E9] border border-[#2C2C2C] text-[#0EA5E9] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>

                    <div className="flex items-center gap-2">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded bg-[#121212] hover:bg-[#2C2C2C] border border-[#2C2C2C] text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
                          title="Source Code / GitHub"
                        >
                          <Github className="w-3.5 h-3.5" /> Code
                        </a>
                      )}

                      <a
                        href={proj.demoUrl && proj.demoUrl !== '#' ? proj.demoUrl : '#'}
                        onClick={(e) => {
                          if (!proj.demoUrl || proj.demoUrl === '#') {
                            e.preventDefault();
                            onOpenProjectModal(proj);
                          }
                        }}
                        target={proj.demoUrl && proj.demoUrl !== '#' ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold flex items-center gap-1 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

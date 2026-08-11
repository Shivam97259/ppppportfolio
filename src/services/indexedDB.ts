import { ProfileData, SkillItem, ProjectItem, CertificationItem, ContactMessage, EducationItem, ExperienceItem } from '../types';

const DB_NAME = 'ExecutivePortfolioDB';
const DB_VERSION = 2;

const DEFAULT_PROFILE: ProfileData = {
  brandName: "AV ARCHITECTURE",
  logoText: "AV",
  brandIconUrl: "",
  brandFaviconUrl: "",
  navHomeLabel: "Home",
  navAboutLabel: "About",
  navProjectsLabel: "Projects Showcase",
  navCertsLabel: "Certifications",
  navContactLabel: "Contact",

  name: "Alexander Vance",
  title: "Principal Systems Architect & Lead Software Engineer",
  headline: "ENGINEERING HIGH-PERFORMANCE ENTERPRISE PLATFORMS & DISTRIBUTED SYSTEMS",
  subheadline: "Specializing in resilient microservice topologies, low-latency APIs, and modern SPA web architectures.",
  tagline: "Engineering high-performance enterprise platforms, resilient cloud microservices, and modern web applications with mathematical precision.",
  bio: "Senior Systems Architect with 10+ years of enterprise experience designing scalable distributed systems, high-throughput microservice topologies, and mission-critical frontend applications. Driven by architectural integrity, clean design systems, and rigorous code quality.",
  aboutBio: "Principal Systems Architect with a passion for designing scalable distributed software, high-throughput streaming systems, and clean component systems. Experienced in leading cross-functional engineering teams, driving cloud-native migrations, and maintaining zero-downtime microservice topologies.",
  profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  primaryCtaText: "VIEW SHOWCASE PROJECTS",
  primaryCtaLink: "projects",
  secondaryCtaText: "CONTACT ARCHITECT",
  secondaryCtaLink: "contact",

  location: "San Francisco, CA / Remote",
  email: "alexander.vance@enterprise-arch.io",
  phone: "+1 (415) 890-2134",
  responseExpectation: "24-48 business hours for consulting & architectural inquiries",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://x.com",
  leetcodeUrl: "https://leetcode.com",
  hacktheboxUrl: "https://hackthebox.com",

  yearsExperience: 10,
  completedProjects: 48,
  certificationsCount: 14,
  uptimePercentage: "99.999%"
};

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: 'e1',
    degree: 'Master of Science in Computer Science & Distributed Systems',
    institution: 'Stanford University',
    period: '2014 - 2016',
    grade: 'GPA 3.95 / 4.0',
    description: 'Specialized in Distributed Algorithms, High-Concurrency Database Systems, and Cloud Operating Systems.'
  },
  {
    id: 'e2',
    degree: 'Bachelor of Science in Software Engineering',
    institution: 'University of California, Berkeley',
    period: '2010 - 2014',
    grade: 'Magna Cum Laude',
    description: 'Focus on Data Structures, Compiler Construction, Computer Networks, and System Architecture.'
  }
];

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp1',
    role: 'Principal Systems Architect',
    company: 'Apex Cloud Systems',
    period: '2021 - Present',
    location: 'San Francisco, CA',
    description: 'Lead architect for enterprise event-driven streaming platform handling billions of daily telemetry records.',
    achievements: [
      'Architected event streaming pipelines reducing message processing latency by 42%.',
      'Engineered multi-region failover automation achieving 99.999% SLA availability.',
      'Mentored team of 18 senior software engineers across cloud infrastructure and frontend architectures.'
    ]
  },
  {
    id: 'exp2',
    role: 'Senior Staff Frontend Engineer',
    company: 'Vanguard Software Lab',
    period: '2018 - 2021',
    location: 'San Jose, CA',
    description: 'Directed frontend engineering for mission-critical monitoring consoles and executive financial dashboards.',
    achievements: [
      'Built custom dark-mode design system utilized across 12 enterprise applications.',
      'Optimized client-side rendering engines to sustain 60fps under live WebSocket data streams.',
      'Pioneered local-first IndexedDB caching strategy eliminating redundant server API calls.'
    ]
  },
  {
    id: 'exp3',
    role: 'Software Engineer II',
    company: 'Nexus Cybernetics',
    period: '2015 - 2018',
    location: 'Palo Alto, CA',
    description: 'Developed scalable REST APIs, microservices, and client applications for automated threat detection.',
    achievements: [
      'Implemented token bucket rate limiting and zero-trust authentication proxies.',
      'Reduced build times by 65% through modular CI/CD container pipelines.'
    ]
  }
];

const DEFAULT_SKILLS: SkillItem[] = [
  { id: 's1', name: 'System Architecture & Microservices', category: 'Architecture', level: 98, iconName: 'Cpu' },
  { id: 's2', name: 'React 19, TypeScript & SPA Architecture', category: 'Frontend', level: 96, iconName: 'Code2' },
  { id: 's3', name: 'Node.js & Express REST APIs', category: 'Backend', level: 94, iconName: 'Server' },
  { id: 's4', name: 'PostgreSQL, Distributed SQL & ORMs', category: 'Backend', level: 92, iconName: 'Database' },
  { id: 's5', name: 'AWS & GCP Cloud Architecture', category: 'DevOps & Cloud', level: 90, iconName: 'Cloud' },
  { id: 's6', name: 'Docker, Containerization & CI/CD', category: 'DevOps & Cloud', level: 92, iconName: 'Boxes' },
  { id: 's7', name: 'Tailwind CSS & UI Design Systems', category: 'Frontend', level: 95, iconName: 'Palette' },
  { id: 's8', name: 'High-Concurrency Event Processing', category: 'Architecture', level: 91, iconName: 'Zap' },
];

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Aegis Core Platform',
    subtitle: 'High-Throughput Enterprise Financial Analytics Engine',
    category: 'Full Stack',
    description: 'An enterprise-grade, low-latency financial stream engine handling 50,000+ real-time events per second with sub-millisecond execution times.',
    longDescription: 'Engineered an event-driven distributed system architecture utilizing Express, WebSocket state engines, and client-side IndexedDB session caches. Features real-time risk assessment graphs and customizable executive dashboards.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'IndexedDB', 'Tailwind CSS'],
    featured: true,
    demoUrl: '#',
    githubUrl: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    completedDate: '2025-10',
    stars: 184
  },
  {
    id: 'p2',
    title: 'Vanguard Cloud Relay',
    subtitle: 'Zero-Trust Global API Proxy Gateway',
    category: 'Cloud Architecture',
    description: 'A resilient multi-region cloud gateway with dynamic load balancing, automated TLS certificate renewal, and real-time security threat telemetry.',
    longDescription: 'Constructed custom Docker container topologies deployed on Cloud Run with edge caching, token bucket rate limiting, and zero-downtime deployment pipelines.',
    technologies: ['Cloud Run', 'Docker', 'Express', 'TypeScript', 'Redis', 'Security Auditing'],
    featured: true,
    demoUrl: '#',
    githubUrl: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    completedDate: '2025-06',
    stars: 142
  },
  {
    id: 'p3',
    title: 'OmniAnalytics Dashboard',
    subtitle: 'Real-Time Enterprise Telemetry & Monitoring Suite',
    category: 'Full Stack',
    description: 'A high-density SPA monitoring console designed for mission-critical operations center displays and distributed node health tracking.',
    longDescription: 'Designed a high-contrast dark theme visual hierarchy using Tailwind CSS, featuring SVG chart visualizers, instant client-side filtering, and IndexedDB local snapshot persistence.',
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'D3.js'],
    featured: true,
    demoUrl: '#',
    githubUrl: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    completedDate: '2026-01',
    stars: 215
  },
  {
    id: 'p4',
    title: 'Gemini Enterprise Copilot',
    subtitle: 'AI-Assisted Code Quality & Refactoring Gateway',
    category: 'AI Integration',
    description: 'Secure enterprise AI proxy routing technical queries through Gemini API models for automated static code analysis and architectural reviews.',
    longDescription: 'Built server-side proxy routes with secret key isolation, rate control, and structured schema responses to deliver instant architectural insights.',
    technologies: ['Gemini API', 'Express', 'Node.js', 'React', 'TypeScript'],
    featured: false,
    demoUrl: '#',
    githubUrl: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    completedDate: '2025-12',
    stars: 98
  }
];

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'c1',
    title: 'AWS Certified Solutions Architect – Professional',
    issuer: 'Amazon Web Services',
    issueDate: '2025-06',
    credentialId: 'AWS-PSA-90823411',
    credentialUrl: 'https://aws.amazon.com/verification',
    skillsCovered: ['Cloud Architecture', 'Distributed Systems', 'Security & Compliance', 'High Availability'],
    icon: 'Cloud',
    verified: true,
    category: 'Cloud',
    expirationDate: '2028-06'
  },
  {
    id: 'c2',
    title: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud',
    issueDate: '2024-11',
    credentialId: 'GCP-PCA-3391024',
    credentialUrl: 'https://cloud.google.com/certification',
    skillsCovered: ['Cloud Infrastructure', 'Microservices', 'Kubernetes', 'IAM Security'],
    icon: 'ShieldCheck',
    verified: true,
    category: 'Cloud',
    expirationDate: '2026-11'
  },
  {
    id: 'c3',
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation (CNCF)',
    issueDate: '2024-08',
    credentialId: 'CKA-9920148',
    credentialUrl: 'https://cncf.io/certification/cka',
    skillsCovered: ['Cluster Management', 'Container Orchestration', 'Storage Systems', 'Networking'],
    icon: 'Boxes',
    verified: true,
    category: 'Architecture',
    expirationDate: '2027-08'
  },
  {
    id: 'c4',
    title: 'Certified Information Systems Security Professional (CISSP)',
    issuer: '(ISC)²',
    issueDate: '2024-05',
    credentialId: 'ISC2-CISSP-771029',
    credentialUrl: 'https://www.isc2.org/Certifications/CISSP',
    skillsCovered: ['Zero-Trust Architecture', 'Security Risk Management', 'Identity & Access', 'Cryptography'],
    icon: 'ShieldCheck',
    verified: true,
    category: 'Security',
    expirationDate: '2027-05'
  }
];

const DEFAULT_MESSAGES: ContactMessage[] = [];

class IndexedDBService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('skills')) {
          db.createObjectStore('skills', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('certifications')) {
          db.createObjectStore('certifications', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('messages')) {
          db.createObjectStore('messages', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('education')) {
          db.createObjectStore('education', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('experience')) {
          db.createObjectStore('experience', { keyPath: 'id' });
        }
      };

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        await this.ensureSeedData(db);
        resolve(db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  private async ensureSeedData(db: IDBDatabase): Promise<void> {
    return new Promise((resolve) => {
      const transaction = db.transaction(['profile', 'skills', 'projects', 'certifications', 'messages', 'education', 'experience'], 'readwrite');
      const profileStore = transaction.objectStore('profile');

      const countReq = profileStore.count();
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          // Database is uninitialized, populate defaults
          profileStore.put({ id: 'main', ...DEFAULT_PROFILE });

          const skillsStore = transaction.objectStore('skills');
          DEFAULT_SKILLS.forEach(s => skillsStore.put(s));

          const projectsStore = transaction.objectStore('projects');
          DEFAULT_PROJECTS.forEach(p => projectsStore.put(p));

          const certsStore = transaction.objectStore('certifications');
          DEFAULT_CERTIFICATIONS.forEach(c => certsStore.put(c));

          const msgStore = transaction.objectStore('messages');
          DEFAULT_MESSAGES.forEach(m => msgStore.put(m));

          const eduStore = transaction.objectStore('education');
          DEFAULT_EDUCATION.forEach(e => eduStore.put(e));

          const expStore = transaction.objectStore('experience');
          DEFAULT_EXPERIENCE.forEach(exp => expStore.put(exp));
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve(); // continue even on error
    });
  }

  // Generic Getter
  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  // Profile Getter & Setter
  public async getProfile(): Promise<ProfileData> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('profile', 'readonly');
      const store = tx.objectStore('profile');
      const req = store.get('main');
      req.onsuccess = () => {
        if (req.result) {
          const { id, ...data } = req.result;
          resolve({ ...DEFAULT_PROFILE, ...data } as ProfileData);
        } else {
          resolve(DEFAULT_PROFILE);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  public async saveProfile(profile: ProfileData): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('profile', 'readwrite');
      const store = tx.objectStore('profile');
      const req = store.put({ id: 'main', ...profile });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Item Saver (Project, Certification, Skill, Education, Experience, Message)
  public async saveItem<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Item Deleter
  public async deleteItem(storeName: string, id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // Reset DB to default seed data
  public async resetToDefaults(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['profile', 'skills', 'projects', 'certifications', 'messages', 'education', 'experience'], 'readwrite');
      
      tx.objectStore('profile').clear();
      tx.objectStore('skills').clear();
      tx.objectStore('projects').clear();
      tx.objectStore('certifications').clear();
      tx.objectStore('messages').clear();
      tx.objectStore('education').clear();
      tx.objectStore('experience').clear();

      tx.objectStore('profile').put({ id: 'main', ...DEFAULT_PROFILE });
      DEFAULT_SKILLS.forEach(s => tx.objectStore('skills').put(s));
      DEFAULT_PROJECTS.forEach(p => tx.objectStore('projects').put(p));
      DEFAULT_CERTIFICATIONS.forEach(c => tx.objectStore('certifications').put(c));
      DEFAULT_MESSAGES.forEach(m => tx.objectStore('messages').put(m));
      DEFAULT_EDUCATION.forEach(e => tx.objectStore('education').put(e));
      DEFAULT_EXPERIENCE.forEach(exp => tx.objectStore('experience').put(exp));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Export all database collections to JSON object
  public async exportAllData(): Promise<Record<string, any>> {
    const profile = await this.getProfile();
    const skills = await this.getAll<SkillItem>('skills');
    const projects = await this.getAll<ProjectItem>('projects');
    const certifications = await this.getAll<CertificationItem>('certifications');
    const messages = await this.getAll<ContactMessage>('messages');
    const education = await this.getAll<EducationItem>('education');
    const experience = await this.getAll<ExperienceItem>('experience');

    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      profile,
      skills,
      projects,
      certifications,
      messages,
      education,
      experience
    };
  }

  // Import JSON backup data and replace existing records
  public async importAllData(data: Record<string, any>): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['profile', 'skills', 'projects', 'certifications', 'messages', 'education', 'experience'], 'readwrite');

      if (data.profile) {
        tx.objectStore('profile').clear();
        tx.objectStore('profile').put({ id: 'main', ...data.profile });
      }
      if (Array.isArray(data.skills)) {
        tx.objectStore('skills').clear();
        data.skills.forEach((s: any) => tx.objectStore('skills').put(s));
      }
      if (Array.isArray(data.projects)) {
        tx.objectStore('projects').clear();
        data.projects.forEach((p: any) => tx.objectStore('projects').put(p));
      }
      if (Array.isArray(data.certifications)) {
        tx.objectStore('certifications').clear();
        data.certifications.forEach((c: any) => tx.objectStore('certifications').put(c));
      }
      if (Array.isArray(data.messages)) {
        tx.objectStore('messages').clear();
        data.messages.forEach((m: any) => tx.objectStore('messages').put(m));
      }
      if (Array.isArray(data.education)) {
        tx.objectStore('education').clear();
        data.education.forEach((e: any) => tx.objectStore('education').put(e));
      }
      if (Array.isArray(data.experience)) {
        tx.objectStore('experience').clear();
        data.experience.forEach((exp: any) => tx.objectStore('experience').put(exp));
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const dbService = new IndexedDBService();

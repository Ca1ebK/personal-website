import { useState, useEffect, useRef } from 'react'
import { 
  Sun, 
  Moon, 
  Github, 
  Linkedin, 
  Mail, 
  Calendar,
  MapPin,
  Terminal,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

// Theme hook with localStorage persistence
function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, default to dark
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved === 'dark'
      }
    }
    return true // Default to dark mode
  })

  // Apply theme changes to DOM
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return [isDark, toggleTheme]
}

// Terminal-style command header
function CommandHeader({ command, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-6 ${className}`}>
      <span className="text-emerald-500 dark:text-emerald-400 font-mono text-sm">❯</span>
      <span className="font-mono text-zinc-600 dark:text-zinc-400 text-sm">{command}</span>
      <span className="animate-pulse text-emerald-500 dark:text-emerald-400 font-mono">_</span>
    </div>
  )
}

// Navbar Component
function Navbar({ isDark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-bold text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          ~/caleb
        </a>
        <div className="flex items-center gap-1">
          {['experience', 'research', 'projects', 'skills', 'resume'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="px-3 py-1.5 text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all hidden sm:block"
            >
              {section}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

// Scroll Arrow Component
function ScrollArrow() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Show arrow when near top (within first 80% of viewport), hide when scrolled down
      setIsVisible(scrollY < windowHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToExperience = () => {
    const experienceSection = document.getElementById('experience');
    if (experienceSection) {
      experienceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToExperience}
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 group cursor-pointer transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to experience section"
    >
      <div className="flex flex-col items-center gap-2 p-3 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer animate-bounce">
        <ChevronDown size={24} className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
      </div>
    </button>
  );
}

// Hero Section
function Hero({ isDark }) {
  const links = [
    { icon: Github, href: 'https://github.com/Ca1ebK', label: 'GitHub', handle: 'Ca1ebK' },
    { icon: Linkedin, href: 'https://linkedin.com/in/calebjkang', label: 'LinkedIn', handle: 'calebjkang' },
    { icon: Mail, href: 'mailto:caleb.jpkang@gmail.com', label: 'Email', handle: 'caleb.jpkang' },
  ]

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-6 relative">
      <div className="max-w-4xl mx-auto w-full">
        {/* Terminal window */}
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden">
          {/* Window header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
            <div className="group/btn relative w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center cursor-default select-none">
              <span className="opacity-0 group-hover/btn:opacity-100 text-red-900 text-[10px] font-bold leading-none transition-opacity pointer-events-none">×</span>
            </div>
            <div className="group/btn relative w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center cursor-default select-none">
              <span className="opacity-0 group-hover/btn:opacity-100 text-yellow-900 text-[10px] font-bold leading-none transition-opacity pointer-events-none">−</span>
            </div>
            <div className="group/btn relative w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center cursor-default select-none">
              <span className="opacity-0 group-hover/btn:opacity-100 text-green-900 text-[10px] font-bold leading-none transition-opacity pointer-events-none">+</span>
            </div>
            <span className="ml-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">caleb@portfolio ~ </span>
          </div>
          
          {/* Terminal content */}
          <div className="p-6 md:p-8 font-mono">
            <div className="flex items-start gap-6 mb-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-400/30 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center relative">
                  <img 
                    src="/IMG_3949.jpg" 
                    alt="Caleb Kang" 
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      // Fallback to initials if image doesn't load
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.photo-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-emerald-600 dark:text-emerald-400 photo-fallback hidden absolute inset-0 items-center justify-center">CK</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                  <span className="text-emerald-500">❯</span> whoami
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-4 font-sans tracking-tight">
                  Caleb Kang
                </h1>
                
                <div className="space-y-2 mb-6">
                  <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
                    Computer Science @ <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Illinois</span> <span className="text-zinc-500 dark:text-zinc-400">(</span><a href="#pathways" className="text-emerald-600 dark:text-emerald-400 hover:underline">Engineering Pathways</a><span className="text-zinc-500 dark:text-zinc-400">)</span>
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                    <MapPin size={16} />
                    <span>Greater Chicago Area</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      Incoming @ Northrop Grumman
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      ex-Fermilab
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl leading-relaxed">
              Building things at the intersection of <span className="text-zinc-800 dark:text-zinc-200 font-medium">scalable systems</span>, <span className="text-zinc-800 dark:text-zinc-200 font-medium">AI/ML</span>, and <span className="text-zinc-800 dark:text-zinc-200 font-medium">robotics</span>. 
              Passionate about using software and AI to solve tangible problems.
            </p>

            {/* Social links as terminal output */}
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-3">
              <span className="text-emerald-500">❯</span> cat socials.txt
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {links.map(({ icon: Icon, href, label, handle }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="btn-hover group flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Icon size={16} />
                  <span className="text-sm">{handle}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Hook for scroll-based progress (fills from 0 to 100% as you scroll through)
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const elementHeight = rect.height
      const windowHeight = window.innerHeight
      
      // Start point: trigger much earlier - when element is still well below viewport
      // Trigger when element top is 500px below viewport top (very early trigger)
      const earlyTriggerOffset = 700
      const triggerPoint = earlyTriggerOffset
      
      // Get element position
      const elementTop = rect.top
      const elementBottom = rect.bottom
      
      // Start animating when element top reaches trigger point (still below viewport)
      if (elementTop > triggerPoint) {
        setProgress(0)
        return
      }
      
      // Calculate progress: how much of element has scrolled past trigger point
      // Use a much smaller effective height to make items appear very quickly
      const effectiveHeight = elementHeight * 0.15 // Very small multiplier for fast appearance
      const distanceScrolled = triggerPoint - elementTop
      const newProgress = Math.min(100, Math.max(0, (distanceScrolled / effectiveHeight) * 100))
      
      setProgress(newProgress)
      if (newProgress >= 100) setIsComplete(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [ref, progress, isComplete]
}

// Experience Item with scroll-fill animation
function ExperienceItem({ id, title, company, location, date, bullets, isRemote, isLast }) {
  const [ref, progress, isComplete] = useScrollProgress()
  const isActive = progress > 5 // Lower threshold so items activate sooner

  return (
    <div 
      ref={ref}
      id={id}
      className="group relative pl-6 pb-8 last:pb-0 transition-all duration-500"
    >
      {/* Background timeline (gray) */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
      
      {/* Filling timeline (emerald) - grows based on scroll progress */}
      <div 
        className="absolute left-0 top-0 w-0.5 bg-emerald-500 transition-all duration-100 ease-out"
        style={{ 
          height: isLast ? `${Math.min(progress, 100)}%` : `${progress}%`,
          boxShadow: progress > 0 ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none'
        }}
      />
      
      {/* Animated dot */}
      <div className={`absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${
        isActive
          ? 'bg-emerald-500 border-emerald-400 dark:border-emerald-400 shadow-lg shadow-emerald-500/50 scale-110'
          : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
      }`}>
        {isActive && !isComplete && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
        )}
      </div>
      
      <div className={`mb-2 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
        <h3 className={`text-lg font-semibold transition-colors ${
          isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'
        }`}>
          {title}
        </h3>
        <p className="text-emerald-600 dark:text-emerald-400 font-medium">{company}</p>
      </div>
      
      <div className={`flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-3 transition-all duration-500 delay-100 ${
        isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {date}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {isRemote ? 'Remote' : location}
        </span>
      </div>
      
      <ul className={`space-y-2 text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-500 delay-200 ${
        isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
      }`}>
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex gap-2">
            <ChevronRight size={14} className="mt-1 text-emerald-500 flex-shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Experience Section
function Experience() {
  const experiences = [
    {
      id: 'exp-northrop',
      title: 'Incoming Software Engineer',
      company: 'Northrop Grumman',
      location: 'Rolling Meadows, IL',
      date: 'Summer 2026',
      bullets: [
        'Mission Systems Sector, Targeting & Survivability (T&S) Division',
      ],
    },
    {
      id: 'exp-fermilab',
      title: 'Software Development Intern',
      company: 'Fermi National Accelerator Laboratory',
      location: 'Batavia, IL',
      date: 'Jun 2025 – Aug 2025',
      bullets: [
        'Engineered Python state machine to automate ASIC chip testing for DUNE, scaling to 6 national sites (~300k chips)',
        'Designed comprehensive UML state diagrams for robust error handling',
        'Authored technical research report; presented findings via poster sessions and virtual reviews',
      ],
    },
    {
      id: 'exp-harper',
      title: 'Student Aide',
      company: 'Harper College',
      location: 'Palatine, IL',
      date: 'Aug 2024 – Present',
      bullets: [
        'Audited faculty syllabi for institutional transfer agreement compliance',
        'Optimized administrative logistics including inventory and campus-wide equipment distribution',
      ],
    },
  ]

  return (
    <section id="experience" className="py-20 px-6 pt-32">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="ls -la ./experience" />
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
          Experience
        </h2>
        <div className="space-y-0">
          {experiences.map((exp, idx) => (
            <ExperienceItem key={exp.company} {...exp} isLast={idx === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Research Section
function Research() {
  return (
    <section id="research" className="py-20 px-6 bg-zinc-50/50 dark:bg-zinc-900/30 pt-24">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="cat research.md" />
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
          Research
        </h2>
        <ExperienceItem
          id="research-biola"
          title="Research Assistant"
          company="Biola University"
          location="Remote"
          date="Oct 2024 – May 2025"
          isRemote={true}
          isLast={true}
          bullets={[
            'Validated multimodal authentication models: fine-tuned CLIP, Whisper, and Sortformer architectures',
            'Executed NVIDIA NeMo performance testing in Google Colab using PyTorch for security applications',
          ]}
        />
      </div>
    </section>
  )
}

// Project Card
function ProjectCard({ id, title, date, bullets, tags }) {
  return (
    <div id={id} className="card-hover group p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <Terminal size={20} />
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{date}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      
      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-emerald-500">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// Projects Section
function Projects() {
  const projects = [
    {
      id: 'proj-farming',
      title: 'C++ Farming Simulator',
      date: 'Oct – Dec 2025',
      bullets: [
        'Terminal-based OOP game with inheritance & polymorphism for crop lifecycle modeling',
        'Dynamic 2D grid with manual memory management for efficient object allocation',
        'Comprehensive Catch2 unit tests for game logic validation',
      ],
      tags: ['C++', 'OOP', 'Catch2', 'Memory Mgmt'],
    },
    {
      id: 'proj-duckiebot',
      title: 'Duckiebot Robotics Initiative',
      date: 'Dec 2024 – Jan 2025',
      bullets: [
        'Led 4-person team in robotic rover development with weekly technical sprints',
        'Configured embedded Linux on Raspberry Pi & NVIDIA Jetson',
        'Deployed Duckietown framework via Docker for command-and-control',
      ],
      tags: ['Linux', 'Docker', 'Raspberry Pi', 'Jetson'],
    },
  ]

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="find ./projects -type f" />
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Skills Section
function Skills() {
  const skills = {
    'Languages': ['Java', 'Python', 'C++', 'TypeScript', 'JavaScript', 'HTML/CSS'],
    'AI/ML': ['PyTorch', 'Generative AI', 'LLMs', 'CLIP', 'Whisper', 'Sortformer'],
    'Tools': ['Git', 'Docker', 'Linux', 'React.js', 'GCP'],
  }

  return (
    <section id="skills" className="py-20 px-6 bg-zinc-50/50 dark:bg-zinc-900/30 pt-28">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="echo $SKILLS" />
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
          Skills
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Resume Section
function Resume() {
  return (
    <section id="resume" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="open resume.pdf" />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
            Resume
          </h2>
          <a
            href="/Kang_Caleb_Resume.pdf"
            download
            className="btn-hover flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
          >
            <Download size={16} />
            Download PDF
          </a>
        </div>
        
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <iframe
            src="/Kang_Caleb_Resume.pdf"
            title="Caleb Kang Resume"
            className="w-full h-[600px] md:h-[800px]"
          />
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
            <span className="text-emerald-500">❯</span> echo "© {new Date().getFullYear()} Caleb Kang"
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Built with React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

// Engineering Pathways Section
function EngineeringPathways() {
  return (
    <section id="pathways" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <CommandHeader command="cat pathways.md" />
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
          Engineering Pathways
        </h2>
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            <a 
              href="https://grainger.illinois.edu/admissions/undergraduate/pathways" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              Engineering Pathways
            </a> offers students interested in beginning their college education at an Illinois community college a <strong className="text-zinc-800 dark:text-zinc-200">streamlined transfer experience and guaranteed admission</strong> to The Grainger College of Engineering at the University of Illinois Urbana-Champaign upon successful completion of program requirements.
          </p>
          <a 
            href="https://grainger.illinois.edu/admissions/undergraduate/pathways" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            Learn more about Engineering Pathways
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

// Main App
function App() {
  const [isDark, toggleTheme] = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      {/* Video background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 dark:opacity-50"
        >
          <source src="/3129957-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-zinc-950/60" />
      </div>
      
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="relative">
        <Hero isDark={isDark} />
        <ScrollArrow />
        <Experience />
        <Research />
        <Projects />
        <Skills />
        <EngineeringPathways />
        <Resume />
      </main>
      <Footer />
    </div>
  )
}

export default App

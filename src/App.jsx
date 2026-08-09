import { useState, useEffect, useRef } from 'react'
import {
  Sun,
  Moon,
  Monitor,
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
  ChevronDown,
  Music
} from 'lucide-react'
import ParticleBackground from './ParticleBackground'
import LightModeBackground from './LightModeBackground'

// Theme hook with localStorage persistence
function useTheme() {
  const [themeMode, setThemeMode] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeMode')
      if (saved) {
        return saved
      }
      // Migrate from old 'theme' key if exists
      const oldSaved = localStorage.getItem('theme')
      if (oldSaved) {
        localStorage.removeItem('theme')
        return oldSaved
      }
    }
    return 'system' // Default to system
  })

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      if (themeMode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return themeMode === 'dark'
    }
    return true
  })

  // Apply theme changes to DOM
  useEffect(() => {
    const root = document.documentElement

    let actualThemeIsDark = themeMode === 'dark'
    if (themeMode === 'system') {
      actualThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    if (actualThemeIsDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    // react-hooks/set-state-in-effect ignores:
    // eslint-disable-next-line
    setIsDark(actualThemeIsDark)
    localStorage.setItem('themeMode', themeMode)
  }, [themeMode])

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      const root = document.documentElement
      if (e.matches) {
        root.classList.add('dark')
        root.classList.remove('light')
        setIsDark(true)
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
        setIsDark(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }

  return [isDark, themeMode, toggleTheme]
}

// Terminal-style command header
function CommandHeader({ command, className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-6 ${className}`}>
      <span className="text-orange-500 dark:text-orange-400 font-mono text-sm">❯</span>
      <span className="font-mono text-zinc-600 dark:text-zinc-400 text-sm">{command}</span>
      <span className="animate-pulse text-orange-500 dark:text-orange-400 font-mono">_</span>
    </div>
  )
}

// Navbar Component
function Navbar({ themeMode, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50'
      : 'bg-transparent border-b border-transparent'
      }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-bold text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
          ~/caleb
        </a>
        <div className="flex items-center gap-1">
          {['experience', 'research', 'projects', 'skills', 'resume'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="px-3 py-1.5 text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all hidden sm:block"
            >
              {section}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all w-9 h-9 flex items-center justify-center"
            aria-label={`Current theme: ${themeMode}. Click to cycle theme.`}
            title={`Current theme: ${themeMode}`}
          >
            {themeMode === 'system' ? <Monitor size={18} /> : themeMode === 'light' ? <Sun size={18} /> : <Moon size={18} />}
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
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 group cursor-pointer transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      aria-label="Scroll to experience section"
    >
      <div className="flex flex-col items-center gap-2 p-3 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer animate-bounce">
        <ChevronDown size={24} className="text-zinc-600 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
      </div>
    </button>
  );
}

// Hero Section
function Hero() {
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
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-2 border-orange-500/30 dark:border-orange-400/30 bg-gradient-to-br from-orange-100 to-blue-100 dark:from-orange-900/30 dark:to-blue-900/30 flex items-center justify-center relative">
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
                  <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-orange-600 dark:text-orange-400 photo-fallback hidden absolute inset-0 items-center justify-center">CK</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                  <span className="text-orange-500">❯</span> whoami
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-white mb-4 font-sans tracking-tight">
                  Caleb Kang
                </h1>

                <div className="space-y-2 mb-6">
                  <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300">
                    Computer Science @ <span className="illini-gradient">Illinois</span> <span className="text-zinc-500 dark:text-zinc-400">(</span><a href="#pathways" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Engineering Pathways</a><span className="text-zinc-500 dark:text-zinc-400">)</span>
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
                    <MapPin size={16} />
                    <span>Greater Chicago Area</span>
                    <span className="text-zinc-300 dark:text-zinc-600">•</span>
                    <span className="relative group/amazon inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-amber-200 dark:border-amber-800 cursor-default">
                      Previously @
                      <img src="/amazon-icon-logo-png_seeklogo-405254.png" alt="Amazon" className="h-3.5 w-auto" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 text-xs font-medium whitespace-nowrap opacity-0 scale-95 group-hover/amazon:opacity-100 group-hover/amazon:scale-100 transition-all duration-200 pointer-events-none">
                        Amazon
                      </span>
                    </span>
                    <span className="relative group/fermilab inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-blue-200 dark:border-blue-800 cursor-default">
                      Previously @
                      <img src="/Fermilab logo.png" alt="Fermilab" className="h-3.5 w-auto" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 text-xs font-medium whitespace-nowrap opacity-0 scale-95 group-hover/fermilab:opacity-100 group-hover/fermilab:scale-100 transition-all duration-200 pointer-events-none">
                        Fermilab
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
              Interested in <span className="text-zinc-800 dark:text-zinc-200 font-medium">product engineering</span>, <span className="text-zinc-800 dark:text-zinc-200 font-medium">product design</span>, <span className="text-zinc-800 dark:text-zinc-200 font-medium">UI/UX</span>, and <span className="text-zinc-800 dark:text-zinc-200 font-medium">systems</span>.
            </p>

            {/* Social links as terminal output */}
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm mb-3">
              <span className="text-orange-500">❯</span> cat socials.txt
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {links.map(({ icon: Icon, href, label, handle }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                  className="btn-hover group flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
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
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const elementHeight = rect.height
        const viewportHeight = window.innerHeight

        const triggerPoint = viewportHeight * 0.55
        const elementTop = rect.top

        if (elementTop > triggerPoint) {
          setProgress(0)
          return
        }

        const effectiveHeight = elementHeight * 0.65
        const distanceScrolled = triggerPoint - elementTop
        const newProgress = Math.min(100, Math.max(0, (distanceScrolled / effectiveHeight) * 100))

        setProgress(newProgress)
        if (newProgress >= 100) setIsComplete(true)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return [ref, progress, isComplete]
}

// Experience Item with scroll-fill animation
function ExperienceItem({ id, title, company, location, date, bullets, isRemote, isLast }) {
  const [ref, progress, isComplete] = useScrollProgress()
  const hasBeenActive = useRef(false)
  if (progress > 12) hasBeenActive.current = true
  const isActive = hasBeenActive.current
  const isDotActive = progress > 12

  return (
    <div
      ref={ref}
      id={id}
      className="group relative pl-6 pb-8 last:pb-0 transition-all duration-500"
    >
      {/* Background timeline (gray) */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

      {/* Filling timeline (orange) - grows based on scroll progress */}
      <div
        className="absolute left-0 top-0 w-0.5 bg-orange-500 transition-all duration-700 ease-out"
        style={{
          height: isLast ? `${Math.min(progress, 100)}%` : `${progress}%`,
          boxShadow: progress > 0 ? '0 0 8px rgba(249, 115, 22, 0.5)' : 'none'
        }}
      />

      {/* Animated dot */}
      <div className={`absolute -left-[7px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 ${isDotActive
        ? 'bg-orange-500 border-orange-400 dark:border-orange-400 shadow-lg shadow-orange-500/50 scale-110'
        : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
        }`}>
        {isDotActive && !isComplete && (
          <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75" />
        )}
      </div>

      <div className={`mb-2 transition-all duration-500 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
        <h3 className={`text-lg font-semibold transition-colors ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'
          }`}>
          {title}
        </h3>
        <p className="text-orange-600 dark:text-orange-400 font-medium">{company}</p>
      </div>

      <div className={`flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 mb-3 transition-all duration-500 delay-100 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
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

      <ul className={`space-y-2 text-sm text-zinc-600 dark:text-zinc-400 transition-all duration-500 delay-200 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        }`}>
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex gap-2">
            <ChevronRight size={14} className="mt-1 text-orange-500 flex-shrink-0" />
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
      id: 'exp-amazon',
      title: 'Software Development Engineer Intern',
      company: 'Amazon',
      location: 'Bellevue, WA',
      date: 'May 2026 – Aug 2026 · 3 mos',
      bullets: [
        "Built an LLM-powered financial observability agent for Teller, Amazon's Accounts Payable system ($2.5B+ processed), translating natural-language questions to SQL over 130M+ payment records (Python, Strands Agents SDK, Claude on Bedrock)",
        'Automated anomaly detection with z-score baselines and a 20+ tool-call agentic investigation loop, delivering cited, confidence-rated explanations in 2-3 minutes; surfaced a 63,469-payment void batch (z-score 62) in production',
        'Deployed the containerized agent on Bedrock AgentCore Runtime with AWS CDK and a CI/CD pipeline; engineered least-privilege cross-account IAM access to SOX-regulated data via Athena, Glue, Lake Formation, and S3',
        'Hardened the tool layer with a read-only SQL validator, table allowlist, Bedrock guardrails, and anti-hallucination checks; shipped 100+ unit and integration tests',
      ],
    },
    {
      id: 'exp-fermilab',
      title: 'Software Engineer Intern',
      company: 'Fermi National Accelerator Laboratory',
      location: 'Batavia, IL',
      date: 'Jun 2025 – Aug 2025 · 3 mos',
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
      date: 'Aug 2024 – Present · 1 yr 5 mos',
      bullets: [
        'Audited faculty syllabi for institutional transfer agreement compliance',
        'Optimized administrative logistics including inventory and campus-wide equipment distribution',
      ],
    },
  ]

  return (
    <section id="experience" className="py-4 px-6 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
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
      </div>
    </section>
  )
}

// Research Section
function Research() {
  return (
    <section id="research" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
          <CommandHeader command="cat research.md" />
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Research
          </h2>
          <ExperienceItem
            id="research-biola"
            title="Research Assistant"
            company="Biola University"
            location="Remote"
            date="Oct 2024 – May 2025 · 8 mos"
            isRemote={true}
            isLast={true}
            bullets={[
              'Validated multimodal authentication models: fine-tuned CLIP, Whisper, and Sortformer architectures',
              'Executed NVIDIA NeMo performance testing in Google Colab using PyTorch for security applications',
            ]}
          />
        </div>
      </div>
    </section>
  )
}

// Project Card
function ProjectCard({ id, title, date, bullets, tags }) {
  return (
    <div id={id} className="card-hover group p-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
          <Terminal size={20} />
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{date}</span>
      </div>

      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
        {title}
      </h3>

      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-orange-500">•</span>
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
      date: 'Oct 2025 – Dec 2025',
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
    <section id="projects" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
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
    <section id="skills" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
          <CommandHeader command="echo $SKILLS" />
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Skills
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-mono text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Resume Section
function Resume() {
  return (
    <section id="resume" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
          <CommandHeader command="open resume.pdf" />
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              Resume
            </h2>
            <a
              href="/Kang_Caleb_Resume.pdf"
              download
              className="btn-hover flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm transition-colors"
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
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
              <span className="text-orange-500">❯</span> echo "© {new Date().getFullYear()} Caleb Kang"
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Built with React + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Spotify Section
function SpotifySection() {
  const [spotifyData, setSpotifyData] = useState({
    nowPlaying: null,
    tracks: [],
    tracksRangeLabel: 'Last 6 Months',
    error: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchSpotifyData() {
      try {
        const response = await fetch('/api/spotify')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load Spotify data.')
        }

        if (isMounted) {
          setSpotifyData({
            nowPlaying: data.nowPlaying,
            tracks: data.tracks || [],
            tracksRangeLabel: data.tracksRangeLabel || 'Last 6 Months',
            error: '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error)
        if (isMounted) {
          setSpotifyData({
            nowPlaying: null,
            tracks: [],
            tracksRangeLabel: 'Last 6 Months',
            error: error.message || 'Unable to load Spotify data.',
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSpotifyData()
    const interval = setInterval(fetchSpotifyData, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const { nowPlaying, tracks, tracksRangeLabel, error } = spotifyData

  return (
    <section id="spotify" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
          <CommandHeader command="spotify --status" />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <Music size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              Spotify
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">Now Playing</p>
            {loading ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                </div>
              </div>
            ) : nowPlaying?.isPlaying ? (
              <a
                href={nowPlaying.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 transition-all group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={nowPlaying.albumImageUrl}
                    alt={nowPlaying.album}
                    className="w-16 h-16 rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-[10px]">▶</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-900 dark:text-white font-medium truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {nowPlaying.title}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm truncate">{nowPlaying.artist}</p>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs truncate">{nowPlaying.album}</p>
                </div>
                <ExternalLink size={16} className="text-zinc-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              </a>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="w-16 h-16 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <Music size={24} className="text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Nothing playing right now</p>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs">Start a song in Spotify and this card will update automatically.</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Top Songs
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {tracksRangeLabel}
              </p>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <span className="text-sm font-mono text-zinc-300 dark:text-zinc-600 w-5 text-center">{i + 1}</span>
                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700 animate-pulse flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2" />
                      <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-red-200 dark:border-red-900/50">
                <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Music size={20} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-700 dark:text-zinc-200 text-sm font-medium">Spotify data could not be loaded</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs break-words">{error}</p>
                </div>
              </div>
            ) : tracks.length === 0 ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Music size={20} className="text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">No top songs found</p>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs">Check your Spotify account permissions or try again later.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tracks.map((track, i) => (
                  <a
                    key={track.songUrl}
                    href={track.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 transition-all group"
                  >
                    <span className="text-sm font-mono font-bold text-zinc-400 dark:text-zinc-500 w-5 text-center group-hover:text-green-500 transition-colors">
                      {i + 1}
                    </span>
                    <img
                      src={track.albumImageUrl}
                      alt={track.album}
                      className="w-12 h-12 rounded-lg shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-900 dark:text-white font-medium truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {track.title}
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <ExternalLink size={16} className="text-zinc-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Engineering Pathways Section
function EngineeringPathways() {
  return (
    <section id="pathways" className="py-4 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-hover bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg p-6 md:p-8 mb-8">
          <CommandHeader command="cat pathways.md" />
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Engineering Pathways
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            <a
              href="https://grainger.illinois.edu/admissions/undergraduate/pathways"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Engineering Pathways
            </a> offers students interested in beginning their college education at an Illinois community college a <strong className="text-zinc-800 dark:text-zinc-200">streamlined transfer experience and guaranteed admission</strong> to The Grainger College of Engineering at the University of Illinois Urbana-Champaign upon successful completion of program requirements.
          </p>
          <a
            href="https://grainger.illinois.edu/admissions/undergraduate/pathways"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
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
  const [isDark, themeMode, toggleTheme] = useTheme()

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white transition-colors duration-[600ms]">
      {/* Animated background - different for light/dark mode with crossfade */}
      <div className={`transition-opacity duration-700 ease-in-out ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <ParticleBackground />
      </div>
      <div className={`transition-opacity duration-700 ease-in-out ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <LightModeBackground />
      </div>

      <Navbar themeMode={themeMode} toggleTheme={toggleTheme} />
      <main className="relative z-10">
        <Hero />
        <ScrollArrow />
        <Experience />
        <Research />
        <Projects />
        <Skills />
        <SpotifySection />
        <EngineeringPathways />
        <Resume />
      </main>
      <Footer />
    </div>
  )
}

export default App

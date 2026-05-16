import projectMino from "../assets/projects/chatbot.avif";
import projectHostel from "../assets/projects/hstl.jpg";
import projectGrove from "../assets/projects/grove.webp";
import projectPortfolio from "../assets/projects/portfolio.png";

export const HERO_CONTENT = `Detail-oriented AIML Engineer and Full Stack Developer based in Hyderabad, with hands-on experience building scalable web and AI-powered applications using Java, Spring Boot, React.js, Node.js, and Python.

I design RESTful APIs, integrate machine learning and NLP into production platforms, and optimize front-end performance for real users. Recent work includes a mental-health AI chatbot (MINO), a secure Spring Boot hostel management system, and geospatial travel platforms with optimized SQL pipelines.

Skilled in JWT authentication, role-based access control, MongoDB and MySQL, Flutter mobile apps, and cloud foundations (AWS Academy). Passionate about agile delivery, clean architecture, and user-centric products — open to software engineering and AIML opportunities.`;

export const EXPERIENCE = [
  {
    role: "SDE Intern",
    company: "Sophrion",
    period: "Apr 2026 – Present",
    location: "Hyderabad, India",
    highlights: [
      "Engineering the backend of a CRM ecosystem using Node.js and Express, building RESTful APIs to manage customer data, interactions, and business workflows.",
      "Architected and deployed scalable web application hosting infrastructure, ensuring high availability and optimized server-side performance across environments.",
      "Contributing to full-stack feature development across the CRM platform, including database schema design, API integration, and frontend connectivity.",
    ],
  },
  {
    role: "AIML Full Stack Engineer Intern",
    company: "Grahmind Innovations Pvt Ltd",
    period: "Dec 2025 – Apr 2026",
    location: "Hyderabad, India",
    highlights: [
      "Built and maintained scalable AI-enabled web application features using React.js, Spring Boot, Python, and MySQL.",
      "Designed and integrated AIML functionalities into full-stack platforms, including an NLP-powered chatbot and a cross-platform Flutter mobile application.",
      "Collaborated in agile sprints across multiple concurrent projects, contributing to API design, database optimization, and frontend component development.",
    ],
  },
];

export const PROJECTS = [
  
  {
    title: "Mental-Health AI Assistant (MINO)",
    image: projectMino,
    description:
      "Built a real-time AI chatbot leveraging NLP to understand and intelligently respond to user mental-health queries, simulating empathetic human conversation.",
    technologies: ["Python", "NLP", "Flask", "React.js"],
    highlights: [
      "Developed a Flask REST API backend and integrated a React.js frontend for seamless interaction and efficient data management.",
      "Implemented context-aware conversation flow to improve session continuity and user experience.",
    ],
  },
  {
    title: "Hostel Management System",
    image: projectHostel,
    description:
      "Engineered a secure, scalable backend using Spring Boot with JWT-based authentication and role-based access control for student hostel operations.",
    technologies: ["Spring Boot", "Spring Security", "JWT", "MySQL"],
    highlights: [
      "Implemented high-concurrency room allocation and registration workflows with optimized MySQL queries for real-time throughput under peak load.",
      "Designed a normalized database schema to support efficient student record management and reporting.",
    ],
  },
  {
    title: "Personal Portfolio Website",
    image: projectPortfolio,
    description:
      "Designed and developed a production-ready developer portfolio with a cosmic glassmorphism UI, animated starfield background, and a full-stack contact workflow.",
    technologies: [
      "React.js",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Firebase",
      "EmailJS",
      "Framer Motion",
    ],
    highlights: [
      "Built a responsive single-page application with custom glass cursor, interactive particle network, and Vanta galaxy background.",
      "Implemented an Express API with Firebase Firestore to persist contact submissions and EmailJS for owner and visitor email notifications.",
      "Structured modular React components, centralized content in constants, and configured Vite dev proxy for unified frontend/backend local development.",
    ],
  },
  {
    title: "GROVE — Geospatial Travel Platform",
    image: projectGrove,
    description:
      "Architected a high-precision travel discovery platform using Java and SQL for granular geospatial search and location-based discovery.",
    technologies: ["Java", "SQL", "NetBeans"],
    highlights: [
      "Delivered optimized, sub-second query performance for complex location-based data retrieval.",
      "Reduced search latency by indexing spatial data and streamlining query execution paths.",
    ],
  },
];

export const CONTACT = {
  address: "Hyderabad, India",
  phoneNo: "+91 9063531983",
  email: "vardhans367@gmail.com",
};

export const SKILL_CATEGORIES = [
  {
    title: "Programming Languages",
    skills: ["Java", "Python"],
  },
  {
    title: "Frontend",
    skills: ["React.js", "HTML5", "CSS3", "JavaScript (ES6+)"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Spring Boot", "Flask", "REST APIs", "Express.js"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "MongoDB", "Supabase", "SQL"],
  },
  {
    title: "AI / ML",
    skills: ["NLP", "Machine Learning", "Chatbot Development"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "Vite", "Power BI", "Tableau", "Flutter", "AWS"],
  },
];

export const TECH_SKILLS = [
  { name: "React.js", color: "#61DAFB" },
  { name: "Node.js", color: "#339933" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Java", color: "#ED8B00" },
  { name: "Python", color: "#3776AB" },
  { name: "Spring Boot", color: "#6DB33F" },
  { name: "Flask", color: "#ffffff" },
  { name: "MySQL", color: "#4479A1" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "Express.js", color: "#ffffff" },
  { name: "Flutter", color: "#02569B" },
  { name: "AWS", color: "#FF9900" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Git", color: "#F05032" },
  { name: "GitHub", color: "#ffffff" },
  { name: "Vite", color: "#646CFF" },
  { name: "HTML5", color: "#E34F26" },
  { name: "CSS3", color: "#1572B6" },
  { name: "NLP", color: "#A78BFA" },
  { name: "Power BI", color: "#F2C811" },
  { name: "Tableau", color: "#E97627" },
];

/** Labels shown when hovering background starfield particles */
export const STARFIELD_SKILLS = TECH_SKILLS.map((s) => s.name);

export const SERVICES = [
  {
    title: "Full Stack Web Development",
    description:
      "Building scalable, user-centric web applications with React.js, Node.js, Spring Boot, and Python — from UI components to production-ready deployments.",
  },
  {
    title: "RESTful API Engineering",
    description:
      "Designing and implementing secure REST APIs for CRM ecosystems, customer workflows, and high-traffic platforms with optimized database integration.",
  },
  {
    title: "AIML Integration & Chatbots",
    description:
      "Integrating NLP-powered chatbots and machine learning features into full-stack platforms for intelligent, context-aware user experiences.",
  },
  {
    title: "Backend & Database Architecture",
    description:
      "Engineering secure backends with JWT authentication, role-based access control, normalized schemas, and high-concurrency MySQL optimization.",
  },
  {
    title: "Mobile App Development",
    description:
      "Cross-platform mobile solutions with Flutter, real-time data sync via Supabase, and Node.js backends for live performance tracking.",
  },
  {
    title: "Cloud & DevOps Practices",
    description:
      "Deploying scalable hosting infrastructure, ensuring high availability, API integration, and agile delivery across concurrent projects.",
  },
];

export const CERTIFICATIONS = [
  {
    title: "Certified Artificial Intelligence Primer",
    provider: "Infosys",
    year: "2025",
  },
  {
    title: "Certified in Software Project Management",
    provider: "NPTEL",
    year: "2025",
  },
  {
    title: "Completed Java and Python programming courses",
    provider: "Codetantra",
    year: "2025",
  },
  {
    title: "Led a backend development team",
    provider: "Smart India Hackathon",
    year: "2025",
  },
  {
    title: "Pearson English International Certificate — Level 10 (C1 Advanced Proficiency)",
    provider: "Pearson",
    year: "2025",
  },
  {
    title: "AWS Academy Graduate — Data Engineering",
    provider: "AWS Academy",
    year: "2025",
  },
  {
    title: "AWS Academy Graduate — Cloud Foundations",
    provider: "AWS Academy",
    year: "2025",
  },
];

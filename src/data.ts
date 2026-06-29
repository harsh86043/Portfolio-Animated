export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  impact: string;
  tags: string[];
  image: string;
  link: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
  icon: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  achievements: string[];
}

export const PERSONAL_INFO = {
  name: "Harsh Pal Suryavanshi",
  title: "Full-Stack .NET Developer",
  subtitle: "ASP.NET Core // Angular // SQL Server Architect",
  tagline: "Building high-performance enterprise systems and interactive web solutions with clean modular architecture.",
  about: "I am a Results-driven Full-Stack .NET Developer with hands-on experience designing, developing, and deploying robust CRM applications, enterprise management software, and responsive web platforms. Specialized in creating high-performance RESTful APIs with ASP.NET Core, building dynamic single-page applications with Angular, optimizing SQL Server queries, and migrating complex legacy monoliths into modern, scalable architectures.",
  email: "harshpal.03@outlook.com",
  backupEmail: "suryavanshiharsh860@gmail.com",
  phone: "+91 8604357268",
  location: "Gurugram, Haryana, India",
  resumeUrl: "#",
  github: "https://github.com",
  linkedin: "https://www.linkedin.com/in/harsh-pal-suryavanshi",
  portfolio: "https://harsh.dev",
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Backend Core",
    skills: ["ASP.NET Core", "C# Language", "Web API Development", "Entity Framework Core", "C / C++ Programming"],
    icon: "Server"
  },
  {
    title: "Frontend Web",
    skills: ["Angular Framework", "TypeScript", "JavaScript", "jQuery", "HTML5 & CSS3", "Bootstrap"],
    icon: "Layout"
  },
  {
    title: "Databases & Storage",
    skills: ["Microsoft SQL Server", "Stored Procedures", "Query Optimization", "Pagination Logic", "Database Normalization"],
    icon: "Database"
  },
  {
    title: "Tools & Systems",
    skills: ["Git & GitHub", "Postman API client", "Visual Studio", "VS Code", "Microsoft Azure Cloud"],
    icon: "Sliders"
  }
];

export const PROJECTS: Project[] = [
  {
    id: "employee-manager",
    title: "Employee Management System",
    role: "Full Stack Developer",
    description: "A secure enterprise-grade CRUD application for organizational resource planning, featuring automated role-based access control and live performance dashboards.",
    impact: "Designed and implemented Microsoft SQL Server schemas using EF Core, establishing smooth pagination and data querying routines for optimal server response times.",
    tags: ["ASP.NET Core Web API", "Angular", "Entity Framework", "SQL Server", "Bootstrap"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    link: "#"
  },
  {
    id: "bulky-book",
    title: "Bulky Book E-Commerce Store",
    role: "Full-Stack .NET Developer",
    description: "A comprehensive scalable e-commerce store with user-friendly product catalog navigation, real-time inventory tracking, and full checkout transaction handling.",
    impact: "Integrated ASP.NET Core Identity Core for secure user accounts, order processing pipelines, and successfully deployed to Microsoft Azure.",
    tags: ["ASP.NET Core MVC", "Angular", "Identity Core", "MS SQL Server", "Bootstrap"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    link: "#"
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Full Stack .NET Developer",
    company: "Hindustan Wellness Pvt. Ltd.",
    period: "Nov 2025 - Present",
    location: "Gurugram, Haryana, India",
    description: [
      "Develop and maintain enterprise CRM applications using ASP.NET Core, Angular, SQL Server, and .NET Web APIs.",
      "Migrate legacy ASP.NET WebForms modules to Angular and .Net Core architecture while retaining complex business flows.",
      "Optimize SQL Server stored procedures, pagination algorithms, and complex queries to resolve performance bottlenecks."
    ],
    achievements: [
      "Engineered tailored reporting modules and real-time role-based dashboards for Agents, Team Leaders, and Managers.",
      "Integrated third-party dialer platforms and unified communication services to improve agent workflow efficiency.",
      "Resolved high-priority production system issues, guaranteeing high uptime and scalable application delivery."
    ]
  },
  {
    role: "Full Stack .NET Developer Trainee",
    company: "Draupadi Devi Vindhyanchal Mahavidyalaya",
    period: "March 2025 - August 2025",
    location: "Gorakhpur, India",
    description: [
      "Developed and maintained full-stack internal academic portals using ASP.NET Core, Angular, and SQL Server.",
      "Designed and documented RESTful Web APIs to connect responsive frontend modules to transactional database backends."
    ],
    achievements: [
      "Implemented secure login flows and role-based authorization rules using JSON Web Tokens (JWT).",
      "Successfully deployed and managed production releases on SmarterASP.NET cloud hosting."
    ]
  }
];

export const CERTIFICATIONS = [
  {
    title: ".NET Core MVC - The Complete Guide 2024 [E-Commerce]",
    issuer: "Udemy",
    date: "Sept 2024"
  },
  {
    title: "Learn C# Full Stack Development with Angular and ASP.NET",
    issuer: "Udemy",
    date: "April 2025"
  },
  {
    title: "Complete C# Masterclass",
    issuer: "Udemy",
    date: "Mar 2024"
  }
];

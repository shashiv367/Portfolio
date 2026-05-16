import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import logo from "../assets/shashi.png";
import ResumeIcon from "./ResumeIcon";

const navLinks = [
  { label: "Certifications", href: "#certifications" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <nav className="navbar-glass pointer-events-auto flex max-w-[95vw] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-2.5 sm:gap-x-6 sm:px-7 sm:py-3">
        <div className="flex flex-shrink-0 items-center">
          <a href="#home" aria-label="Home">
            <img src={logo} className="mx-1" width={100} height={35} alt="Logo" />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-stone-400 md:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            download
            aria-label="Download Resume"
            title="Download Resume"
            className="flex items-center text-stone-400 transition-colors hover:text-white"
          >
            <ResumeIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 text-lg text-stone-400">
          <a
            href="https://www.linkedin.com/in/shashi-vardhan-a22358343"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-[#0A66C2]"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/shashiv367"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-white"
          >
            <FaGithub />
          </a>
          <a
            href="mailto:vardhans367@gmail.com"
            aria-label="Email"
            className="transition-colors hover:text-[#EA4335]"
          >
            <FaEnvelope />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

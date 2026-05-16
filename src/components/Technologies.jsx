import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaAws,
  FaChartBar,
  FaDatabase,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaJava,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { FaBrain } from "react-icons/fa6";
import {
  SiCss3,
  SiExpress,
  SiFlask,
  SiFlutter,
  SiJavascript,
  SiMongodb,
  SiSpringboot,
  SiSupabase,
  SiTableau,
  SiVite,
} from "react-icons/si";
import { SKILL_CATEGORIES, TECH_SKILLS } from "../constants";

const ICON_MAP = {
  "React.js": FaReact,
  "Node.js": FaNodeJs,
  MongoDB: SiMongodb,
  Java: FaJava,
  Python: FaPython,
  "Spring Boot": SiSpringboot,
  Flask: SiFlask,
  MySQL: FaDatabase,
  JavaScript: SiJavascript,
  "Express.js": SiExpress,
  Flutter: SiFlutter,
  AWS: FaAws,
  Supabase: SiSupabase,
  Git: FaGitAlt,
  GitHub: FaGithub,
  Vite: SiVite,
  HTML5: FaHtml5,
  CSS3: SiCss3,
  NLP: FaBrain,
  "Power BI": FaChartBar,
  Tableau: SiTableau,
};

const ICON_SIZE = "text-4xl sm:text-5xl";

const SkillBubble = ({ skill }) => {
  const Icon = ICON_MAP[skill.name] || FaReact;

  return (
    <motion.div
      className="group relative mx-4 flex shrink-0 flex-col items-center"
      whileHover={{ scale: 1.12 }}
    >
      <motion.div
        className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20"
        style={{ color: skill.color }}
      >
        <Icon
          className={`${ICON_SIZE} transition-[filter] duration-200 group-hover:drop-shadow-[0_0_14px_currentColor]`}
          aria-hidden
        />
      </motion.div>
      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-stone-300 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {skill.name}
      </span>
    </motion.div>
  );
};

const Technologies = () => {
  const items = useMemo(() => TECH_SKILLS, []);
  const marqueeItems = useMemo(() => [...items, ...items], [items]);

  return (
    <section className="pb-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="my-20 text-center text-4xl"
      >
        Technologies
      </motion.h2>

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SKILL_CATEGORIES.map((category, index) => (
          <motion.div
            key={category.title}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="glass-card group p-6"
            style={{ perspective: "1000px" }}
          >
            <h3 className="mb-4 text-lg font-semibold text-stone-100">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-stone-300 backdrop-blur-sm transition group-hover:border-white/20 group-hover:bg-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="tech-marquee-mask relative w-full overflow-hidden py-6"
      >
        <div className="tech-marquee-track flex w-max items-center">
          {marqueeItems.map((skill, index) => (
            <SkillBubble key={`${skill.name}-${index}`} skill={skill} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Technologies;

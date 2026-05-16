import profilePic from "../assets/1.webp";
import { HERO_CONTENT, CERTIFICATIONS } from "../constants";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const Hero = () => {
  return (
    <section id="home" className="scroll-mt-28 pb-16 pt-4 md:pb-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative h-52 w-52 overflow-hidden rounded-full border-2 border-white/20 shadow-[0_0_48px_rgba(255,255,255,0.1)] sm:h-60 sm:w-60 lg:h-72 lg:w-72">
            <img
              src={profilePic}
              alt="Shashi Vardhan"
              className="h-full w-full object-cover object-[center_22%] scale-[1.35]"
            />
          </div>
        </motion.div>

        <motion.div
          className="w-full max-w-xl text-center lg:max-w-2xl lg:text-left"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-stone-100 sm:text-5xl lg:text-6xl"
          >
            Shashi Vardhan
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-lg font-medium text-stone-400 sm:text-xl"
          >
            Full Stack Developer
            <span className="mx-2 text-stone-600">|</span>
            AIML Engineer
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-6 space-y-4 text-base leading-relaxed text-stone-300 sm:text-lg"
          >
            {HERO_CONTENT.split("\n\n").map((paragraph) => (
              <span key={paragraph.slice(0, 24)} className="block">
                {paragraph}
              </span>
            ))}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        id="certifications"
        className="certifications-section mx-auto mt-28 max-w-4xl scroll-mt-28 pt-4 sm:mt-32 lg:mt-40"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-stone-100 lg:text-left">
          Certifications
        </h2>
        <ul className="glass-card grid gap-3 p-6 sm:grid-cols-2">
          {CERTIFICATIONS.map((cert) => (
            <li
              key={`${cert.provider}-${cert.title}`}
              className="border-l-2 border-stone-500/50 pl-4 text-sm leading-relaxed text-stone-300 sm:text-base"
            >
              <span className="font-semibold text-stone-100">{cert.title}</span>
              <span className="block text-stone-500">
                {cert.provider} · {cert.year}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
};

export default Hero;

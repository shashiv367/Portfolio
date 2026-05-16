import { motion } from "framer-motion";
import { EXPERIENCE } from "../constants";

const Experience = () => {
  return (
    <section id="experience" className="scroll-mt-24 pb-4">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Professional Experience
      </motion.h2>

      <motion.div
        className="mx-auto max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {EXPERIENCE.map((job, index) => (
          <motion.article
            key={`${job.company}-${job.role}`}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="glass-card border-l-2 border-l-sky-400/40 p-6 sm:p-8"
          >
            <motion.div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold text-stone-100">{job.role}</h3>
                <p className="text-lg text-sky-300/90">{job.company}</p>
              </div>
              <div className="text-right text-sm text-stone-500">
                <p>{job.period}</p>
                <p>{job.location}</p>
              </div>
            </motion.div>

            <ul className="space-y-2 text-sm leading-relaxed text-stone-400 sm:text-base">
              {job.highlights.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky-400/80" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Experience;

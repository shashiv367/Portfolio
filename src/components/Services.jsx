import { motion } from "framer-motion";
import { SERVICES } from "../constants";

const Services = () => {
  return (
    <section id="services" className="pb-24 scroll-mt-24">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        Services
      </motion.h2>
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {SERVICES.map((service, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card group p-6"
          >
            <h3 className="mb-3 text-xl font-semibold text-stone-100">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed text-stone-400">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Services;

import React from "react";
import profilePic from "../assets/1.jpg";
import { HERO_CONTENT, CERTIFICATIONS } from "../constants";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.5,
      staggerChildren: 0.5,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.5 } },
};

const Hero = () => {
  return (
    <div className="gb-4 lg:mb-36">
      <div className="flex flex-wrap lg:flex-row">
        {/* Left Section: Profile Picture */}
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center lg:p-8">
            <motion.img
              src={profilePic}
              alt="Shashi Vardhan"
              className="border border-stone-500 rounded-3xl"
              width={450}
              height={400}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Right Section: Hero Content and Certifications */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="flex flex-col items-start mt-10">
              <motion.h2
                variants={childVariants}
                className="pb-2 text-4xl tracking-tighter lg:text-8xl"
              >
                Shashi Vardhan
              </motion.h2>
              <motion.span
                variants={childVariants}
                className="bg-gradient-to-r from-stone-300 to-stone-600 bg-clip-text text-3xl tracking-tight text-transparent"
              >
                Tech Enthusiast | Student
              </motion.span>
              <motion.p
                variants={childVariants}
                className="my-2 max-w-lg py-6 text-xl leading-relaxed tracking-tighter"
              >
                {HERO_CONTENT}
              </motion.p>
              <motion.a
                variants={childVariants}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-white rounded-full p-4 text-sm text-stone-800 mb-10"
              >
                Download Resume
              </motion.a>

              {/* Certifications Section */}
              <div className="certifications-section w-full mt-6">
                <h2 className="text-2xl font-bold mb-4">Certifications</h2>
                <ul className="list-disc pl-5">
                  {CERTIFICATIONS.map((cert, index) => (
                    <li key={index} className="mb-2">
                      <strong>{cert.title}</strong> - {cert.provider} ({cert.year})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
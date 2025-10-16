"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen overflow-hidden">
      <motion.section
        className="container mx-auto px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* LEFT SIDE - TEXT */}
        <motion.div className="space-y-6 md:pr-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-green-400"
            variants={itemVariants}
          >
            Welcome to Alfamily
          </motion.h1>

          <motion.p
            className="text-lg leading-relaxed text-gray-300"
            variants={itemVariants}
          >
            The internal ride-sharing platform for Bank Alfalah employees. 
            Seamlessly connect with colleagues, offer or request rides, and 
            make your daily commute smarter.
          </motion.p>

          <motion.ul
            className="space-y-3 text-gray-300"
            variants={itemVariants}
          >
            {[
              "Secure Login with official email + OTP",
              "Smart matching of drivers & riders",
              "Eco-friendly & cost saving",
            ].map((text, index) => (
              <motion.li
                key={index}
                className="flex items-center"
                variants={itemVariants}
              >
                <span className="text-yellow-400 mr-2">✅</span> {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(34,197,94,0.5)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href="/register/driver"
                className="inline-block px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg transition-all text-center"
              >
                Register as Driver
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px rgba(250,204,21,0.5)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href="/register/rider"
                className="inline-block px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg transition-all text-center"
              >
                Register as Passenger
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - IMAGE */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 60 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { duration: 1, ease: "easeOut" },
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.05,
              rotate: 1,
              transition: { type: "spring", stiffness: 120 },
            }}
          >
            <Image
              src="https://img.freepik.com/premium-photo/social-network-concept-human-figures-blue-line-3d-rendering_152359-123.jpg"
              alt="Connecting people carpool"
              width={500}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

"use client";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const About: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <section id="about" ref={ref} className="relative bg-gray-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -60 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">Our Platform</span>
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Kick It ⚽ – Connect. Compete. Play. A dynamic sports event platform
            where players and organizers meet. Kick It is a full-stack event
            scheduling web app designed for sports enthusiasts to create,
            discover, and join local games. Whether you're looking for a casual
            pickup match or competitive tournaments, Kick It brings athletes
            together seamlessly.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Whether you're looking for a casual pickup match or competitive
            tournaments, Kick It brings athletes together seamlessly.
          </p>

          <a
            href="#"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all"
          >
            Learn More
          </a>
        </motion.div>

        {/* Right Image */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 60 },
            visible: { opacity: 1, x: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
            alt="About Us"
            className="rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;

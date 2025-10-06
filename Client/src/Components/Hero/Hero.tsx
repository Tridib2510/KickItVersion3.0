"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import LoginPopup from "../Login/Login";
import Player from "../../assets/Player.png";

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <section
      ref={ref}
      className="relative bg-gray-900 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Kickstart Your Journey <br /> with{" "}
            <span className="text-indigo-400">Our Platform</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Discover opportunities, connect with people, and grow faster than
            ever before.
          </p>
          <div className="flex gap-4">
            <LoginPopup Text={"Get Started"} />
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl border-gray-400 text-gray-200"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center"
        >
          <img
            src={Player}
            alt="Hero Illustration"
            className="w-120 h-120 object-cover rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

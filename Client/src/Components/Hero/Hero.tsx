
import { motion } from "motion/react";
import { Button } from "../ui/button";
import LoginPopup from "../Login/Login";
import Player from "../../assets/Player.png"; // Adjust the path as necessary
export default function Hero() {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Kickstart Your Journey <br /> with <span className="text-indigo-400">Our Platform</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Discover opportunities, connect with people, and grow faster than ever before.
          </p>
          <div className="flex gap-4">
            <LoginPopup Text={'Get Started'}/>
            <Button size="lg" variant="outline" className="rounded-2xl border-gray-400 text-gray-200">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
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

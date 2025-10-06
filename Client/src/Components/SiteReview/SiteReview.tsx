"use client";
import { motion } from "motion/react";
import React from "react";

interface Comment {
  name: string;
  handle: string;
  avatar: string;
  message: string;
}

interface HorizontalTweetCommentsWhiteProps {
  comments?: Comment[];
  speed?: number;
  direction?: "left" | "right";
}

export const HorizontalTweetCommentsWhite: React.FC<HorizontalTweetCommentsWhiteProps> = ({
  comments = [
    {
      name: "Rajdeep Seth",
      handle: "@rajdeepseth1",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajdeep",
      message:
        "Stumbled upon ui.aceternity.com today and my mind is blown 🤯\nThe seamless integration of framer-motion, tailwind CSS, and shadcn showcases a masterclass in UI design. 🚀 Kudos to @mannupaaji for creating such an innovative and inspirational resource for devs! #UI #nextjs",
    },
    {
      name: "Sarah Miller",
      handle: "@sarahbuilds",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      message:
        "This component animation feels *incredible*! 🔥 Love how smooth the transitions are — definitely using this in my next project.",
    },
    {
      name: "Aman Verma",
      handle: "@amanv",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
      message:
        "Framer Motion + Tailwind = ❤️  This combo makes building elegant UIs so much easier!",
    },
    {
      name: "Lisa K.",
      handle: "@lisacodes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      message:
        "UI perfection. ✨ Whoever designed this deserves a raise. So clean, so fluid!",
    },
  ],
  speed = 60,
  direction = "left",
}) => {
  const repeated = [...comments, ...comments];
  const distance = 100;
  const duration = distance / (speed / 10);

  return (
    <div className="relative w-full overflow-hidden bg-white py-6">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          ease: "linear",
          duration,
          repeat: Infinity,
        }}
      >
        {repeated.map((comment, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[360px] h-fit bg-white text-gray-900 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <div className="font-semibold text-gray-900">{comment.name}</div>
                <div className="text-gray-500 text-sm">{comment.handle}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
              {comment.message}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Fade edges for smooth visual ending */}
      <div className="pointer-events-none absolute inset-0 flex justify-between">
        <div className="w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="w-32 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
};

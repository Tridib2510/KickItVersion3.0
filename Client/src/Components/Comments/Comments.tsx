import React, { useState } from "react";
import { Send, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Comment = {
  id: number;
  name: string;
  text: string;
  date: string;
  likes: number;
};

const ModernCommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Alice",
      text: "This looks amazing! Can't wait to join 🎉",
      date: "2025-08-20 10:00 AM",
      likes: 2,
    },
    {
      id: 2,
      name: "Bob",
      text: "Great event, looking forward to it 🙌",
      date: "2025-08-20 11:30 AM",
      likes: 5,
    },
  ]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !text.trim()) return;

    const newComment: Comment = {
      id: comments.length + 1,
      name,
      text,
      date: new Date().toLocaleString(),
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setName("");
    setText("");
  };

  const handleLike = (id: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c
      )
    );
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          💬 Community Comments
        </motion.h2>

        {/* Comment Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md mb-10 border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </Button>
          </div>
        </motion.form>

        {/* Comments List */}
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{comment.likes}</span>
                  </button>
                </div>
                <p className="text-gray-700 mt-2">{comment.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ModernCommentSection;

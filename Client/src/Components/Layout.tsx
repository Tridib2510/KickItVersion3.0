import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import ChatPopup from "./Chat/Chat";
import { MessageCircle } from "lucide-react";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar />
      <Outlet />

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Popup */}
      <ChatPopup/>

      <Footer />
    </>
  );
};

export default Layout;

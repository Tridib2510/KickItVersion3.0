import { useState,useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import ChatPopup from "./Chat/Chat";
import { MessageCircle } from "lucide-react";

const Layout = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />

      {/* Floating Chat Button */}
     

      {/* Chat Popup */}
      {!isMobile && <ChatPopup />}

      <Footer />
    </>
  );
};

export default Layout;

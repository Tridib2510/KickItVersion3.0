import React, { useState, useEffect } from "react";
import { Menu, X, Home, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/Auth";
import clsx from "clsx";
import LoginPopup from "../Login/Login";
import { Link } from "react-router-dom";
import NotificationDropdown from "../Notification/Notification";

const BackendKey = import.meta.env.VITE_BACKEND_KEY;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const [profile, setProfile] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const options = {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: { "Content-Type": "application/json" },
  };

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token) {
      fetch(`${BackendKey}/KickIt/getUser`, options)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.user?.image || profile);
          setIsLoggedIn(true);
        })
        .catch(() => setIsLoggedIn(false));
    }
  }, [token]);

  return (
    <>
      <nav
        className={clsx(
          "w-full fixed top-0 left-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-gray-900"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              KickIt
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </Link>
            <Link
              to="/createEvent"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>Create</span>
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
                <NotificationDropdown />
                <Link to="/profile" className="focus:outline-none">
                  <img
                    src={profile}
                    alt="User Profile"
                    className="w-10 h-10 rounded-xl border-2 border-indigo-500/50 hover:border-indigo-400 transition-all hover:scale-105"
                  />
                </Link>
              </div>
            ) : (
              <div className="ml-4 pl-4 border-l border-gray-700">
                <LoginPopup Text="Login" />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMenu}
      />

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 md:hidden z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={toggleMenu}>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                KickIt
              </span>
            </Link>
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Profile Section */}
        {isLoggedIn ? (
          <div className="p-6 border-b border-gray-800">
            <Link
              to="/profile"
              onClick={toggleMenu}
              className="flex items-center gap-4"
            >
              <img
                src={profile}
                alt="User Profile"
                className="w-14 h-14 rounded-xl border-2 border-indigo-500/50"
              />
              <div>
                <p className="font-semibold text-white">My Profile</p>
                <p className="text-sm text-gray-400">View your profile</p>
              </div>
            </Link>
          </div>
        ) : null}

        {/* Menu Links */}
        <div className="p-4 space-y-1">
          <Link
            to="/"
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/events"
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>Events</span>
          </Link>
          <Link
            to="/createEvent"
            onClick={toggleMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <span>Create Event</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/notification"
                onClick={toggleMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <span>Notifications</span>
              </Link>
              <Link
                to="/chat"
                onClick={toggleMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </Link>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          {isLoggedIn ? (
            <button
              onClick={async () => {
                await fetch(`${BackendKey}/KickIt/logout`, { credentials: "include" });
                window.location.href = "/";
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <span>Logout</span>
            </button>
          ) : (
            <div onClick={toggleMenu}>
              <LoginPopup Text="Login" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
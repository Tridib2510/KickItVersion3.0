import React, { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useAuthStore } from "../../store/Auth"
import clsx from "clsx"
import LoginPopup from "../Login/Login"
import { Link } from "react-router-dom"
import { CreateEventPopup } from "../CreateEvent/CreateEvent"
import NotificationDropdown from "../Notification/Notification"

const BackendKey = import.meta.env.VITE_BACKEND_KEY

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  const [profile, isProfile] = useState("https://randomuser.me/api/portraits/men/32.jpg")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  interface Options {
    method: string
    credentials: RequestCredentials
    headers: {
      "Content-Type": string
    }
  }

  const options: Options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }

  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    if (token) {
      fetch(`${BackendKey}/KickIt/getUser`, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          isProfile(data.user.image)
          setIsLoggedIn(true)
        })
    }
  }, [localStorage.getItem("token")])

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-400">MyBrand</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="hover:text-indigo-400 transition-colors">Home</a>
          <a href="events" className="hover:text-indigo-400 transition-colors">Events</a>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
          <CreateEventPopup />

          {isLoggedIn ? (
            <div className="flex items-center space-x-6 ml-6">
              <NotificationDropdown />
              <Link to="/profile" className="focus:outline-none text-gray-200 hover:text-white">
                <img
                  src={profile}
                  alt="User Profile"
                  className="w-9 h-9 rounded-full border-2 border-indigo-400 hover:scale-105 transition-transform"
                />
              </Link>
            </div>
          ) : (
            <LoginPopup Text={"Get Started"} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-gray-200 hover:text-white"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 md:hidden z-40 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <X size={28} className="text-gray-200 hover:text-white" />
          </button>
        </div>

        {/* Profile Picture at Top */}
        {isLoggedIn && (
          <div className="flex flex-col items-center mt-4 space-y-3">
            <Link to="/profile" onClick={toggleMenu}>
              <img
                src={profile}
                alt="User Profile"
                className="w-20 h-20 rounded-full border-4 border-indigo-400 hover:scale-110 transition-transform"
              />
            </Link>
            <span className="text-lg font-medium">My Profile</span>
          </div>
        )}

        {/* Vertical Menu */}
        <div className="flex flex-col space-y-6 px-6 mt-8">
          <a href="#" className="hover:text-indigo-400 transition-colors" onClick={toggleMenu}>Home</a>
          <a href="events" className="hover:text-indigo-400 transition-colors" onClick={toggleMenu}>Events</a>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors" onClick={toggleMenu}>Pricing</a>
          <CreateEventPopup />

          {isLoggedIn ? (
            <div className="mt-6">
              <NotificationDropdown />
            </div>
          ) : (
            <LoginPopup Text={"Get Started"} />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

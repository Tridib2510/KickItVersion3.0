import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                KickIt
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connecting players with local sports events. Create or join games in your community and stay active together.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-indigo-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-indigo-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-indigo-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-indigo-400" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/createEvent" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">123 Sports Avenue, Active City, AC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <a href="mailto:hello@kickit.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  hello@kickit.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} KickIt. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for sports enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
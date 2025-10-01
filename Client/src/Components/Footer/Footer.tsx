import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">MyBrand</h2>
          <p className="text-gray-400">
            Building modern solutions to connect people, inspire growth,
            and create opportunities worldwide.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400">About</a></li>
              <li><a href="#" className="hover:text-indigo-400">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400">Docs</a></li>
              <li><a href="#" className="hover:text-indigo-400">Support</a></li>
              <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-400">API</a></li>
            </ul>
          </div>
        </div>

        {/* Social Section */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400"><Facebook size={20} /></a>
            <a href="#" className="hover:text-indigo-400"><Twitter size={20} /></a>
            <a href="#" className="hover:text-indigo-400"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-indigo-400"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Divider & Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MyBrand. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

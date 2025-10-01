import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
const BackendKey=import.meta.env.VITE_BACKEND_KEY

interface User {
  id: string;
  username: string;
  description: string;
  email: string;
  reviews: number;
  rating: Array<number>;
  totalEvents: number;
  image: string;
  
}

interface UpdateProfileModalProps {
  user: User | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  user,
  isOpen,
  onClose
  
}) => {
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      
      setPreviewImage(user.image || null);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if(formData){
    
   
    formData.set(e.target.name, e.target.value);
    setFormData(formData);
    }
   
  };

  // Handle file upload & preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
        
      const reader = new FileReader();
      reader.onloadend = () => {
    
        setPreviewImage(reader.result as string);
        
        formData.set("file", file);
        setFormData(formData); // save base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    fetch(`${BackendKey}/KickIt/profileUpdate`, {
      method: "PATCH",
      credentials: "include",
      
      body:formData
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        console.log(updatedUser)
        onClose();
        window.location.reload();
        
      })
      .catch((err) => console.error("Update failed", err));
  };
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90%] max-w-lg p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update Profile
        </h2>

        {/* Profile Image Preview */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              previewImage ||
              "https://via.placeholder.com/150?text=Profile+Image"
            }
            alt="Profile Preview"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover mb-3"
          />
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter your username"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="Description"
              
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Tell something about yourself"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;

import React from "react";
import { X } from "lucide-react";

interface Event { 
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

interface User {
  id: string; 
  username: string;
  image?: string;
  bio?: string;
}

interface JoinRequestProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  user: User | null;
  onAccept: (eventId: string, userId: string) => void;
  onReject: (eventId: string, userId: string) => void;
}

const JoinRequest: React.FC<JoinRequestProps> = ({
  isOpen,
  onClose,
  event,
  user,
  onAccept,
  onReject,
}) => {
  if (!isOpen || !event || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Section */}
          <div>
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              📅 {event.date} | ⏰ {event.time}
            </p>
            <p className="text-sm text-gray-600 mb-1">📍 {event.location}</p>
            <p className="text-gray-700 text-sm mt-2">{event.description}</p>
          </div>

          {/* User Section */}
          <div className="flex flex-col items-center justify-center text-center">
            {user.image && (
              <img
                src={user.image}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            )}
            <h3 className="text-lg font-semibold text-gray-800">{user.username}</h3>
            {user.bio && <p className="text-sm text-gray-600 mt-2">{user.bio}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => onReject(event.id, user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(event.id, user.id)}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRequest;

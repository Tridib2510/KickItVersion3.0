import React from "react";
import { X } from "lucide-react";

interface Events {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  
}

interface EventDetailsModalProps {
  event: Events | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Event Image */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-52 object-cover rounded-xl mb-4"
          />
        )}

        {/* Event Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>

        {/* Event Info */}
        <div className="text-gray-600 space-y-1 mb-4">
          <p><span className="font-semibold">📅 Date:</span> {event.date}</p>
          <p><span className="font-semibold">⏰ Time:</span> {event.time}</p>
          <p><span className="font-semibold">📍 Location:</span> {event.location}</p>
        </div>

        {/* Event Description */}
        <p className="text-gray-700 leading-relaxed">{event.description}</p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Close
          </button>
          {/* <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            Register
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

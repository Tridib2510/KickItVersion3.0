import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../store/Auth";
const BackendKey = import.meta.env.VITE_BACKEND_KEY;
import Soccer from "../../assets/Soccer.png";
import Cricket from "../../assets/Cricket.png";
import Badminton from "../../assets/Badminton.png";
import Tennis from "../../assets/Tennis.png";
import Basketball from "../../assets/Basketball.png";
import Spinner from "../Spinner.tsx/Spinner";

type Event = {
  id: number;
  title: string;
  date: string;
  createdBy?: string;
  location: string;
  description: string;
  image: string;
  activity: string;
  playersJoined?: number;
  playersRequired?: number;
  time?: string;
};

const activityImages: Record<string, string> = {
  Soccer,
  Cricket,
  Badminton,
  Tennis,
  Basketball,
};

const activityColors: Record<string, string> = {
  Soccer: "bg-green-100 text-green-700",
  Cricket: "bg-yellow-100 text-yellow-700",
  Badminton: "bg-orange-100 text-orange-700",
  Tennis: "bg-blue-100 text-blue-700",
  Basketball: "bg-red-100 text-red-700",
};

const EventsSection: React.FC = () => {
  const id = useAuthStore((state) => state.userId);
  const [events, setEvents] = useState<Event[]>([]);
  const [userId, setUserId] = useState<string>();
  const [socket2, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const socket = io(`${BackendKey}`);
    setSocket(socket);
    setUserId(id);
    console.log(userId);
    console.log(socket2);
  }, []);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BackendKey}/KickIt/home`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const Events: Event[] = data.data.slice(0, 3).map((e: any) => ({
          id: e._id,
          title: e.eventName,
          date: e.date,
          location: e.venue,
          description: e.Description,
          image: e.image || Soccer,
          activity: e.activity,
          playersJoined: e.playersJoined?.length || 0,
          playersRequired: e.playersRequired || 10,
          time: e.time,
        }));

        setEvents(Events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section id="events" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Upcoming <span className="text-indigo-600">Events</span>
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
          Find and join sports events happening near you
        </p>

        {loading && <Spinner />}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const spotsLeft =
              (event.playersRequired || 10) - (event.playersJoined || 0);
            const isFull = spotsLeft <= 0;
            const isLowSpots = spotsLeft > 0 && spotsLeft <= 3;

            return (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image with activity badge overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activityImages[event.activity] || Soccer}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Activity Badge */}
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      activityColors[event.activity] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {event.activity}
                  </span>
                  {/* Spots Badge */}
                  {isFull ? (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                      Full
                    </span>
                  ) : isLowSpots ? (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                      {spotsLeft} spots left
                    </span>
                  ) : null}
                </div>

                {/* Event Details */}
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  </div>

                  {/* Players & Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-600 font-medium">
                        {event.playersJoined || 0}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">
                        {event.playersRequired || 10} players
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className={`rounded-full px-5 ${
                        isFull
                          ? "bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-500 hover:bg-indigo-600 text-white"
                      }`}
                      disabled={isFull}
                    >
                      {isFull ? "Full" : "Join"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
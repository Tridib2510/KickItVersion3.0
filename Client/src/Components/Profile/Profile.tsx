import React, { useEffect, useState } from "react";
import UpdateProfileModal from "../updateProfile/updateProfile";
import { ChartBarLabel } from "../Charts/BarChar";
import EventDetailsModal from "../EventDetails/EventDetails";
import { BadgeSlider } from "../Badges/Badges";
import Calendar from "../Calender/Calender";
import Soccer from "../../assets/Soccer.png";
import Cricket from "../../assets/Cricket.png";
import Badminton from "../../assets/Badminton.png";
import Tennis from "../../assets/Tennis.png";
import Basketball from "../../assets/Basketball.png";
import { MapPin, Star, Calendar as CalendarIcon, Award, LogOut, Settings, Activity } from "lucide-react";
import { Button } from "../ui/button";

const BackendKey = import.meta.env.VITE_BACKEND_KEY;

const UserProfile: React.FC = () => {
  type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    activity?: string;
    description: string;
    image?: string;
  };

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

  interface Badge {
    id?: string;
    badgeName?: string;
    description?: string;
    previewShown?: Boolean;
    image?: string;
  }

  const [badges, setBadges] = useState<Badge[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${BackendKey}/KickIt/logout`, {
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/profile`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser({
          id: data.user._id,
          username: data.user.username,
          description: data.user.Description,
          email: data.user.email,
          reviews: data.user.reviews.length,
          rating: data.user.ratings,
          totalEvents: data.user.totalEvents,
          image: data.user.image,
        });
        const Badges: Badge[] = data.user.badges.map((e: any) => ({
          id: e._id,
          badgeName: e.badgeName,
          description: e.description,
          issuedOn: e.issuedOn,
          previewShown: e.previewShown,
          image: e.image,
        }));
        setBadges(Badges);
      });
  }, []);

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/myEvents`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const Events: Event[] = data.data.map((e: any) => ({
          id: e._id,
          title: e.eventName,
          date: e.date,
          location: e.venue,
          description: e.Description,
          activity: e.activity,
          image:
            "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
        }));
        setMyEvents(Events);
      });
  }, []);

  const averageRating = user?.rating?.length
    ? (user.rating.reduce((a, b) => a + b, 0) / user.rating.length).toFixed(1)
    : "New";

  const activityImages: Record<string, string> = {
    Soccer,
    Cricket,
    Badminton,
    Tennis,
    Basketball,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 h-56 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                alt={user?.username}
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {user?.username}
              </h1>
              <p className="text-gray-500 mb-4">{user?.email}</p>
              <p className="text-gray-600 bg-gray-50 rounded-xl p-4 max-w-lg">
                {user?.description || "Hey there! I'm a sports enthusiast looking to join local games and events."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white px-6"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-2xl font-bold">{averageRating}</span>
              </div>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Award className="w-5 h-5" />
                <span className="text-2xl font-bold">{user?.reviews || 0}</span>
              </div>
              <p className="text-sm text-gray-500">Reviews</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <Activity className="w-5 h-5" />
                <span className="text-2xl font-bold">{myEvents.length}</span>
              </div>
              <p className="text-sm text-gray-500">Events</p>
            </div>
          </div>
        </div>

        {/* Chart + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Performance
            </h2>
            <ChartBarLabel />
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Badges ({badges.length})
            </h2>
            <BadgeSlider badges={badges} />
          </div>
        </div>

        {/* My Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-500" />
            My Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setIsEventOpen(true);
                }}
                className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={activityImages[event.activity || ""] || Basketball}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700">
                    {event.activity}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
            {myEvents.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No events yet</p>
                <p className="text-sm text-gray-400">Join an event to see it here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Calendar */}
      <Calendar
        setSelectedEvent={setSelectedEvent}
        setIsEventOpen={setIsEventOpen}
      />

      {/* Modals */}
      <UpdateProfileModal
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventOpen}
        onClose={() => setIsEventOpen(false)}
      />
    </div>
  );
};

export default UserProfile;
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Star, Share2, Heart, Check } from "lucide-react";
import ReviewPopup from "../Review/Review";
import { useAuthStore } from "../../store/Auth";

import Soccer from "../../assets/Soccer.png";
import Cricket from "../../assets/Cricket.png";
import Badminton from "../../assets/Badminton.png";
import Tennis from "../../assets/Tennis.png";
import Basketball from "../../assets/Basketball.png";

const BackendKey = import.meta.env.VITE_BACKEND_KEY;

interface Profile {
  id?: string;
  name?: string;
  avatar?: string;
  role?: string;
}

interface EventDetailsData {
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  activity?: string;
  description?: string;
  participants?: Profile[];
  playersJoined?: number;
  playersRequired?: number;
  createdBy?: string;
  ratings?: number[];
}

const activityImages: Record<string, string> = {
  Soccer,
  Cricket,
  Badminton,
  Tennis,
  Basketball,
};

const activityColors: Record<string, string> = {
  Soccer: "from-green-500 to-emerald-600",
  Cricket: "from-yellow-500 to-amber-600",
  Badminton: "from-orange-500 to-orange-600",
  Tennis: "from-blue-500 to-blue-600",
  Basketball: "from-red-500 to-rose-600",
};

const activityBgColors: Record<string, string> = {
  Soccer: "bg-green-100 text-green-700",
  Cricket: "bg-yellow-100 text-yellow-700",
  Badminton: "bg-orange-100 text-orange-700",
  Tennis: "bg-blue-100 text-blue-700",
  Basketball: "bg-red-100 text-red-700",
};

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EventDetailsData | undefined>();
  const [reviewer, setReviewer] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const userId = useAuthStore((state) => state.userId);

  function openReview(userId: string | undefined) {
    setOpen(true);
    if (userId) setReviewer(userId);
  }

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/getEvent/${eventId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const participants: Profile[] = data.event.playersJoined.map(
          ({ username, image, id }: any) => ({
            id,
            name: username,
            avatar: image,
          })
        );

        setEvent({
          id: data.event._id,
          title: data.event.eventName,
          date: data.event.date,
          time: data.event.time,
          location: data.event.venue,
          description: data.event.Description,
          activity: data.event.activity,
          participants,
          playersJoined: data.event.playersJoined?.length || 0,
          playersRequired: data.event.playersRequired || 10,
          createdBy: data.event.createdBy,
          ratings: data.event.ratings || [],
        });

        // Check if current user is already in the event
        const userIsJoined = data.event.playersJoined?.some(
          (p: any) => p.id === userId || p._id === userId
        );
        setIsJoined(!!userIsJoined);
      });
  }, [eventId, userId]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const averageRating = event?.ratings?.length
    ? (event.ratings.reduce((a, b) => a + b, 0) / event.ratings.length).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={activityImages[event?.activity || ""] || Basketball}
          alt={event?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 md:top-6 md:left-6 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 md:gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 md:p-3 rounded-full backdrop-blur-md transition ${
              isSaved ? "bg-red-500/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition text-white">
            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {event?.activity && (
              <span
                className={`inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white mb-3 md:mb-4`}
              >
                🏅 {event.activity}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
              {event?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90 text-sm md:text-base">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(event?.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {event?.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event?.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-md border border-gray-100 text-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {event?.playersJoined || 0}
                </p>
                <p className="text-xs md:text-sm text-gray-500">Joined</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-md border border-gray-100 text-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {event?.playersRequired || 10}
                </p>
                <p className="text-xs md:text-sm text-gray-500">Required</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-md border border-gray-100 text-center">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                <p className="text-xs md:text-sm text-gray-500">Rating</p>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-md border border-gray-100 text-center">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-red-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900 truncate">{event?.location?.split(",")[0]}</p>
                <p className="text-xs md:text-sm text-gray-500">Venue</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {event?.description || "No description provided for this event."}
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {event?.activity && (
                  <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${activityBgColors[event.activity] || "bg-gray-100 text-gray-700"}`}>
                    {event.activity}
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-indigo-100 text-indigo-700">
                  Active Event
                </span>
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Participants ({event?.participants?.length || 0})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scroll("left")}
                    className="p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => scroll("right")}
                    className="p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div
                ref={sliderRef}
                className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide scroll-smooth"
              >
                {event?.participants && event.participants.length > 0 ? (
                  event.participants.map((profile, index) => (
                    <motion.div
                      key={profile.id || index}
                      onClick={() => openReview(profile.id)}
                      className="min-w-[140px] md:min-w-[180px] bg-white rounded-2xl shadow-lg p-4 md:p-5 flex-shrink-0 cursor-pointer hover:shadow-xl transition-all"
                      whileHover={{ y: -5 }}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-3 border-4 border-indigo-100"
                      />
                      <p className="font-semibold text-sm md:text-base text-gray-900 text-center truncate">
                        {profile.name}
                      </p>
                      {profile.role && (
                        <p className="text-xs md:text-sm text-gray-500 text-center truncate">
                          {profile.role}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center py-12 bg-white rounded-2xl">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No participants yet</p>
                      <p className="text-sm text-gray-400">Be the first to join!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Join Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isJoined ? "You're Attending" : "Join This Event"}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{formatDate(event?.date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-900">{event?.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{event?.location}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Spots filled</span>
                  <span className="font-medium text-gray-900">
                    {event?.playersJoined || 0} / {event?.playersRequired || 10}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (event?.playersJoined || 0) >= (event?.playersRequired || 10)
                        ? "bg-red-500"
                        : "bg-indigo-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        ((event?.playersJoined || 0) / (event?.playersRequired || 10)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {isJoined ? (
                <div className="flex items-center justify-center gap-2 py-3.5 bg-green-100 text-green-700 font-semibold rounded-xl">
                  <Check className="w-5 h-5" />
                  Joined
                </div>
              ) : (
                <button className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200">
                  Request to Join
                </button>
              )}

              <p className="text-xs text-gray-400 text-center mt-4">
                {isJoined
                  ? "You're all set! See you at the event"
                  : "Your request will be reviewed by the event organizer"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReviewPopup open={open} setOpen={setOpen} reviewer={reviewer} />
    </div>
  );
};

export default EventPage;
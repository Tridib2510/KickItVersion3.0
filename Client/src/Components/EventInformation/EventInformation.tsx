import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReviewPopup from "../Review/Review";

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
}

const EventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<EventDetailsData | undefined>();
  const [reviewer, setReviewer] = useState("");

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
        });
      });
  }, [eventId]);

  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
        
        {/* Left Column - Image + Description (Hidden on small screens) */}
        <div className="hidden md:flex col-span-1 bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-8 flex-col items-center text-center w-full">
          <img
            src={
              event?.activity === "Soccer"
                ? Soccer
                : event?.activity === "Cricket"
                ? Cricket
                : event?.activity === "Badminton"
                ? Badminton
                : event?.activity === "Tennis"
                ? Tennis
                : Basketball
            }
            alt={event?.title}
            className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-xl mb-4 sm:mb-6 shadow-md"
          />
          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
            {event?.description}
          </p>
        </div>

        {/* Right Column */}
        <div className="col-span-2 flex flex-col gap-8 md:gap-10 w-full">
          {/* Event Info */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 md:mb-4 tracking-wide">
              {event?.title}
            </h1>

            {/* Activity Section */}
            {event?.activity && (
              <div className="flex justify-center md:justify-start mb-5">
                <span className="inline-block px-5 py-2 text-lg sm:text-xl md:text-2xl font-semibold bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-md">
                  🏅 {event.activity}
                </span>
              </div>
            )}

            <p className="text-lg sm:text-xl md:text-2xl mb-1 md:mb-2 font-medium">
              📅 {event?.date} | 🕒 {event?.time}
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-medium">
              📍 {event?.location}
            </p>
          </div>

          {/* Participants Slider */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center md:text-left">
              Participants
            </h2>
            <div className="relative">
              {/* Left Button */}
              <button
                onClick={() => scroll("left")}
                className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-4 hover:bg-gray-100 text-xl sm:text-2xl transition"
              >
                ◀
              </button>

              {/* Slider */}
              <div
                ref={sliderRef}
                className="flex overflow-x-auto gap-5 sm:gap-8 py-4 sm:py-6 scrollbar-hide scroll-smooth px-2"
              >
                {event?.participants && event.participants.length > 0 ? (
                  event.participants.map((profile) => (
                    <motion.div
                      key={profile.id}
                      onClick={() => openReview(profile.id)}
                      className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] bg-white rounded-2xl md:rounded-3xl shadow-lg p-4 sm:p-6 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
                      whileHover={{ scale: 1.08 }}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-3 sm:mb-4 border-4 border-indigo-500"
                      />
                      <div>
                        <p className="font-semibold text-lg sm:text-xl text-gray-900">
                          {profile.name}
                        </p>
                        {profile.role && (
                          <p className="text-sm sm:text-base text-gray-500">
                            {profile.role}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-lg text-center w-full">
                    No participants yet for this event.
                  </p>
                )}
              </div>

              {/* Right Button */}
              <button
                onClick={() => scroll("right")}
                className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 sm:p-4 hover:bg-gray-100 text-xl sm:text-2xl transition"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Popup */}
      <ReviewPopup open={open} setOpen={setOpen} reviewer={reviewer} />
    </div>
  );
};

export default EventPage;

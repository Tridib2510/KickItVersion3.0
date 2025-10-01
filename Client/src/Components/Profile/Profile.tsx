import React, { useEffect, useState } from "react";
import { ThreeDCardDemo } from "../Cards/Cards";
import UpdateProfileModal from "../updateProfile/updateProfile";
import { ChartBarLabel} from "../Charts/BarChar";
import EventDetailsModal from "../EventDetails/EventDetails";
import {BadgeSlider} from "../Badges/Badges";
import Calendar from "../Calender/Calender"; //  import only the compound calendar
const BackendKey=import.meta.env.VITE_BACKEND_KEY

const UserProfile: React.FC = () => {
  type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
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

 interface Badge{
  id?:string,
  badgeName?:string,
  description?:string,
  previewShown?:Boolean,
  image?:string
}
  const [badges,setBadges]=useState<Badge[]>([])
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // EventDetailsModal states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/profile`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.user.badges)
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
        console.log(data.user.badges)
        const Badges:Badge[]=data.user.badges.map((e:any)=>({
            id:e._id,
            badgeName:e.badgeName,
            description:e.description,
            issuedOn:e.issuedOn,
            previewShown:e.previewShown,
            image:e.image
        }))
        console.log(Badges)
        setBadges(Badges)
      });
  }, []);

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/myEvents`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const Events: Event[] = data.data.map((e: any) => ({
          id: e._id,
          title: e.eventName,
          date: e.date,
          location: e.venue,
          description: e.Description,
          image:
            "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
        }));
        setMyEvents(Events);

        
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 relative">
      {/* Header */}
      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between bg-gradient-to-r from-blue-400 to-indigo-500 h-64 text-white">
        <div className="ml-0 sm:ml-48 mt-20 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <p className="uppercase text-sm font-semibold text-gray-200">
              Profile
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold">{user?.username}</h1>
            <p className="text-gray-100 text-sm sm:text-base">{user?.email}</p>
          </div>

          {/* Update Button (desktop only) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:block bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
          >
            Update Profile
          </button>
        </div>

        {/* Profile Image + Description */}
        <div
          className="
            absolute 
            bottom-[-140px] sm:bottom-[-100px]   /* ✅ lift up slightly on desktop */
            left-1/2 sm:left-8 
            transform -translate-x-1/2 sm:translate-x-0 
            flex flex-col items-center sm:items-start
          "
        >
          <img
            src={user?.image}
            alt="User"
            className="h-28 w-28 sm:h-32 sm:w-32 rounded-full shadow-lg border-4 border-white"
          />
          <p className="mt-3 text-center sm:text-left text-gray-800 bg-white/70 px-3 py-1 rounded-md text-sm max-w-xs">
            {user?.description || "No description provided"}
          </p>

          {/* Mobile-only Update Profile button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="sm:hidden mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* Push content down */}
      <div className="pt-40 sm:pt-32 px-4 sm:px-8 pb-20">
        {/* Stats */}
        <div className="flex flex-wrap gap-6 text-gray-700 mb-8">
          <div>
            <span className="block text-xl font-bold text-gray-900">
              {user?.rating.length}⭐
            </span>
            Rating
          </div>
          <div>
            <span className="block text-xl font-bold text-gray-900">
              {user?.reviews}
            </span>
            Reviews
          </div>
          <div>
            <span className="block text-xl font-bold text-gray-900">
              {myEvents.length}
            </span>
            Events
          </div>
        </div>

        {/* Chart */}
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Left column */}
  <div>
    <ChartBarLabel/>
  </div>

  {/* Right column */}
  <div>
    {/* Replace with your actual content */}
     <BadgeSlider badges={badges}/> 
  </div>
</div>



        {/* Events */}
        <h2 className="text-2xl font-bold mb-4">Your Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {myEvents.map((event) => (
            <div key={event.id} className="flex flex-col gap-2">
              <ThreeDCardDemo
                id={event.id}
                time={event.time}
                title={event.title}
                date={event.date}
                location={event.location}
                description={event.description}
                image={event.image}
                setSelectedEvent={setSelectedEvent}
                setIsEventOpen={setIsEventOpen}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Integrated Floating Calendar (self-contained) */}
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

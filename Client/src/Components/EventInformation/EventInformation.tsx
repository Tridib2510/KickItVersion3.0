import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { motion } from "framer-motion";
import ReviewPopup from "../Review/Review";
const BackendKey=import.meta.env.VITE_BACKEND_KEY


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
  description?: string;
  participants?: Profile[];
}

const EventPage: React.FC = () => {
const { eventId } = useParams<{ eventId: string }>();
 const [open, setOpen] = useState(false);
const [event,setEvent]=useState<EventDetailsData|undefined>()
const [reviewer,setReviewer]=useState("");
function openReview(userId:string|undefined){
  console.log("set Review")
  setOpen(true)
  if(userId)setReviewer(userId)
}

    // let event: EventDetailsData = {
    // id: "1",
    // title: "React Conference 2025",
    // date: "October 28, 2025",
    // time: "10:00 AM - 5:00 PM",
    // location: "Silicon Valley Conference Center",
    // description:
    //   "Join us for a full day of talks, workshops, and networking focused on React and modern frontend development. Learn about the latest trends, meet industry leaders, and expand your skillset.",
    // participants: [
    //   {
    //     id: "p1",
    //     name: "Alice Johnson",
    //     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    //     role: "Speaker",
    //   },
    //   {
    //     id: "p2",
    //     name: "Bob Smith",
    //     avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    //     role: "Attendee",
    //   },
    //   {
    //     id: "p3",
    //     name: "Carol Lee",
    //     avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    //     role: "Organizer",
    //   },
    //   {
    //     id: "p4",
    //     name: "David Kim",
    //     avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    //   },
    //   {
    //     id: "p5",
    //     name: "Emma Watson",
    //     avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    //   },
    // ],
//   };

  useEffect(()=>{
   fetch(`${BackendKey}/KickIt/getEvent/${eventId}`,{
    credentials:"include"
   })
   .then(res=>res.json())
   .then(data=>{
    console.log('current-->')
    const participants:Profile[]=data.event.playersJoined.map(({username,image,id}:any)=>({
        id:id,
        name:username,
        avatar:image
    }))
    
     const ev={
           id:data._id,
           title:data.eventName,
           date:data.date,
           time:data.time,
           location:data.venue,
           description:data.Description
     }
     console.log('ev')
  console.log(ev)
    setEvent({
           id:data.event._id,
           title:data.event.eventName,
           date:data.event.date,
           time:data.event.time,
           location:data.event.venue,
           description:data.event.Description,
           participants:participants
      })

    
   })
   
   
},[])

  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 space-y-10">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">{event?.title}</h1>
        <p className="text-lg">{event?.date} | {event?.time}</p>
        <p className="text-lg">{event?.location}</p>
        <p className="mt-4 text-gray-100 text-base">{event?.description}</p>
      </div>

      {/* Participants Slider */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            ◀
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 py-4 scrollbar-hide scroll-smooth"
          >
            {event?.participants && event.participants.map((profile) => (
              <motion.div
                key={profile.id}
                onClick={()=>openReview(profile.id)}
                className="min-w-[200px] bg-white rounded-2xl shadow-lg p-4 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.08 }}
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <div className="text-center">
                  <p className="font-semibold">{profile.name}</p>
                  {profile.role && (
                    <p className="text-sm text-gray-500">{profile.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            ▶
          </button>
        </div>
      </div>
      <ReviewPopup open={open} setOpen={setOpen} reviewer={reviewer}/>
    </div>
  );
};

export default EventPage;

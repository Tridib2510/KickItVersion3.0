import React, { useEffect,useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { io,Socket} from "socket.io-client"
import { useAuthStore } from "../../store/Auth";
const BackendKey=import.meta.env.VITE_BACKEND_KEY


type Event = {
  id: number;
  title: string;
  date: string;
  createdBy?:string;
  location: string;
  description: string;
  image: string;
};

// const events: Event[] = [
  // {
  //   id: 1,
  //   title: "Summer Coding Bootcamp",
  //   date: "Aug 25, 2025 · 10:00 AM",
  //   location: "Online",
  //   description:
  //     "Join our 2-week immersive bootcamp to learn full-stack web development from scratch.",
  //   image:
  //     "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  // },
  // {
  //   id: 2,
  //   title: "Startup Pitch Night",
  //   date: "Sep 02, 2025 · 6:30 PM",
  //   location: "San Francisco, CA",
  //   description:
  //     "Watch top startups pitch their ideas to investors and industry leaders.",
  //   image:
  //     "https://images.unsplash.com/photo-1515165562835-c4cda4e9d8b6?w=800&q=80",
  // },
  // {
  //   id: 3,
  //   title: "Design Thinking Workshop",
  //   date: "Sep 10, 2025 · 2:00 PM",
  //   location: "New York, NY",
  //   description:
  //     "A hands-on workshop to unlock creativity and problem-solving skills through design thinking.",
  //   image:
  //     "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
  // },
// ];
 


const EventsSection: React.FC = () => {
  const id = useAuthStore((state) => state.userId);
const [events, setEvents]= useState<Event[]>([]);
const [userId,setUserId]=useState<string>()
const [socket2, setSocket] = useState<Socket | null>(null)
useEffect(()=>{
const socket=io(`${BackendKey}`)
setSocket(socket)
setUserId(id)
console.log(userId)
console.log(socket2)
},[])

useEffect(()=>{
  fetch(`${BackendKey}/KickIt/home`)
  .then((response)=>response.json())
  .then(data=>{
    let Events: Event[] = [];
    data.data.slice(0,3).forEach((e:any)=>{
      
      Events.push({
  id:e._id,
  title:e.eventName,
  date:e.date,
  location:e.venue,
  description:e.Description,
  image:"https:images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80"
  
})
    }

  )
  setEvents(Events)
  
  })

  // If you wrote import React, { useEffect } from "react"; but didn’t import useState, then calling React.useState works, but calling 
  // just useState without importing will throw.

// If you later added import { useState } from "react";, then switched to useState, it started working (not because of the hook itself,
//  but because your file imports became consistent).


},[])
  return (
    <section id="events" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Upcoming <span className="text-indigo-600">Events</span>
        </h2>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
           
            
            return(
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Event Image */}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              {/* Event Details */}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>

                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {event.description}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="w-full rounded-full bg-indigo-500 hover:bg-indigo-600"
                >
                  Join Event
                </Button>
              </div>
            </div>
          )}
          
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

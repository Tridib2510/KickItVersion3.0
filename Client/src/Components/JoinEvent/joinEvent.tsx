import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/Auth";
import EventDetailsRegister from "../EventDetailsRegister/EventDetailsRegister"
import { io,Socket} from "socket.io-client"
import { Link } from "react-router-dom";
import Soccer from "../../assets/Soccer.png"

console.log('SOCCER')
console.log(Soccer)

type Event = {
  id: string;
  title: string;
  date: string;
  time:string;
  createdBy?:string;
  location: string;
  description: string;
  image: string;
  activity: string;
  playersJoined: string[];
  joiningRequest:string[]

};





const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [request,setRequest]=useState(true)
  const [socket, setSocket] = useState<Socket | null>(null)
  const itemsPerPage = 6;

  const id = useAuthStore((state) => state.userId);

  const BackendKey=import.meta.env.VITE_BACKEND_KEY

  useEffect(()=>{
  const Socket=io(BackendKey)
  setSocket(Socket)
console.log(socket)
  setUserId(id)

  

  },[])

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/home`)
      .then((response) => response.json())
      .then(
        (data: {
          data: {
            _id: string;
            eventName: string;
            date: string;
            venue: string;
            createdBy:string;
            time:string;
            Description: string;
            playersJoined: string[];
            joiningRequest:string[],
            activity: string;
            image:string
          }[];
        }) => {
          const eventsList: Event[] = data.data.map((e) => ({
            id: e._id,
            title: e.eventName,
            time:e.time,
            date: e.date,
            createdBy:e.createdBy,
            location: e.venue,
            description: e.Description,
            activity: e.activity,
            joiningRequest:e.joiningRequest,
            image:e.image?e.image:"/src/assets/Soccer.png",            
            playersJoined: e.playersJoined,
          }));
          setEvents(eventsList);
          setUserId(id);
        }
      )
      .catch((err) => console.error("Failed to fetch events:", err));
  }, [id,request]);

  // 🔍 Search
  
  const filteredEvents = events.filter((event) => {
    const q = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      event.activity.toLowerCase().includes(q)
    );
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section id="events" className="bg-gray-50 py-20">
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          Upcoming <span className="text-indigo-600">Events</span>
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute right-4 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {currentEvents.map((event) => (
            
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              <Link to={`./${event.id}`}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex-1">
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

                {/* Action Button */}
                {userId && event.playersJoined.includes(userId) ? (
                  <Button
                    size="sm"
                    disabled
                    className="w-full rounded-full bg-green-500/20 text-green-700 font-semibold cursor-not-allowed"
                  >
                    ✅ Already Joined
                  </Button>
                ) :(userId && event.joiningRequest.includes(userId))? <Button
    size="sm"
    disabled
    className="w-full rounded-full bg-yellow-500/20 text-yellow-700 font-semibold cursor-not-allowed"
  >
    📩 Request Already Sent
  </Button>: (
                  <Button
                    onClick={()=>{
                      setSelectedEvent({
                    id:event.id,
                    title: event.title,
                    time: event.time,
                    date: event.date,
                    createdBy:event.createdBy,
                    location: event.location,
                    description: event.description,
                    image: event.image,
                    activity:"",
                    playersJoined:[],
                    joiningRequest:[]
                  });
                  setIsEventOpen(true);

                    }}

                    size="sm"
                    className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  >
                    🚀 Join Event
                  </Button>
                )}
              </div>
                </Link>
            </div>
            
          ))}

          {currentEvents.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No events found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          
          </div>
        )}
      </div>

       <EventDetailsRegister
       request={request}
       setRequest={setRequest}
        event={selectedEvent}
        isOpen={isEventOpen}
        onClose={() => setIsEventOpen(false)}
      />
    </section>
  );
};

export default EventsSection;

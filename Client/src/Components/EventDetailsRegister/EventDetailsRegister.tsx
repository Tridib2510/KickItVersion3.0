import { X } from "lucide-react";
import { useState,useEffect } from "react";
import toast from "react-hot-toast"
import { io,Socket} from "socket.io-client"
import { useAuthStore } from "../../store/Auth";
interface Events {
  id: string;
  title: string;
  date: string;
  time: string;
  createdBy?:string;
  location: string;
  description: string;
  image?: string;
  
}

interface EventDetailsModalProps {
  event: Events | null;
  isOpen: boolean;
  request:boolean,
  setRequest:React.Dispatch<React.SetStateAction<boolean>>

  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose,request,setRequest}) => {
   const [socket, setSocket] = useState<Socket | null>(null)
   const [loading, setLoading] = useState(false);
  
   const id = useAuthStore((state) => state.userId);
const BackendKey=import.meta.env.VITE_BACKEND_KEY

  useEffect(()=>{
  
  const socket=io(BackendKey)
  setSocket(socket)


  },[])



  if (!isOpen || !event) return null;

  const Register=async()=>{
     if (loading) return;
       setLoading(true);

    socket?.emit('joinRoom',event.createdBy)
    console.log('join user')
    console.log(event.createdBy)
 console.log('Send Request 1')
   socket?.emit('sendRequest',event.createdBy,'',id,event)
console.log('Send Request 2')

      const requestedEvent=event.id
      const requestedUser=event.createdBy

       console.log(requestedEvent)
       console.log(requestedUser)

      try { 
  await fetch(`${BackendKey}/KickIt/joinRequestToCreator`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                }, 
                body:JSON.stringify({
                    
                    eventId:requestedEvent,
                    createdBy:requestedUser
                }),
                credentials:'include'
            }).then(res=>res.json())
                    .then(() => {
                      
                        toast.success("Request successfully send")
                        setRequest(!request)
                        onClose()
                    })
                    .catch(() => {
                      toast.error("Request failed")
                    });



        
      } catch (error) {
        toast.error('Request failed')
      }
      finally{
        setLoading(false)
      }
      
    
      
      console.log(event)
  }

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
         
          { <button 
            onClick={()=>Register()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            Register
          </button> }

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Close
          </button>
         
        </div>
      </div>
    
    </div>
  );
};

export default EventDetailsModal;

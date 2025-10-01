import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";
import { io, Socket } from "socket.io-client"
const BackendKey=import.meta.env.VITE_BACKEND_KEY
 
type Contact = {
  id: string;  
  name: string;
  avatar: string;
  user:string
  lastMessage: string;
};

type Message = {
  id: number;
  text: string;
  sender: string
};

// const contacts: Contact[] = [
//   { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1", lastMessage: "See you soon!" },
//   { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2", lastMessage: "Let’s catch up tomorrow." },
//   { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3", lastMessage: "Got it 👍" },
// ];

export default function WhatsAppPopup() {

const [contacts,setContacts]=useState<Contact[]>([])
const [socket, setSocket] = useState<Socket | null>(null)
const [open, setOpen] = useState(false);
const [activeContact, setActiveContact] = useState<Contact | null>(null);
const [messages, setMessages] = useState<Record<string, Message[]>>({});
const [input, setInput] = useState("");
function joinEventGroup(id:String){
  console.log(id)
   socket?.emit('joinRoom',id)
}

useEffect(()=>{

if (activeContact?.id) {
   if(messages[activeContact.id][messages[activeContact.id].length-1].sender==='me'){
   console.log(messages[activeContact.id])
    socket?.send(messages[activeContact.id],activeContact.user,activeContact.id);
   }
}
},[messages])

useEffect(()=>{
  const s= io(BackendKey)
  setSocket(s)
  s?.on('send',(message,name,eventId)=>{
    console.log(message)
        const newMsg: Message = { id: Date.now(), text: message, sender:name };
   console.log(newMsg.text)
   console.log(eventId)
    setMessages((prev) => ({
     ...prev,  
  [eventId]: [...(prev[eventId] || []), newMsg],
}));

  
 })
},[])

useEffect(()=>{
  fetch(`${BackendKey}/KickIt/joinedEvents`,{
    credentials: "include",
  })
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data.Event.length)
    const Contacts:Contact[]=[]
    for(let i=0;i<data.Event.length;i++){
     console.log(data.Event[i])
     const id=data.Event[i]._id
     const name=data.Event[i].eventName
     const user=data.Event[i].createdBy.username
     const avatar=data.Event[i].createdBy.image
     Contacts.push({ id: id, name:name,user:user, avatar:avatar, lastMessage: "" })
    }
    setContacts(Contacts)
  })
},[])

  

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const handleSend = () => {
    if (!input.trim() || !activeContact) return;
    const newMsg: Message = { id: Date.now(), text: input, sender: "me" };
    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    setInput("");
  };

  return (
    <>
      {/* Floating Icon */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-80 max-h-[80vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-green-600 text-white">
              <span className="font-semibold">Support</span>
              <div className="flex items-center gap-2">
                {activeContact && (
                  <span className="text-sm">{activeContact.name}</span>
                )}
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Contacts List */}
              {!activeContact && (
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        joinEventGroup(c.id)  
                        setActiveContact(c)
                      }}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                          {c.lastMessage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chat Window */}
              {activeContact && (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[url('https://i.imgur.com/aQZ8JkR.png')] bg-cover">
                    {(messages[activeContact.id] || []).map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                          msg.sender === "me"
                            ? "ml-auto bg-green-500 text-white rounded-br-none"
                            : "mr-auto bg-white text-slate-900 rounded-bl-none shadow"
                        }`}
                      >
                        {msg.sender!='me'?`${msg.sender} :${msg.text}`:msg.text}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2 p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleSend}
                      className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Back to contacts button */}
            {activeContact && (
              <button
                onClick={() => setActiveContact(null)}
                className="w-full text-center py-1 text-sm text-green-600 hover:bg-green-100 dark:hover:bg-slate-700"
              >
                Back to Contacts
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

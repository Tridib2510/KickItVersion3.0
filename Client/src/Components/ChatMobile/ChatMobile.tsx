import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../../store/Auth";

const BackendKey = import.meta.env.VITE_BACKEND_KEY;

type Contact = {
  id: string;
  name: string;
  avatar: string;
  user: string;
  lastMessage: string;
};

type Message = {
  id: number;
  text: string;
  sender: string;
  send: string;
};

export default function MobileChat() {
  const userId = useAuthStore((state) => state.userId);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");

  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>{
    const s = io(BackendKey);
    setSocket(s);

    s.on("send", (message, senderName, eventId) => {
      const newMsg: Message = {
        id: Date.now(),
        text: message,
        sender: senderName,
        send: "notNow",
      };
      setMessages((prev) => ({
        ...prev,
        [eventId]: [...(prev[eventId] || []), newMsg],
      }));
    });

   
  }, []);

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/joinedEvents`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const joinedContacts: Contact[] = data.Event.map((event: any) => ({
          id: event._id,
          name: event.eventName,
          user: data.user,
          avatar: event.createdBy.image,
          lastMessage: "",
        }));
        setContacts(joinedContacts);
      });
  }, []);

  useEffect(() => {
    if (!activeContact) return;

    fetch(`${BackendKey}/KickIt/getPrevChats/${activeContact.id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const prevMessages: Message[] = data.chats.map((chat: any) => ({
          id: Date.now(),
          text: chat.message,
          sender: chat.sender === userId ? "me" : chat.senderName,
          send: "not now",
        }));

        setMessages((prev) => ({
          ...prev,
          [activeContact.id]: prevMessages,
        }));
      });
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  const joinEventGroup = (id: string) => {
    socket?.emit("joinRoom", id);
  };

  const handleSend = () => {
    if (!input.trim() || !activeContact) return;

    const newMsg: Message = {
      id: Date.now(),
      text: input,
      sender: "me",
      send: "now",
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    socket?.send(input, activeContact.user, activeContact.id, userId);
    setInput("");
  };

  return (
    <div className="block md:hidden fixed inset-0 bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-green-600 text-white shadow-md rounded-b-xl">
        {activeContact && (
          <button
            onClick={() => {
              setActiveContact(null);
              setMessages({});
            }}
            className="p-2 hover:bg-green-500 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-bold">{activeContact ? activeContact.name : "Chats"}</h1>
      </div>

      {/* Contact List */}
      {!activeContact && (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-slate-800">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                joinEventGroup(contact.id);
                setActiveContact(contact);
              }}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition rounded-xl mx-2 my-1"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{contact.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {contact.lastMessage || "No messages yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Window */}
      {activeContact && (
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-slate-800">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {(messages[activeContact.id] || []).map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm break-words ${
                  msg.sender === "me"
                    ? "ml-auto bg-green-500 text-white rounded-br-none shadow-lg"
                    : "mr-auto bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none shadow"
                }`}
              >
                {msg.sender !== "me" ? (
                  <span className="font-semibold">{msg.sender}: </span>
                ) : null}
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-3 p-3 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

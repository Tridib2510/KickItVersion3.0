import React, { useState, useRef, useEffect } from "react"
import { Bell, X } from "lucide-react"
import clsx from "clsx"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "../../store/Auth"
import JoinRequest from "../AcceptUser/AcceptUser"

interface Notification {
  id: string
  message: string
  time: string
  read?: boolean
  image?: string
  eventId?: string
  event?: {
    id: string
    title: string
    date: string
    time: string
    location: string
    description: string
    image?: string
  }
  user?: {
    id: string
    username: string
    image?: string
    bio?: string
  }
}

interface Options {
  method: string
  credentials: RequestCredentials
  headers: {
    "Content-Type": string
  }
}

const BackendKey = import.meta.env.VITE_BACKEND_KEY

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [checkNotification, setCheckNotification] = useState(false)
  const [activeJoinRequest, setActiveJoinRequest] = useState<Notification | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const id = useAuthStore((state) => state.userId)

  // socket setup
  useEffect(() => {
    const Socket = io(BackendKey)
    setSocket(Socket)
   console.log(socket)
    Socket.emit("joinRoom", id)
console.log(checkNotification)
    socket?.on("send", (user, event) => {
      setCheckNotification((prev) => !prev)
      setNotifications((prev) => [
        ...prev,
        {
          id: user._id,
          message: `${user.username} would like to join your event`,
          time: "1hr ago",
          image: user.image,
          eventId: event?._id,
          event: {
            id: event?._id,
            title: event?.title,
            date: event?.date,
            time: event?.time,
            location: event?.location,
            description: event?.description,
            image: event?.image,
          },
          user: {
            id: user._id,
            username: user.username,
            image: user.image,
            bio: user.bio,
          },
        },
      ])
    })

    return () => {
      Socket.disconnect()
    }
  }, [id])

  // fetch persisted join requests
  useEffect(() => {
    const options: Options = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }

    fetch(`${BackendKey}/KickIt/joinRequests`, options)
      .then((res) => res.json())
      .then((data) => {
   console.log('data.user')
          console.log(data.user.joinedRequests[0])
        const notis: Notification[] = []
        for (let i=0;i<data.user.requests.length;i++) {
         console.log('notifications')
         console.log(data.user)
          notis.push({
            id: data.user.requests[i].userId._id,
            message: `${data.user.requests[i].userId.username} would like to join your event`,
            time: "1hr ago",
            image: data.user.requests[i].userId.image,
            eventId: data.user.requests[i].eventId._id,
            event: {
              id: data.user.requests[i].eventId._id,
              title: data.user.requests[i].eventId.eventName,
              date: data.user.requests[i].eventId.date,
              time: data.user.requests[i].eventId.time,
              location: data.user.requests[i].eventId.venue,
              description: data.user.requests[i].eventId.Description,
              image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            },
            user: {
              id: data.user.requests[i].userId._id,
              username: data.user.requests[i].userId.username,
              image: data.user.requests[i].userId.image,
              bio: data.user.requests[i].userId.Description,
            },
          })
        }
        setNotifications((prev) => [...prev, ...notis])
        console.log('notis')
        console.log(data)
      })
  }, [])

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Accept / Reject handlers
  const handleAccept = async (eventId: string, userId: string) => {
    await fetch(`${BackendKey}/KickIt/joinRequests/accept`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userId }),
    })
    setActiveJoinRequest(null)
  }

  const handleReject = async (eventId: string, userId: string) => {
    await fetch(`${BackendKey}/KickIt/joinRequests/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, userId }),
    })
    setActiveJoinRequest(null)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => {
         if (window.innerWidth < 768) {
        window.location.href='./notification'
      }   
      else{
        setIsOpen(!isOpen)
      }  
          
        }}
        className="relative hover:text-indigo-400 transition-colors"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={clsx(
          "absolute right-0 mt-2 w-72 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 transition-all duration-200 z-50",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold text-gray-800">Notifications</span>
          <button onClick={() => {setIsOpen(false)
            }} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id)
                  setActiveJoinRequest(n)
                }}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-gray-100 transition",
                  !n.read ? "bg-indigo-50" : "bg-white"
                )}
              >
                {n.image && (
                  <img
                    src={n.image}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm">{n.message}</p>
                  <span className="text-xs text-gray-500">{n.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* JoinRequest Modal */}
      {activeJoinRequest && (
        <JoinRequest
          isOpen={!!activeJoinRequest}
//  If activeJoinRequest is null → !!null → false
// If activeJoinRequest is an object → !!{...} → true
          onClose={() => setActiveJoinRequest(null)}
          event={activeJoinRequest.event || null}
          user={activeJoinRequest.user || null}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  )
}

export default NotificationDropdown

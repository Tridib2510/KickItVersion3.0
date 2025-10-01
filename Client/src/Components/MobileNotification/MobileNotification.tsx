import React, { useState, useEffect } from "react"
import clsx from "clsx"
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

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeJoinRequest, setActiveJoinRequest] = useState<Notification | null>(null)
  const checkNotification=false
  // Fetch persisted notifications / join requests
  useEffect(() => {
    const options: Options = {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }

    fetch(`${BackendKey}/KickIt/joinRequests`, options)
      .then((res) => res.json())
      .then((data) => {
        const notis: Notification[] = []
        for (let i = 0; i < data.user.joinedRequests.length; i++) {
          notis.push({
            id: data.user.joinedRequests[i]._id,
            message: `${data.user.joinedRequests[i].username} would like to join your event`,
            time: "1hr ago",
            image: data.user.joinedRequests[i].image,
            eventId: data.user.joinedRequests[i].eventId,
            event: {
              id: data.user.requestedEvents[i]._id,
              title: data.user.requestedEvents[i].eventName,
              date: data.user.requestedEvents[i].date,
              time: data.user.requestedEvents[i].time,
              location: data.user.requestedEvents[i].venue,
              description: data.user.requestedEvents[i].Description,
              image: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            },
            user: {
              id: data.user.joinedRequests[i]._id,
              username: data.user.joinedRequests[i].username,
              image: data.user.joinedRequests[i].image,
              bio: data.user.joinedRequests[i].Description,
            },
          })
        }
        setNotifications((prev) => [...prev, ...notis])
      })
  }, [checkNotification])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications ({unreadCount})</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <p className="p-6 text-gray-500">No new notifications</p>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id)
                  setActiveJoinRequest(n)
                }}
                className={clsx(
                  "flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 transition",
                  !n.read ? "bg-indigo-50" : "bg-white"
                )}
              >
                {n.image && (
                  <img
                    src={n.image}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{n.message}</p>
                  <p className="text-xs text-gray-500">{n.time}</p>
                  {n.event && (
                    <p className="text-xs text-gray-400 mt-1">
                      Event: {n.event.title} | {n.event.date} | {n.event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JoinRequest Modal */}
      {activeJoinRequest && (
        <JoinRequest
          isOpen={!!activeJoinRequest}
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

export default NotificationsPage

"use client"

import * as React from "react"
import { X, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { useEffect, useState } from "react"

const BackendKey=import.meta.env.VITE_BACKEND_KEY

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Event type
type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image?: string
}

interface MapEvent {
  event: Event
  day: number
}

interface ThreeDCardDemoProps{
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  setIsEventOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function CenterCalendar({setSelectedEvent, setIsEventOpen}:ThreeDCardDemoProps) {
  
  const today = new Date()
  const [currentMonth] = useState(today.getMonth())
  const [currentYear] = useState(today.getFullYear())

  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [myEvents, setMyEvents] = useState<MapEvent[]>([])
  const [selectedEvents] = useState<MapEvent[]>([])

  // Fetch events
  useEffect(() => {
    fetch(`${BackendKey}/KickIt/myEvents`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const events: MapEvent[] = data.data
          .map((e: any) => {
            const eventMonth = Number(e.date.slice(5, 7)) - 1
            const eventDay = Number(e.date.slice(8, 10))

            if (eventMonth === currentMonth) {
              return {
                day: eventDay,
                event: {
                  id: e._id,
                  title: e.eventName,
                  date: e.date,
                  time: e.time,
                  location: e.venue,
                  description: e.Description,
                  image:
                    "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=80",
                },
              }
            }
            return null
          })
          .filter(Boolean) as MapEvent[]

        setMyEvents(events)
      })
  }, [currentMonth, currentYear])

  // Calendar helpers
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setOpen(false)
  }

  // Render days in the grid
  const renderDays = () => {
    const daysArray = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate?.toDateString() === date.toDateString()
      const hasEvent:MapEvent[]= myEvents.filter((ev)=>ev.day===day)
      
      
     
      daysArray.push(
        <div key={day} className="relative flex flex-col items-center">
          <button
            onClick={() =>{ handleSelectDate(date)
             if(hasEvent.length!=0){
        setIsEventOpen(true)
        setSelectedEvent(hasEvent[0].event)
      }

            }}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-full transition",
              isToday && "border border-blue-500 text-blue-600 font-semibold",
              isSelected && "bg-blue-600 text-white hover:bg-blue-700",
              !isSelected && !isToday && "hover:bg-gray-100"
            )}
          >
            {day}
          </button>

          {hasEvent.length!=0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>
          )}
        </div>
      )
    }
    return daysArray
  }

  return (
    <div className="relative">
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-25 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-blue-700 transition"
      >
        <CalendarIcon className="h-5 w-5" />
        <span className="text-sm font-medium">
          {selectedDate ? selectedDate.toLocaleDateString() : "Pick Date"}
        </span>
      </button>

      {/* Calendar Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex justify-center items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {new Date(currentYear, currentMonth).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  {currentYear}
                </h2>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-center font-medium text-gray-500 mb-2">
                {days.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2 text-sm">{renderDays()}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details */}
      {selectedEvents?.length > 0 && (
        <div className="mt-6 space-y-4 max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 text-center">
            Events on {selectedDate?.toDateString()}
          </h3>

          {selectedEvents.map(({ event }) => (
            <div
              key={event.id}
              className="p-4 bg-gray-100 rounded-xl shadow-sm flex gap-4 items-center"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="text-md font-bold">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.location}</p>
                <p className="text-xs text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

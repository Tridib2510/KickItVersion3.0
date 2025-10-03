"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import toast from "react-hot-toast"
import { Label } from "../ui/label"
import { Calendar, Clock, Trophy } from "lucide-react"

const Backend = import.meta.env.VITE_BACKEND_KEY

export function CreateEventPopup() {
  const [formData, setFormData] = useState({
    eventName: "",
    venue: "",
    description: "",
    playersRequired: "",
    date: "",
    time: "",
    sport: "",
  })

  interface Options {
    method: string
    credentials: RequestCredentials // 'include', 'same-origin', or 'omit'
    headers: {
      'Content-Type': string
    }
    body: string
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    try {
      const options: Options = {
        method: "POST",
        credentials: "include", // ensures cookies are sent
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: form.get("eventName"),
          activity: form.get("sport"),
          venue: form.get("venue"),
          date: form.get("date"),
          time: form.get("time"),
          Description: form.get("description"),
          playersRequired: form.get("playersRequired"),
        }),
      }

      fetch(`${Backend}/KickIt/createEvent`, options)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "fail" || data.status === "Error") {
            throw new Error(data.message)
          }
          toast.success("Event Created")
          setFormData({
            eventName: "",
            venue: "",
            description: "",
            playersRequired: "",
            date: "",
            time: "",
            sport: "",
          })
        })
    } catch (error) {
      toast.error("Something went wrong. Please try again")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a href="#" className="hover:text-indigo-400 transition-colors">Create Event</a>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">🎉 Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Event Name */}
          <div>
            <Label htmlFor="eventName">Event Name</Label>
            <Input id="eventName" name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Enter event name" required />
          </div>

          {/* Venue */}
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" value={formData.venue} onChange={handleChange} placeholder="Enter venue" required />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" required />
          </div>

          {/* Players Required */}
          <div>
            <Label htmlFor="playersRequired">Players Required</Label>
            <Input type="number" id="playersRequired" name="playersRequired" value={formData.playersRequired} onChange={handleChange} placeholder="e.g. 10" required />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <Input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Sport Dropdown */}
          <div>
            <Label htmlFor="sport">Sport</Label>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-gray-500" />
              <select
                id="sport"
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                required
                className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a sport</option>
                <option value="Soccer">Soccer</option>
                <option value="Cricket">Cricket</option>
                <option value="Badminton">Badminton</option>
                <option value="Tennis">Tennis</option>
                <option value="Basketball">Basketball</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-4">✅ Create Event</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
const BackendKey=import.meta.env.VITE_BACKEND_KEY


interface Badge{
  id?:string,
  badgeName?:string,
  description?:string,
  previewShown?:Boolean,
  image?:string
}

interface BadgeProps {
  badges: Badge[]; // <-- assuming you have a Badge type from mongoose or custom
}

export function BadgeSlider({badges}:BadgeProps) {

  useEffect(()=>{
    interface Options {
      method: string;
      credentials: RequestCredentials;//RequestCredentials includes 'include', 'same-origin', or 'omit'
      headers: {
        'Content-Type': string;
      };
      body: string|undefined;
    }

      const options:Options= {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
       body:undefined

    };

    fetch(`${BackendKey}/KickIt/previewAlreadyShown`,options)
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
       if(data.badges.length!=0){
       setOpen(true)
       }
    })

    
    


  },[badges])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [open, setOpen] = useState(false)
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? badges.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === badges.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>

        {/* 🔥 Match chart height (~300px) */}
        <CardContent className="relative flex items-center justify-center h-[300px]">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-105 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Badge Image + Name (Clickable for popup) */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <img
              src={badges[currentIndex]?.image}
              alt={badges[currentIndex]?.badgeName}
              className="w-36 h-36 object-contain"
            />
            <p className="mt-4 text-base font-semibold">
              {badges[currentIndex]?.badgeName}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:scale-105 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </CardContent>
      </Card>

      {/* Badge Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6 flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              🎉 New Badge Unlocked!
            </DialogTitle>
          </DialogHeader>

          <motion.img
            src={badges[currentIndex]?.image}
            alt={badges[currentIndex]?.badgeName}
            className="w-32 h-32 my-4 drop-shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          <p className="text-lg font-medium">{badges[currentIndex]?.badgeName}</p>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            {badges[currentIndex]?.description}
          </p>

          <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
            Awesome 🚀
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

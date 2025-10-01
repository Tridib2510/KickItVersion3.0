"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import EventCreator from "../../assets/EventCreator.png"

export function BadgePopup() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-center items-center">
      {/* 🔘 Button to trigger popup */}
      <Button onClick={() => setOpen(true)}>Show Badge</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6 flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              🎉 New Badge Unlocked!
            </DialogTitle>
          </DialogHeader>

          {/* Badge with animation */}
          <motion.img
            src={EventCreator}
            alt="Event Creator Badge"
            className="w-32 h-32 my-4 drop-shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />

          <p className="text-lg font-medium">Pro Reviewer</p>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            You earned this badge for reviewing 10+ events!
          </p>

          {/* Close button */}
          <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
            Awesome 🚀
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

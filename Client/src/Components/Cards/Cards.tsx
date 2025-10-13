"use client";
import React from "react";
import { Link } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

type Event = {
  id: string;
  title: string;
  time: string;
  date: string;
  location: string;
  description: string;
  image?: string;
};

interface ThreeDCardDemoProps extends Event {
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  setIsEventOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ThreeDCardDemo({
  id,
  title,
  description,
  date,
  location,
  image,
}: ThreeDCardDemoProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        
        {/* Title */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>

        {/* Description */}
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>

        {/* Image */}
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>

        {/* Event Details (Date, Time, Location) */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>
            <span className="font-semibold">📅 Date:</span> {date}
          </p>
         
          <p>
            <span className="font-semibold">📍 Location:</span> {location}
          </p>
        </div>

        {/* View Details Button */}
        <div className="flex justify-between items-center mt-6">
          <Link to={`/events/${id}`}>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold cursor-pointer"
            >
              View Details
            </CardItem>
          </Link>
        </div>
      </CardBody>
    </CardContainer>
  );
}

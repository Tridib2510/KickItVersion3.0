"use client";
import React from "react";

import { CardBody, CardContainer, CardItem } from "../ui/3d-card"

type Event = {
  id: string;
  title: string;
  time:string;
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
  time,
  date,
  location,
  image,
  setSelectedEvent,
  setIsEventOpen
}:ThreeDCardDemoProps) {
  
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
         {description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <CardItem
            translateZ={20}
            onClick={() => {
                  setSelectedEvent({
                    id: id,
                    title: title,
                    time: time,
                    date: date,
                    location: location,
                    description: description,
                    image: image,
                  });
                  setIsEventOpen(true);
                }}
           
            target="__blank"
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white cursor-pointer"
          >
            Try now →
          </CardItem>
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            View Details
          </CardItem>

     

        </div>
      </CardBody>
    </CardContainer>

                
  );
}

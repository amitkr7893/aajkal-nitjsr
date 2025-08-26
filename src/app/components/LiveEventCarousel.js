'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LiveEventCarousel({ events }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No live events right now.
      </div>
    );
  }

  const currentEvent = events[index];
    if (!currentEvent) return null;

  return (
    <div className="relative h-[80vh] w-full flex justify-end items-center overflow-hidden">



<div className="absolute z-50 h-full left-0 flex-grow pt-8 pl-8 flex flex-col justify-items-start">
        <h3 className="text-6xl mb-10 font-bold text-shadow-lg">{events[index]?.title || 'Event Title'}</h3>
        
        <span>

          <span className="bg-pink-900/20 m-1 w-max text-pink-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {events[index]?.date ? new Date(events[index].date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric'}) : '00/00/0000'} 
          </span>
          <span className=" bg-yellow-900/20 m-1 w-max text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {events[index]?.date ? new Date(events[index].date).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true}) : '00:00 XY'} 
          </span>

        </span>

          <span className="bg-green-900/20 m-1 w-max text-green-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {events[index]?.location? 'Venue : ' + events[index]?.location : 'Venue : ABC'}
          </span>
          <span className="bg-sky-900/20 m-1 mt-4 w-max text-sky-300 text-1xl font-bold px-2 py-0.5 rounded-sm">
            By : {events[index]?.organizer? events[index]?.organizer : 'Team XYZ'}
          </span>

          <span className="bg-grey-900/20 m-1 mt-4 max-w-[20vw] text-gray-400 text-sm px-2 py-0.5 rounded-sm indent-6 line-clamp-5">
            {events[index]?.desc || 'Join the brightest minds in AI and technology for a day filled with expert talks, hands-on workshops, and networking opportunities. Discover how artificial intelligence is transforming industries and shaping the future.' }
          </span>
      </div>

        <div className='relative mr-8 w-full h-[560px] max-w-2xl flex rounded-2xl overflow-hidde items-center'>

          <motion.div
            key={index}
            className="absolute w-full h-full"
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            exit={{ opacity: 0, }}
            transition={{ duration: 0.8 }}
            >
            <Image
              src={events[index].image || '/event_img.jpg'}
              alt="Live Event"
              layout="fill"
              objectFit="fill"
              className="brightness-60 border-2 border-red-400 rounded-2xl"
              />
          </motion.div>
        </div>
    </div>
  );
}

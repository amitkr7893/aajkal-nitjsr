'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventSlideshow({ events }) {
  const [ind, setInd] = useState(0);
  const delay = 4000; // 4 seconds per slide

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % events.length);
    }, delay);
    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length < 3) return null;

  const prevIndex = (ind - 1 + events.length) % events.length;
  const nextIndex = (ind + 1) % events.length;

  return (
    <div className="flex justify-center items-center w-full min-h-[80vh] overflow-hidden">
      <div className="flex items-center max-w-4xl w-full justify-center">
        {/* Left preview */}
        <motion.div
          className="w-1/4 opacity-70 transform scale-90 transition-all duration-500"
          key={events[prevIndex]._id}
        >
          <img
            src={events[prevIndex].image || '/p3.jpg'}
            alt={events[prevIndex].title}
            className="w-full h-80 object-cover rounded-xl shadow-md"
          />
        </motion.div>

        {/* Center event */}
        <AnimatePresence mode="wait">
          <motion.div
            key={events[ind]._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="relative w-1/2 h-140 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={events[ind].image || '/p2.jpg'}
              alt={events[ind].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-end"
            style={{
              backgroundImage: "url('/p3.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            >

              <div className='from-black content-end h-full to-transparent bg-gradient-to-tr p-6'>  
              <h3 className="text-3xl font-bold text-white mb-2" >{events[index].title}</h3>
              <p className= "bg-gradient-to-r text-white text-sm">{events[index].date} | {events[index].location}</p>
              <p className= "bg-gradient-to-r text-white text-sm mt-2 line-clamp-2">{events[index].description}</p>
              <p className= "bg-gradient-to-r text-blue-300 text-sm mt-1">By: {events[index].organizer}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right preview */}
        <motion.div
          className="w-1/4 opacity-50 transform scale-90 transition-all duration-500"
          key={events[nextIndex]._id}
        >
          <img
            className="w-full h-64 object-cover rounded-xl shadow-md"
            src={events[nextIndex].image || '/p2.jpg'}
            alt={events[nextIndex].title}
          />
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// const images = ['/p1.jpg', '/p2.jpg', '/p3.jpg', '/p4.jpg', '/p5.jpg', '/p6.jpg'];

export default function ImageCarousel({ events }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // const getStyle = (i) => {
  //   const pos = (i - index + 6) % 6;

  //   const positions = [
  //     { translateX: "40%", scale: 1.3, z: 40, opacity: 0 }, // front
  //     { translateX: "40%", scale: 1.2, z: 40, opacity: 1 },
  //     { translateX: "15%", scale: 0.5, z: 30, opacity: 1 },
  //     { translateX: "10%", scale: 0.4, z: 20, opacity: 1 },
  //     { translateX: "5%", scale: 0.3, z: 10, opacity: 1 },
  //     { translateX: "0%", scale: 0.2, z: 0, opacity: 1 },
  //   ];

  //   // Hide the image that just left the front
  //   if (pos == 5) {
  //     return {
  //       translateX: "0%", // move far to left
  //       scale: 0.2,
  //       z: 0,
  //       opacity: 0,
  //       pointerEvents: "none",
  //       rotateY: "0deg",
  //     };
  //   }
  //   return positions[pos];
  // };

  
  const [positions, setPositions] = useState([]);

useEffect(() => {
  const updateLayout = () => {
    const width = window.innerWidth;
    if (width >= 768) {
      // Desktop layout
      setPositions([
        { translateX: "40%", scale: 1.3, z: 40, opacity: 0 },
        { translateX: "40%", scale: 1.2, z: 40, opacity: 1 },
        { translateX: "15%", scale: 0.5, z: 30, opacity: 1 },
        { translateX: "10%", scale: 0.4, z: 20, opacity: 1 },
        { translateX: "5%", scale: 0.3, z: 10, opacity: 1 },
        { translateX: "0%", scale: 0.2, z: 0, opacity: 1 },
      ]);
    } 
    else if (width >= 440) {
      setPositions([
        { translateX: "35%", scale: 1.3, z: 40, opacity: 0 },
        { translateX: "-10%", scale: 1.3, z: 40, opacity: 1 },
        { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
        { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
        { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
        { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
        // { translateX: "-40%", scale: 0.9, z: 20, opacity: 1 },
        // { translateX: "-43%", scale: 0.7, z: 10, opacity: 1 },
        // { translateX: "-46%", scale: 0.5, z: 0, opacity: 1 },
      ])
    }
    else {
        setPositions([
          { translateX: "35%", scale: 1.3, z: 40, opacity: 0 },
          { translateX: "-10%", scale: 1.3, z: 40, opacity: 1 },
          { translateX: "-15%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-15%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-15%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-15%", scale: 1.1, z: 30, opacity: 1 },

      ]);
    }
  };

  updateLayout();
  window.addEventListener("resize", updateLayout);
  return () => window.removeEventListener("resize", updateLayout);
}, []);

  const getStyle = (i) => {
  const pos = (i - index + 6) % 6;

  if (!positions.length) return {};

  if (pos === 5) {
    return {
      translateX: "0%",
      scale: 0.2,
      z: 0,
      opacity: 0,
      pointerEvents: "none",
      rotateY: "0deg",
    };
  }

  return positions[pos];
};


  return (
    <div className="relative h-[50vh] sm:h-[80vh] w-full flex justify-center items-center overflow-hidden">
      <div className="absolute z-50 h-full left-0 flex-grow pt-8 pl-8 flex flex-col justify-items-start">
        <h3 className="hidden md:block text-6xl mb-10 font-bold text-shadow-lg">
          {events[index]?.title || "Event Title"}
        </h3>

        <span className="hidden md:block">
          <span className="bg-pink-900/20 m-1 w-max text-pink-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {events[index]?.date
              ? new Date(events[index].date).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "00/00/0000"}
          </span>
          <span className=" bg-yellow-900/20 m-1 w-max text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {events[index]?.date
              ? new Date(events[index].date).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "00:00 XY"}
          </span>
        </span>

        <span className="hidden md:block bg-green-900/20 m-1 w-max text-green-300 text-xs font-medium px-2 py-0.5 rounded-sm">
          {events[index]?.location
            ? "Venue : " + events[index]?.location
            : "Venue : ABC"}
        </span>
        <span className="hidden md:block bg-sky-900/20 m-1 mt-4 w-max text-sky-300 text-1xl font-bold px-2 py-0.5 rounded-sm">
          By :{" "}
          {events[index]?.organizer ? events[index]?.organizer : "Team XYZ"}
        </span>

        <span className="hidden md:block bg-grey-900/20 m-1 mt-4 max-w-[20vw] text-gray-400 text-sm px-2 py-0.5 rounded-sm indent-6 line-clamp-5">
          {events[index]?.desc ||
            "Join the brightest minds in AI and technology for a day filled with expert talks, hands-on workshops, and networking opportunities. Discover how artificial intelligence is transforming industries and shaping the future."}
        </span>
      </div>

      <div className="relative w-[200px] h-[200px] sm:w-[310px] sm:h-[310px] lg:w-[260px] lg:h-[260px] flex justify-center items-center">
        {[...Array(6)].map((_, i) => {
          const { translateX, scale, opacity, z, pointerEvents } = getStyle(
            i + 1
          );
          const src = events[i]?.image || "/event_img.jpg";
          return (
            <motion.div
              key={i}
              className="absolute w-full h-full transition-all duration-500 ease-in-out shadow-xl"
              style={{
                transformOrigin: "left 100px",
                transform: `translateX(${translateX}) scale(${scale})`,
                zIndex: z,
                opacity,
                pointerEvents,
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                src={src}
                alt={`carousel-${i}`}
                layout="fill"
                objectFit="fill"
                className="rounded-2xl "
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

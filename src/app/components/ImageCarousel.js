"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEvent } from "@/context/EventContext";

export default function ImageCarousel({ events = [] }) {
  const [index, setIndex] = useState(0);
  const { setSelectedEvent } = useEvent();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setPositions([
          { translateX: "600%", scale: 1.2, z: 40, opacity: 0 },
          { translateX: "35%", scale: 1.0, z: 40, opacity: 1 },
          { translateX: "15%", scale: 0.5, z: 30, opacity: 1 },
          { translateX: "10%", scale: 0.4, z: 20, opacity: 1 },
          { translateX: "5%", scale: 0.3, z: 10, opacity: 1 },
          { translateX: "0%", scale: 0.2, z: 0, opacity: 1 },
        ]);
      } else if (width >= 440) {
        setPositions([
          { translateX: "235%", scale: 1.3, z: 40, opacity: 0 },
          { translateX: "-10%", scale: 1.3, z: 40, opacity: 1 },
          { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
          { translateX: "-35%", scale: 1.1, z: 30, opacity: 1 },
        ]);
      } else {
        setPositions([
          { translateX: "235%", scale: 1.3, z: 40, opacity: 0 },
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

  const currentEvent = events[index];

  const handleClick = () => {
    if (currentEvent) {
      setSelectedEvent(currentEvent);
    }
  };

  return (
    <div className="relative w-full flex justify-center items-center overflow-hidden p-16">
      {/* Left Text Info */}
      <div className="absolute z-50 h-full left-0 flex-grow pt-8 pl-8 flex flex-col justify-items-start">
        <h3 className="hidden md:block text-6xl mb-10 font-bold text-shadow-lg">
          {currentEvent?.title || "Event Title"}
        </h3>

        <span className="hidden md:block">
          <span className="bg-pink-900/20 m-1 w-max text-pink-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {currentEvent?.date
              ? new Date(currentEvent.date).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "00/00/0000"}
          </span>
          <span className="bg-yellow-900/20 m-1 w-max text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-sm">
            {currentEvent?.date
              ? new Date(currentEvent.date).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "00:00 XY"}
          </span>
        </span>

        <span className="hidden md:block bg-green-900/20 m-1 w-max text-green-300 text-xs font-medium px-2 py-0.5 rounded-sm">
          {currentEvent?.location
            ? "Venue : " + currentEvent?.location
            : "Venue : ABC"}
        </span>
        <span className="hidden md:block bg-sky-900/20 m-1 mt-4 w-max text-sky-300 text-1xl font-bold px-2 py-0.5 rounded-sm">
          By : {currentEvent?.organizer || "Team XYZ"}
        </span>

        <span className="hidden md:block bg-grey-900/20 m-1 mt-12 max-h-20 max-w-[20vw] text-gray-400 text-sm px-2 py-0.5 rounded-sm indent-6 line-clamp-3">
          {currentEvent?.description ||
            currentEvent?.desc ||
            "Join the brightest minds in AI and technology for a day filled with expert talks, hands-on workshops, and networking opportunities."}
        </span>
      </div>

      {/* Image Carousel */}
      <div className="relative w-[200px] h-[200px] sm:w-[310px] sm:h-[310px] lg:w-[360px] lg:h-[360px] flex justify-center items-center">
        {[...Array(6)].map((_, i) => {
          const { translateX, scale, opacity, z, pointerEvents } = getStyle(
            i + 1
          );

          const event = events[i];
          const src = event?.image || "/event_img.jpg";

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
                cursor: event ? "pointer" : "default",
              }}
            >
              {event ? (
                <Link
                  href={`/events/${event._id}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <Image
                    src={src}
                    alt={`carousel-${i}`}
                    fill
                    className="rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                    style={{ objectFit: "fill" }}
                  />
                </Link>
              ) : (
                <Image
                  src={src}
                  alt={`carousel-${i}`}
                  fill
                  style={{ objectFit: "fill" }}
                  className="rounded-2xl"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

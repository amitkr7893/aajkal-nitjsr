"use client";
import { useEvent } from "@/context/EventContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EventDetails({ params }) {
  const { selectedEvent } = useEvent();
  const [event, setEvent] = useState(selectedEvent);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading event details...
      </div>
    );
  }

  const { title, desc, date, location, organizer, studentId, image } = event;

  const dt = new Date(event.date);
  const time = dt.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-10">
        {/* Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Side (Sticky Image) */}
          <div className="w-full md:w-1/2 md:sticky md:top-18 self-start rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
            <Image
              src={image || "/event_img.jpg"}
              alt={title}
              width={800}
              height={600}
              className="object-cover w-full h-auto md:h-[500px]"
            />
          </div>

          {/* Right Side (Content) */}
          <div className="w-full md:w-1/2">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-pink-900/20 text-pink-300 text-sm font-medium px-3 py-1 rounded-md">
                {new Date(date).toLocaleDateString("en-GB")}
              </span>
              <span className="bg-yellow-900/20 text-yellow-300 text-sm font-medium px-3 py-1 rounded-md">
                {time}
              </span>
              <span className="bg-green-900/20 text-green-300 text-sm font-medium px-3 py-1 rounded-md">
                {location}
              </span>
              <span className="bg-sky-900/20 text-sky-300 text-sm font-bold px-3 py-1 rounded-md">
                {organizer}
              </span>
            </div>

            {/* Description */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-5 shadow-inner mb-8">
              <h2 className="text-xl font-semibold mb-2 text-sky-300">
                About the Event
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {desc || "No description available."}
              </p>
            </div>

            {/* Posted By */}
            <p className="mt-4 text-gray-500 text-sm">
              Posted by:{" "}
              <span className="text-sky-300 font-medium">
                {studentId?.toUpperCase()}
              </span>
            </p>

            {/* Back Button */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block px-6 py-2 rounded-lg bg-sky-700/30 hover:bg-sky-700/50 transition text-sky-200 text-base font-medium"
              >
                ← Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

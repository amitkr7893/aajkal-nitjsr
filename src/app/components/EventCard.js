"use client";
import React from 'react';

const EventCard = ({ events = [] }) => {
  if (events.length === 0) {
    return <p className="text-center text-gray-500">No events in this category.</p>;
  }

  return (
    <>
      {events.map((event, i) => {
        const date = new Date(event.date);
        const dateStr = date.toLocaleDateString('en-GB',{ day: '2-digit', month: '2-digit', year: 'numeric'});
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isPast = date < new Date();
        return (
          <div
            key={i}
            className={`bg-black p-5 rounded-xl shadow-lg mb-6 mx-4 transition-opacity duration-300 ${
              isPast ? 'opacity-70 grayscale' : ''
            }`}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>

            {/* Badges for metadata */}
            <div className="flex flex-wrap items-center gap-1 mb-4">
              <span className="bg-pink-900/20 text-pink-300 text-xs font-medium px-2 py-0.5 rounded-sm">
                {dateStr}
              </span>
              <span className=" bg-yellow-900/20 text-yellow-300 text-xs font-medium px-2 py-0.5 rounded-sm">
                {timeStr}
              </span>
              <span className="bg-green-900/20 text-green-300 text-xs font-medium px-2 py-0.5 rounded-sm">
                {event.location}
              </span>
              <span className="bg-sky-900/20 text-sky-300 text-xs font-bold px-2 py-0.5 rounded-sm">
                By : {event.organizer}
              </span>
            </div>     
            {/* Image */}
            <div className="overflow-hidden rounded-lg border border-zinc-700">
                <img
                src={event.image || '/event_img.jpg'}
                alt={event.title}
                className="h-40 w-full object-cover transition-transform duration-300"
                />
            </div>

              <span className="bg-sky-900/20 text-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                Posted By : {event.studentId.toUpperCase()}
              </span>
          </div>
        );
      })}
    </>
  );
};

export default EventCard;

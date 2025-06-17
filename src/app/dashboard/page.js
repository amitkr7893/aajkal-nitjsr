"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [events, setEvents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = "studentId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    const name = getCookie("name");
    const id = getCookie("studentId");
    if (!name && !id) {
      router.replace("/login");
      return;
    }
    setStudentId(id);
    setStudentName(decodeURIComponent(name));
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!studentId) return;
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvents(data.filter((e) => e.studentId === studentId).sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, [studentId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      alert("Failed to delete. Try again.");
      console.error(err);
    }
  };

  if (loading) return null;


  return (
    <div className="max-w-4xl mx-auto px-4 pt-2 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center bg-black text-white rounded-md p-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="font-medium hover:underline">
          Go back
        </Link>

        <div className="flex items-center gap-3" ref={menuRef}>
          <Link
            href="/submit"
            className="text-white-500 mr-4 border-2 px-4 py-1 rounded-full font-medium hover:opacity-80"
          >
            Add Event
          </Link>
          <img
            src="/user.png"
            alt="Profile"
            className="h-9 w-9 p-0.5 rounded-full border-2 cursor-pointer"
            ref={buttonRef}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-6 top-14 w-44 bg-white border border-gray-200 rounded-md shadow-md z-50 ">
              <span className="block px-4 py-2 text-sm font-semibold border-b text-gray-800">{studentName}</span>
              <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <p className="text-gray-400 text-center mt-16">You haven’t posted any events yet.</p>
      ) : (
        <div className="space-y-6 mt-6">
          {events.map((event) => {
            const date = new Date(event.date);
            const dateStr = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            const timeStr = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
              

            const isPast = new Date(event.endDate) < new Date();

            return (
              <div
                key={event._id}
                className={`bg-zinc-950 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 ${isPast ? 'grayscale opacity-80' : ''}`}
              >
                <div className="sm:w-32 w-full h-32 overflow-hidden rounded-lg border border-zinc-700">
                  <img
                    src={event.image || "/event_img.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center w-full">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-medium">
                      <span className="bg-pink-900/20 text-pink-300 px-2 py-0.5 rounded">{dateStr}</span>
                      <span className="bg-yellow-900/20 text-yellow-300 px-2 py-0.5 rounded">{timeStr}</span>
                      <span className="bg-green-900/20 text-green-300 px-2 py-0.5 rounded">{event.location}</span>
                      <span className="bg-sky-900/20 text-sky-300 px-2 py-0.5 rounded">By: {event.organizer}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        sessionStorage.setItem("editingEvent", JSON.stringify(event));
                        window.location.href = `/submit?id=${event._id}`;
                      }}
                      className="bg-sky-600 text-white text-md rounded px-2 py-1 items-center flex gap-1 hover:opacity-90"
                    >
                      <img src="/edit.png" className="h-6 w-6" alt="Edit" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white text-md rounded px-2 py-1 items-center flex gap-1 hover:opacity-90"
                    >
                      <img src="/bin.png" className="h-4 w-4" alt="Delete" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

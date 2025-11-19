"use client";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageCarousel from "./components/ImageCarousel";
import EventCard from "./components/EventCard";
import LiveEventCarousel from "./components/LiveEventCarousel";
import Footer from "./components/Footer";

const categories = [
  "All",
  "Cultural",
  "Technical",
  "Sports",
  "Literary & Academic",
  "Others",
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false); // dropdown state
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const categoryMenuRef = useRef(null); // <-- NEW: ref for dropdown menu
  const categoryButtonRef = useRef(null); // <-- NEW: ref for dropdown toggle button
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const id = getCookie("studentId");
    const nm = decodeURIComponent(getCookie("name"));
    if (id) setStudentId(id);
    if (nm) setName(nm);
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event) {
      // user menu: existing logic
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

      // category dropdown: only close if click is outside both button and dropdown
      if (
        categoryMenuRef.current &&
        categoryButtonRef.current &&
        !categoryMenuRef.current.contains(event.target) &&
        !categoryButtonRef.current.contains(event.target)
      ) {
        setCategoryMenu(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie =
      "studentId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((e) => e.category === activeCategory));
    }
  }, [activeCategory, events]);

  const now = new Date();

  const upcomingEvents = useMemo(
    () =>
      filteredEvents
        .filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [filteredEvents]
  );

  const upcomingEventsCarousel = useMemo(
    () =>
      events
        .filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [events]
  );

  const liveEventsCarousel = useMemo(
    () =>
      events.filter(
        (e) => new Date(e.date) <= now && now <= new Date(e.endDate)
      ),
    [events]
  );

  const pastEvents = useMemo(
    () =>
      filteredEvents
        .filter((e) => new Date(e.endDate) < now)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filteredEvents]
  );

  return (
    <div className="">
      <header
        className="flex items-center sticky justify-between top-0 z-50 p-4 bg-black shadow-md"
        style={{ zIndex: "1000" }}
      >
        <div className="flex items-center space-x-3">
          <img
            src="/aajkal.png"
            alt="logo"
            className="h-8 w-8 rounded-full bg-sky-500 sm:h-12 sm:w-12"
          />
          <h1 className="text-1xl font-bold text-white-700 sm:text-2xl">
            aajkal@nitjsr
          </h1>
        </div>

        <nav className="hidden lg:flex space-x-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                activeCategory === cat
                  ? "bg-sky-500 text-white"
                  : "text-white-700 hover:bg-sky-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="flex items-center relative" ref={menuRef}>
          {studentId && (
            <Link
              href="/submit"
              className="text-white-500 mr-4 border-1 px-4 py-1 text-xs rounded-full font-medium hover:opacity-80 sm:text-[1rem]"
            >
              Add Event
            </Link>
          )}

          {studentId ? (
            <div
              className="flex items-center space-x-2 text-white-700 font-medium cursor-pointer"
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src="/user.png"
                alt="Profile"
                className="h-6 w-6 p-0.5 rounded-full border-1 sm:h-9 sm:w-9 sm:border-2"
              />
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-sky-500 text-white-500 mr-2 border-1 border-sky-500 hover:scale-105 px-4 py-1 rounded-full text-xs sm:text-[1rem]"
            >
              SignUp/LogIn
            </Link>
          )}

          {menuOpen && (
            <div className="absolute right-4 top-12 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <span className="block px-2 py-2 m-1 font-semibold text-sm border-b-1 text-gray-700 ">
                {name}
              </span>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="w-full max-w-[100%] px-4 sm:px-10 h-full flex flex-col gap-3 lg:flex-row mt-6 mb-0 pb-0">
        <div className="flex-1 w-full ">
          <div className="flex justify-center align-middle gap-2 mb-4">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-4 py-1 rounded-sm ${
                activeTab === "live"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              Live
            </button>

            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-1 rounded-sm transition-all duration-300 ${
                activeTab === "upcoming"
                  ? "bg-sky-500 text-white shadow-lg"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
              }`}
            >
              Upcoming
            </button>
          </div>

          {activeTab === "live" ? (
            <section className="">
              <LiveEventCarousel events={liveEventsCarousel} />
            </section>
          ) : (
            <section className="">
              <ImageCarousel events={upcomingEventsCarousel} />
            </section>
          )}
        </div>

        <div className="w-full self-center lg:w-[300px] my-4 pb-10 max-w-[540px]">
          <section className="relative w-full rounded-2xl bg-zinc-950 h-[600px]">
            {/* MOBILE DROPDOWN (Replaces native select ONLY) */}
            <div className="block lg:hidden w-full relative">
              <button
                ref={categoryButtonRef} // <-- attach ref
                onClick={(e) => {
                  e.stopPropagation(); // prevent immediate document click
                  setCategoryMenu(!categoryMenu);
                }}
                className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white border border-zinc-700 flex justify-between items-center"
              >
                {activeCategory}
                <span className="text-gray-300">▼</span>
              </button>

              {categoryMenu && (
                <div
                  ref={categoryMenuRef} // <-- attach ref
                  className="absolute mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-50"
                >
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCategoryMenu(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-zinc-800 ${
                        activeCategory === cat
                          ? "text-sky-400"
                          : "text-gray-300"
                      }`}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute -bottom-12 left-0 w-full h-[600px] z-20 bg-[linear-gradient(to_top,black_0%,transparent_50%)]" />
            <div className="rounded-xs min-h-full h-[600px] z-10 overflow-auto custom-scrollbar">
              <h2 className="text-xl sticky top-0 bg-zinc-950 text-center font-bold text-sky-400 mb-2 p-4 rounded-2xl">
                Upcoming Events -{" "}
                {activeCategory === "Home" ? "All" : activeCategory}
              </h2>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-400 text-center mb-6">
                  No upcoming events.
                </p>
              ) : (
                <EventCard events={upcomingEvents} />
              )}

              <h2 className="text-xl sticky top-0 bg-zinc-950 text-center font-bold z-10 text-yellow-400 mt-6 mb-2 p-4 rounded-2xl">
                Past Events -{" "}
                {activeCategory === "Home" ? "All" : activeCategory}
              </h2>
              {pastEvents.length === 0 ? (
                <p className="text-gray-400 text-center">No past events.</p>
              ) : (
                <EventCard events={pastEvents} />
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

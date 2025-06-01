'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageCarousel from "./components/ImageCarousel";
import EventCard from './components/EventCard';

const categories = ['Home', 'Cultural', 'Technical', 'Sports', 'Literary & Academic', 'Others'];

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();

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
    // Clear specific cookies by setting them with past expiry
    document.cookie = "studentId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    router.push('/');
    setTimeout(() => {
      window.location.reload();  // Hard reload the entire page
    }, 100);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch');
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
    if (activeCategory === 'Home') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => e.category === activeCategory));
    }
  }, [activeCategory, events]);

  // Check if user is logged in

  useEffect(() => {
    const id = getCookie("studentId");
    const name = decodeURIComponent(getCookie("name"));
    if (id) setStudentId(id);
    if (name) setName(name);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="flex items-center sticky top-0 justify-evenly z-50 p-4 bg-black shadow-md" style={{ zIndex: '1000' }}>
        <div className="flex items-center space-x-3">
          <img src="/aajkal.png" alt="logo" className="h-12 w-12 rounded-full bg-sky-500" />
          <h1 className="text-2xl font-bold text-white-700">aajkal@nitjsr</h1>
        </div>
        <nav className="flex space-x-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${activeCategory === cat ? 'bg-sky-500 text-white' : 'text-white-700 hover:bg-sky-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </nav>
        <div className='flex items-center relative' ref={menuRef}>
          {studentId && (<Link href="/submit" className="text-white-500 mr-4 border-1 px-4 py-1 rounded-full font-medium ">Add Event</Link>)}
          {studentId ? (
            <div className="flex items-center space-x-2 text-white-700 font-medium cursor-pointer" ref={buttonRef} onClick={() => setMenuOpen(!menuOpen)}>
              <img src="/user.png" alt="Profile" className="h-9 w-9 p-0.5 rounded-full border-1" />
            </div>


          ) : (
            <Link href="/login" className="bg-sky-500 text-white-500 mr-4 border-1 border-sky-500 hover:scale-105 px-4 py-1 rounded-full font-medium ">SignUp/LogIn</Link>
          )}

          {menuOpen && (
            <div className="absolute right-4 top-12 w-44 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <span className="block px-4 py-2 text-sm bg-neutral-200 rounded-sm text-gray-700 hover:bg-gray-100">{name}</span>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <button
                onClick={() => handleLogout()} // Replace with actual logout logic
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-8xl mx-auto px-14 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <section className="md:col-span-3">
          {/* <EventSlideshow  events={filteredEvents} /> */}
          <ImageCarousel events={events} />
        </section>


        <section className=" relative rounded-2xl bg-zinc-950 md:col-span-1 h-[600px] ">

            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[600px] z-20 bg-[linear-gradient(to_top,black_0%,transparent_50%)]" />
          <div className="rounded-xs min-h-full h-[600px] z-10 overflow-auto custom-scrollbar">

            <h2 className="text-xl sticky rounded-2xl text-center top-0 bg-zinc-950 font-bold text-white mb-4 p-4">
              Upcoming Events - {activeCategory === 'Home' ? 'All' : activeCategory}
            </h2>

            <EventCard events={filteredEvents} />

          </div>
        </section>


      </main>
    </div>
  );
}

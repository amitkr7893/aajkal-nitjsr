"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full  border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-content-center">
          {/* About */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/aajkal_light.png" alt="aajkal" className="h-10 w-10 rounded-full" />
              <h3 className="text-lg font-bold">aajkal@nitjsr</h3>
            </div>
            <p className="mt-3 text-gray-400 text-sm max-w-md">
              Your campus events hub — discover, share and manage events happening across NIT Jamshedpur.
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Built with ❤️ for students
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-sky-300 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/submit" className="hover:underline">Add Event</Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">SignUp / LogIn</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-sky-300 mb-3">Contact</h4>
            <p className="text-gray-300 text-sm">Email: <a href="mailto:aajkal.nitjsr.main@gmail.com" className="text-sky-300 hover:underline">aajkal.nitjsr.main@gmail.com</a></p>
            <p className="text-gray-400 text-sm mt-3">Have feedback or found a bug? Reach out — we’ll fix it fast.</p>

            {/* <div className="mt-4 flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 16.5 3c-2.7 0-4.8 2.5-3.8 5A12.94 12.94 0 0 1 3 4s-4 9 5 13a13 13 0 0 1-8 2c12 7 27 0 27-16.5A4.5 4.5 0 0 0 23 3z" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-90">
                  <path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3V2z" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div> */}
          </div>
        </div>

        {/* bottom line */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} aajkal@nitjsr. All rights reserved.</p>
          <div className="mt-3 md:mt-0 text-xs text-gray-400">
            <span className="mr-4">Privacy</span>
            <span className="mr-4">Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

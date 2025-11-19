"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-10 py-10">
        
        <div className="
          grid grid-cols-1 md:grid-cols-3 gap-8 place-content-center 
          text-center md:text-left      /* ⭐ Center on small screens */
        ">

          {/* About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 justify-center md:justify-start">
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
          <div className="flex flex-col items-center md:items-start">
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

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold text-sky-300 mb-3">Contact</h4>
            <p className="text-gray-300 text-sm">
              Email: <a href="mailto:aajkal.nitjsr.main@gmail.com" className="text-sky-300 hover:underline">aajkal.nitjsr.main@gmail.com</a>
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Have feedback or found a bug? Reach out — we’ll fix it fast.
            </p>
          </div>

        </div>

        {/* bottom line */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col justify-between items-center text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} aajkal@nitjsr. All rights reserved.
          </p>

          {/* <div className="mt-3 md:mt-0 text-xs text-gray-400 flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div> */}
        </div>

      </div>
    </footer>
  );
}

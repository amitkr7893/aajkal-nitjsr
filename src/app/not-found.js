import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-center px-4">
      <h1 className="text-6xl font-bold mb-4 text-sky-500 drop-shadow-md">404 - Page Not Found</h1>
      <p className="text-lg text-gray-300 mb-8">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        href="/"
        className="bg-sky-500 text-white px-6 py-2 rounded-full hover:bg-sky-600 transition-transform hover:scale-105 font-medium"
      >
        Go Back Home
      </Link>
    </div>
  );
}

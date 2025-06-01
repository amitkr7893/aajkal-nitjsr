'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [pass, setPass] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId : studentId, password : pass }),
    });

    const data = await res.json();

    if (res.ok) {
      // alert('Login successful');
      router.push('/');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-950 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Registration No"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <div className="relative mb-4 w-full">
        <input
          className="w-full p-2 pr-10 border rounded"
          type={visible ? 'text' : 'password'}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
        >
          {visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <p className="text-xs mb-4 mt-4">
        <a href="/forgot-password" className="hover:underline">
          Forgot Password?
        </a>
      </p>

      <button
        onClick={handleLogin}
        disabled={!studentId || !pass}
        className="w-full bg-sky-500 text-white py-2 rounded disabled:bg-sky-800 disabled:text-neutral-400 disabled:hover:cursor-default hover:bg-sky-600 cursor-pointer"
      >
        LogIn
      </button>

      <p className="text-xs text-center mt-4">
        <a href="/register" className="hover:underline">
          Not Registered? Register
        </a>
      </p>

    </div>
  );
}

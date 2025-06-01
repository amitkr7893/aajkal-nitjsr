// “Here is src/app/register/page.js ⬇️”
"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const router = useRouter();

  const sendOTP = async () => {
    const res = await fetch("/api/send-otp?purpose=register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: studentId.trim().toLowerCase() }),
    });

    if (res.ok) {
      setOtpSent(true);
    } else {
      alert("Failed to send OTP. Make sure your ID is valid.");
    }
  };

  // const verifyOTP = async () => {
  //   const res = await fetch("/api/verify-otp", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ studentId: studentId.trim().toLowerCase(), otp }),
  //   });

  //   if (res.ok) {
  //     setOtpVerified(true);
  //   } else {
  //     alert("Invalid OTP");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return alert("Please verify OTP before registering.");
  
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, name, pass, otp }), // ✅ include otp
    });
  
    if (res.ok) {
      alert(`${name}, you are registered successfully !`);
      router.push("/login");

    } else {
      const data = await res.json();
      alert(data.error || "Registration failed");
    }
  };
  


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-zinc-950 shadow rounded">
      <h2 className="text-2xl font-bold text-center">Register</h2>

      <input
        className="w-full p-2 border rounded"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Registration No"
        required
      />

      <input
        className="w-full p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
      />

      <div className="relative w-full">
        <input
          className="w-full p-2 pr-10 border rounded"
          type={visible ? 'text' : 'password'}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Create Password"
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

      {!otpSent && (
        <button
          type="button"
          disabled ={!studentId || !name || !pass}
          className="w-full p-2 bg-emerald-500 text-white rounded disabled:hover:cursor-default disabled:bg-emerald-800 disabled:text-neutral-400 hover:bg-emerald-600 cursor-pointer"
          onClick={sendOTP}
        >
          Send OTP
        </button>
      )}

      {otpSent && (
        <>
          <input
            className="w-full p-2 border rounded"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (e.target.value.trim().length > 0) {
                setOtpVerified(true);
              } else {
                setOtpVerified(false);
              }
            }}
            placeholder="Enter OTP"
            required
          />
        </>
      )}


      <button
        type="submit"
        disabled={!otpVerified}
        className="w-full p-2 bg-sky-500 text-white rounded disabled:bg-sky-800 disabled:text-neutral-400 disabled:hover:cursor-default  hover:bg-sky-600 cursor-pointer"
      >
        Register
      </button>

      <p className="text-xs text-center">
        <a href="/login" className="hover:underline">
          Already Registered? LogIn
        </a>
      </p>
    </form>
  );
}
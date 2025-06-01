'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const sendOTP = async () => {
    const res = await fetch("/api/send-otp?purpose=reset", {
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
  
  const handleResetPassword = async () => {    
    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, otp, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Password updated successfully!');
      window.location.href = '/login';
    } else {
      setMessage(data.error || 'Failed to reset password.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-950 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

      {message && <p className="text-center text-sm text-red-600 mt-2">{message}</p>}

      <input
        className="w-full mb-4 p-2 border rounded"
        placeholder="Enter Registration No"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      {!otpSent ? (
        <button
          onClick={sendOTP}
          disabled={!studentId}
          className="w-full bg-emerald-500 text-white py-2 rounded disabled:hover:cursor-default disabled:text-neutral-400 disabled:bg-emerald-800 hover:bg-emerald-600 cursor-pointer"
        >
          Send OTP
        </button>
      ) : (
        <>
          <input
            className="w-full mb-4 p-2 border rounded"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <div className="relative mb-4 w-full">
        <input
          className="w-full p-2 pr-10 border rounded"
          type={visible ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
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
          <button
          disabled={!otp || !newPassword}
            onClick={handleResetPassword}
            className="w-full bg-sky-500 text-white py-2 rounded disabled:hover:cursor-default disabled:bg-sky-800 disabled:text-neutral-400 hover:bg-sky-600 cursor-pointer"
          >
            Reset Password
          </button>
        </>
      )}

      <p className="text-xs mt-4 text-center">
        <a href="/login" className="hover:underline">
          Password Came Back To Mind? LogIn
        </a>
      </p>

    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import CustomDialog from '../components/CustomDialog';

function getCookie(name) {
  if (typeof document === 'undefined') return null; // SSR safety
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function ForgotPasswordPage() {
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  const showError = (msg) => setDialogMessage(msg);

  // Redirect if user is already logged in
  useEffect(() => {
    const id = getCookie('studentId');
    if (id) {
      router.replace('/');
    }
  }, [router]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOTP = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const res = await fetch('/api/send-otp?purpose=reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId.trim().toLowerCase() }),
      });

      if (res.ok) {
        setOtpSent(true);
        setTimer(120);
        showError('OTP sent successfully!');
      } else {
        showError('Failed to send OTP. Make sure your ID is valid.');
      }
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, otp, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        showError('Password updated successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        showError(data.error || 'Failed to reset password.');
      }
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"></div>
      )}

      <CustomDialog message={dialogMessage} onClose={() => setDialogMessage('')} />

      <div className="max-w-md mx-auto mt-10 p-6 bg-zinc-950 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

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

            {timer > 0 ? (
              <p className="text-sm text-gray-400 text-center mt-2">
                Resend OTP in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </p>
            ) : (
              <button
                type="button"
                onClick={sendOTP}
                className="w-full mt-2 p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
              >
                Send OTP Again
              </button>
            )}
          </>
        )}

        <p className="text-xs mt-4 text-center">
          <a href="/login" className="hover:underline">
            Password Came Back To Mind? LogIn
          </a>
        </p>
      </div>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import NProgress from "nprogress";
import CustomDialog from "../components/CustomDialog";

function getCookie(name) {
  if (typeof document === "undefined") return null; // SSR safety check
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default function Register() {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [visible, setVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  const [dialogMessage, setDialogMessage] = useState("");
  const showError = (msg) => setDialogMessage(msg);

  useEffect(() => {
      const id = getCookie("studentId");
      if (id) {
        router.replace("/");
      }
    }, [router]);

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
      const res = await fetch("/api/send-otp?purpose=register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      if (res.ok) {
        setOtpSent(true);
        setTimer(120);
      } else if (res.status === 400) {
        showError("You are already registered, Try to login");
      } else {
        showError("Failed to send OTP, Make sure your ID is valid");
      }
    } finally {
      NProgress.done();
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, otp }),
      });
      if (res.ok) {
        setOtpVerified(true);
      } else {
        showError("Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, name, pass, otp }),
      });
      if (res.ok) {
        showError(`${name}, you are registered successfully !`);
        router.push("/login");
      } else {
        const data = await res.json();
        showError(data.error || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"></div>
      )}

      <CustomDialog
        message={dialogMessage}
        onClose={() => setDialogMessage("")}
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 space-y-4 p-6 bg-zinc-950 shadow rounded"
      >
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
            type={visible ? "text" : "password"}
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

        {/* OTP Section */}
        {!otpSent && (
          <button
            type="button"
            disabled={!studentId || !name || !pass}
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
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
            />

            {/* Verify OTP Button */}
            {otp && !otpVerified &&(
              <button
                type="button"
                onClick={verifyOTP}
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-800 disabled:text-neutral-400 disabled:hover:cursor-default"
              >
                Verify OTP
              </button>
            )}

            {/* Resend OTP Button with Timer */}
            {timer > 0 ? (
              <p className="text-sm text-gray-400 text-center">
                Resend OTP in {Math.floor(timer / 60)}:
                {String(timer % 60).padStart(2, "0")}
              </p>
            ) : (
              <button
                type="button"
                onClick={sendOTP}
                className="w-full p-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
              >
                Send OTP Again
              </button>
            )}
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
    </div>
  );
}

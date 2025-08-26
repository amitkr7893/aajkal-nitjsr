// “Here is src/app/api/register/route.js ⬇️”
import { createUser, findUserById } from "@/lib/auth";
import { verifyOtp } from "@/lib/otpStore";
import { NextResponse } from "next/server";

export async function POST(request) {
  let { studentId, name, pass, otp } = await request.json();

  studentId = studentId.trim().toLowerCase();
  name = name.trim();
  const email = `${studentId.toLowerCase()}@nitjsr.ac.in`;
  pass = pass.trim();
  otp = otp.trim();

  // 0. Check if user already exists
  // const existing = await findUserById(studentId);
  // if (existing) {
  //   return NextResponse.json({ error: "User already exists" }, { status: 400 });
  // }

  // 1. Verify OTP
  const isOtpValid = await verifyOtp(email, otp);


  if (!isOtpValid) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  // 2. Create the user after OTP verification
  await createUser({ studentId, name, pass, email });

  const res = NextResponse.json({ message: "Registered successfully" });
  // res.cookies.set("studentId", studentId,
  //   { 
  //     path: "/",
  //     maxAge: 60 * 60 * 24 * 7, // 7 days
  //     httpOnly: false }
  //   );

  return res;
}
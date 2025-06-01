// “Here is src/app/api/reset-password/route.js ⬇️”
import { findUserById, updatePassword } from "@/lib/auth";
import { verifyOtp } from "@/lib/otpStore";
import { NextResponse } from "next/server";

export async function POST(request) {
  let { studentId, otp, newPassword } = await request.json();

  studentId = studentId.trim().toLowerCase();
  const email = `${studentId}@nitjsr.ac.in`;
  newPassword = newPassword.trim();
  otp = otp.trim();

 // 1. Check if user exists
  const existingUser = await findUserById(studentId);
  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 2. Verify OTP
  const isOtpValid = await verifyOtp(email, otp);
  if (!isOtpValid) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  // 3. Update password
  await updatePassword(studentId, newPassword);

  return NextResponse.json({ message: "Password updated successfully" });
}
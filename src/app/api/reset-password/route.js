import { updatePassword } from "@/lib/auth";
import { verifyOtp } from "@/lib/otpStore";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { studentId, otp, newPassword } = await request.json();
  const email = `${studentId}@nitjsr.ac.in`;

  //Verify OTP
  const isOtpValid = await verifyOtp(email, otp);
  if (!isOtpValid) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  // Update password
  await updatePassword(studentId, newPassword);

  return NextResponse.json({ message: "Password updated successfully" });
}
import { findUserById } from "@/lib/auth";
import { sendOTPEmail } from "@/lib/mailer";
import { setOtp } from "@/lib/otpStore";

export async function POST(req) {
  try {
    const { studentId } = await req.json();
    const { searchParams } = new URL(req.url);
    const purpose = searchParams.get("purpose");
    const email = `${studentId.toLowerCase().trim()}@nitjsr.ac.in`;

    const existingUser = await findUserById(studentId);

    if (purpose === "reset" && !existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (purpose === "register" && existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP using centralized function
    await setOtp(email, otp);

    // Send OTP
    await sendOTPEmail(email, otp);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OTP send error:", error);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
